import { PrismaClient } from "../../generated";
import { auditLogExtension } from "./extensions/auditLogExtension";
import { authExtension } from "./extensions/authExtension";
import { softDeleteExtension } from "./extensions/softDeleteExtension";
// import { authMiddleware, softDeleteMiddleware, auditLogMiddleware } from "../middlewares/prismaMiddleware";

//* Middleware: Deprecated
// prisma.$use(authMiddleware);
// prisma.$use(softDeleteMiddleware);
// prisma.$use(auditLogMiddleware);

const prisma = new PrismaClient()
  .$extends(authExtension)
  .$extends(softDeleteExtension)
  .$extends(auditLogExtension);

export default prisma;