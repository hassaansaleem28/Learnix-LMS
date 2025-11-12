"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncErrors = catchAsyncErrors;
function catchAsyncErrors(theFunc) {
    return function (req, res, next) {
        Promise.resolve(theFunc(req, res, next)).catch(next);
    };
}
