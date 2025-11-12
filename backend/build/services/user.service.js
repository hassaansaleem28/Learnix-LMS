"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = require("../utils/redis");
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const userModel_1 = __importDefault(require("../models/userModel"));
const getUserById = async function (id, res) {
    try {
        const userJson = await redis_1.redis.get(id);
        if (userJson) {
            const user = JSON.parse(userJson);
            res.status(200).json({ success: true, user });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUserById = getUserById;
exports.getAllUsersService = (0, catchAsyncErrors_1.catchAsyncErrors)(async function (req, res, next) {
    const allUsers = await userModel_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, allUsers });
});
const updateUserRoleService = async function (res, email, role) {
    const user = await userModel_1.default.findOneAndUpdate({ email }, { role }, { new: true });
    if (!user)
        return res.status(404).json({ success: false, message: "User not found!" });
    res.status(200).json({
        success: true,
        user,
    });
};
exports.updateUserRoleService = updateUserRoleService;
