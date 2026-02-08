/*
  Warnings:

  - Added the required column `product_id` to the `chat_rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "chat_rooms_customer_id_seller_id_key";

-- AlterTable
ALTER TABLE "chat_rooms" ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
