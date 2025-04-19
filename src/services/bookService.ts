import { Query, FilterQuery } from "types/book";
import prisma from "../utils/db";
import { Book } from "../../generated";
import ApiError from "../utils/ApiError";

const getAllBooksService = async (query: Query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;
  const where = { deletedAt: null };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
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
    prisma.book.count({ where }),
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
};

const getFilteredBooksService = async (query: FilterQuery) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    genre,
    authorName,
    publishedYear,
  } = query;

  const skip = (page - 1) * limit;

  const where: any = { deletedAt: null };

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  if (genre) where.genre = genre;
  if (publishedYear) where.publishedYear = publishedYear;

  if (authorName) {
    where.author = {
      name: { contains: authorName, mode: "insensitive" },
    };
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
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
    prisma.book.count({ where }),
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
};

const getBookByIdService = async (id: string) => {
  const book = await prisma.book.findUnique({
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
};

const addBookService = async (
  bookDetails: Omit<Book, "id" | "createdAt" | "updatedAt" | "deletedAt">
) => {
  const isbnBook = await prisma.book.findUnique({
    where: { isbn: bookDetails.isbn },
  });
  if (isbnBook) {
    throw new ApiError(400, "Book ISBN already exists");
  }

  const addedBook = await prisma.book.create({
    data: bookDetails,
  });

  return addedBook;
};

const updateBookService = async (
  id: string,
  authorId: string,
  updatedData: Partial<Book>
) => {
  try {
    const book = await prisma.book.update({
      where: { id, authorId },
      data: updatedData,
    });
    return book;
  } catch (error) {
    console.error(error); //!TODO check if book doesn't exist error
    throw new Error("Error updating book");
  }
};

const deleteBookService = async (id: string, authorId: string) => {
  try {
    const book = await prisma.book.update({
      where: { id, authorId },
      data: {
        deletedAt: new Date(),
      },
    });
    return book;
  } catch (error) {
    console.error(error); //!TODO check if book doesn't exist error
    throw new Error("Error updating book");
  }
};

export {
  getAllBooksService,
  getFilteredBooksService,
  getBookByIdService,
  addBookService,
  updateBookService,
  deleteBookService,
};
