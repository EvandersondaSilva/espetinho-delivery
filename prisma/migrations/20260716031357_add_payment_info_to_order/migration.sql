-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "changeFor" INTEGER,
ADD COLUMN     "noChangeNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" TEXT;
