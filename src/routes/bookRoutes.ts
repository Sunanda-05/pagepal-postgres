import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getFilteredBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getBooks,
} from "../controllers/bookController";
import { addBooktag } from "../controllers/bookTagController";

import ratingsRouter from "./ratingRoutes";
import reviewsRouter from "./reviewRoutes";


const router = Router({ mergeParams: true });

router.get("/", asyncHandler(authMiddleware), setUserContext, getBooks);
router.get(
  "/filters",
  asyncHandler(authMiddleware),
  setUserContext,
  getFilteredBooks
);
router.get("/:id", asyncHandler(authMiddleware), setUserContext, getBookById);
router.post("/", asyncHandler(authMiddleware), setUserContext, addBook);
router.patch("/", asyncHandler(authMiddleware), setUserContext, updateBook);
router.delete("/", asyncHandler(authMiddleware), setUserContext, deleteBook);

router.post("/:id/tag", asyncHandler(authMiddleware), setUserContext, addBooktag);

router.use("/:id/ratings", ratingsRouter);
router.use("/:id/reviews", reviewsRouter)

export default router;
