-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'PAID');

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "borrower_id" TEXT NOT NULL,
    "lender_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
