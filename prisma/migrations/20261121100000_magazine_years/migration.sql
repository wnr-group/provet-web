-- Years in the magazine library. The admin adds a year, then puts magazines in
-- it; each year is either shown under Recent Editions or is an Archive year.
-- This replaces the page's "months that count as recent" setting (the two
-- MagazineSetting columns for it are left in place, unused).
--
-- RLS on, no policies, like every other table (see 20261119100000_admin_auth_and_rls).

-- CreateTable
CREATE TABLE "MagazineYear" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isRecent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazineYear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MagazineYear_year_key" ON "MagazineYear"("year");

-- A year for every year the existing issues are in; the newest is the recent
-- one, which is what the page showed (the latest issues first, the rest in the
-- Archives).
INSERT INTO "MagazineYear" ("id", "year", "isRecent", "updatedAt")
SELECT gen_random_uuid()::text, y.year, y.year = (SELECT MAX(EXTRACT(YEAR FROM "publishedAt")::int) FROM "Magazine"), CURRENT_TIMESTAMP
FROM (SELECT DISTINCT EXTRACT(YEAR FROM "publishedAt")::int AS year FROM "Magazine") y;

-- Lock it down (guarded so a plain Postgres still runs this)
ALTER TABLE "MagazineYear" ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "MagazineYear" FROM anon, authenticated;
  END IF;
END
$$;
