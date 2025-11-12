"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
async function sendMail(options) {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const { email, subject, template, data } = options;
        const templatePath = path_1.default.join(__dirname, "../mails", template);
        const html = await ejs_1.default.renderFile(templatePath, data);
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html,
        });
    }
    catch (error) { }
}
exports.default = sendMail;
