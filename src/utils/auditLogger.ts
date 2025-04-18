import prisma from "./db";
import { AuditLog } from "../../generated";

export async function createAuditLog(
  logData: Omit<AuditLog, "createdAt" | "id">
) {
  return prisma.auditLog.create({
    data: {
      userId: logData.userId,
      operation: logData.operation,
      model: logData.model,
      recordId: logData.recordId,
      oldData: logData.oldData ?? undefined,
      newData: logData.newData ?? undefined,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
    },
  });
}
