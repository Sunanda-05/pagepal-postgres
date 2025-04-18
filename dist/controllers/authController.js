"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.logoutUser = exports.refreshTokens = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const tokenService_1 = require("../services/tokenService");
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "";
const loginUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            response.status(400).json({ error: "Email and password are required." });
            return;
        }
        const user = yield (0, authService_1.getUserByEmail)(email);
        if (!user) {
            response.status(404).json({ error: "Email is not registered." });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            response.status(401).json({ error: "Wrong password." });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        const refreshToken = yield (0, tokenService_1.generateRefreshToken)(user.id);
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
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.loginUser = loginUser;
const refreshTokens = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.refreshtoken;
        if (!refreshToken) {
            response.status(401).json({ error: "No refresh token provided." });
            return;
        }
        const dbToken = (0, tokenService_1.getRefreshToken)(refreshToken);
        if (!dbToken) {
            response.status(401).json({ error: "Invalid refresh token" });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                response
                    .status(403)
                    .json({ error: "Expired or invalid refresh token" });
                return;
            }
            const { userId } = decoded;
            const newAccessToken = jsonwebtoken_1.default.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
                expiresIn: "30m",
            });
            response.status(200).json({ accessToken: newAccessToken });
        });
    }
    catch (error) {
        console.error("Error in Refresh Token:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.refreshTokens = refreshTokens;
const logoutUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = request.cookies.refreshtoken;
        if (refreshToken) {
            yield (0, tokenService_1.deleteRefreshToken)(refreshToken);
            console.log("first");
        }
        response.clearCookie("refreshtoken", { path: "/auth" });
        response.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Error in Refresh Token:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.logoutUser = logoutUser;
const registerUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = request.body;
        if (!email || !password) {
            response.status(400).json({ error: "Email & Password are required." });
            return;
        }
        const userExists = yield (0, authService_1.getUserByEmail)(email);
        if (userExists) {
            response.status(400).json({ error: "Email is already registered." });
            return;
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        const userData = { email, passwordHash, name };
        const user = yield (0, authService_1.createUser)(userData);
        response.status(201).json(user);
    }
    catch (error) {
        console.error("Error in Register User:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});
exports.registerUser = registerUser;
