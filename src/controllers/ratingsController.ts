import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import {
  getBookRatingService,
  rateBookService,
} from "../services/ratingService";

export const getBookRatings = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const bookId = request.params.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const ratings = await getBookRatingService(bookId);
    response.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

export const rateBook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const rating = +(request.body.rating);
    const bookId = request.params.id;

    const ratingInfo = await rateBookService(bookId, userId, rating);
    response.status(201).json(ratingInfo);
  } catch (error) {
    next(error);
  }
};
