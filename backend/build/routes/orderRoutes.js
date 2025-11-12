"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderController_1 = require("../controllers/orderController");
const userController_1 = require("../controllers/userController");
const orderRouter = express_1.default.Router();
orderRouter.post("/create-order", userController_1.updateAccessToken, auth_1.isAuthenticated, orderController_1.createOrder);
orderRouter.get("/get-all-orders", userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), orderController_1.getAllOrders);
orderRouter.get("/payment/stripe-publishable-key", orderController_1.getStripePublicKey);
orderRouter.post("/payment", auth_1.isAuthenticated, orderController_1.newPayment);
exports.default = orderRouter;
