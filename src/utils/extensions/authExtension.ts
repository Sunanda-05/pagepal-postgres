import { Prisma } from "../../../generated";
import { getCurrentUser } from "../../config/context";

export const authExtension = Prisma.defineExtension({
  name: "authExtension",
  query: {
    tag: {
      async create({ args, query }) {
        const details = getCurrentUser();
        if (details?.user?.role !== "ADMIN") {
          throw new Error("Only admins can manage tags");
        }
        return query(args);
      },
      async update({ args, query }) {
        const details = getCurrentUser();
        if (details?.user?.role !== "ADMIN") {
          throw new Error("Only admins can manage tags");
        }
        return query(args);
      },
      async delete({ args, query }) {
        const details = getCurrentUser();
        if (details?.user?.role !== "ADMIN") {
          throw new Error("Only admins can manage tags");
        }
        return query(args);
      },
    },
  },
});
