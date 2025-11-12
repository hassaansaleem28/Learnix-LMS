"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = ErrorMiddleware;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
function ErrorMiddleware(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error!";
    if (error.name === "Cast Error") {
        const message = `Resource not found. Invalid ${error.path}`;
        error = new ErrorHandler_1.default(message, 400);
    }
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered!`;
        error = new ErrorHandler_1.default(message, 400);
    }
    if (error.name === "JsonWebTokenErro") {
        const message = `Json web token is invalid, try again`;
        error = new ErrorHandler_1.default(message, 400);
    }
    if (error.name === "TokenExpiredError") {
        const message = `Token has expired, please log in again or try again`;
        error = new ErrorHandler_1.default(message, 400);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
}
