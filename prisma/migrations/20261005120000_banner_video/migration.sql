-- A homepage banner can play a background video (its image is the poster).
-- AddColumn
ALTER TABLE "Banner" ADD COLUMN IF NOT EXISTS "video" TEXT;
