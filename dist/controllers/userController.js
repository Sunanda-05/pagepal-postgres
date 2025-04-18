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
exports.getOtherProfileById = exports.updateProfile = exports.getMyProfile = void 0;
const userService_1 = require("../services/userService");
const getMyProfile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const userProfile = yield (0, userService_1.getUserByIdService)(userId);
        response.status(200).json(userProfile);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getMyProfile = getMyProfile;
const updateProfile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            response.status(400).json({ error: "No UserId provided." });
            return;
        }
        const userProfile = yield (0, userService_1.updateProfileService)(userId, request.body);
        response.status(200).json(userProfile);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.updateProfile = updateProfile;
const getOtherProfileById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = request.params;
        const userProfile = yield (0, userService_1.getUserByIdService)(userId);
        response.status(200).json(userProfile);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.getOtherProfileById = getOtherProfileById;
