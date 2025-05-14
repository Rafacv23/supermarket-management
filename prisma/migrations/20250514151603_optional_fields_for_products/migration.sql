-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "price" REAL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT,
    "quantity" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("barcode", "brand", "category", "createdAt", "description", "id", "image", "name", "price", "quantity", "stock", "updatedAt") SELECT "barcode", "brand", "category", "createdAt", "description", "id", "image", "name", "price", "quantity", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
