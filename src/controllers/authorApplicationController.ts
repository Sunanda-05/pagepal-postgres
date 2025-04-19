import { Request, Response, NextFunction } from "express";
import {
  applyAuthorService,
  getMyApplyService,
} from "../services/authorApplicationService";
import ApiError from "../utils/ApiError";

export const getMyApplication = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(401, "Not a user");

    const applications = await getMyApplyService(userId);
    response.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const applyAsAuthor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (!user) throw new ApiError(401, "Not a user");
    if (user?.role === "USER") throw new ApiError(401, "Not a user");

    const bio = request.query.bio as string;
    const application = await applyAuthorService(user?.id, bio);
    response.status(201).json(application);
  } catch (error) {
    next(error);
  }
};
