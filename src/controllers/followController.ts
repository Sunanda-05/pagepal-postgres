import { Request, Response } from "express";
import {
  followUserService,
  getFollowersByIdService,
  getFollowingByIdService,
  unfollowUserService
} from "../services/followServices";

export const getFollowers = async (request: Request, response: Response) => {
  try {
    const userId = request?.params?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const followers = await getFollowersByIdService(userId);
    response.status(200).json(followers);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const getFollowings = async (request: Request, response: Response) => {
  try {
    const userId = request?.params?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const followers = await getFollowingByIdService(userId);
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
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const follow = await followUserService(userId, followingId);
    response.status(200).json(follow);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
}

export const unfollowUser = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    const followingId = request?.params?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const follow = await unfollowUserService(userId, followingId);
    response.status(200).json(follow);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
}