import { UserData } from "types/auth";
import prisma from "../utils/db";

const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user by email");
  }
};

const createUser = async (userData: UserData) => {
  try {
    const user = await prisma.user.create({
      data: userData,
      omit: {
        passwordHash: true,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user");
  }
};

export { getUserByEmail, createUser };
