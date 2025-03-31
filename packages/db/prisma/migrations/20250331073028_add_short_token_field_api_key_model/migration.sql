/*
  Warnings:

  - Added the required column `shortToken` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "shortToken" TEXT NOT NULL;
