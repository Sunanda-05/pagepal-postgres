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
exports.addBooktag = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bookTagService_1 = require("../services/bookTagService");
const addBooktag = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const bookId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const { tagId } = request.body;
        if (!tagId) {
            throw new ApiError_1.default(400, "No Tag ID provided");
        }
        const book = yield (0, bookTagService_1.addBookTagService)(bookId, tagId, user.id);
        response.status(201).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.addBooktag = addBooktag;
