import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/orderModel";
import userModel from "../models/userModel";
import courseModel from "../models/courseModel";
import { getAllOrdersService, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/nodemailer";
import notificationModel from "../models/notificationModel";
import Stripe from "stripe";
import { redis } from "../utils/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createOrder = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { courseId, payment_info } = req.body as unknown as IOrder;

    if (payment_info) {
      if ("id" in payment_info) {
        const paymentIntentId: any = payment_info.id as any;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment not authorized!", 400));
        }
      }
    }
    const user = await userModel.findById(req.user?._id);

    const courseExistsInUser = user?.courses.some(
      (course: any) => course._id.toString() === courseId
    );
    if (courseExistsInUser)
      return next(
        new ErrorHandler("You have already purchased this course!", 400)
      );
    const course = await courseModel.findById(courseId);
    if (!course) return next(new ErrorHandler("Course not found!", 404));

    const data: any = {
      courseId: course._id,
      userId: user?._id,
      payment_info,
    };

    const mailData = {
      order: {
        _id: String(course._id).slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/order-confirmation.ejs"),
      { order: mailData }
    );
    try {
      if (user)
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
    user?.courses.push(course?.id);
    await redis.set(req.user?._id as any, JSON.stringify(user));
    await user?.save();

    await notificationModel.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new Order from ${course?.name}`,
    });
    await courseModel.findByIdAndUpdate(courseId, {
      $inc: { purchased: 1 },
    });
    newOrder(data, res, next);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllOrders = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    getAllOrdersService(req, res, next);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// send stripe publishable key
export const getStripePublicKey = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).json({
      success: true,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const newPayment = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "USD",
      metadata: {
        company: "Learnix Inc",
      },
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
