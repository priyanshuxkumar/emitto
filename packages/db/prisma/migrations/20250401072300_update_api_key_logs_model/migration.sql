/*
  Warnings:

  - The `responseStatus` column on the `ApiKeyLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ApiKeyLogs" ADD COLUMN     "userId" INTEGER,
DROP COLUMN "responseStatus",
ADD COLUMN     "responseStatus" INTEGER;

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKeyLogs_userId_idx" ON "ApiKeyLogs"("userId");

-- CreateIndex
CREATE INDEX "ApiKeyLogs_apikeyId_idx" ON "ApiKeyLogs"("apikeyId");
