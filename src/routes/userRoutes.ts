import { Router } from "express";
import {
  getMyProfile,
  getOtherProfileById,
  updateProfile,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  followUser,
  getUserFollowers,
  getUserFollowings,
  removeFollower,
  unfollowUser,
} from "../controllers/followController";
import { getRecommendations } from "../controllers/recommendationController";

const router = Router({ mergeParams: true });

router.get("/me", asyncHandler(authMiddleware), setUserContext, getMyProfile);
router.patch("/", asyncHandler(authMiddleware), setUserContext, updateProfile);
router.get(
  "/recommendations",
  asyncHandler(authMiddleware),
  setUserContext,
  getRecommendations
);
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

router.get(
  "/:id/followers",
  asyncHandler(authMiddleware),
  setUserContext,
  getUserFollowers
);

router.get(
  "/:id/following",
  asyncHandler(authMiddleware),
  setUserContext,
  getUserFollowings
);

router.delete(
  "/:id/remove-follower",
  asyncHandler(authMiddleware),
  setUserContext,
  removeFollower
);

router.delete(
  "/:id/unfollow",
  asyncHandler(authMiddleware),
  setUserContext,
  unfollowUser
);

export default router;
