import { NextFunction, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/userModel";
import courseModel from "../models/courseModel";
import orderModel from "../models/orderModel";

export const getUserAnalytics = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userAnalytics = await generateLast12MonthsData(userModel as any);
    res.status(200).json({ success: true, userAnalytics });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getCoursesAnalytics = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const coursesAnalytics = await generateLast12MonthsData(courseModel as any);
    res.status(200).json({ success: true, coursesAnalytics });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getOrdersAnalytics = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ordersAnalytics = await generateLast12MonthsData(orderModel as any);
    res.status(200).json({ success: true, ordersAnalytics });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
