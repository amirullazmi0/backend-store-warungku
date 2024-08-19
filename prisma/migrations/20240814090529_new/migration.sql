/*
  Warnings:

  - You are about to drop the column `total` on the `item_store` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `transaction_item_store` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `transaction_item_store` table. All the data in the column will be lost.
  - Added the required column `qty` to the `item_store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_store" DROP COLUMN "total",
ADD COLUMN     "qty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transaction_item_store" DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice";
