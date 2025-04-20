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
exports.getMyApplyService = exports.applyAuthorService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const applyAuthorService = (userId, bio) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alreadyAuthor = yield db_1.default.user.findUnique({
            where: {
                id: userId,
                role: "AUTHOR",
            },
        });
        if (alreadyAuthor)
            throw new ApiError_1.default(400, "You are already an author");
        const application = yield db_1.default.authorApplication.create({
            data: {
                userId,
                bio,
            },
        });
        return application;
    }
    catch (error) {
        console.error(error);
        throw new Error("Application for author failed");
    }
});
exports.applyAuthorService = applyAuthorService;
const getMyApplyService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield db_1.default.authorApplication.findMany({
            where: {
                userId,
            },
        });
        return applications;
    }
    catch (error) {
        console.error(error);
        throw new Error("Fetching applications failed");
    }
});
exports.getMyApplyService = getMyApplyService;
