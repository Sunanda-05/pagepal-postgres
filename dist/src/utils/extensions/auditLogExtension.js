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
exports.auditLogExtension = void 0;
const generated_1 = require("../../../generated");
const context_1 = require("../../config/context");
const auditLogger_1 = require("../../utils/auditLogger");
exports.auditLogExtension = generated_1.Prisma.defineExtension({
    name: "auditLogExtension",
    result: {
        $allModels: {
            $afterOperation: {
                compute(_a) {
                    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, result, }) {
                        var _b, _c, _d, _e, _f, _g;
                        const details = (0, context_1.getCurrentUser)();
                        const isWriteAction = ["create", "update", "delete"].includes(operation);
                        if (!isWriteAction || !details)
                            return;
                        const recordId = (_d = (_c = (_b = args === null || args === void 0 ? void 0 : args.where) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : result === null || result === void 0 ? void 0 : result.id) !== null && _d !== void 0 ? _d : "";
                        const oldData = operation === "update" ? args === null || args === void 0 ? void 0 : args.data : undefined;
                        const newData = result !== null && result !== void 0 ? result : undefined;
                        yield (0, auditLogger_1.createAuditLog)({
                            userId: ((_e = details.user) === null || _e === void 0 ? void 0 : _e.id) || "",
                            operation,
                            model: model || "",
                            recordId: String(recordId),
                            oldData,
                            newData,
                            ipAddress: (_f = details.ip) !== null && _f !== void 0 ? _f : "",
                            userAgent: (_g = details.userAgent) !== null && _g !== void 0 ? _g : "",
                        });
                    });
                },
            },
        },
    },
});
