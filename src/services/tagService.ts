import prisma from "../utils/db";
import { Prisma } from "../../generated";
import ApiError from "../../src/utils/ApiError";

const getAllTagsService = async () => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    return tags;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching tags");
  }
};

const getBooksByTagIdService = async (tagId: string) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
      },
    });

    return books;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching books by tagId");
  }
};

const addTagService = async (tagname: string) => {
  try {
    const newTag = await prisma.tag.create({
      data: {
        name: tagname.toLowerCase(),
      },
    });

    return newTag;
  } catch (error: any) {
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (error.meta?.target as string[])?.includes("name")
    ) {
      throw new ApiError(409, "Tag already exists");
    }
    throw new Error("Error adding tag");
  }
};

export { getAllTagsService, getBooksByTagIdService, addTagService };
