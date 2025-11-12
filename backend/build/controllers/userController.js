"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateAvatar = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
exports.registerUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { name, email, password } = req.body;
        const isEmailExists = await userModel_1.default.findOne({ email });
        if (isEmailExists)
            return next(new ErrorHandler_1.default("Email already exists", 400));
        const user = { name, email, password };
        const { activationCode, token } = createActivationToken(user);
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            await (0, nodemailer_1.default)({
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
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
function createActivationToken(user) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.JWT_ACTIVATION_SECRET, {
        expiresIn: "15m",
    });
    return { token, activationCode };
}
exports.activateUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.JWT_ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code!", 400));
        }
        const { name, email, password } = newUser.user;
        const isUserExists = await userModel_1.default.findOne({ email });
        if (isUserExists)
            return next(new ErrorHandler_1.default("User with this email already exists!", 400));
        const user = await userModel_1.default.create({ name, email, password });
        res.status(201).json({ success: true });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return next(new ErrorHandler_1.default("Please enter both email and password!", 400));
        const user = await userModel_1.default.findOne({ email }).select("+password");
        if (!user)
            return next(new ErrorHandler_1.default("Invalid email or password!", 400));
        const isPasswordMatch = await user?.comparePassword(password);
        if (!isPasswordMatch)
            return next(new ErrorHandler_1.default("Incorrect Password!", 400));
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.logoutUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id || "";
        redis_1.redis.del(userId);
        res.status(200).json({
            success: true,
            message: "You have successfully Logged out. Come back soon!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateAccessToken = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        if (!decoded)
            return next(new ErrorHandler_1.default("Couldn 't refresh token!", 400));
        const session = await redis_1.redis.get(decoded.id);
        if (!session)
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "5m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "3d" });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getUserInfo = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const userId = req.user?._id;
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.socialAuth = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { email, name, avatar } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            const newUser = await userModel_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        const user = await userModel_1.default.findById(userId);
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({ success: true, user });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return next(new ErrorHandler_1.default("Please enter old and new passwords!", 400));
        const user = await userModel_1.default.findById(req.user?._id).select("+password");
        if (user?.password === undefined)
            return next(new ErrorHandler_1.default("Invalid user", 400));
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch)
            return next(new ErrorHandler_1.default("Invalid old password!", 400));
        user.password = newPassword;
        await user.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateAvatar = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel_1.default.findById(userId);
        if (avatar && user) {
            if (user?.avatar?.public_id) {
                await cloudinary_1.default.uploader.destroy(user?.avatar?.public_id);
                const cloud = await cloudinary_1.default.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: cloud.public_id,
                    url: cloud.secure_url,
                };
            }
            else {
                const cloud = await cloudinary_1.default.uploader.upload(avatar, {
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
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllUsers = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        (0, user_service_1.getAllUsersService)(req, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user role
exports.updateUserRole = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { email, role } = req.body;
        (0, user_service_1.updateUserRoleService)(res, email, role);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.deleteUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await userModel_1.default.findById(id);
        if (!user)
            return next(new ErrorHandler_1.default("User not found!", 404));
        await user.deleteOne({ id });
        await redis_1.redis.del(id);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully!" });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
