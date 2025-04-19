import { CollectionBook } from "../../generated";
import prisma from "../utils/db";

const addCollectionBookService = async (
  details: Omit<CollectionBook, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const findBook = prisma.book.findUnique({
      where: { id: details.bookId },
    });
    const findCollection = prisma.collection.findUnique({
      where: { id: details.collectionId, userId: details.userId },
    });
    const [book, ownedCollection] = await Promise.all([
      findBook,
      findCollection,
    ]);

    if (!book) throw new Error("Book not found");
    if (!ownedCollection)
      throw new Error("Collection not found or not owned by user");

    const addedCollectionBook = await prisma.collectionBook.create({
      data: details,
    });

    return addedCollectionBook;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding book to collection");
  }
};

const deleteCollectionBookService = async (
  userId: string,
  bookId?: string,
  id?: string,
  collectionId?: string
) => {
  try {
    if (!bookId && !(collectionId && id)) {
      throw new Error(
        "Missing required parameters: bookId or collectionId and id"
      );
    }

    const findBook = prisma.book.findUnique({
      where: { id: bookId },
    });
    const findCollectionBook = id
      ? prisma.collectionBook.findUnique({
          where: {
            id,
            userId,
          },
        })
      : collectionId && bookId
      ? prisma.collectionBook.findUnique({
          where: {
            collectionId_bookId: {
              collectionId,
              bookId,
            },
          },
        })
      : null;

    const [book, ownedCollection] = await Promise.all([
      findBook,
      findCollectionBook,
    ]);

    if (!book) throw new Error("Book not found");
    if (!ownedCollection)
      throw new Error("Collection not found or not owned by user");

    const removedCollectionBook = await prisma.collectionBook.delete({
      where: {
        id: ownedCollection.id,
      },
    });

    return removedCollectionBook;
  } catch (error) {
    console.error(error);
    throw new Error("Error removing book from collection");
  }
};

export { addCollectionBookService, deleteCollectionBookService };
