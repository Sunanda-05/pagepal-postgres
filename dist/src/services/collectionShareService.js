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
exports.shareCollectionService = exports.getSharedCollectionsService = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const db_1 = __importDefault(require("../utils/db"));
const shareCollectionService = (collectionId, userId, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user, ownedCollection] = yield Promise.all([
            db_1.default.user.findUnique({
                where: {
                    id: userId,
                },
            }),
            db_1.default.collection.findUnique({
                where: {
                    id: collectionId,
                    userId: ownerId,
                },
            }),
        ]);
        if (!user)
            throw new ApiError_1.default(404, "User not found");
        if (!ownedCollection)
            throw new ApiError_1.default(403, "Collection not found or not owned by user");
        const sharedAccess = yield db_1.default.sharedCollectionAccess.create({
            data: {
                userId,
                collectionId,
            },
        });
        return sharedAccess;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to share collection");
    }
});
exports.shareCollectionService = shareCollectionService;
const getSharedCollectionsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharedCollections = yield db_1.default.collection.findMany({
            where: {
                sharedWith: {
                    some: { userId },
                },
            },
            select: {
                name: true,
                id: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
                books: {
                    select: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                genre: true,
                                author: {
                                    select: {
                                        id: true,
                                        email: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return sharedCollections;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching public collections");
    }
});
exports.getSharedCollectionsService = getSharedCollectionsService;
