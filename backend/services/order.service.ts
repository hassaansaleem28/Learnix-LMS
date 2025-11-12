import { NextFunction, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel from "../models/orderModel";

export const newOrder = catchAsyncErrors(async function (
  data: any,
  res: Response,
  next: NextFunction
) {
  try {
    const newOrder = await orderModel.create(data);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllOrdersService = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allOrders = await orderModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, allOrders });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
