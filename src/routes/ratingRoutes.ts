import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  rateBook,
  getBookRatings
} from "../controllers/ratingsController";

const router = Router({ mergeParams: true });

router.post(
  "/",
  asyncHandler(authMiddleware),
  setUserContext,
  rateBook
);

router.get(
  "/",
  asyncHandler(authMiddleware),
  setUserContext,
  getBookRatings
);

export default router;
