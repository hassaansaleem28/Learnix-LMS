import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "../utils/cloudinary";
import LayoutModel from "../models/layoutModel";

export const createLayout = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type } = req.body as { type: string };
    const isTypeExists = await LayoutModel.findOne({ type });
    if (isTypeExists) {
      return next(new ErrorHandler(`${type} already exists!`, 400));
    }
    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const cloud = await cloudinary.uploader.upload(image, {
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
      await LayoutModel.create(banner);
    }
    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async function (item: any) {
          return { question: item.question, answer: item.answer };
        })
      );
      await LayoutModel.create({ type: "FAQ", faq: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesItems = await Promise.all(
        categories.map(async function (item: any) {
          return { title: item.title };
        })
      );
      await LayoutModel.create({
        type: "Categories",
        categories: categoriesItems,
      });
    }
    res.status(200).json({ success: true, message: "Layout created!" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const editLayout = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type } = req.body as { type: string };

    if (type === "Banner") {
      const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
      const { image, title, subTitle } = req.body;
      const data = image.startsWith("https")
        ? bannerData
        : await cloudinary.uploader.upload(image, { folder: "layouts" });

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
      await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
    }
    if (type === "FAQ") {
      const { faq } = req.body;
      const faqData = await LayoutModel.findOne({ type: "FAQ" });
      const faqItems = await Promise.all(
        faq.map(async function (item: any) {
          return { question: item.question, answer: item.answer };
        })
      );
      await LayoutModel.findByIdAndUpdate(faqData?._id, {
        type: "FAQ",
        faq: faqItems,
      });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesData = await LayoutModel.findOne({ type: "Categories" });

      const categoriesItems = await Promise.all(
        categories.map(async function (item: any) {
          return { title: item.title };
        })
      );
      await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
        type: "Categories",
        categories: categoriesItems,
      });
    }
    res.status(200).json({ success: true, message: "Layout Updated!" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getLayoutByType = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type } = req.params;
    const layout = await LayoutModel.findOne({ type });
    res.status(200).json({ success: true, layout });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
