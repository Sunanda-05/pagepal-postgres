import { Prisma } from "../../../generated";

export const softDeleteExtension = Prisma.defineExtension({
  name: "softDeleteExtension",
  query: {
    book: {
      async delete({ args, query }) {
        return query({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          deletedAt: null,
        };
        return query(args);
      },
    },
  },
});
