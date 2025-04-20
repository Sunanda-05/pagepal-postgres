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
exports.reviewApplication = exports.listAllApplications = void 0;
const adminApplicationService_1 = require("../services/adminApplicationService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const listAllApplications = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if (!user)
            throw new ApiError_1.default(401, "No UserID user");
        if ((user === null || user === void 0 ? void 0 : user.role) !== "ADMIN")
            throw new ApiError_1.default(401, "Not an ADMIN");
        const status = request.query.status
            ? request.query.status
            : undefined;
        const applications = yield (0, adminApplicationService_1.getAllApplyService)(status);
        response.status(200).json(applications);
    }
    catch (error) {
        next(error);
    }
});
exports.listAllApplications = listAllApplications;
const reviewApplication = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if (!user)
            throw new ApiError_1.default(401, "Not a user");
        if ((user === null || user === void 0 ? void 0 : user.role) !== "ADMIN")
            throw new ApiError_1.default(401, "Not an admin");
        const id = request.params.id;
        const status = request.body.status;
        const reason = request.body.reason;
        if (!id)
            throw new ApiError_1.default(400, "No Review Id");
        if (!status)
            throw new ApiError_1.default(400, "No Review Status");
        const application = yield (0, adminApplicationService_1.reviewApplyService)(id, user.id, status, reason);
        response.status(201).json(application);
    }
    catch (error) {
        next(error);
    }
});
exports.reviewApplication = reviewApplication;
