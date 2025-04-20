"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const ratingsController_1 = require("../controllers/ratingsController");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, ratingsController_1.rateBook);
router.get("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, ratingsController_1.getBookRatings);
exports.default = router;
