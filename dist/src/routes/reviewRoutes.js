"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, reviewController_1.reviewBook);
router.patch("/:reviewId", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, reviewController_1.updateReview);
router.delete("/:reviewId", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, reviewController_1.deleteReview);
router.get("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, reviewController_1.getBookReview);
exports.default = router;
