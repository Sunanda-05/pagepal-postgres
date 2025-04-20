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
const generated_1 = require("../generated");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new generated_1.PrismaClient();
function loadSeedData(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, "seedData", fileName);
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting seeding process...\n");
        const fileNames = [
            "User.json",
            "Book.json",
            "Rating.json",
            "Review.json",
            "Tag.json",
            "BookTag.json",
            "Follow.json",
            "AuthorApplication.json",
            "Collection.json",
            "CollectionBook.json",
            "SharedCollectionAccess.json",
            "RefreshToken.json",
            "AuditLog.json",
        ];
        for (const fileName of fileNames) {
            const modelName = fileName.replace(".json", "");
            const model = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
            if (!model) {
                console.warn(`Model for ${modelName} not found. Skipping.`);
                continue;
            }
            const entries = yield loadSeedData(fileName);
            if (entries.length === 0) {
                console.log(`No data found in ${fileName}`);
                continue;
            }
            yield model.createMany({
                data: entries,
                skipDuplicates: true,
            });
            console.log(`Seeded ${entries.length} entries for ${modelName}`);
        }
        console.log("\nSeeding complete!");
    });
}
main()
    .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
