import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import notificationModel from "../models/notificationModel";
import cron from "node-cron";

// all notifications for admin

export const getNotifications = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.status(201).json({ success: true, notifications });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update status of notification

export const updateNotificationStatus = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notification = await notificationModel.findById(req.params.id);
    if (!notification)
      return next(new ErrorHandler("Notification not found!", 400));
    else
      notification.status
        ? (notification.status = "read")
        : notification.status;

    await notification.save();

    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.status(201).json({ success: true, notifications });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

cron.schedule("0 0 0 * * *", async function () {
  const thirtydayAgo = new Date(Date.now() - 30 + 2);
  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtydayAgo },
  });
  console.log("Read Notifications Deleted!");
});
