import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  applyAsAuthor,
  getMyApplication,
} from "../controllers/authorApplicationController";

const router = Router({ mergeParams: true });

router.post(
  "/apply",
  asyncHandler(authMiddleware),
  setUserContext,
  applyAsAuthor
);

router.get(
  "/application",
  asyncHandler(authMiddleware),
  setUserContext,
  getMyApplication
);

export default router;
