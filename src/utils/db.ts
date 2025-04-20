import { PrismaClient, Prisma } from "../../generated";
import { auditLogExtension } from "./extensions/auditLogExtension";
import { authExtension } from "./extensions/authExtension";
import { softDeleteExtension } from "./extensions/softDeleteExtension";
// import { authMiddleware, softDeleteMiddleware, auditLogMiddleware } from "../middlewares/prismaMiddleware";

//* Middleware: Deprecated
// prisma.$use(authMiddleware);
// prisma.$use(softDeleteMiddleware);
// prisma.$use(auditLogMiddleware);

const logQuery = (e: Prisma.QueryEvent) => {
  if (e.query.includes("password")) return;
  console.log(`Query executed: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
};

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "info", emit: "event" },
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ] as Prisma.LogDefinition[],
  errorFormat: "pretty",
});

prisma.$on("query" as never, logQuery);
prisma.$on("info" as never, (e) => {
  console.log(e);
});

prisma
  .$extends(authExtension)
  .$extends(softDeleteExtension)
  .$extends(auditLogExtension);

export default prisma;
