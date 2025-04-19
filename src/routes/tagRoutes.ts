import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getAllTags,
  getBooksByTag,
  createTag,
} from "../controllers/tagController";

const router = Router({ mergeParams: true });

router.get("/", asyncHandler(authMiddleware), setUserContext, getAllTags);
router.get(
  "/:id/books",
  asyncHandler(authMiddleware),
  setUserContext,
  getBooksByTag
);
router.post("/", asyncHandler(authMiddleware), setUserContext, createTag);

export default router;
