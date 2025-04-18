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
exports.authExtension = void 0;
const generated_1 = require("../../../generated");
const context_1 = require("../../config/context");
exports.authExtension = generated_1.Prisma.defineExtension({
    name: "authExtension",
    query: {
        tag: {
            create(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    var _b;
                    const details = (0, context_1.getCurrentUser)();
                    if (((_b = details === null || details === void 0 ? void 0 : details.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
                        throw new Error("Only admins can manage tags");
                    }
                    return query(args);
                });
            },
            update(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    var _b;
                    const details = (0, context_1.getCurrentUser)();
                    if (((_b = details === null || details === void 0 ? void 0 : details.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
                        throw new Error("Only admins can manage tags");
                    }
                    return query(args);
                });
            },
            delete(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    var _b;
                    const details = (0, context_1.getCurrentUser)();
                    if (((_b = details === null || details === void 0 ? void 0 : details.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
                        throw new Error("Only admins can manage tags");
                    }
                    return query(args);
                });
            },
        },
    },
});
