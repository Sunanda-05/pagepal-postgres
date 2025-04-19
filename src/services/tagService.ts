import prisma from "../utils/db";

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
        name: tagname,
      },
    });

    return newTag;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding tag");
  }
};

export { getAllTagsService, getBooksByTagIdService, addTagService };
