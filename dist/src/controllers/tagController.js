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
exports.createTag = exports.getBooksByTag = exports.getAllTags = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tagService_1 = require("../services/tagService");
const getAllTags = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield (0, tagService_1.getAllTagsService)();
        response.status(200).json(tags);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTags = getAllTags;
const getBooksByTag = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagId = request.params.id;
        if (!tagId)
            throw new ApiError_1.default(400, "No Tag ID provided");
        const books = yield (0, tagService_1.getBooksByTagIdService)(tagId);
        response.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
});
exports.getBooksByTag = getBooksByTag;
const createTag = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const tagname = request.body.name;
        const newTag = yield (0, tagService_1.addTagService)(tagname);
        response.status(201).json(newTag);
    }
    catch (error) {
        next(error);
    }
});
exports.createTag = createTag;
