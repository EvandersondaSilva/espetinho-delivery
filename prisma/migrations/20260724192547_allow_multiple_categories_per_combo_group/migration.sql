/*
  Warnings:

  - You are about to drop the column `categoryId` on the `combo_groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "combo_groups" DROP CONSTRAINT "combo_groups_categoryId_fkey";

-- AlterTable
ALTER TABLE "combo_groups" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "combo_group_categories" (
    "id" TEXT NOT NULL,
    "comboGroupId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "combo_group_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "combo_group_categories_comboGroupId_categoryId_key" ON "combo_group_categories"("comboGroupId", "categoryId");

-- AddForeignKey
ALTER TABLE "combo_group_categories" ADD CONSTRAINT "combo_group_categories_comboGroupId_fkey" FOREIGN KEY ("comboGroupId") REFERENCES "combo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_group_categories" ADD CONSTRAINT "combo_group_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
