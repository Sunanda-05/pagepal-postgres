import ApiError from "../utils/ApiError";
import prisma from "../utils/db";

const getUserFollowersService = async (id: string) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      select: {
        createdAt: true,
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return followers;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user followers");
  }
};

const getUserFollowingService = async (id: string) => {
  try {
    const followings = await prisma.follow.findMany({
      where: { followerId: id },
      select: {
        createdAt: true,
        following: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return followings;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching who the user is following");
  }
};

const followUserService = async (followerId: string, followingId: string) => {
  try {
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
    console.error(error);
    throw new Error("Error following user");
  }
};

const unfollowUserService = async (followerId: string, followingId: string) => {
  try {
    if (followerId === followingId) {
      throw new ApiError(400, "Users cannot unfollow themselves");
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
    console.error(error);
    throw new Error("Error unfollowing user");
  }
};

export {
  getUserFollowersService,
  getUserFollowingService,
  followUserService,
  unfollowUserService,
};