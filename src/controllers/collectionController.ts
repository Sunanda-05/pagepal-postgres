import { Request, Response, NextFunction } from "express";
import {
  createCollectionService,
  deleteCollectionService,
  getAllPublicCollectionsService,
  getCollectionByIdService,
  getMyCollectionsService,
  updateCollectionService,
} from "../services/collectionService";
import ApiError from "../utils/ApiError";
import { Collection } from "../../generated";

export const getAllPublicCollections = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const collections = await getAllPublicCollectionsService();
    response.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

export const getMyCollections = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collections = await getMyCollectionsService(userId);
    response.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collectionId = request.params.id;
    if (!collectionId) throw new ApiError(400, "No Collection ID provided");

    const collections = await getCollectionByIdService(collectionId, userId);
    response.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collectionDetails: Omit<
      Collection,
      "id" | "createdAt" | "updatedAt"
    > = {
      name: request.body.title,
      description: request.body.description,
      isPublic: request.body.isPublic ?? false,
      userId,
    };

    const book = await createCollectionService(collectionDetails);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const collectionId = request?.params?.id;
    if (!collectionId) throw new ApiError(400, "No Collection ID provided");

    const updatedFields: Partial<Collection> = {};

    if ("name" in request.body) updatedFields.name = request.body.name;
    if ("isPublic" in request.body)
      updatedFields.isPublic = request.body.isPublic;
    if ("description" in request.body)
      updatedFields.description = request.body.description;

    const collection = await updateCollectionService(
      collectionId,
      updatedFields
    );
    response.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");

    const collectionId = request?.params?.id;
    if (!collectionId) throw new ApiError(400, "No Book ID provided");

    const collection = await deleteCollectionService(collectionId, user.id);
    response.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};
