-- DropIndex
DROP INDEX "Job_promptId_key";

-- CreateIndex
CREATE INDEX "Job_promptId_aiSource_status_idx" ON "Job"("promptId", "aiSource", "status");
