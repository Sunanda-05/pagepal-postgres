import { NextFunction, Request, Response } from "express";
import {
  followAuthorService,
  getAuthorFollowersService,
  unfollowAuthorService,
} from "../services/authorFollowServices";
import {
  followUserService,
  getUserFollowersService,
  getUserFollowingService,
  removeFollowerService,
  unfollowUserService,
} from "../services/userFollowServices";
import ApiError from "../utils/ApiError";

const parsePage = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseLimit = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }
  return Math.min(50, parsed);
};

const parseSearch = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const getUserFollowers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.params?.id;
    const { type } = request.query;
    if (!userId) throw new ApiError(400, "No UserId provided.");

    if (type === "user") {
      const result = await getUserFollowersService(userId, {
        page: parsePage(request.query.page),
        limit: parseLimit(request.query.limit),
        search: parseSearch(request.query.search),
        viewerId: request.user?.id,
      });
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await getAuthorFollowersService(userId);
      response.status(200).json(result);
    } else {
      throw new ApiError(400, "Invalid follow type");
    }
  } catch (error) {
    next(error);
  }
};

export const getUserFollowings = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.params?.id;
    if (!userId) throw new ApiError(400, "No UserId provided.");

    const followers = await getUserFollowingService(userId, {
      page: parsePage(request.query.page),
      limit: parseLimit(request.query.limit),
      search: parseSearch(request.query.search),
      viewerId: request.user?.id,
    });

    response.status(200).json(followers);
  } catch (error) {
    next(error);
  }
};

export const followUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.user?.id;
    const followingId = request?.params?.id;
    const { type } = request?.query;
    if (!userId) throw new ApiError(400, "No UserId provided.");

    if (type === "user") {
      const result = await followUserService(userId, followingId);
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await followAuthorService(userId, followingId);
      response.status(200).json(result);
    } else {
      throw new ApiError(400, "Invalid follow type");
    }
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.user?.id;
    const followingId = request?.params?.id;
    const { type } = request.query;
    if (!userId) throw new ApiError(400, "No UserId provided.");

    if (type === "user") {
      const result = await unfollowUserService(userId, followingId);
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await unfollowAuthorService(userId, followingId);
      response.status(200).json(result);
    } else {
      throw new ApiError(400, "Invalid follow type");
    }
  } catch (error) {
    next(error);
  }
};

export const removeFollower = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.user?.id;
    const followerId = request?.params?.id;

    if (!userId) throw new ApiError(400, "No UserId provided.");
    if (!followerId) throw new ApiError(400, "No follower id provided.");

    const result = await removeFollowerService(userId, followerId);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
