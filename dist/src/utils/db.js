"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../generated");
const auditLogExtension_1 = require("./extensions/auditLogExtension");
const authExtension_1 = require("./extensions/authExtension");
const softDeleteExtension_1 = require("./extensions/softDeleteExtension");
// import { authMiddleware, softDeleteMiddleware, auditLogMiddleware } from "../middlewares/prismaMiddleware";
//* Middleware: Deprecated
// prisma.$use(authMiddleware);
// prisma.$use(softDeleteMiddleware);
// prisma.$use(auditLogMiddleware);
const logQuery = (e) => {
    if (e.query.includes("password"))
        return;
    console.log(`Query executed: ${e.query}`);
    console.log(`Params: ${e.params}`);
    console.log(`Duration: ${e.duration}ms`);
};
const prisma = new generated_1.PrismaClient({
    log: [
        { level: "query", emit: "event" },
        { level: "info", emit: "event" },
        { level: "warn", emit: "stdout" },
        { level: "error", emit: "stdout" },
    ],
    errorFormat: "pretty",
});
prisma.$on("query", logQuery);
prisma.$on("info", (e) => {
    console.log(e);
});
prisma
    .$extends(authExtension_1.authExtension)
    .$extends(softDeleteExtension_1.softDeleteExtension)
    .$extends(auditLogExtension_1.auditLogExtension);
exports.default = prisma;
