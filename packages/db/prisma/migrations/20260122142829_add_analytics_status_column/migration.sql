/*
  Warnings:

  - You are about to drop the column `analysed` on the `Response` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AnalyticsStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "analysed",
ADD COLUMN     "analyticsStatus" "AnalyticsStatus" NOT NULL DEFAULT 'PENDING';
