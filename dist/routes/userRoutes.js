"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/me", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, userController_1.getMyProfile);
router.get("/:id", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, userController_1.getOtherProfileById);
router.patch("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, userController_1.updateProfile);
exports.default = router;
