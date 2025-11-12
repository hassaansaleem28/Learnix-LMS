import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "../utils/cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/courseModel";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/nodemailer";
import notificationModel from "../models/notificationModel";
import axios from "axios";

export const uploadCourse = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    if (data.thumbnail) {
      const cloud = await cloudinary.uploader.upload(data.thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: cloud.public_id,
        url: cloud.secure_url,
      };
    }
    createCourse(data, res, next);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const editCourse = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const courseId = req.params.id;
    const thumbnail = data.thumbnail;

    const courseData = (await courseModel.findById(courseId)) as any;
    if (thumbnail && !thumbnail.startsWith("https")) {
      await cloudinary.uploader.destroy(courseData.thumbnail.public_id);
      const cloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: cloud.public_id,
        url: cloud.secure_url,
      };
    }
    if (thumbnail.startsWith("https")) {
      data.thumbnail = {
        public_id: courseData?.thumbnail?.public_id,
        url: courseData?.thumbnail?.secure_url,
      };
    }
    const course = await courseModel.findByIdAndUpdate(
      courseId,
      {
        $set: data,
      },
      { new: true }
    );
    res.status(201).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getSingleCourse = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.id;
    const isCacheExists = await redis.get(courseId);
    if (isCacheExists) {
      const course = JSON.parse(isCacheExists);
      res.status(200).json({ success: true, course });
    } else {
      const course = await courseModel
        .findById(req.params.id)
        .select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
      await redis.set(courseId, JSON.stringify(course), "EX", 604800);
      res.status(200).json({ success: true, course });
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllCourses = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allCourses = await courseModel
      .find()
      .select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
    res.status(200).json({ success: true, allCourses });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getCourseContentByUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find(
      (course: any) => course._id.toString() === courseId
    );
    if (!courseExists)
      return next(
        new ErrorHandler("You aren't eligible to access this course!", 404)
      );
    const course = await courseModel.findById(courseId);
    const content = course?.courseData;
    res.status(201).json({ success: true, content });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { question, courseId, contentId }: IAddQuestionData = req.body;
    const course = await courseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content!", 400));
    }
    const courseContent = course?.courseData.find((item: any) =>
      item._id.equals(contentId)
    );
    if (!courseContent)
      return next(new ErrorHandler("Invalid Content Id!", 400));

    // create a new question object
    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };
    // add this question to our Course Content
    courseContent.questions.push(newQuestion);
    await notificationModel.create({
      user: req.user?._id,
      title: "New Question Received",
      message: `You have a new question in ${courseContent?.title}.`,
    });
    // save the updated course
    await course?.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IAddReplyBody {
  reply: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addReply = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reply, courseId, contentId, questionId }: IAddReplyBody = req.body;
    const course = await courseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content!", 400));
    }
    const courseContent = course?.courseData.find((item: any) =>
      item._id.equals(contentId)
    );
    if (!courseContent)
      return next(new ErrorHandler("Invalid Content Id!", 400));

    const question = courseContent.questions.find((item: any) =>
      item._id.equals(questionId)
    );
    if (!question) return next(new ErrorHandler("Invalid question Id", 400));

    // create new answer object...

    const newReply: any = {
      user: req.user,
      reply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    question.questionReplies?.push(newReply);
    await course?.save({ validateBeforeSave: false });

    if (req.user?._id === question.user._id) {
      await notificationModel.create({
        user: req.user?._id,
        title: "New Question Reply Received",
        message: `You have a new question reply in ${course?.name}.`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/question-reply.ejs"),
        data
      );
      try {
        await sendMail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IAddReviewBody {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    // check if courseId already exists in userCourseList based on _id.
    const courseExists = userCourseList?.some(
      (course: any) => course._id.toString() === courseId.toString()
    );
    if (!courseExists)
      return next(
        new ErrorHandler("You are not eligible to access this course!", 400)
      );
    const course = await courseModel.findById(courseId);
    const { review, rating } = req.body as IAddReviewBody;

    const reviewData: any = {
      user: req.user,
      comment: review,
      rating,
    };
    course?.reviews.push(reviewData);
    let avg = 0;
    course?.reviews.forEach((review: any) => (avg += review.rating));

    if (course) course.ratings = avg / course.reviews.length;
    await course?.save({ validateBeforeSave: false });
    await redis.set(courseId, JSON.stringify(course), "EX", 604800);

    await notificationModel.create({
      user: req.user?._id,
      title: "New Review Recieved!",
      message: `${req.user?.name} has given a review in ${course?.name}!`,
    });
    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IAddReplyToReview {
  reply: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reply, courseId, reviewId } = req.body as IAddReplyToReview;

    const course = await courseModel.findById(courseId);
    if (!course) return next(new ErrorHandler("course not found!", 404));

    const review = course.reviews.find(
      (review: any) => review._id.toString() === reviewId.toString()
    );
    if (!review) return next(new ErrorHandler("Review not found!", 400));

    const replyData: any = {
      user: req.user,
      reply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!review.commentReplies) {
      review.commentReplies = [];
    }
    review.commentReplies?.push(replyData);
    await course.save({ validateBeforeSave: false });
    await redis.set(courseId, JSON.stringify(course), "EX", 604800);
    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllCoursesAdmin = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    getAllCoursesService(req, res, next);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const deleteCourse = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);
    if (!course) return next(new ErrorHandler("Course not found!", 404));

    await course.deleteOne({ id });
    await redis.del(id);

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully!" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const generateVideoUrl = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { videoId } = req.body;

    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "videoId is required" });
    }
    if (!process.env.VDO_CIPHER_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "VDO_CIPHER_SECRET_KEY is not set",
      });
    }

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Apisecret ${process.env.VDO_CIPHER_SECRET_KEY}`,
        },
      }
    );
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
