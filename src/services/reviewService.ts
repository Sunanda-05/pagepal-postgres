import { Review } from "generated";
import prisma from "../utils/db";
import ApiError from "../utils/ApiError";

const reviewBookService = async (
  bookId: string,
  userId: string,
  reviewText: string
) => {
  try {
    const bookRef = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!bookRef) {
      throw new ApiError(404, "Book Not found");
    }

    const reviewInfo = await prisma.review.create({
      data: {
        bookId,
        userId,
        reviewText,
      },
    });

    return reviewInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Error rating book");
  }
};

const getBookReviewService = async (bookId: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting book ratings");
  }
};

const updateReviewService = async (
  id: string,
  userId: string,
  updatedData: Partial<Review>
) => {
  try {
    const review = await prisma.review.update({
      where: { id, userId },
      data: updatedData,
    });
    return review;
  } catch (error) {
    console.error(error); //!TODO check if Review doesn't exist error
    throw new Error("Error updating Review");
  }
};

const deleteReviewService = async (id: string, userId: string) => {
  try {
    const review = await prisma.review.delete({
      where: { id, userId },
    });
    return review;
  } catch (error) {
    console.error(error); //!TODO check if review doesn't exist error
    throw new Error("Error deleting review");
  }
};

export {
  reviewBookService,
  getBookReviewService,
  updateReviewService,
  deleteReviewService,
};
