"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesService = exports.createCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
exports.createCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (data, res, next) {
    try {
        const course = await courseModel_1.default.create(data);
        res.status(201).json({ success: true, course });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllCoursesService = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const allCourses = await courseModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, allCourses });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
