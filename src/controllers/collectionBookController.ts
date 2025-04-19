import { Request, Response, NextFunction } from "express";
import {
  addCollectionBookService,
  deleteCollectionBookService,
} from "../services/collectionBookService";
import ApiError from "../utils/ApiError";

export const addBookToCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collectionId = request?.params?.id;
    if (!collectionId) throw new ApiError(400, "No Collection ID provided");

    const collectionBookDetails = {
      readingStatus: request.body.readingStatus,
      collectionId,
      bookId: request.body.isPublic ?? false,
      userId,
    };

    const book = await addCollectionBookService(collectionBookDetails);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const removeBookFromCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collectionId = request?.params?.id;
    const bookId = request?.params?.bookId;
    if (!collectionId || !bookId) throw new ApiError(400, "No Collection ID/Book ID provided");

    const removedCollectionBook = await deleteCollectionBookService(userId, bookId, undefined, collectionId);
    response.status(200).json(removedCollectionBook);
  } catch (error) {
    next(error);
  }
};
