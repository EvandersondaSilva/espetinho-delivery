-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stockDeducted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
