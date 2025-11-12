"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const notificationCotroller_1 = require("../controllers/notificationCotroller");
const userController_1 = require("../controllers/userController");
const notificationRouter = express_1.default.Router();
notificationRouter.get("/get-all-notifications", userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), notificationCotroller_1.getNotifications);
notificationRouter.put("/update-notification-status/:id", userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), notificationCotroller_1.updateNotificationStatus);
exports.default = notificationRouter;
