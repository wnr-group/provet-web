-- CreateTable
CREATE TABLE "BrochureSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "buttonLabel" TEXT NOT NULL DEFAULT 'Download Brochure',
    "requireDetails" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrochureSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrochureSetting_key_key" ON "BrochureSetting"("key");
