"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.getStripePublicKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const order_service_1 = require("../services/order.service");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const stripe_1 = __importDefault(require("stripe"));
const redis_1 = require("../utils/redis");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.createOrder = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { courseId, payment_info } = req.body;
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("Payment not authorized!", 400));
                }
            }
        }
        const user = await userModel_1.default.findById(req.user?._id);
        const courseExistsInUser = user?.courses.some((course) => course._id.toString() === courseId);
        if (courseExistsInUser)
            return next(new ErrorHandler_1.default("You have already purchased this course!", 400));
        const course = await courseModel_1.default.findById(courseId);
        if (!course)
            return next(new ErrorHandler_1.default("Course not found!", 404));
        const data = {
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
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user)
                await (0, nodemailer_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
        user?.courses.push(course?.id);
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();
        await notificationModel_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new Order from ${course?.name}`,
        });
        await courseModel_1.default.findByIdAndUpdate(courseId, {
            $inc: { purchased: 1 },
        });
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllOrders = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        (0, order_service_1.getAllOrdersService)(req, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// send stripe publishable key
exports.getStripePublicKey = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        res.status(200).json({
            success: true,
            stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.newPayment = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
