import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import {
  getSharedCollectionsService,
  shareCollectionService,
} from "../services/collectionShareService";

export const getCollectionsSharedWithMe = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user?.id;
    if (!userId) throw new ApiError(400, "No user ID provided");

    const collections = await getSharedCollectionsService(userId);
    response.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

export const shareCollection = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const ownerId = request.user?.id;
    if (!ownerId) throw new ApiError(400, "No Owner ID provided");

    const userId = request.body.userId;
    if (!userId) throw new ApiError(400, "No User ID provided");

    const collectionId = request.params.id;
    if (!collectionId) throw new ApiError(400, "No Collection ID provided");

    const sharedCollection = await shareCollectionService(
      collectionId,
      userId,
      ownerId
    );

    response.status(201).json(sharedCollection);
  } catch (error) {
    next(error);
  }
};
