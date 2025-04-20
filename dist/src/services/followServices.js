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
exports.unfollowUserService = exports.followUserService = exports.getFollowersByIdService = exports.getFollowingByIdService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const getFollowersByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
        throw new Error("Error fetching user by id");
    }
});
exports.getFollowersByIdService = getFollowersByIdService;
const getFollowingByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
        throw new Error("Error fetching user by id");
    }
});
exports.getFollowingByIdService = getFollowingByIdService;
const followUserService = (id, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (id === followingId) {
            throw new ApiError_1.default(400, "Users cannot follow themselves");
        }
        const [follower, following] = yield Promise.all([
            db_1.default.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    following: {
                        where: {
                            followingId: followingId,
                        },
                    },
                },
            }),
            db_1.default.user.findUnique({
                where: { id: followingId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    followers: {
                        where: {
                            followerId: id,
                        },
                    },
                },
            }),
        ]);
        if (!follower || !following) {
            throw new ApiError_1.default(404, "One or both users not found");
        }
        if ((follower === null || follower === void 0 ? void 0 : follower.following.length) > 0 || (following === null || following === void 0 ? void 0 : following.followers.length) > 0) {
            throw new ApiError_1.default(400, "Already following this user");
        }
        const newFollow = yield db_1.default.follow.create({
            data: {
                followerId: id,
                followingId: followingId,
            },
        });
        return newFollow;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching user by id");
    }
});
exports.followUserService = followUserService;
const unfollowUserService = (id, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (id === followingId) {
            throw new ApiError_1.default(400, "Users cannot unfollow themselves");
        }
        const [follower, following] = yield Promise.all([
            db_1.default.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    following: {
                        where: {
                            followingId: followingId,
                        },
                    },
                },
            }),
            db_1.default.user.findUnique({
                where: { id: followingId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    followers: {
                        where: {
                            followerId: id,
                        },
                    },
                },
            }),
        ]);
        if (!follower || !following) {
            throw new ApiError_1.default(404, "One or both users not found");
        }
        if ((follower === null || follower === void 0 ? void 0 : follower.following.length) === 0 || (following === null || following === void 0 ? void 0 : following.followers.length) === 0) {
            throw new ApiError_1.default(400, "Not following this user");
        }
        const unfollow = yield db_1.default.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: id,
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
        throw new Error("Error fetching user by id");
    }
});
exports.unfollowUserService = unfollowUserService;
