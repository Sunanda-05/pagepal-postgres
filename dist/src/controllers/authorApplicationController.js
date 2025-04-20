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
exports.applyAsAuthor = exports.getMyApplication = void 0;
const authorApplicationService_1 = require("../services/authorApplicationService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getMyApplication = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(401, "Not a user");
        const applications = yield (0, authorApplicationService_1.getMyApplyService)(userId);
        response.status(200).json(applications);
    }
    catch (error) {
        next(error);
    }
});
exports.getMyApplication = getMyApplication;
const applyAsAuthor = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if (!user)
            throw new ApiError_1.default(401, "Not a user");
        if ((user === null || user === void 0 ? void 0 : user.role) === "USER")
            throw new ApiError_1.default(401, "Not a user");
        const bio = request.query.bio;
        const application = yield (0, authorApplicationService_1.applyAuthorService)(user === null || user === void 0 ? void 0 : user.id, bio);
        response.status(201).json(application);
    }
    catch (error) {
        next(error);
    }
});
exports.applyAsAuthor = applyAsAuthor;
