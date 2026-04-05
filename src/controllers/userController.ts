import { Request, Response } from "express";
import {
  getFollowSuggestionsService,
  getUserByIdService,
  searchUsersService,
  updateProfileService,
} from "../services/userService";
import ApiError from "../utils/ApiError";

const respondWithError = (response: Response, error: unknown) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error("Error in user controller:", error);
  response.status(500).json({ error: "Internal server error." });
};

const parsePage = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseLimit = (value: unknown, defaultValue = 10): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue;
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
    respondWithError(response, error);
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
    respondWithError(response, error);
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
    respondWithError(response, error);
  }
};

export const searchUsers = async (request: Request, response: Response) => {
  try {
    const viewerId = request?.user?.id;

    if (!viewerId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }

    const users = await searchUsersService(viewerId, {
      query: parseSearch(request.query.query ?? request.query.search),
      page: parsePage(request.query.page),
      limit: parseLimit(request.query.limit, 10),
    });

    response.status(200).json(users);
  } catch (error) {
    respondWithError(response, error);
  }
};

export const getFollowSuggestions = async (
  request: Request,
  response: Response
) => {
  try {
    const viewerId = request?.user?.id;

    if (!viewerId) {
      response.status(400).json({ error: "No UserId provided." });
      return;
    }

    const suggestions = await getFollowSuggestionsService(
      viewerId,
      parseLimit(request.query.limit, 8)
    );

    response.status(200).json(suggestions);
  } catch (error) {
    respondWithError(response, error);
  }
};

