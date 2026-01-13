"use strict";
// services/authorFollowServices.ts
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
exports.unfollowAuthorService = exports.followAuthorService = exports.getAuthorFollowersService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const getAuthorFollowersService = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followers = yield db_1.default.authorFollow.findMany({
            where: { authorId },
            select: {
                createdAt: true,
                follower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return followers;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching author followers");
    }
});
exports.getAuthorFollowersService = getAuthorFollowersService;
const followAuthorService = (followerId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingFollow = yield db_1.default.authorFollow.findUnique({
            where: {
                followerId_authorId: {
                    followerId: followerId,
                    authorId: authorId,
                },
            },
        });
        if (existingFollow) {
            throw new ApiError_1.default(400, "Already following this author");
        }
        const newFollow = yield db_1.default.authorFollow.create({
            data: {
                followerId: followerId,
                authorId: authorId,
            },
        });
        return newFollow;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error following author");
    }
});
exports.followAuthorService = followAuthorService;
const unfollowAuthorService = (followerId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unfollow = yield db_1.default.authorFollow.delete({
            where: {
                followerId_authorId: {
                    followerId: followerId,
                    authorId: authorId,
                },
            },
        });
        if (!unfollow) {
            throw new ApiError_1.default(400, "Not following this author");
        }
        return unfollow;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error unfollowing author");
    }
});
exports.unfollowAuthorService = unfollowAuthorService;
