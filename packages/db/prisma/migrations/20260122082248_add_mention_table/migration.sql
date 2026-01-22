-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('positive', 'negative', 'neutral');

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "analysed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "analysedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Mention" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "mentionScore" DOUBLE PRECISION NOT NULL,
    "responseId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mention_responseId_idx" ON "Mention"("responseId");

-- CreateIndex
CREATE INDEX "Mention_brandId_idx" ON "Mention"("brandId");

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
