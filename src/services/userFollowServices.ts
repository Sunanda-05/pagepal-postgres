import ApiError from "../utils/ApiError";
import prisma from "../utils/db";

interface FollowListQuery {
  page?: number;
  limit?: number;
  search?: string;
  viewerId?: string;
}

const clampPagination = (page?: number, limit?: number) => {
  const safePage = Number.isFinite(page) && (page as number) > 0 ? (page as number) : 1;
  const safeLimit = Number.isFinite(limit) && (limit as number) > 0
    ? Math.min(50, limit as number)
    : 20;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

const normalizeSearch = (search?: string) => {
  if (!search) return undefined;
  const trimmed = search.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const getUserFollowersService = async (id: string, query: FollowListQuery = {}) => {
  try {
    const { page, limit, skip } = clampPagination(query.page, query.limit);
    const search = normalizeSearch(query.search);
    const viewerId = query.viewerId;

    const where = {
      followingId: id,
      ...(search
        ? {
            follower: {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { username: { contains: search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    };

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
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
            },
          },
        },
      }),
      prisma.follow.count({ where }),
    ]);

    return {
      data: followers.map((entry) => ({
        id: entry.follower.id,
        email: entry.follower.email,
        username: entry.follower.username,
        name: entry.follower.name,
        bio: entry.follower.bio,
        role: entry.follower.role,
        followersCount: entry.follower._count.followers,
        followingCount: entry.follower._count.following,
        reviewsWritten: entry.follower._count.reviews,
        booksRead: 0,
        isFollowing: Array.isArray((entry.follower as any).followers)
          ? (entry.follower as any).followers.length > 0
          : false,
        followsYou: Array.isArray((entry.follower as any).following)
          ? (entry.follower as any).following.length > 0
          : false,
        followedAt: entry.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error fetching user followers");
  }
};

const getUserFollowingService = async (id: string, query: FollowListQuery = {}) => {
  try {
    const { page, limit, skip } = clampPagination(query.page, query.limit);
    const search = normalizeSearch(query.search);
    const viewerId = query.viewerId;

    const where = {
      followerId: id,
      ...(search
        ? {
            following: {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { username: { contains: search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    };

    const [followings, total] = await Promise.all([
      prisma.follow.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
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
            },
          },
        },
      }),
      prisma.follow.count({ where }),
    ]);

    return {
      data: followings.map((entry) => ({
        id: entry.following.id,
        email: entry.following.email,
        username: entry.following.username,
        name: entry.following.name,
        bio: entry.following.bio,
        role: entry.following.role,
        followersCount: entry.following._count.followers,
        followingCount: entry.following._count.following,
        reviewsWritten: entry.following._count.reviews,
        booksRead: 0,
        isFollowing: Array.isArray((entry.following as any).followers)
          ? (entry.following as any).followers.length > 0
          : false,
        followsYou: Array.isArray((entry.following as any).following)
          ? (entry.following as any).following.length > 0
          : false,
        followedAt: entry.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error fetching who the user is following");
  }
};

const followUserService = async (followerId: string, followingId: string) => {
  try {
    if (!followerId || !followingId) {
      throw new ApiError(400, "Missing follower or following user id");
    }

    if (followerId === followingId) {
      throw new ApiError(400, "Users cannot follow themselves");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      throw new ApiError(400, "Already following this user");
    }

    const newFollow = await prisma.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    return newFollow;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error following user");
  }
};

const unfollowUserService = async (followerId: string, followingId: string) => {
  try {
    if (!followerId || !followingId) {
      throw new ApiError(400, "Missing follower or following user id");
    }

    if (followerId === followingId) {
      throw new ApiError(400, "Users cannot unfollow themselves");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingFollow) {
      throw new ApiError(400, "Not following this user");
    }

    const unfollow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (!unfollow) {
      throw new ApiError(400, "Not following this user");
    }
    return unfollow;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error unfollowing user");
  }
};

const removeFollowerService = async (userId: string, followerId: string) => {
  try {
    if (!userId || !followerId) {
      throw new ApiError(400, "Missing user id or follower id");
    }

    if (userId === followerId) {
      throw new ApiError(400, "Users cannot remove themselves as followers");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingFollow) {
      throw new ApiError(404, "Follower relation not found");
    }

    return prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error);
    throw new ApiError(500, "Error removing follower");
  }
};

export {
  getUserFollowersService,
  getUserFollowingService,
  followUserService,
  unfollowUserService,
  removeFollowerService,
};