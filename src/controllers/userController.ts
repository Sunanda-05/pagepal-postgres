import { Request, Response } from "express";
import {
  getUserByIdService,
  updateProfileService,
} from "../services/userService";

export const getMyProfile = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const userProfile = await getUserByIdService(userId);
    response.status(200).json(userProfile);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const updateProfile = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    if (!userId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }
    const userProfile = await updateProfileService(userId, request.body);
    response.status(200).json(userProfile);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const getOtherProfileById = async (
  request: Request,
  response: Response
) => {
  try {
    const { id: userId } = request.params;
    const userProfile = await getUserByIdService(userId);
    response.status(200).json(userProfile);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

