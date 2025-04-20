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
exports.addTagService = exports.getBooksByTagIdService = exports.getAllTagsService = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getAllTagsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield db_1.default.tag.findMany({
            include: {
                _count: {
                    select: {
                        books: true,
                    },
                },
            },
        });
        return tags;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching tags");
    }
});
exports.getAllTagsService = getAllTagsService;
const getBooksByTagIdService = (tagId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield db_1.default.book.findMany({
            where: {
                tags: {
                    some: {
                        id: tagId,
                    },
                },
            },
        });
        return books;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching books by tagId");
    }
});
exports.getBooksByTagIdService = getBooksByTagIdService;
const addTagService = (tagname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTag = yield db_1.default.tag.create({
            data: {
                name: tagname,
            },
        });
        return newTag;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error adding tag");
    }
});
exports.addTagService = addTagService;
