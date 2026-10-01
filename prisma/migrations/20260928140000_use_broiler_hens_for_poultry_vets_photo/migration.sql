-- Poultry imagery shows mature broiler hens. The "vets checking birds" photo
-- (photo-1648141499388) turned out to show a rooster, so wherever stored
-- content uses it - including rows the replace_pet_stock_images migration
-- pointed at it - it becomes a white broiler flock (photo-1589922583749).
--
-- As before, only the Unsplash photo id inside each URL changes, so each image
-- keeps its crop and size, and admin-uploaded images are never touched.

UPDATE "Product" SET "images" = REPLACE("images", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048')
WHERE "images" LIKE '%photo-1648141499388-34177db06fba%';

UPDATE "Category" SET "image" = REPLACE("image", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048')
WHERE "image" LIKE '%photo-1648141499388-34177db06fba%';

UPDATE "Banner" SET "image" = REPLACE("image", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048')
WHERE "image" LIKE '%photo-1648141499388-34177db06fba%';

UPDATE "Page" SET "heroImage" = REPLACE("heroImage", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048')
WHERE "heroImage" LIKE '%photo-1648141499388-34177db06fba%';

UPDATE "ContentBlock" SET
  "image" = REPLACE("image", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048'),
  "config" = REPLACE("config", 'photo-1648141499388-34177db06fba', 'photo-1589922583749-6b8473a85048')
WHERE "image" LIKE '%photo-1648141499388-34177db06fba%' OR "config" LIKE '%photo-1648141499388-34177db06fba%';
