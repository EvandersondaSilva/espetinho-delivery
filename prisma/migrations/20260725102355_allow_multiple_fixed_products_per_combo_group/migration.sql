-- DropForeignKey
ALTER TABLE "combo_groups" DROP CONSTRAINT "combo_groups_productId_fkey";

-- AlterTable
ALTER TABLE "combo_groups" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "combo_group_fixed_items" (
    "id" TEXT NOT NULL,
    "comboGroupId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "combo_group_fixed_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "combo_group_fixed_items_comboGroupId_productId_key" ON "combo_group_fixed_items"("comboGroupId", "productId");

-- AddForeignKey
ALTER TABLE "combo_group_fixed_items" ADD CONSTRAINT "combo_group_fixed_items_comboGroupId_fkey" FOREIGN KEY ("comboGroupId") REFERENCES "combo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_group_fixed_items" ADD CONSTRAINT "combo_group_fixed_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

