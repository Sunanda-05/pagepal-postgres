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
exports.deleteReview = exports.updateReview = exports.reviewBook = exports.getBookReview = void 0;
const reviewService_1 = require("../services/reviewService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getBookReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = request.params.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const reviews = yield (0, reviewService_1.getBookReviewService)(bookId);
        response.status(200).json(reviews);
    }
    catch (error) {
        next(error);
    }
});
exports.getBookReview = getBookReview;
const reviewBook = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user)
            throw new ApiError_1.default(400, "No User ID provided");
        const reviewText = request.body.review;
        if (!reviewText)
            throw new ApiError_1.default(400, "No Review Text provided");
        const bookId = request.params.id;
        if (!bookId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const review = yield (0, reviewService_1.reviewBookService)(bookId, user, reviewText);
        response.status(201).json(review);
    }
    catch (error) {
        next(error);
    }
});
exports.reviewBook = reviewBook;
const updateReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const reviewId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.reviewId;
        if (!reviewId)
            throw new ApiError_1.default(400, "No Review ID provided");
        const reviewText = request.body.review;
        const updatedReview = yield (0, reviewService_1.updateReviewService)(reviewId, userId, reviewText);
        response.status(200).json(updatedReview);
    }
    catch (error) {
        next(error);
    }
});
exports.updateReview = updateReview;
const deleteReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const reviewId = (_b = request === null || request === void 0 ? void 0 : request.params) === null || _b === void 0 ? void 0 : _b.reviewId;
        if (!reviewId)
            throw new ApiError_1.default(400, "No Review ID provided");
        const deletedReview = yield (0, reviewService_1.deleteReviewService)(reviewId, userId);
        response.status(200).json(deletedReview);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
