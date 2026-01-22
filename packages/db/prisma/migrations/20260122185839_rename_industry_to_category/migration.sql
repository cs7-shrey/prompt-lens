/*
  Warnings:

  - You are about to drop the column `industry` on the `TrackingCompany` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrackingCompany" DROP COLUMN "industry",
ADD COLUMN     "category" TEXT;
