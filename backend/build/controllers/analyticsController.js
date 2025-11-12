"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAnalytics = exports.getCoursesAnalytics = exports.getUserAnalytics = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const analytics_generator_1 = require("../utils/analytics.generator");
const userModel_1 = __importDefault(require("../models/userModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
exports.getUserAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const userAnalytics = await (0, analytics_generator_1.generateLast12MonthsData)(userModel_1.default);
        res.status(200).json({ success: true, userAnalytics });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getCoursesAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const coursesAnalytics = await (0, analytics_generator_1.generateLast12MonthsData)(courseModel_1.default);
        res.status(200).json({ success: true, coursesAnalytics });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getOrdersAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const ordersAnalytics = await (0, analytics_generator_1.generateLast12MonthsData)(orderModel_1.default);
        res.status(200).json({ success: true, ordersAnalytics });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
