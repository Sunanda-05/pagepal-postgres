import { PrismaClient } from "../generated";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function loadSeedData<T>(fileName: string): Promise<T[]> {
  const filePath = path.join(__dirname, "seedData", fileName);
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

async function main() {
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
    const model = (prisma as any)[
      modelName.charAt(0).toLowerCase() + modelName.slice(1)
    ];
    if (!model) {
      console.warn(`Model for ${modelName} not found. Skipping.`);
      continue;
    }

    const entries = await loadSeedData(fileName);
    if (entries.length === 0) {
      console.log(`No data found in ${fileName}`);
      continue;
    }

    await model.createMany({
      data: entries,
      skipDuplicates: true,
    });

    console.log(`Seeded ${entries.length} entries for ${modelName}`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
