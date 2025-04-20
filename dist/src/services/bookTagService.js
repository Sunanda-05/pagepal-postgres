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
exports.addBookTagService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const addBookTagService = (bookId, tagId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [book, tag] = yield Promise.all([
            db_1.default.book.findUnique({
                where: {
                    id: bookId,
                    authorId,
                },
            }),
            db_1.default.tag.findUnique({
                where: {
                    id: tagId,
                },
            }),
        ]);
        if (!book)
            throw new ApiError_1.default(403, "Book not found or not owned by this author");
        if (!tag)
            throw new ApiError_1.default(404, "Tag not found");
        const bookTag = yield db_1.default.bookTag.create({
            data: {
                bookId,
                tagId,
            },
        });
        return bookTag;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to add book tag");
    }
});
exports.addBookTagService = addBookTagService;
