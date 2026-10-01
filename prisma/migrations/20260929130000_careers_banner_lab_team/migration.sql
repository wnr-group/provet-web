-- The Careers banner showed a close-up of a goat, which says nothing about
-- working at Provet. It becomes a team of scientists at work in a lab
-- (photo-1581093450021), matching the site's laboratory imagery.
--
-- Only the Unsplash photo id inside the URL is swapped, so the banner keeps
-- its crop and size; a banner the admin has replaced (an upload or another
-- photo) never contains the old id and is left alone.

UPDATE "Page" SET "heroImage" = REPLACE("heroImage", 'photo-1622837699015-9a4cb8b7a94b', 'photo-1581093450021-4a7360e9a6b5')
WHERE "heroImage" LIKE '%photo-1622837699015-9a4cb8b7a94b%';
