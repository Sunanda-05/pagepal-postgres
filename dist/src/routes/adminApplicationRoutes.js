"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const adminApplicationController_1 = require("../controllers/adminApplicationController");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/author-applications", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, adminApplicationController_1.listAllApplications);
router.post("/author-applications/:id", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, adminApplicationController_1.reviewApplication);
exports.default = router;
