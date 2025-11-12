import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/mongodb";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/userRoutes";
import courseRouter from "./routes/courseRoutes";
import orderRouter from "./routes/orderRoutes";
import notificationRouter from "./routes/notificationRoutes";
import analyticsRouter from "./routes/analyticRoutes";
import layoutRouter from "./routes/layoutRoutes";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://lms-frontend-plum-three.vercel.app"],
    credentials: true,
  })
);

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/layout", layoutRouter);

app.get("/test", (req: express.Request, res: express.Response) => {
  res.status(200).json({ success: true, message: "Server is Live!" });
});

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const error: any = new Error(`Route ${req.originalUrl} not Found!`);
    error.statusCode = 404;
    next(error);
  }
);
app.use(limiter);
app.use(ErrorMiddleware);

app.listen(5000, () => {
  console.log("Server running on port 5000...");
});
