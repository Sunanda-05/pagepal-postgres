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
const prisma = new generated_1.PrismaClient()
    .$extends(authExtension_1.authExtension)
    .$extends(softDeleteExtension_1.softDeleteExtension)
    .$extends(auditLogExtension_1.auditLogExtension);
exports.default = prisma;
