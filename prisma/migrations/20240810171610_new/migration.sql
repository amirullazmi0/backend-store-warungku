-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "addressId" VARCHAR(255),
    "logo" VARCHAR,
    "password" VARCHAR(255) NOT NULL,
    "accessToken" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "lastActive" TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" VARCHAR(255) NOT NULL,
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
    "addressId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("addressId","userId")
);

-- CreateTable
CREATE TABLE "itemstore" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,

    CONSTRAINT "itemstore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "customer" UUID NOT NULL,
    "item" JSONB[],
    "invoice" JSONB,
    "total" INTEGER NOT NULL,
    "userId" VARCHAR(255) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "address_id_key" ON "address"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemstore" ADD CONSTRAINT "itemstore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
