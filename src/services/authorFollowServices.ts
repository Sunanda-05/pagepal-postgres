// services/authorFollowServices.ts

import ApiError from "../utils/ApiError";
import prisma from "../utils/db";

const getAuthorFollowersService = async (authorId: string) => {
  try {
    const followers = await prisma.authorFollow.findMany({
      where: { authorId },
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
    throw new Error("Error fetching author followers");
  }
};

const followAuthorService = async (followerId: string, authorId: string) => {
  try {
    const existingFollow = await prisma.authorFollow.findUnique({
      where: {
        followerId_authorId: {
          followerId: followerId,
          authorId: authorId,
        },
      },
    });

    if (existingFollow) {
      throw new ApiError(400, "Already following this author");
    }

    const newFollow = await prisma.authorFollow.create({
      data: {
        followerId: followerId,
        authorId: authorId,
      },
    });
    return newFollow;
  } catch (error) {
    console.error(error);
    throw new Error("Error following author");
  }
};

const unfollowAuthorService = async (followerId: string, authorId: string) => {
  try {
    const unfollow = await prisma.authorFollow.delete({
      where: {
        followerId_authorId: {
          followerId: followerId,
          authorId: authorId,
        },
      },
    });

    if (!unfollow) {
      throw new ApiError(400, "Not following this author");
    }
    return unfollow;
  } catch (error) {
    console.error(error);
    throw new Error("Error unfollowing author");
  }
};

export {
  getAuthorFollowersService,
  followAuthorService,
  unfollowAuthorService,
};