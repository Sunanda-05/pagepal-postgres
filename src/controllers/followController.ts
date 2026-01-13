import { Request, Response } from "express";
import {
  followAuthorService,
  getAuthorFollowersService,
  unfollowAuthorService,
} from "../services/authorFollowServices";
import {
  followUserService,
  getUserFollowersService,
  getUserFollowingService,
  unfollowUserService,
} from "../services/userFollowServices";

export const getUserFollowers = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request?.params?.id;
    const { type } = request.query;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    if (type === "user") {
      const result = await getUserFollowersService(userId);
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await getAuthorFollowersService(userId);
      response.status(200).json(result);
    } else {
      response.status(400).json({ message: "Invalid follow type" });
    }
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const getUserFollowings = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request?.params?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const followers = await getUserFollowingService(userId);
    response.status(200).json(followers);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const followUser = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    const followingId = request?.params?.id;
    const { type } = request?.query;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    if (type === "user") {
      const result = await followUserService(userId, followingId);
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await followAuthorService(userId, followingId);
      response.status(200).json(result);
    } else {
      response.status(400).json({ message: "Invalid follow type" });
    }
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const unfollowUser = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    const followingId = request?.params?.id;
    const { type } = request.query;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }

    if (type === "user") {
      const result = await unfollowUserService(userId, followingId);
      response.status(200).json(result);
    } else if (type === "author") {
      const result = await unfollowAuthorService(userId, followingId);
      response.status(200).json(result);
    } else {
      response.status(400).json({ message: "Invalid follow type" });
    }
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};
