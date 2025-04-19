import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { addBookTagService } from "../services/bookTagService";

export const addBooktag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");

    const bookId = request?.params?.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const { tagId } = request.body;
    if (!tagId) {
      throw new ApiError(400, "No Tag ID provided");
    }

    const book = await addBookTagService(bookId, tagId, user.id);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
};
