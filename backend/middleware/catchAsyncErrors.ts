import { NextFunction, Request, Response } from "express";

export function catchAsyncErrors(theFunc: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
}
