import { Request, Response, NextFunction } from "express";
import {
  getAllApplyService,
  reviewApplyService,
} from "../services/adminApplicationService";
import ApiError from "../utils/ApiError";
import { ApplicationStatus } from "../../generated";

export const listAllApplications = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (!user) throw new ApiError(401, "No UserID user");
    if (user?.role !== "ADMIN") throw new ApiError(401, "Not an ADMIN");

    const status = request.query.status
      ? (request.query.status as ApplicationStatus)
      : undefined;
    const applications = await getAllApplyService(status);
    response.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const reviewApplication = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (!user) throw new ApiError(401, "Not a user");
    if (user?.role !== "ADMIN") throw new ApiError(401, "Not an admin");

    const id = request.params.id;
    const status = request.body.status;
    const reason = request.body.reason;

    if (!id) throw new ApiError(400, "No Review Id");
    if (!status) throw new ApiError(400, "No Review Status");

    const application = await reviewApplyService(id, user.id, status, reason);
    response.status(201).json(application);
  } catch (error) {
    next(error);
  }
};
