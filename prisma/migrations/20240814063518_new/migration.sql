-- CreateEnum
CREATE TYPE "rolesUser" AS ENUM ('user', 'super');

-- CreateTable
CREATE TABLE "user" (
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

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
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

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAddress" (
    "addressId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("addressId","userId")
);

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
CREATE TABLE "category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoriesItemStore" (
    "categoryId" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,

    CONSTRAINT "categoriesItemStore_pkey" PRIMARY KEY ("categoryId","itemStoreId")
);

-- CreateTable
CREATE TABLE "itemStoreImages" (
    "id" UUID NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "itemstoreId" UUID NOT NULL,

    CONSTRAINT "itemStoreImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "invoice" JSONB,
    "total" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStore" ADD CONSTRAINT "itemStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoriesItemStore" ADD CONSTRAINT "categoriesItemStore_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoriesItemStore" ADD CONSTRAINT "categoriesItemStore_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStoreImages" ADD CONSTRAINT "itemStoreImages_itemstoreId_fkey" FOREIGN KEY ("itemstoreId") REFERENCES "itemStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionItemStore" ADD CONSTRAINT "transactionItemStore_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionItemStore" ADD CONSTRAINT "transactionItemStore_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
