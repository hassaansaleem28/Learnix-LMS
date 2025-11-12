"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("./utils/mongodb");
const error_1 = require("./middleware/error");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const analyticRoutes_1 = __importDefault(require("./routes/analyticRoutes"));
const layoutRoutes_1 = __importDefault(require("./routes/layoutRoutes"));
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["https://lms-frontend-plum-three.vercel.app"],
    credentials: true,
}));
(0, mongodb_1.connectDB)();
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
});
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/course", courseRoutes_1.default);
app.use("/api/v1/order", orderRoutes_1.default);
app.use("/api/v1/notifications", notificationRoutes_1.default);
app.use("/api/v1/analytics", analyticRoutes_1.default);
app.use("/api/v1/layout", layoutRoutes_1.default);
app.get("/test", (req, res) => {
    res.status(200).json({ success: true, message: "Server is Live!" });
});
app.use((req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not Found!`);
    error.statusCode = 404;
    next(error);
});
app.use(limiter);
app.use(error_1.ErrorMiddleware);
app.listen(5000, () => {
    console.log("Server running on port 5000...");
});
