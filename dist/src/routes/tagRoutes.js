"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const tagController_1 = require("../controllers/tagController");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, tagController_1.getAllTags);
router.get("/:id/books", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, tagController_1.getBooksByTag);
router.post("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, tagController_1.createTag);
exports.default = router;
