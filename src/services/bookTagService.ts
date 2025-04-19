import prisma from "../utils/db";

const addBookTag = async (bookId: string, tagId: string, authorId: string) => {
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

    if (!book) throw new Error("Book not found or not owned by this author");
    if (!tag) throw new Error("Tag not found");

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

export { addBookTag };
