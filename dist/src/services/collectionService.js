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
exports.deleteCollectionService = exports.updateCollectionService = exports.createCollectionService = exports.getCollectionByIdService = exports.getMyCollectionsService = exports.getAllPublicCollectionsService = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getAllPublicCollectionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicCollections = yield db_1.default.collection.findMany({
            where: {
                isPublic: true,
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
        return publicCollections;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching public collections");
    }
});
exports.getAllPublicCollectionsService = getAllPublicCollectionsService;
const getMyCollectionsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myCollections = yield db_1.default.collection.findMany({
            where: { userId },
            include: {
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
        return myCollections;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching owned collections");
    }
});
exports.getMyCollectionsService = getMyCollectionsService;
const getCollectionByIdService = (collectionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield db_1.default.collection.findUnique({
            where: {
                id: collectionId,
                OR: [
                    { userId },
                    { isPublic: true },
                    {
                        sharedWith: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
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
        return collection;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching collection by id");
    }
});
exports.getCollectionByIdService = getCollectionByIdService;
const createCollectionService = (collectionData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCollection = yield db_1.default.collection.create({
            data: collectionData,
        });
        return newCollection;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error creating collection");
    }
});
exports.createCollectionService = createCollectionService;
const updateCollectionService = (collectionId, collectionData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCollection = yield db_1.default.collection.update({
            where: { id: collectionId },
            data: collectionData,
        });
        return updatedCollection;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error updating collection");
    }
});
exports.updateCollectionService = updateCollectionService;
const deleteCollectionService = (collectionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCollection = yield db_1.default.collection.delete({
            where: { id: collectionId, userId },
        });
        return deletedCollection;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error updating collection");
    }
});
exports.deleteCollectionService = deleteCollectionService;
