import prisma from "../utils/db";

const getFollowersByIdService = async (id: string) => {
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
    throw new Error("Error fetching user by id");
  }
};

const getFollowingByIdService = async (id: string) => {
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
    throw new Error("Error fetching user by id");
  }
};

const followUserService = async (id: string, followingId: string) => {
  try {
    if (id === followingId) {
      throw new Error("Users cannot follow themselves");
    }
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          following: {
            where: {
              followingId: followingId,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: followingId },
        select: {
          id: true,
          name: true,
          email: true,
          followers: {
            where: {
              followerId: id,
            },
          },
        },
      }),
    ]);

    if (!follower || !following) {
      throw new Error("One or both users not found");
    }

    if (follower?.following.length > 0 || following?.followers.length > 0) {
      throw new Error("Already following this user");
    }

    const newFollow = await prisma.follow.create({
      data: {
        followerId: id,
        followingId: followingId,
      },
    });

    return newFollow;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user by id");
  }
};

const unfollowUserService = async (id: string, followingId: string) => {
  try {
    if (id === followingId) {
      throw new Error("Users cannot unfollow themselves");
    }
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          following: {
            where: {
              followingId: followingId,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: followingId },
        select: {
          id: true,
          name: true,
          email: true,
          followers: {
            where: {
              followerId: id,
            },
          },
        },
      }),
    ]);

    if (!follower || !following) {
      throw new Error("One or both users not found");
    }

    if (follower?.following.length === 0 || following?.followers.length === 0) {
      throw new Error("Not following this user");
    }

    const unfollow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: id,
          followingId: followingId,
        },
      },
    });

    if (!unfollow) {
      throw new Error("Not following this user");
    }
    return unfollow;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user by id");
  }
};

export {
  getFollowingByIdService,
  getFollowersByIdService,
  followUserService,
  unfollowUserService,
};
