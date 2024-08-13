/*
  Warnings:

  - You are about to drop the column `item` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `itemstore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categoriesItemStore" DROP CONSTRAINT "categoriesItemStore_itemStoreId_fkey";

-- DropForeignKey
ALTER TABLE "itemStoreImages" DROP CONSTRAINT "itemStoreImages_itemstoreId_fkey";

-- DropForeignKey
ALTER TABLE "itemstore" DROP CONSTRAINT "itemstore_userId_fkey";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "item";

-- DropTable
DROP TABLE "itemstore";

-- CreateTable
CREATE TABLE "itemStore" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "itemStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactionItemStore" (
    "transactionId" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "transactionItemStore_pkey" PRIMARY KEY ("transactionId","itemStoreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "itemStore_id_key" ON "itemStore"("id");

-- AddForeignKey
ALTER TABLE "itemStore" ADD CONSTRAINT "itemStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoriesItemStore" ADD CONSTRAINT "categoriesItemStore_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStoreImages" ADD CONSTRAINT "itemStoreImages_itemstoreId_fkey" FOREIGN KEY ("itemstoreId") REFERENCES "itemStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionItemStore" ADD CONSTRAINT "transactionItemStore_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionItemStore" ADD CONSTRAINT "transactionItemStore_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
