/*
  Warnings:

  - You are about to drop the `ApiKeyUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiKeyUsage" DROP CONSTRAINT "ApiKeyUsage_apikeyId_fkey";

-- DropTable
DROP TABLE "ApiKeyUsage";

-- CreateTable
CREATE TABLE "ApiKeyLogs" (
    "id" TEXT NOT NULL,
    "apikeyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeyLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiKeyLogs" ADD CONSTRAINT "ApiKeyLogs_apikeyId_fkey" FOREIGN KEY ("apikeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
