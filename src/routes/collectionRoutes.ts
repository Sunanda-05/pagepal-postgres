import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { setUserContext } from "../config/context";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getAllPublicCollections,
  getCollectionById,
  getMyCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";
import {
  addBookToCollection,
  removeBookFromCollection,
} from "../controllers/collectionBookController";
import {
  getCollectionsSharedWithMe,
  shareCollection,
} from "../controllers/collectionShareController";

const router = Router({ mergeParams: true });

router.get(
  "/public",
  asyncHandler(authMiddleware),
  setUserContext,
  getAllPublicCollections
);
router.get(
  "/me",
  asyncHandler(authMiddleware),
  setUserContext,
  getMyCollections
);
router.get(
  "/:id",
  asyncHandler(authMiddleware),
  setUserContext,
  getCollectionById
);
router.post(
  "/",
  asyncHandler(authMiddleware),
  setUserContext,
  createCollection
);
router.patch(
  "/:id",
  asyncHandler(authMiddleware),
  setUserContext,
  updateCollection
);
router.delete(
  "/:id",
  asyncHandler(authMiddleware),
  setUserContext,
  deleteCollection
);

router.post(
  "/:id/books",
  asyncHandler(authMiddleware),
  setUserContext,
  addBookToCollection
);
router.delete(
  "/:id/books/:bookId",
  asyncHandler(authMiddleware),
  setUserContext,
  removeBookFromCollection
);

router.post(
  "/:id/share",
  asyncHandler(authMiddleware),
  setUserContext,
  shareCollection
);
router.get(
  "/shared",
  asyncHandler(authMiddleware),
  setUserContext,
  getCollectionsSharedWithMe
);

export default router;
