-- CreateTable
CREATE TABLE "Sms" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sms" ADD CONSTRAINT "Sms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
