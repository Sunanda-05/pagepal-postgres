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

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingReview) {
      throw new ApiError(409, "Review already exists for this book");
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
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error creating review");
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
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error getting reviews");
  }
};

const updateReviewService = async (
  id: string,
  userId: string,
  reviewText: string
) => {
  try {
    const normalizedReviewText = reviewText.trim();

    if (!normalizedReviewText) {
      throw new ApiError(400, "No Review Text provided");
    }

    const reviewRef = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!reviewRef) {
      throw new ApiError(404, "Review not found");
    }

    if (reviewRef.userId !== userId) {
      throw new ApiError(403, "You can only edit your own review");
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        reviewText: normalizedReviewText,
      },
    });

    return review;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error updating review");
  }
};

const deleteReviewService = async (id: string, userId: string) => {
  try {
    const reviewRef = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!reviewRef) {
      throw new ApiError(404, "Review not found");
    }

    if (reviewRef.userId !== userId) {
      throw new ApiError(403, "You can only delete your own review");
    }

    const review = await prisma.review.delete({
      where: { id },
    });

    return review;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error deleting review");
  }
};

export {
  reviewBookService,
  getBookReviewService,
  updateReviewService,
  deleteReviewService,
};
