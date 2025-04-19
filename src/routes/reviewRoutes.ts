import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  reviewBook,
  updateReview,
  deleteReview,
  getBookReview,
} from "../controllers/reviewController";

const router = Router({ mergeParams: true });

router.post("/", asyncHandler(authMiddleware), setUserContext, reviewBook);

router.patch(
  "/:reviewId",
  asyncHandler(authMiddleware),
  setUserContext,
  updateReview
);

router.delete(
  "/:reviewId",
  asyncHandler(authMiddleware),
  setUserContext,
  deleteReview
);

router.get("/", asyncHandler(authMiddleware), setUserContext, getBookReview);

export default router;
