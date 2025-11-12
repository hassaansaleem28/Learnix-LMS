"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const layoutModel_1 = __importDefault(require("../models/layoutModel"));
exports.createLayout = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { type } = req.body;
        const isTypeExists = await layoutModel_1.default.findOne({ type });
        if (isTypeExists) {
            return next(new ErrorHandler_1.default(`${type} already exists!`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const cloud = await cloudinary_1.default.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: cloud.public_id,
                        url: cloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await layoutModel_1.default.create(banner);
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async function (item) {
                return { question: item.question, answer: item.answer };
            }));
            await layoutModel_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async function (item) {
                return { title: item.title };
            }));
            await layoutModel_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({ success: true, message: "Layout created!" });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.editLayout = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = await layoutModel_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            const data = image.startsWith("https")
                ? bannerData
                : await cloudinary_1.default.uploader.upload(image, { folder: "layouts" });
            const banner = {
                type: "Banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };
            await layoutModel_1.default.findByIdAndUpdate(bannerData._id, { banner });
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqData = await layoutModel_1.default.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(faq.map(async function (item) {
                return { question: item.question, answer: item.answer };
            }));
            await layoutModel_1.default.findByIdAndUpdate(faqData?._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = await layoutModel_1.default.findOne({ type: "Categories" });
            const categoriesItems = await Promise.all(categories.map(async function (item) {
                return { title: item.title };
            }));
            await layoutModel_1.default.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({ success: true, message: "Layout Updated!" });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getLayoutByType = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { type } = req.params;
        const layout = await layoutModel_1.default.findOne({ type });
        res.status(200).json({ success: true, layout });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
