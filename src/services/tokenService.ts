import jwt from "jsonwebtoken";
import prisma from "../utils/db";

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "";

const generateRefreshToken = async (userId: string) => {
  const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: expirationDate,
    },
  });

  return refreshToken;
};

const getRefreshToken = async (token: string) => {
  return await prisma.refreshToken.findUnique({ where: { token } });
};

const deleteRefreshToken = async (token: string) => {
  return await prisma.refreshToken.delete({ where: { token } });
};

export { generateRefreshToken, getRefreshToken, deleteRefreshToken };
