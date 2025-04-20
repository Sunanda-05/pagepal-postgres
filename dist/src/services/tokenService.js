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
exports.deleteRefreshToken = exports.getRefreshToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../utils/db"));
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "";
const generateRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = jsonwebtoken_1.default.sign({ userId }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    const refreshToken = yield db_1.default.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: expirationDate,
        },
    });
    return refreshToken;
});
exports.generateRefreshToken = generateRefreshToken;
const getRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.refreshToken.findUnique({ where: { token } });
});
exports.getRefreshToken = getRefreshToken;
const deleteRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.refreshToken.delete({ where: { token } });
});
exports.deleteRefreshToken = deleteRefreshToken;
