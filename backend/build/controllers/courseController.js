"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getAllCoursesAdmin = exports.addReplyToReview = exports.addReview = exports.addReply = exports.addQuestion = exports.getCourseContentByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const course_service_1 = require("../services/course.service");
const courseModel_1 = __importDefault(require("../models/courseModel"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const axios_1 = __importDefault(require("axios"));
exports.uploadCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const data = req.body;
        if (data.thumbnail) {
            const cloud = await cloudinary_1.default.uploader.upload(data.thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: cloud.public_id,
                url: cloud.secure_url,
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.editCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const data = req.body;
        const courseId = req.params.id;
        const thumbnail = data.thumbnail;
        const courseData = (await courseModel_1.default.findById(courseId));
        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary_1.default.uploader.destroy(courseData.thumbnail.public_id);
            const cloud = await cloudinary_1.default.uploader.upload(thumbnail, {
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
        const course = await courseModel_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, { new: true });
        res.status(201).json({ success: true, course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getSingleCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const courseId = req.params.id;
        const isCacheExists = await redis_1.redis.get(courseId);
        if (isCacheExists) {
            const course = JSON.parse(isCacheExists);
            res.status(200).json({ success: true, course });
        }
        else {
            const course = await courseModel_1.default
                .findById(req.params.id)
                .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
            res.status(200).json({ success: true, course });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllCourses = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const allCourses = await courseModel_1.default
            .find()
            .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({ success: true, allCourses });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getCourseContentByUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExists)
            return next(new ErrorHandler_1.default("You aren't eligible to access this course!", 404));
        const course = await courseModel_1.default.findById(courseId);
        const content = course?.courseData;
        res.status(201).json({ success: true, content });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.addQuestion = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await courseModel_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid Content!", 400));
        }
        const courseContent = course?.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent)
            return next(new ErrorHandler_1.default("Invalid Content Id!", 400));
        // create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        // add this question to our Course Content
        courseContent.questions.push(newQuestion);
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent?.title}.`,
        });
        // save the updated course
        await course?.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.addReply = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { reply, courseId, contentId, questionId } = req.body;
        const course = await courseModel_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid Content!", 400));
        }
        const courseContent = course?.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent)
            return next(new ErrorHandler_1.default("Invalid Content Id!", 400));
        const question = courseContent.questions.find((item) => item._id.equals(questionId));
        if (!question)
            return next(new ErrorHandler_1.default("Invalid question Id", 400));
        // create new answer object...
        const newReply = {
            user: req.user,
            reply,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        question.questionReplies?.push(newReply);
        await course?.save({ validateBeforeSave: false });
        if (req.user?._id === question.user._id) {
            await notificationModel_1.default.create({
                user: req.user?._id,
                title: "New Question Reply Received",
                message: `You have a new question reply in ${course?.name}.`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await (0, nodemailer_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 400));
            }
        }
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.addReview = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        // check if courseId already exists in userCourseList based on _id.
        const courseExists = userCourseList?.some((course) => course._id.toString() === courseId.toString());
        if (!courseExists)
            return next(new ErrorHandler_1.default("You are not eligible to access this course!", 400));
        const course = await courseModel_1.default.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
        course?.reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((review) => (avg += review.rating));
        if (course)
            course.ratings = avg / course.reviews.length;
        await course?.save({ validateBeforeSave: false });
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New Review Recieved!",
            message: `${req.user?.name} has given a review in ${course?.name}!`,
        });
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.addReplyToReview = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { reply, courseId, reviewId } = req.body;
        const course = await courseModel_1.default.findById(courseId);
        if (!course)
            return next(new ErrorHandler_1.default("course not found!", 404));
        const review = course.reviews.find((review) => review._id.toString() === reviewId.toString());
        if (!review)
            return next(new ErrorHandler_1.default("Review not found!", 400));
        const replyData = {
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
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllCoursesAdmin = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        (0, course_service_1.getAllCoursesService)(req, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.deleteCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { id } = req.params;
        const course = await courseModel_1.default.findById(id);
        if (!course)
            return next(new ErrorHandler_1.default("Course not found!", 404));
        await course.deleteOne({ id });
        await redis_1.redis.del(id);
        res
            .status(200)
            .json({ success: true, message: "Course deleted successfully!" });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.generateVideoUrl = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
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
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Apisecret ${process.env.VDO_CIPHER_SECRET_KEY}`,
            },
        });
        res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
