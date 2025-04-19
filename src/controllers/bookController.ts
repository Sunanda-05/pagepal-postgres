import { Request, Response, NextFunction } from "express";
import {
  addBookService,
  getAllBooksService,
  getBookByIdService,
  getFilteredBooksService,
  updateBookService,
  deleteBookService,
} from "../services/bookService";
import { FilterQuery, Query } from "types/book";
import ApiError from "../utils/ApiError";
import { Book } from "../../generated";

export const getBooks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const query: Query = {
      page: +(request.query.page ?? ""),
      limit: +(request.query.limit ?? ""),
      sortBy: (request.query.sortBy as string) ?? "createdAt",
      sortOrder:
        request.query.sortOrder === "asc" || request.query.sortOrder === "desc"
          ? request.query.sortOrder
          : "desc",
    };
    const books = await getAllBooksService(query);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getFilteredBooks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const query: FilterQuery = {
      page: +(request.query.page ?? "1"),
      limit: +(request.query.limit ?? "10"),
      sortBy: (request.query.sortBy as string) ?? "createdAt",
      sortOrder:
        request.query.sortOrder === "asc" || request.query.sortOrder === "desc"
          ? request.query.sortOrder
          : "desc",
      search: request.query.search as string,
      genre: request.query.genre as string,
      authorName: request.query.authorName as string,
      publishedYear: +(request.query.publishedYear ?? ""),
    };
    const books = await getFilteredBooksService(query);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.params.id;
    if (!id) throw new ApiError(400, "No Book ID provided");

    const books = await getBookByIdService(id);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const addBook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");

    const bookDetails: Omit<
      Book,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    > = {
      title: request.body.title,
      genre: request.body.genre,
      description: request.body.description,
      isbn: request.body.isbn,
      publishedYear: request.body.publishedYear,
      authorId: user.id,
    };

    const book = await addBookService(bookDetails);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");

    const bookId = request?.params?.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const updatedFields: Partial<Book> = {};

    if ("title" in request.body) updatedFields.title = request.body.title;
    if ("genre" in request.body) updatedFields.genre = request.body.genre;
    if ("description" in request.body)
      updatedFields.description = request.body.description;
    if ("isbn" in request.body) updatedFields.isbn = request.body.isbn;
    if ("publishedYear" in request.body)
      updatedFields.publishedYear = request.body.publishedYear;

    const book = await updateBookService(bookId, user.id, updatedFields);
    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    if (user?.role !== "AUTHOR") throw new ApiError(401, "Not an Author");

    const bookId = request?.params?.id;
    if (!bookId) throw new ApiError(400, "No Book ID provided");

    const book = await deleteBookService(bookId, user.id);
    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
