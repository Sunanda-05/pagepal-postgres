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
exports.deleteCollectionBookService = exports.addCollectionBookService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const addCollectionBookService = (details) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findBook = db_1.default.book.findUnique({
            where: { id: details.bookId },
        });
        const findCollection = db_1.default.collection.findUnique({
            where: { id: details.collectionId, userId: details.userId },
        });
        const [book, ownedCollection] = yield Promise.all([
            findBook,
            findCollection,
        ]);
        if (!book)
            throw new ApiError_1.default(404, "Book not found");
        if (!ownedCollection)
            throw new ApiError_1.default(403, "Collection not found or not owned by user");
        const addedCollectionBook = yield db_1.default.collectionBook.create({
            data: details,
        });
        return addedCollectionBook;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error adding book to collection");
    }
});
exports.addCollectionBookService = addCollectionBookService;
const deleteCollectionBookService = (userId, bookId, id, collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!bookId && !(collectionId && id)) {
            throw new ApiError_1.default(400, "Missing required parameters: bookId or collectionId and id");
        }
        const findBook = db_1.default.book.findUnique({
            where: { id: bookId },
        });
        const findCollectionBook = id
            ? db_1.default.collectionBook.findUnique({
                where: {
                    id,
                    userId,
                },
            })
            : collectionId && bookId
                ? db_1.default.collectionBook.findUnique({
                    where: {
                        collectionId_bookId: {
                            collectionId,
                            bookId,
                        },
                        userId
                    },
                })
                : null;
        const [book, ownedCollection] = yield Promise.all([
            findBook,
            findCollectionBook,
        ]);
        if (!book)
            throw new ApiError_1.default(404, "Book not found");
        if (!ownedCollection)
            throw new ApiError_1.default(403, "Collection not found or not owned by user");
        const removedCollectionBook = yield db_1.default.collectionBook.delete({
            where: {
                id: ownedCollection.id,
            },
        });
        return removedCollectionBook;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error removing book from collection");
    }
});
exports.deleteCollectionBookService = deleteCollectionBookService;
