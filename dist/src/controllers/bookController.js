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
exports.deleteBook = exports.updateBook = exports.addBook = exports.getBookById = exports.getFilteredBooks = exports.getBooks = void 0;
const bookService_1 = require("../services/bookService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getBooks = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const query = {
            page: +((_a = request.query.page) !== null && _a !== void 0 ? _a : ""),
            limit: +((_b = request.query.limit) !== null && _b !== void 0 ? _b : ""),
            sortBy: (_c = request.query.sortBy) !== null && _c !== void 0 ? _c : "createdAt",
            sortOrder: request.query.sortOrder === "asc" || request.query.sortOrder === "desc"
                ? request.query.sortOrder
                : "desc",
        };
        const books = yield (0, bookService_1.getAllBooksService)(query);
        response.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
});
exports.getBooks = getBooks;
const getFilteredBooks = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const query = {
            page: +((_a = request.query.page) !== null && _a !== void 0 ? _a : "1"),
            limit: +((_b = request.query.limit) !== null && _b !== void 0 ? _b : "10"),
            sortBy: (_c = request.query.sortBy) !== null && _c !== void 0 ? _c : "createdAt",
            sortOrder: request.query.sortOrder === "asc" || request.query.sortOrder === "desc"
                ? request.query.sortOrder
                : "desc",
            search: request.query.search,
            genre: request.query.genre,
            authorName: request.query.authorName,
            publishedYear: +((_d = request.query.publishedYear) !== null && _d !== void 0 ? _d : ""),
        };
        const books = yield (0, bookService_1.getFilteredBooksService)(query);
        response.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
});
exports.getFilteredBooks = getFilteredBooks;
const getBookById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        if (!id)
            throw new ApiError_1.default(400, "No Book ID provided");
        const books = yield (0, bookService_1.getBookByIdService)(id);
        response.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
});
exports.getBookById = getBookById;
const addBook = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const bookDetails = {
            title: request.body.title,
            genre: request.body.genre,
            description: request.body.description,
            isbn: request.body.isbn,
            publishedYear: request.body.publishedYear,
            authorId: user.id,
        };
        const book = yield (0, bookService_1.addBookService)(bookDetails);
        response.status(201).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.addBook = addBook;
const updateBook = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const bookId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const updatedFields = {};
        if ("title" in request.body)
            updatedFields.title = request.body.title;
        if ("genre" in request.body)
            updatedFields.genre = request.body.genre;
        if ("description" in request.body)
            updatedFields.description = request.body.description;
        if ("isbn" in request.body)
            updatedFields.isbn = request.body.isbn;
        if ("publishedYear" in request.body)
            updatedFields.publishedYear = request.body.publishedYear;
        const book = yield (0, bookService_1.updateBookService)(bookId, user.id, updatedFields);
        response.status(200).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const bookId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const book = yield (0, bookService_1.deleteBookService)(bookId, user.id);
        response.status(200).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;
