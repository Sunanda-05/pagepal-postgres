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
exports.removeBookFromCollection = exports.addBookToCollection = void 0;
const collectionBookService_1 = require("../services/collectionBookService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addBookToCollection = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const collectionId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.id;
        if (!collectionId)
            throw new ApiError_1.default(400, "No Collection ID provided");
        const collectionBookDetails = {
            readingStatus: request.body.readingStatus,
            collectionId,
            bookId: (_c = request.body.isPublic) !== null && _c !== void 0 ? _c : false,
            userId,
        };
        const book = yield (0, collectionBookService_1.addCollectionBookService)(collectionBookDetails);
        response.status(201).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.addBookToCollection = addBookToCollection;
const removeBookFromCollection = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const collectionId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.id;
        const bookId = (_c = request === null || request === void 0 ? void 0 : request.params) === null || _c === void 0 ? void 0 : _c.bookId;
        if (!collectionId || !bookId)
            throw new ApiError_1.default(400, "No Collection ID/Book ID provided");
        const removedCollectionBook = yield (0, collectionBookService_1.deleteCollectionBookService)(userId, bookId, undefined, collectionId);
        response.status(200).json(removedCollectionBook);
    }
    catch (error) {
        next(error);
    }
});
exports.removeBookFromCollection = removeBookFromCollection;
