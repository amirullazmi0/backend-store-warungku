/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoriesItemStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionItemStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categoriesItemStore" DROP CONSTRAINT "categoriesItemStore_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categoriesItemStore" DROP CONSTRAINT "categoriesItemStore_itemStoreId_fkey";

-- DropForeignKey
ALTER TABLE "itemStore" DROP CONSTRAINT "itemStore_userId_fkey";

-- DropForeignKey
ALTER TABLE "itemStoreImages" DROP CONSTRAINT "itemStoreImages_itemstoreId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactionItemStore" DROP CONSTRAINT "transactionItemStore_itemStoreId_fkey";

-- DropForeignKey
ALTER TABLE "transactionItemStore" DROP CONSTRAINT "transactionItemStore_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_addressId_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_addressId_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_userId_fkey";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "categoriesItemStore";

-- DropTable
DROP TABLE "itemStore";

-- DropTable
DROP TABLE "transactionItemStore";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "userAddress";

-- CreateTable
CREATE TABLE "store" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "addressId" UUID,
    "logo" VARCHAR,
    "password" VARCHAR(255) NOT NULL,
    "accessToken" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "lastActive" TIMESTAMP(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_address" (
    "id" UUID NOT NULL,
    "active" BOOLEAN,
    "jalan" VARCHAR(255),
    "rt" VARCHAR(255),
    "rw" VARCHAR(255),
    "kodepos" VARCHAR(255),
    "kelurahan" VARCHAR(255),
    "kecamatan" VARCHAR(255),
    "kota" VARCHAR(255),
    "provinsi" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_user_address" (
    "addressId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "store_user_address_pkey" PRIMARY KEY ("addressId","userId")
);

-- CreateTable
CREATE TABLE "item_store" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "item_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catergory_item_store" (
    "categoryId" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,

    CONSTRAINT "catergory_item_store_pkey" PRIMARY KEY ("categoryId","itemStoreId")
);

-- CreateTable
CREATE TABLE "transaction_item_store" (
    "transactionId" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "transaction_item_store_pkey" PRIMARY KEY ("transactionId","itemStoreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_email_key" ON "store"("email");

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "store_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_user_address" ADD CONSTRAINT "store_user_address_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "store_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_user_address" ADD CONSTRAINT "store_user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_store" ADD CONSTRAINT "item_store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catergory_item_store" ADD CONSTRAINT "catergory_item_store_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catergory_item_store" ADD CONSTRAINT "catergory_item_store_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "item_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStoreImages" ADD CONSTRAINT "itemStoreImages_itemstoreId_fkey" FOREIGN KEY ("itemstoreId") REFERENCES "item_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_item_store" ADD CONSTRAINT "transaction_item_store_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "item_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_item_store" ADD CONSTRAINT "transaction_item_store_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
