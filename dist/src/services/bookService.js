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
exports.deleteBookService = exports.updateBookService = exports.addBookService = exports.getBookByIdService = exports.getFilteredBooksService = exports.getAllBooksService = void 0;
const db_1 = __importDefault(require("../utils/db"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getAllBooksService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", } = query;
    const skip = (page - 1) * limit;
    const where = { deletedAt: null };
    const [books, total] = yield Promise.all([
        db_1.default.book.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            select: {
                title: true,
                genre: true,
                publishedYear: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                ratings: {
                    select: {
                        rating: true,
                    },
                },
            },
        }),
        db_1.default.book.count({ where }),
    ]);
    return {
        data: books,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllBooksService = getAllBooksService;
const getFilteredBooksService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, genre, authorName, publishedYear, } = query;
    const skip = (page - 1) * limit;
    const where = { deletedAt: null };
    if (search) {
        where.title = { contains: search, mode: "insensitive" };
    }
    if (genre)
        where.genre = genre;
    if (publishedYear)
        where.publishedYear = publishedYear;
    if (authorName) {
        where.author = {
            name: { contains: authorName, mode: "insensitive" },
        };
    }
    const [books, total] = yield Promise.all([
        db_1.default.book.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            select: {
                title: true,
                genre: true,
                publishedYear: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                ratings: {
                    select: {
                        rating: true,
                    },
                },
            },
        }),
        db_1.default.book.count({ where }),
    ]);
    return {
        data: books,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getFilteredBooksService = getFilteredBooksService;
const getBookByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield db_1.default.book.findUnique({
        where: { id, deletedAt: null },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            ratings: true,
            reviews: true,
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });
    return book;
});
exports.getBookByIdService = getBookByIdService;
const addBookService = (bookDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const isbnBook = yield db_1.default.book.findUnique({
        where: { isbn: bookDetails.isbn },
    });
    if (isbnBook) {
        throw new ApiError_1.default(400, "Book ISBN already exists");
    }
    const addedBook = yield db_1.default.book.create({
        data: bookDetails,
    });
    return addedBook;
});
exports.addBookService = addBookService;
const updateBookService = (id, authorId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield db_1.default.book.update({
            where: { id, authorId },
            data: updatedData,
        });
        return book;
    }
    catch (error) {
        console.error(error); //!TODO check if book doesn't exist error
        throw new Error("Error updating book");
    }
});
exports.updateBookService = updateBookService;
const deleteBookService = (id, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield db_1.default.book.update({
            where: { id, authorId },
            data: {
                deletedAt: new Date(),
            },
        });
        return book;
    }
    catch (error) {
        console.error(error); //!TODO check if book doesn't exist error
        throw new Error("Error updating book");
    }
});
exports.deleteBookService = deleteBookService;
