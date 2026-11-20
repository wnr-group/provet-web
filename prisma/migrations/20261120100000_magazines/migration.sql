-- The magazine, managed from the admin: its issues and the page's settings.
-- Both tables get Row Level Security with no policies, like every other table
-- (see 20261119100000_admin_auth_and_rls): the public API key reads and writes
-- nothing; the app connects as the database owner and is unaffected.

-- CreateTable
CREATE TABLE "Magazine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issueNumber" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "coverImage" TEXT,
    "coverLayout" TEXT NOT NULL DEFAULT 'portrait',
    "pdfUrl" TEXT,
    "pdfFileName" TEXT,
    "summary" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagazineSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "recentMonths" INTEGER NOT NULL DEFAULT 12,
    "defaultYear" TEXT NOT NULL DEFAULT 'latest',
    "recentTabLabel" TEXT,
    "archivesTabLabel" TEXT,
    "latestLabel" TEXT,
    "readLabel" TEXT,
    "downloadLabel" TEXT,
    "otherMagazinesLabel" TEXT,
    "archivesHeading" TEXT,
    "archivesIntro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazineSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Magazine_isPublished_publishedAt_idx" ON "Magazine"("isPublished", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MagazineSetting_key_key" ON "MagazineSetting"("key");

-- Lock both down (guarded so a plain Postgres still runs this)
ALTER TABLE "Magazine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MagazineSetting" ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "Magazine", "MagazineSetting" FROM anon, authenticated;
  END IF;
END
$$;
