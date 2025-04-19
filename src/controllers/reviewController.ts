import { Request, Response, NextFunction } from "express";
import {
  getBookReviewService,
  reviewBookService,
  updateReviewService,
  deleteReviewService,
} from "../services/reviewService";
import ApiError from "../utils/ApiError";

export const getBookReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const bookId = request.params.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const reviews = await getBookReviewService(bookId);
    response.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const reviewBook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user?.id;
    if (!user) throw new ApiError(400, "No User ID provided");

    const reviewText = request.body.review;
    if (!reviewText) throw new ApiError(400, "No Review Text provided");

    const bookId = request.params.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const review = await reviewBookService(bookId, user, reviewText);
    response.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const reviewId = request?.params?.reviewId;
    if (!reviewId) throw new ApiError(400, "No Review ID provided");

    const reviewText = request.body.review;
    const updatedReview = await updateReviewService(
      reviewId,
      userId,
      reviewText
    );
    response.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const reviewId = request?.params?.reviewId;
    if (!reviewId) throw new ApiError(400, "No Review ID provided");

    const deletedReview = await deleteReviewService(reviewId, userId);
    response.status(200).json(deletedReview);
  } catch (error) {
    next(error);
  }
};
