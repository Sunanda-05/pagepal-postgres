import { Router } from "express";
import {
  getMyProfile,
  getOtherProfileById,
  updateProfile,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import { followUser, unfollowUser } from "../controllers/followController";
import { getRecommendations } from "../controllers/recommendationController";

const router = Router({ mergeParams: true });

router.get("/me", asyncHandler(authMiddleware), setUserContext, getMyProfile);
router.patch("/", asyncHandler(authMiddleware), setUserContext, updateProfile);
router.get(
  "/:id",
  asyncHandler(authMiddleware),
  setUserContext,
  getOtherProfileById
);
router.post(
  "/:id/follow",
  asyncHandler(authMiddleware),
  setUserContext,
  followUser
);
router.delete(
  "/:id/unfollow",
  asyncHandler(authMiddleware),
  setUserContext,
  unfollowUser
);

router.get("/recommendations", getRecommendations)
export default router;
