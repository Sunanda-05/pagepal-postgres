import prisma from "../utils/db";
import { User } from "../../generated";

const getUserByIdService = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        passwordHash: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user by id");
  }
};

const updateProfileService = async (id: string, updatedData: Partial<User>) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updatedData,
      omit: {
        passwordHash: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user by id");
  }
};

export {
  getUserByIdService,
  updateProfileService,
};
