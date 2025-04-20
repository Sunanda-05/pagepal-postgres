import { Request, Response, NextFunction } from "express";
import { generateRecommendations } from "../services/recommendationService";
import ApiError from "../utils/ApiError";

export const getRecommendations = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(401, "Unauthorized");
    const books = await generateRecommendations(userId);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
