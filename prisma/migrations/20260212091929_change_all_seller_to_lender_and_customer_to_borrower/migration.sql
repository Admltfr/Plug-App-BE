/*
  Warnings:

  - The values [CUSTOMER,SELLER] on the enum `ChatSender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `seller_id` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `chat_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `chat_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `from_customer_id` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `to_seller_id` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lender_id]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[borrower_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lender_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lender_id` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrower_id` to the `chat_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lender_id` to the `chat_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lender_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_borrower_id` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_lender_id` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatSender_new" AS ENUM ('BORROWER', 'LENDER');
ALTER TABLE "chat_messages" ALTER COLUMN "sender" TYPE "ChatSender_new" USING ("sender"::text::"ChatSender_new");
ALTER TYPE "ChatSender" RENAME TO "ChatSender_old";
ALTER TYPE "ChatSender_new" RENAME TO "ChatSender";
DROP TYPE "public"."ChatSender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_rooms" DROP CONSTRAINT "chat_rooms_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_rooms" DROP CONSTRAINT "chat_rooms_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_from_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_to_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_seller_id_fkey";

-- DropIndex
DROP INDEX "bank_accounts_seller_id_key";

-- DropIndex
DROP INDEX "wallets_customer_id_key";

-- DropIndex
DROP INDEX "wallets_seller_id_key";

-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "seller_id",
ADD COLUMN     "lender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "customer_id",
DROP COLUMN "seller_id",
ADD COLUMN     "borrower_id" TEXT NOT NULL,
ADD COLUMN     "lender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "customer_id",
DROP COLUMN "seller_id",
ADD COLUMN     "borrower_id" TEXT,
ADD COLUMN     "lender_id" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "seller_id",
ADD COLUMN     "lender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "from_customer_id",
DROP COLUMN "to_seller_id",
ADD COLUMN     "from_borrower_id" TEXT NOT NULL,
ADD COLUMN     "to_lender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "customer_id",
DROP COLUMN "seller_id",
ADD COLUMN     "borrower_id" TEXT,
ADD COLUMN     "lender_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_lender_id_key" ON "bank_accounts"("lender_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_borrower_id_key" ON "wallets"("borrower_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_lender_id_key" ON "wallets"("lender_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_borrower_id_fkey" FOREIGN KEY ("from_borrower_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_lender_id_fkey" FOREIGN KEY ("to_lender_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
