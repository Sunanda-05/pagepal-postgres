import { Collection } from "../../generated";
import prisma from "../utils/db";

const applyAuthorService = async (userId: string, bio?: string) => {
  try {
    const alreadyAuthor = await prisma.user.findUnique({
      where: {
        id: userId,
        role: "AUTHOR",
      },
    });
    if (alreadyAuthor) throw new Error("You are already an author");

    const application = await prisma.authorApplication.create({
      data: {
        userId,
        bio,
      },
    });

    return application;
  } catch (error) {
    console.error(error);
    throw new Error("Application for author failed");
  }
};

const getMyApplyService = async (userId: string) => {
  try {
    const applications = await prisma.authorApplication.findMany({
      where: {
        userId,
      },
    });
    return applications;
  } catch (error) {
    console.error(error);
    throw new Error("Fetching applications failed");
  }
};

export { applyAuthorService, getMyApplyService };
