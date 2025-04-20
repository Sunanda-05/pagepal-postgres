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
exports.rateBook = exports.getBookRatings = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ratingService_1 = require("../services/ratingService");
const getBookRatings = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = request.params.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const ratings = yield (0, ratingService_1.getBookRatingService)(bookId);
        response.status(200).json(ratings);
    }
    catch (error) {
        next(error);
    }
});
exports.getBookRatings = getBookRatings;
const rateBook = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const rating = +(request.body.rating);
        const bookId = request.params.id;
        const ratingInfo = yield (0, ratingService_1.rateBookService)(bookId, userId, rating);
        response.status(201).json(ratingInfo);
    }
    catch (error) {
        next(error);
    }
});
exports.rateBook = rateBook;
