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
exports.generateRecommendations = void 0;
const db_1 = __importDefault(require("../utils/db"));
/*1. Fetch all the books reviewed by the user.
   - Use the `prisma.review.findMany` method to get reviews for the user.
   - Include the associated `book` details in the results.

2. Fetch all the ratings given by the user.
   - Use the `prisma.rating.findMany` method to get ratings for the user.
   - Include the associated `book` details in the results.

3. Calculate sentiment and weighted ratings for each book reviewed by the user.
   - Loop through each review and extract the sentiment score.
   - Use the sentiment score and the rating given by the user to calculate a weighted score for each book.

4. Fetch all books that the user has not reviewed yet.
   - Use `prisma.book.findMany` to get all books that are not in the user's reviewed books list.
   - Exclude books that are already reviewed by the user.

5. Sort books based on the aggregated sentiment and weighted scores.
   - Loop through all books that the user hasn't reviewed yet.
   - Retrieve the score for each book from the previously calculated scores.
   - Sort the books in descending order based on their scores.

6. Return the list of recommended books sorted by score.
   - After sorting the books, return only the books (not the scores). */
const calculateSentiment = (text) => {
    const positiveWords = ["good", "great", "amazing", "fantastic", "love"];
    const negativeWords = ["bad", "horrible", "terrible", "hate"];
    let sentimentScore = 0;
    positiveWords.forEach((word) => {
        if (text.includes(word))
            sentimentScore += 1;
    });
    negativeWords.forEach((word) => {
        if (text.includes(word))
            sentimentScore -= 1;
    });
    return sentimentScore;
};
const calculateWeightedRating = (rating, sentimentScore) => {
    const weight = sentimentScore > 0 ? 1.2 : 0.8;
    return rating * weight;
};
const generateRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield db_1.default.review.findMany({
            where: { userId },
            include: { book: true },
        });
        const ratings = yield db_1.default.rating.findMany({
            where: { userId },
            include: { book: true },
        });
        const bookScores = {};
        for (const review of reviews) {
            const sentimentScore = calculateSentiment(review.reviewText);
            const rating = ratings.find((r) => r.bookId === review.bookId);
            if (rating) {
                const weightedRating = calculateWeightedRating(rating.rating, sentimentScore);
                bookScores[review.bookId] =
                    (bookScores[review.bookId] || 0) + weightedRating;
            }
        }
        const allBooks = yield db_1.default.book.findMany({
            where: { id: { notIn: reviews.map((r) => r.bookId) } },
        });
        const recommendedBooks = allBooks
            .map((book) => (Object.assign(Object.assign({}, book), { score: bookScores[book.id] || 0 })))
            .sort((a, b) => b.score - a.score);
        return recommendedBooks;
    }
    catch (error) {
        console.error("Error generating recommendations:", error);
        throw error;
    }
});
exports.generateRecommendations = generateRecommendations;
