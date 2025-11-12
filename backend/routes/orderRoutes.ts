import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  getStripePublicKey,
  newPayment,
} from "../controllers/orderController";
import { updateAccessToken } from "../controllers/userController";

const orderRouter = express.Router();

orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  createOrder
);
orderRouter.get(
  "/get-all-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);
orderRouter.get("/payment/stripe-publishable-key", getStripePublicKey);
orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;
