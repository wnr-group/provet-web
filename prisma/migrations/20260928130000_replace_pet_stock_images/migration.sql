-- Replace domestic-pet stock photos (dogs at the vet, a dog on a beach) in
-- stored content with livestock, poultry and aquaculture imagery, matching
-- the site's farm-animal positioning.
--
-- These Unsplash photos reached the database through earlier seeds: the demo
-- products and categories, the first set of home banners and a page hero.
-- Code changes cannot reach those rows, so they are rewritten here.
--
-- Only the Unsplash photo id inside each URL is swapped (REPLACE on the
-- "photo-<id>" fragment), so each URL keeps the crop and size its slot asked
-- for, and any image an admin uploaded - which never contains these ids - is
-- untouched. On a database without these photos every statement matches
-- nothing.
--
--   vet with a dachshund    -> vets checking birds on a poultry farm
--   vet injecting a dog     -> ear-tagged calves
--   vet examining a dog     -> fish-farm sea cages with a service boat
--   dog at the vet          -> dairy cow feeding in a barn
--   dog running on a beach  -> dairy cattle in a modern barn

UPDATE "Product" SET "images" =
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("images",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e')
WHERE "images" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-';

UPDATE "Category" SET "image" =
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("image",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e')
WHERE "image" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-';

UPDATE "Banner" SET "image" =
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("image",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e')
WHERE "image" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-';

UPDATE "Page" SET "heroImage" =
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("heroImage",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e')
WHERE "heroImage" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-';

UPDATE "ContentBlock" SET
  "image" = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("image",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e'),
  "config" = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("config",
    'photo-1770836037793-95bdbf190f71', 'photo-1648141499388-34177db06fba'),
    'photo-1770836037275-38b44e4b101f', 'photo-1454179083322-198bb4daae41'),
    'photo-1770836037289-e00e5f351d11', 'photo-1723134085909-19da487ac9bd'),
    'photo-1630438994394-3deff7a591bf', 'photo-1609711479431-40d56059c463'),
    'photo-1530281700549-e82e7bf110d6', 'photo-1646082275982-025ccc59bd2e')
WHERE "image" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-'
   OR "config" ~ 'photo-(1770836037793|1770836037275|1770836037289|1630438994394|1530281700549)-';
