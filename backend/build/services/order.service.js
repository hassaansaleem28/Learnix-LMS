"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
exports.newOrder = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (data, res, next) {
    try {
        const newOrder = await orderModel_1.default.create(data);
        res.status(201).json({ success: true, order: newOrder });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllOrdersService = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const allOrders = await orderModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, allOrders });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
