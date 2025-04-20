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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewApplyService = exports.getAllApplyService = void 0;
const generated_1 = require("../../generated");
const db_1 = __importDefault(require("../utils/db"));
const getAllApplyService = (status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield db_1.default.authorApplication.findMany({
            where: { status: status },
        });
        return applications;
    }
    catch (error) {
        console.error(error);
        throw new Error("Fetching applications failed");
    }
});
exports.getAllApplyService = getAllApplyService;
const reviewApplyService = (id, adminId, status, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const application = yield tx.authorApplication.update({
                where: {
                    id,
                    status: "PENDING",
                },
                data: {
                    status,
                    reviewedById: adminId,
                    reason,
                    reviewedAt: new Date(),
                },
                include: {
                    user: true,
                },
            });
            if (status === "APPROVED") {
                yield tx.user.update({
                    where: { id: application.userId },
                    data: { role: generated_1.Role.AUTHOR },
                });
            }
            return application;
        }));
    }
    catch (error) {
        console.error(error); //!TODO check if application not found
        throw new Error("Reviewing application failed");
    }
});
exports.reviewApplyService = reviewApplyService;
