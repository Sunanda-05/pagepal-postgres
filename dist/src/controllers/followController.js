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
exports.unfollowUser = exports.followUser = exports.getFollowings = exports.getFollowers = void 0;
const followServices_1 = require("../services/followServices");
const getFollowers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const followers = yield (0, followServices_1.getFollowersByIdService)(userId);
        response.status(200).json(followers);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getFollowers = getFollowers;
const getFollowings = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const followers = yield (0, followServices_1.getFollowingByIdService)(userId);
        response.status(200).json(followers);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getFollowings = getFollowings;
const followUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        const followingId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const follow = yield (0, followServices_1.followUserService)(userId, followingId);
        response.status(201).json(follow);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.followUser = followUser;
const unfollowUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        const followingId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const follow = yield (0, followServices_1.unfollowUserService)(userId, followingId);
        response.status(200).json(follow);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.unfollowUser = unfollowUser;
