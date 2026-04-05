import ApiError from "../utils/ApiError";
import prisma from "../utils/db";

const shareCollectionService = async (
  collectionId: string,
  userId: string,
  ownerId: string
) => {
  try {
    if (ownerId === userId) {
      throw new ApiError(400, "You cannot share a collection with yourself");
    }

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

    if (!user) throw new ApiError(404, "User not found");
    if (!ownedCollection)
      throw new ApiError(403, "Collection not found or not owned by user");

    const existingShare = await prisma.sharedCollectionAccess.findUnique({
      where: {
        collectionId_userId: {
          collectionId,
          userId,
        },
      },
      select: {
        collectionId: true,
      },
    });

    if (existingShare) {
      throw new ApiError(409, "Collection is already shared with this user");
    }

    const sharedAccess = await prisma.sharedCollectionAccess.create({
      data: {
        userId,
        collectionId,
      },
    });

    return sharedAccess;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Failed to share collection");
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
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error fetching shared collections");
  }
};

export { getSharedCollectionsService, shareCollectionService };
