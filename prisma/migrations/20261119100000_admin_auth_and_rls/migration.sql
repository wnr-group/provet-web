-- Admin sign-in moves to Supabase Auth, and the database stops being open to the
-- public API key.
--
-- 1. AdminUser becomes the authorisation record for a Supabase user: authUserId
--    links it to auth.users, isActive lets an admin be switched off, and the old
--    bcrypt passwordHash becomes optional (it is cleared per admin by
--    scripts/create-admin.js, then the column can be dropped).
--
-- 2. Row Level Security on every table in the public schema, with no policies.
--    Supabase exposes the public schema through its REST API to anyone holding
--    the project's public (anon) key, and until now these tables had RLS off and
--    full privileges granted to the anon and authenticated roles - enquiries,
--    brochure leads and admin accounts included. With RLS on and no policy,
--    those roles can read and write nothing. The app is unaffected: it connects
--    as the database owner ("postgres"), which bypasses RLS, and never uses the
--    REST API. As a second lock, the anon and authenticated privileges are
--    revoked, including for tables created later.
--
-- The RLS block is guarded on the Supabase roles existing, so this still runs on
-- a plain Postgres (a local or shadow database).

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "authUserId" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "AdminUser" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_authUserId_key" ON "AdminUser"("authUserId");

-- Lock down the public schema
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
  END IF;
END
$$;
