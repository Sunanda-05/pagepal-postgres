import { Collection } from "../../generated";
import prisma from "../utils/db";

const getAllPublicCollectionsService = async () => {
  try {
    const publicCollections = await prisma.collection.findMany({
      where: {
        isPublic: true,
      },
      select: {
        name: true,
        id: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        books: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                genre: true,
                author: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return publicCollections;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching public collections");
  }
};

const getMyCollectionsService = async (userId: string) => {
  try {
    const myCollections = await prisma.collection.findMany({
      where: { userId },
      include: {
        books: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                genre: true,
                author: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return myCollections;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching owned collections");
  }
};

const getCollectionByIdService = async (
  collectionId: string,
  userId: string
) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
        OR: [
          { userId },
          { isPublic: true },
          {
            sharedWith: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        books: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                genre: true,
                author: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return collection;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching collection by id");
  }
};

const createCollectionService = async (
  collectionData: Omit<Collection, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const newCollection = await prisma.collection.create({
      data: collectionData,
    });
    return newCollection;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating collection");
  }
};

const updateCollectionService = async (
  collectionId: string,
  collectionData: Partial<Collection>
) => {
  try {
    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: collectionData,
    });
    return updatedCollection;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating collection");
  }
};

const deleteCollectionService = async (collectionId: string) => {
  try {
    const deletedCollection = await prisma.collection.delete({
      where: { id: collectionId },
    });
    return deletedCollection;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating collection");
  }
};

export {
  getAllPublicCollectionsService,
  getMyCollectionsService,
  getCollectionByIdService,
  createCollectionService,
  updateCollectionService,
  deleteCollectionService,
};
