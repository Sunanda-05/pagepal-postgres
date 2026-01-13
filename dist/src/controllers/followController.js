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
exports.unfollowUser = exports.followUser = exports.getUserFollowings = exports.getUserFollowers = void 0;
const authorFollowServices_1 = require("../services/authorFollowServices");
const userFollowServices_1 = require("../services/userFollowServices");
const getUserFollowers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        const { type } = request.query;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        if (type === "user") {
            const result = yield (0, userFollowServices_1.getUserFollowersService)(userId);
            response.status(200).json(result);
        }
        else if (type === "author") {
            const result = yield (0, authorFollowServices_1.getAuthorFollowersService)(userId);
            response.status(200).json(result);
        }
        else {
            response.status(400).json({ message: "Invalid follow type" });
        }
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getUserFollowers = getUserFollowers;
const getUserFollowings = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const followers = yield (0, userFollowServices_1.getUserFollowingService)(userId);
        response.status(200).json(followers);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getUserFollowings = getUserFollowings;
const followUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        const followingId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.id;
        const { type } = request === null || request === void 0 ? void 0 : request.query;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        if (type === "user") {
            const result = yield (0, userFollowServices_1.followUserService)(userId, followingId);
            response.status(200).json(result);
        }
        else if (type === "author") {
            const result = yield (0, authorFollowServices_1.followAuthorService)(userId, followingId);
            response.status(200).json(result);
        }
        else {
            response.status(400).json({ message: "Invalid follow type" });
        }
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
        const { type } = request.query;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        if (type === "user") {
            const result = yield (0, userFollowServices_1.unfollowUserService)(userId, followingId);
            response.status(200).json(result);
        }
        else if (type === "author") {
            const result = yield (0, authorFollowServices_1.unfollowAuthorService)(userId, followingId);
            response.status(200).json(result);
        }
        else {
            response.status(400).json({ message: "Invalid follow type" });
        }
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.unfollowUser = unfollowUser;
