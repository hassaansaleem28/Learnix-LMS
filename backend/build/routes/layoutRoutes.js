"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const layoutController_1 = require("../controllers/layoutController");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const layoutRouter = express_1.default.Router();
layoutRouter.post("/create-layout", userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layoutController_1.createLayout);
layoutRouter.put("/edit-layout", userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layoutController_1.editLayout);
layoutRouter.get("/get-layout-by-type/:type", layoutController_1.getLayoutByType);
exports.default = layoutRouter;
