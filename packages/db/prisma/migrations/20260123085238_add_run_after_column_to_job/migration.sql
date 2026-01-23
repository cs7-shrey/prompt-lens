/*
  Warnings:

  - Added the required column `runAfter` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "runAfter" TIMESTAMP(3) NOT NULL;
