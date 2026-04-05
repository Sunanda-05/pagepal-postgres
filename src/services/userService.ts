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

interface UserSummaryPayload {
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
}

interface UserSearchQuery {
  query?: string;
  page?: number;
  limit?: number;
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

const mapToUserSummaryPayload = (user: any): UserSummaryPayload => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    role: user.role,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    booksRead: 0,
    reviewsWritten: user._count.reviews,
    isFollowing: Array.isArray(user.followers)
      ? user.followers.length > 0
      : false,
    followsYou: Array.isArray(user.following)
      ? user.following.length > 0
      : false,
  };
};

const userSummarySelect = (viewerId?: string) => ({
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  role: true,
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
});

const clampPagination = (page?: number, limit?: number) => {
  const safePage = Number.isFinite(page) && (page as number) > 0 ? (page as number) : 1;
  const safeLimit = Number.isFinite(limit) && (limit as number) > 0
    ? Math.min(50, limit as number)
    : 10;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

const normalizeSearch = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

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

const searchUsersService = async (viewerId: string, query: UserSearchQuery = {}) => {
  try {
    const { page, limit, skip } = clampPagination(query.page, query.limit);
    const searchQuery = normalizeSearch(query.query);

    if (!searchQuery) {
      return {
        data: [] as UserSummaryPayload[],
        meta: buildMeta(0, page, limit),
      };
    }

    const where = {
      id: {
        not: viewerId,
      },
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive" as const,
          },
        },
        {
          username: {
            contains: searchQuery,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: searchQuery,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            name: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: userSummarySelect(viewerId),
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => mapToUserSummaryPayload(user)),
      meta: buildMeta(total, page, limit),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error searching users");
  }
};

const getFollowSuggestionsService = async (viewerId: string, limit = 8) => {
  try {
    const safeLimit = Math.min(Math.max(limit, 1), 20);

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: viewerId,
        },
        followers: {
          none: {
            followerId: viewerId,
          },
        },
      },
      take: safeLimit,
      orderBy: {
        createdAt: "desc",
      },
      select: userSummarySelect(viewerId),
    });

    return users.map((user) => mapToUserSummaryPayload(user));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error fetching follow suggestions");
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
  searchUsersService,
  getFollowSuggestionsService,
  updateProfileService,
};
