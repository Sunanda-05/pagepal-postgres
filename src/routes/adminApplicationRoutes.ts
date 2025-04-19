import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  listAllApplications,
  reviewApplication,
} from "../controllers/adminApplicationController";

const router = Router({ mergeParams: true });

router.get(
  "/author-applications",
  asyncHandler(authMiddleware),
  setUserContext,
  listAllApplications
);

router.post(
  "/author-applications/:id",
  asyncHandler(authMiddleware),
  setUserContext,
  reviewApplication
);

export default router;
