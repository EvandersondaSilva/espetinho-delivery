-- CreateEnum
CREATE TYPE "ComboGroupType" AS ENUM ('CATEGORY_CHOICE', 'FIXED_PRODUCT');

-- CreateTable
CREATE TABLE "combos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_groups" (
    "id" TEXT NOT NULL,
    "comboId" TEXT NOT NULL,
    "type" "ComboGroupType" NOT NULL,
    "label" TEXT NOT NULL,
    "categoryId" TEXT,
    "productId" TEXT,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "combo_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combos" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "comboId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_items" (
    "id" TEXT NOT NULL,
    "orderComboId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_combo_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "combo_groups" ADD CONSTRAINT "combo_groups_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_groups" ADD CONSTRAINT "combo_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_groups" ADD CONSTRAINT "combo_groups_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_items" ADD CONSTRAINT "order_combo_items_orderComboId_fkey" FOREIGN KEY ("orderComboId") REFERENCES "order_combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_items" ADD CONSTRAINT "order_combo_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
