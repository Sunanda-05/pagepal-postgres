"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const context_1 = require("../config/context");
const asyncHandler_1 = require("../utils/asyncHandler");
const collectionController_1 = require("../controllers/collectionController");
const collectionBookController_1 = require("../controllers/collectionBookController");
const collectionShareController_1 = require("../controllers/collectionShareController");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/public", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.getAllPublicCollections);
router.get("/me", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.getMyCollections);
router.get("/:id", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.getCollectionById);
router.post("/", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.createCollection);
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.updateCollection);
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionController_1.deleteCollection);
router.post("/:id/books", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionBookController_1.addBookToCollection);
router.delete("/:id/books/:bookId", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionBookController_1.removeBookFromCollection);
router.post("/:id/share", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionShareController_1.shareCollection);
router.get("/shared", (0, asyncHandler_1.asyncHandler)(authMiddleware_1.default), context_1.setUserContext, collectionShareController_1.getCollectionsSharedWithMe);
exports.default = router;
