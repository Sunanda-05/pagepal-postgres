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
exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollectionById = exports.getMyCollections = exports.getAllPublicCollections = void 0;
const collectionService_1 = require("../services/collectionService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getAllPublicCollections = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield (0, collectionService_1.getAllPublicCollectionsService)();
        response.status(200).json(collections);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPublicCollections = getAllPublicCollections;
const getMyCollections = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const collections = yield (0, collectionService_1.getMyCollectionsService)(userId);
        response.status(200).json(collections);
    }
    catch (error) {
        next(error);
    }
});
exports.getMyCollections = getMyCollections;
const getCollectionById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const collectionId = request.params.id;
        if (!collectionId)
            throw new ApiError_1.default(400, "No Collection ID provided");
        const collections = yield (0, collectionService_1.getCollectionByIdService)(collectionId, userId);
        response.status(200).json(collections);
    }
    catch (error) {
        next(error);
    }
});
exports.getCollectionById = getCollectionById;
const createCollection = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new ApiError_1.default(400, "No User ID provided");
        const collectionDetails = {
            name: request.body.title,
            description: request.body.description,
            isPublic: (_b = request.body.isPublic) !== null && _b !== void 0 ? _b : false,
            userId,
        };
        const book = yield (0, collectionService_1.createCollectionService)(collectionDetails);
        response.status(201).json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.createCollection = createCollection;
const updateCollection = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const collectionId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!collectionId)
            throw new ApiError_1.default(400, "No Collection ID provided");
        const updatedFields = {};
        if ("name" in request.body)
            updatedFields.name = request.body.name;
        if ("isPublic" in request.body)
            updatedFields.isPublic = request.body.isPublic;
        if ("description" in request.body)
            updatedFields.description = request.body.description;
        const collection = yield (0, collectionService_1.updateCollectionService)(collectionId, updatedFields);
        response.status(200).json(collection);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCollection = updateCollection;
const deleteCollection = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== "AUTHOR")
            throw new ApiError_1.default(401, "Not an Author");
        const collectionId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        if (!collectionId)
            throw new ApiError_1.default(400, "No Book ID provided");
        const collection = yield (0, collectionService_1.deleteCollectionService)(collectionId, user.id);
        response.status(200).json(collection);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCollection = deleteCollection;
