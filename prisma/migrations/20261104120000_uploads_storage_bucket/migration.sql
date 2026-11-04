-- The public "uploads" bucket in Supabase Storage, where admin uploads (banner
-- photos, hero video, PDFs) live in production (lib/storage.js).
--
-- Public, so the website can load the files by URL. Only the server can write
-- to it: it uses the project's secret key, which bypasses row-level security,
-- so no write policy is added for anonymous or signed-in users. The 30 MB cap
-- is the largest upload the admin allows (the hero video).
--
-- Guarded on the `storage` schema existing: it only does on Supabase, and this
-- migration must still run cleanly on a plain Postgres (a local or shadow
-- database). Safe to re-run - the bucket already exists in production, where
-- this changes nothing.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES ('uploads', 'uploads', true, 31457280)
    ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 31457280;
  END IF;
END
$$;
