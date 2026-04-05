import prisma from "../utils/db";
import { User } from "../../generated";
import ApiError from "../utils/ApiError";
import { getCurrentUser } from "../config/context";

interface UserProfilePayload {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  role: string;
  followersCount: number;
  followingCount: number;
  booksRead: number;
  reviewsWritten: number;
  isFollowing: boolean;
  followsYou: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const getBooksReadCount = async (userId: string): Promise<number> => {
  const finishedEntries = await prisma.collectionBook.findMany({
    where: {
      userId,
      readingStatus: "FINISHED",
    },
    select: {
      bookId: true,
    },
    distinct: ["bookId"],
  });

  return finishedEntries.length;
};

const mapToUserProfilePayload = async (user: any): Promise<UserProfilePayload> => {
  const booksRead = await getBooksReadCount(user.id);

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    role: user.role,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    booksRead,
    reviewsWritten: user._count.reviews,
    isFollowing: Array.isArray(user.followers)
      ? user.followers.length > 0
      : false,
    followsYou: Array.isArray(user.following)
      ? user.following.length > 0
      : false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getUserByIdService = async (id: string) => {
  try {
    const viewerId = getCurrentUser()?.user?.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            reviews: true,
          },
        },
        ...(viewerId
          ? {
              followers: {
                where: {
                  followerId: viewerId,
                },
                select: {
                  id: true,
                },
              },
              following: {
                where: {
                  followingId: viewerId,
                },
                select: {
                  id: true,
                },
              },
            }
          : {}),
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return mapToUserProfilePayload(user);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error fetching user by id");
  }
};

const updateProfileService = async (id: string, updatedData: Partial<User>) => {
  try {
    const data: Partial<Pick<User, "name" | "bio" | "username" | "email">> = {};

    if (typeof updatedData.name === "string") data.name = updatedData.name;
    if (typeof updatedData.bio === "string" || updatedData.bio === null) {
      data.bio = updatedData.bio;
    }
    if (typeof updatedData.username === "string") data.username = updatedData.username;
    if (typeof updatedData.email === "string") data.email = updatedData.email;

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No valid profile fields provided for update");
    }

    await prisma.user.update({
      where: { id },
      data,
    });

    return getUserByIdService(id);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error updating user profile");
  }
};

export {
  getUserByIdService,
  updateProfileService,
};
