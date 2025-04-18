"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogMiddleware = exports.softDeleteMiddleware = exports.authMiddleware = void 0;
const auditLogger_1 = require("../utils/auditLogger");
const context_1 = require("../config/context");
const authMiddleware = (params, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const details = (0, context_1.getCurrentUser)();
    if (params.model === "Tag" &&
        ["create", "update", "delete"].includes(params.action)) {
        if (((_a = details === null || details === void 0 ? void 0 : details.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
            throw new Error("Only admins can manage tags");
        }
    }
    return next(params);
});
exports.authMiddleware = authMiddleware;
const softDeleteMiddleware = (params, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.model === "Book" && params.action === "delete") {
        params.action = "update";
        params.args["data"] = { deletedAt: new Date() };
    }
    if (params.model === "Book" && params.action === "findMany") {
        params.args.where = Object.assign(Object.assign({}, params.args.where), { deletedAt: null });
    }
    return next(params);
});
exports.softDeleteMiddleware = softDeleteMiddleware;
const auditLogMiddleware = (params, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const details = (0, context_1.getCurrentUser)();
    const result = yield next(params);
    const isWriteAction = ["create", "update", "delete"].includes(params.action);
    if (isWriteAction && details) {
        const recordId = (_d = (_c = (_b = (_a = params.args) === null || _a === void 0 ? void 0 : _a.where) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : result === null || result === void 0 ? void 0 : result.id) !== null && _d !== void 0 ? _d : "";
        const oldData = params.action === "update" ? (_e = params.args) === null || _e === void 0 ? void 0 : _e.data : undefined;
        const newData = result !== null && result !== void 0 ? result : undefined;
        yield (0, auditLogger_1.createAuditLog)({
            userId: ((_f = details.user) === null || _f === void 0 ? void 0 : _f.id) || "",
            operation: params.action,
            model: params.model || "",
            recordId: String(recordId),
            oldData,
            newData,
            ipAddress: (_g = details.ip) !== null && _g !== void 0 ? _g : "",
            userAgent: (_h = details.userAgent) !== null && _h !== void 0 ? _h : "",
        });
    }
    return result;
});
exports.auditLogMiddleware = auditLogMiddleware;
