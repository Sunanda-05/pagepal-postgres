import { createAuditLog } from "../utils/auditLogger";
import { Prisma } from "../../generated";
import { getCurrentUser } from "../config/context";

export const authMiddleware: Prisma.Middleware = async (params, next) => {
  const details = getCurrentUser();

  if (
    params.model === "Tag" &&
    ["create", "update", "delete"].includes(params.action)
  ) {
    if (details?.user?.role !== "ADMIN") {
      throw new Error("Only admins can manage tags");
    }
  }

  return next(params);
};

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.model === "Book" && params.action === "delete") {
    params.action = "update";
    params.args["data"] = { deletedAt: new Date() };
  }

  if (params.model === "Book" && params.action === "findMany") {
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    };
  }

  return next(params);
};

export const auditLogMiddleware: Prisma.Middleware = async (params, next) => {
  const details = getCurrentUser();

  const result = await next(params);

  const isWriteAction = ["create", "update", "delete"].includes(params.action);
  if (isWriteAction && details) {
    const recordId = params.args?.where?.id ?? result?.id ?? "";

    const oldData = params.action === "update" ? params.args?.data : undefined;
    const newData = result ?? undefined;

    await createAuditLog({
      userId: details.user?.id || "",
      operation: params.action,
      model: params.model || "",
      recordId: String(recordId),
      oldData,
      newData,
      ipAddress: details.ip ?? "",
      userAgent: details.userAgent?? "",
    });
  }

  return result;
};
