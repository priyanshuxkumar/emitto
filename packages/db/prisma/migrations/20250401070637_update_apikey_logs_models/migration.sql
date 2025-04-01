-- AlterTable
ALTER TABLE "ApiKeyLogs" ADD COLUMN     "requestBody" JSONB,
ADD COLUMN     "responseBody" JSONB;
