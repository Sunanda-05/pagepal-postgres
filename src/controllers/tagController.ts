import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import {
  getAllTagsService,
  getBooksByTagIdService,
  addTagService,
} from "../services/tagService";

export const getAllTags = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const tags = await getAllTagsService();
    response.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

export const getBooksByTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const tagId = request.params.id;
    if (!tagId) throw new ApiError(400, "No Tag ID provided");

    const books = await getBooksByTagIdService(tagId);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");
    const tagname = request.body.name;

    const newTag = await addTagService(tagname);
    response.status(201).json(newTag);
  } catch (error) {
    next(error);
  }
};
