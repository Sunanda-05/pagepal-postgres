import ApiError from "../utils/ApiError";
import prisma from "../utils/db";

const addBookTagService = async (bookId: string, tagId: string, authorId: string) => {
  try {
    const [book, tag] = await Promise.all([
      prisma.book.findUnique({
        where: {
          id: bookId,
          authorId,
        },
      }),
      prisma.tag.findUnique({
        where: {
          id: tagId,
        },
      }),
    ]);

    if (!book) throw new ApiError(403, "Book not found or not owned by this author");
    if (!tag) throw new ApiError(404, "Tag not found");

    const bookTag = await prisma.bookTag.create({
      data: {
        bookId,
        tagId,
      },
    });

    return bookTag;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add book tag");
  }
};

export { addBookTagService };
