import { Collection } from "../../generated";
import prisma from "../utils/db";

const shareCollectionService = async (
  collectionId: string,
  userId: string,
  ownerId: string
) => {
  try {
    const [user, ownedCollection] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      prisma.collection.findUnique({
        where: {
          id: collectionId,
          userId: ownerId,
        },
      }),
    ]);

    if (!user) throw new Error("User not found");
    if (!ownedCollection)
      throw new Error("Collection not found or not owned by user");

    const sharedAccess = await prisma.sharedCollectionAccess.create({
      data: {
        userId,
        collectionId,
      },
    });

    return sharedAccess;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to share collection");
  }
};

const getSharedCollectionsService = async (userId: string) => {
  try {
    const sharedCollections = await prisma.collection.findMany({
      where: {
        sharedWith: {
          some: { userId },
        },
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

    return sharedCollections;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching public collections");
  }
};

export { getSharedCollectionsService, shareCollectionService };
