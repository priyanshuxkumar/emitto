-- CreateEnum
CREATE TYPE "ApiKeyPermissions" AS ENUM ('FullAccess', 'SendingAccess');

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "permission" "ApiKeyPermissions" NOT NULL DEFAULT 'FullAccess';
