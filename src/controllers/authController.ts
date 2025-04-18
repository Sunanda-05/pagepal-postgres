import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import { getUserByEmail, createUser } from "../services/authService";
import {
  deleteRefreshToken,
  generateRefreshToken,
  getRefreshToken,
} from "../services/tokenService";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "";

export const loginUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      response.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      response.status(404).json({ error: "Email is not registered." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      response.status(401).json({ error: "Wrong password." });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = await generateRefreshToken(user.id);

    response.cookie("refreshtoken", refreshToken.token, {
      httpOnly: true, // Prevents XSS (JavaScript cannot access it)
      secure: false, // Only send over HTTPS     //make to true when https
      sameSite: "lax", // Prevents most CSRF attacks
      path: "/auth", // Restrict usage to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    response.status(200).json({
      message: "Login successful!",
      email,
      accessToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const refreshTokens = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const refreshToken = request.cookies?.refreshtoken;
    if (!refreshToken) {
      response.status(401).json({ error: "No refresh token provided." });
      return;
    }
    const dbToken = getRefreshToken(refreshToken);
    if (!dbToken) {
      response.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) {
        response
          .status(403)
          .json({ error: "Expired or invalid refresh token" });
        return;
      }

      const { userId } = decoded as JwtPayload & { userId: string };
      const newAccessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
      });

      response.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const logoutUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const refreshToken = request.cookies.refreshtoken;
    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
      console.log("first");
    }

    response.clearCookie("refreshtoken", { path: "/auth" });
    response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};

export const registerUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { email, password, name } = request.body;
    if (!email || !password) {
      response.status(400).json({ error: "Email & Password are required." });
      return;
    }

    const userExists = await getUserByEmail(email);
    if (userExists) {
      response.status(400).json({ error: "Email is already registered." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = { email, passwordHash, name };
    const user = await createUser(userData);

    response.status(201).json(user);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};
