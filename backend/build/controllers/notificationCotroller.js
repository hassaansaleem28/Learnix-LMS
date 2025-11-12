"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationStatus = exports.getNotifications = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const node_cron_1 = __importDefault(require("node-cron"));
// all notifications for admin
exports.getNotifications = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const notifications = await notificationModel_1.default
            .find()
            .sort({ createdAt: -1 });
        res.status(201).json({ success: true, notifications });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update status of notification
exports.updateNotificationStatus = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const notification = await notificationModel_1.default.findById(req.params.id);
        if (!notification)
            return next(new ErrorHandler_1.default("Notification not found!", 400));
        else
            notification.status
                ? (notification.status = "read")
                : notification.status;
        await notification.save();
        const notifications = await notificationModel_1.default
            .find()
            .sort({ createdAt: -1 });
        res.status(201).json({ success: true, notifications });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
node_cron_1.default.schedule("0 0 0 * * *", async function () {
    const thirtydayAgo = new Date(Date.now() - 30 + 2);
    await notificationModel_1.default.deleteMany({
        status: "read",
        createdAt: { $lt: thirtydayAgo },
    });
    console.log("Read Notifications Deleted!");
});
