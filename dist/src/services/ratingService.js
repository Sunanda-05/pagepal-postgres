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
exports.getBookRatingService = exports.rateBookService = void 0;
const db_1 = __importDefault(require("../utils/db"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const rateBookService = (bookId, userId, rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookRef = yield db_1.default.book.findUnique({
            where: { id: bookId },
        });
        if (!bookRef) {
            throw new ApiError_1.default(404, "Book not found.");
        }
        const ratedInfo = yield db_1.default.rating.create({
            data: {
                bookId,
                userId,
                rating,
            },
        });
        return ratedInfo;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error rating book");
    }
});
exports.rateBookService = rateBookService;
const getBookRatingService = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratings = yield db_1.default.rating.findMany({
            where: { bookId },
            select: { rating: true },
            orderBy: { createdAt: "desc" },
        });
        return ratings;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error getting book ratings");
    }
});
exports.getBookRatingService = getBookRatingService;
