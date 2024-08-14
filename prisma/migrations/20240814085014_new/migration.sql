/*
  Warnings:

  - You are about to drop the `catergory_item_store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "catergory_item_store" DROP CONSTRAINT "catergory_item_store_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "catergory_item_store" DROP CONSTRAINT "catergory_item_store_itemStoreId_fkey";

-- DropTable
DROP TABLE "catergory_item_store";

-- CreateTable
CREATE TABLE "category_item_store" (
    "categoryId" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,

    CONSTRAINT "category_item_store_pkey" PRIMARY KEY ("categoryId","itemStoreId")
);

-- AddForeignKey
ALTER TABLE "category_item_store" ADD CONSTRAINT "category_item_store_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_item_store" ADD CONSTRAINT "category_item_store_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "item_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
