import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";

export function ErrorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error!";

  if (error.name === "Cast Error") {
    const message = `Resource not found. Invalid ${error.path}`;
    error = new ErrorHandler(message, 400);
  }
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered!`;
    error = new ErrorHandler(message, 400);
  }
  if (error.name === "JsonWebTokenErro") {
    const message = `Json web token is invalid, try again`;
    error = new ErrorHandler(message, 400);
  }
  if (error.name === "TokenExpiredError") {
    const message = `Token has expired, please log in again or try again`;
    error = new ErrorHandler(message, 400);
  }
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
}
