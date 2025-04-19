import prisma from "../utils/db";
import ApiError from '../utils/ApiError'

const rateBookService = async (
  bookId: string,
  userId: string,
  rating: number
) => {
  try {
    const bookRef = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!bookRef) {
      throw new ApiError(404, "Book not found.");
    }

    const ratedInfo = await prisma.rating.create({
      data: {
        bookId,
        userId,
        rating,
      },
    });

    return ratedInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Error rating book");
  }
};

const getBookRatingService = async (bookId: string) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { bookId },
      select: { rating: true },
      orderBy: { createdAt: "desc" },
    });

    return ratings;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting book ratings");
  }
};

export { rateBookService, getBookRatingService };
