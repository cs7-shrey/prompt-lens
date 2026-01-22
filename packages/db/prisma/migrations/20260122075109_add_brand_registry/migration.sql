-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT,
    "websiteUrl" TEXT,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Brand_canonicalName_idx" ON "Brand"("canonicalName");

-- CreateIndex
CREATE INDEX "Brand_aliases_idx" ON "Brand" USING GIN ("aliases");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_canonicalName_key" ON "Brand"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_displayName_key" ON "Brand"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_websiteUrl_key" ON "Brand"("websiteUrl");
