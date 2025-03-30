/*
  Warnings:

  - You are about to drop the column `category` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "category",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "EmailStatus";
