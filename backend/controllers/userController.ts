import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/userModel";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/nodemailer";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "../utils/cloudinary";

interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;
    const isEmailExists = await userModel.findOne({ email });
    if (isEmailExists)
      return next(new ErrorHandler("Email already exists", 400));

    const user: IRegisterationBody = { name, email, password };

    const { activationCode, token } = createActivationToken(user);
    const data = { user: { name: user.name }, activationCode };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your ${user.email} to activate your account!`,
        activationToken: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IActivationToken {
  token: string;
  activationCode: string;
}

function createActivationToken(user: any): IActivationToken {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_ACTIVATION_SECRET as Secret,
    {
      expiresIn: "15m",
    }
  );
  return { token, activationCode };
}

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.JWT_ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code!", 400));
    }

    const { name, email, password } = newUser.user;
    const isUserExists = await userModel.findOne({ email });

    if (isUserExists)
      return next(
        new ErrorHandler("User with this email already exists!", 400)
      );

    const user = await userModel.create({ name, email, password });

    res.status(201).json({ success: true });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password)
      return next(
        new ErrorHandler("Please enter both email and password!", 400)
      );
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid email or password!", 400));
    const isPasswordMatch = await user?.comparePassword(password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Incorrect Password!", 400));

    sendToken(user, 200, res);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const logoutUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    const userId = req.user?._id || "";
    redis.del(userId as string);
    res.status(200).json({
      success: true,
      message: "You have successfully Logged out. Come back soon!",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateAccessToken = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;
    if (!decoded)
      return next(new ErrorHandler("Couldn 't refresh token!", 400));

    const session = await redis.get(decoded.id as string);
    if (!session)
      return next(
        new ErrorHandler("Please login to access this resource!", 400)
      );

    const user = JSON.parse(session);
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "3d" }
    );
    req.user = user;
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days
    next();
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getUserInfo = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?._id;
    getUserById(userId as string, res);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await userModel.findOne({ email });
    if (!user) {
      const newUser = await userModel.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (name && user) {
      user.name = name;
    }
    await user?.save();
    await redis.set(userId as string, JSON.stringify(user));
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;
    if (!oldPassword || !newPassword)
      return next(new ErrorHandler("Please enter old and new passwords!", 400));

    const user = await userModel.findById(req.user?._id).select("+password");
    if (user?.password === undefined)
      return next(new ErrorHandler("Invalid user", 400));

    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid old password!", 400));

    user.password = newPassword;
    await user.save();
    await redis.set(req.user?._id as string, JSON.stringify(user));

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

interface IUserAvatar {
  avatar: string;
}

export const updateAvatar = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { avatar } = req.body as IUserAvatar;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(user?.avatar?.public_id);
        const cloud = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: cloud.public_id,
          url: cloud.secure_url,
        };
      } else {
        const cloud = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: cloud.public_id,
          url: cloud.secure_url,
        };
      }
    }
    await user?.save();
    await redis.set(userId as string, JSON.stringify(user));

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllUsers = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    getAllUsersService(req, res, next);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update user role

export const updateUserRole = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, role } = req.body;
    updateUserRoleService(res, email, role);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const deleteUser = catchAsyncErrors(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) return next(new ErrorHandler("User not found!", 404));

    await user.deleteOne({ id });
    await redis.del(id);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
