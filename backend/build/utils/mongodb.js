"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        mongoose_1.default.connection.on("connected", () => console.log("MongoDB Connected!"));
        await mongoose_1.default.connect(`${process.env.MONGODB_URL}/udemy-clone`);
    }
    catch (error) {
        console.error(error);
    }
}
