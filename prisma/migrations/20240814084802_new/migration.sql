/*
  Warnings:

  - You are about to drop the `itemStoreImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "itemStoreImages" DROP CONSTRAINT "itemStoreImages_itemstoreId_fkey";

-- DropTable
DROP TABLE "itemStoreImages";

-- CreateTable
CREATE TABLE "item_store_images" (
    "id" UUID NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "itemstoreId" UUID NOT NULL,

    CONSTRAINT "item_store_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_store_images" ADD CONSTRAINT "item_store_images_itemstoreId_fkey" FOREIGN KEY ("itemstoreId") REFERENCES "item_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
