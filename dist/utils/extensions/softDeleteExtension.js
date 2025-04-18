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
exports.softDeleteExtension = void 0;
const generated_1 = require("../../../generated");
exports.softDeleteExtension = generated_1.Prisma.defineExtension({
    name: "softDeleteExtension",
    query: {
        book: {
            delete(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    return query({
                        where: args.where,
                        data: { deletedAt: new Date() },
                    });
                });
            },
            findMany(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    args.where = Object.assign(Object.assign({}, args.where), { deletedAt: null });
                    return query(args);
                });
            },
        },
    },
});
