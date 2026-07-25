-- AlterEnum
ALTER TYPE "ComboGroupType" ADD VALUE 'PRODUCT_CHOICE';

-- CreateTable
CREATE TABLE "combo_group_choice_products" (
    "id" TEXT NOT NULL,
    "comboGroupId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "combo_group_choice_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "combo_group_choice_products_comboGroupId_productId_key" ON "combo_group_choice_products"("comboGroupId", "productId");

-- AddForeignKey
ALTER TABLE "combo_group_choice_products" ADD CONSTRAINT "combo_group_choice_products_comboGroupId_fkey" FOREIGN KEY ("comboGroupId") REFERENCES "combo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_group_choice_products" ADD CONSTRAINT "combo_group_choice_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

