/*
  Warnings:

  - Added the required column `endpoint` to the `ApiKeyLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `ApiKeyLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseStatus` to the `ApiKeyLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeyLogs" ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "responseStatus" TEXT NOT NULL;
