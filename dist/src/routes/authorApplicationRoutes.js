"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const authorApplicationController_1 = require("../controllers/authorApplicationController");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/apply", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, authorApplicationController_1.applyAsAuthor);
router.get("/application", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, authorApplicationController_1.getMyApplication);
exports.default = router;
