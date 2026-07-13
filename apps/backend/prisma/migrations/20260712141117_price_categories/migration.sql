/*
  Warnings:

  - You are about to drop the column `name` on the `price_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `price_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `price_list_items` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `price_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `price_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerM3` to the `price_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerPiece` to the `price_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thickness` to the `price_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `price_list_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "price_list_items" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "unit",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "length" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "pricePerM3" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "pricePerPiece" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "thickness" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "width" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "price_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_list_items_categoryId_idx" ON "price_list_items"("categoryId");

-- AddForeignKey
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "price_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
