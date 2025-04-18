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
exports.followUserService = exports.getFollowersByIdService = exports.getFollowingByIdService = void 0;
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
const followUserService = (id, followingId) => __awaiter(void 0, void 0, void 0, function* () { });
exports.followUserService = followUserService;
