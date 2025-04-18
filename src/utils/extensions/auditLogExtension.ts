import { Prisma } from "../../../generated";
import { getCurrentUser } from "../../config/context";
import { createAuditLog } from "../../utils/auditLogger";

export const auditLogExtension = Prisma.defineExtension({
  name: "auditLogExtension",
  result: {
    $allModels: {
      $afterOperation: {
        async compute({
          model,
          operation,
          args,
          result,
        }: {
          model: string;
          operation: string;
          args: any;
          result: any;
        }) {
          const details = getCurrentUser();

          const isWriteAction = ["create", "update", "delete"].includes(
            operation
          );
          if (!isWriteAction || !details) return;

          const recordId = args?.where?.id ?? result?.id ?? "";

          const oldData = operation === "update" ? args?.data : undefined;
          const newData = result ?? undefined;

          await createAuditLog({
            userId: details.user?.id || "",
            operation,
            model: model || "",
            recordId: String(recordId),
            oldData,
            newData,
            ipAddress: details.ip ?? "",
            userAgent: details.userAgent ?? "",
          });
        },
      },
    },
  },
});
