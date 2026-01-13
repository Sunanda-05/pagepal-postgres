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
exports.unfollowUserService = exports.followUserService = exports.getUserFollowingService = exports.getUserFollowersService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const getUserFollowersService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followers = yield db_1.default.follow.findMany({
            where: { followingId: id },
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
        throw new Error("Error fetching user followers");
    }
});
exports.getUserFollowersService = getUserFollowersService;
const getUserFollowingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followings = yield db_1.default.follow.findMany({
            where: { followerId: id },
            select: {
                createdAt: true,
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return followings;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching who the user is following");
    }
});
exports.getUserFollowingService = getUserFollowingService;
const followUserService = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (followerId === followingId) {
            throw new ApiError_1.default(400, "Users cannot follow themselves");
        }
        const existingFollow = yield db_1.default.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId,
                },
            },
        });
        if (existingFollow) {
            throw new ApiError_1.default(400, "Already following this user");
        }
        const newFollow = yield db_1.default.follow.create({
            data: {
                followerId: followerId,
                followingId: followingId,
            },
        });
        return newFollow;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error following user");
    }
});
exports.followUserService = followUserService;
const unfollowUserService = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (followerId === followingId) {
            throw new ApiError_1.default(400, "Users cannot unfollow themselves");
        }
        const unfollow = yield db_1.default.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId,
                },
            },
        });
        if (!unfollow) {
            throw new ApiError_1.default(400, "Not following this user");
        }
        return unfollow;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error unfollowing user");
    }
});
exports.unfollowUserService = unfollowUserService;
