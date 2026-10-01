-- Category -> Subcategory -> Product.
--
-- Structure: Category gains a self-referencing parentId (a top-level category
-- has none; a subcategory points at its category) and a sortOrder among its
-- siblings. Products keep their categoryId, which from here on names a
-- subcategory.

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Category_parentId_sortOrder_idx" ON "Category"("parentId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data: file the existing flat categories under three new top-level ones.
--
-- Nothing is moved, renamed or re-keyed: every existing category keeps its
-- id and slug and simply becomes a subcategory, so products, enquiries and
-- /products?category=<slug> links are untouched. Categories are sorted by
-- the range their products carry (Product.specifications.brand, falling back
-- to the category description), the same split the old provet.in site used:
-- Avinova is poultry, Blunova is aquaculture, and anything else goes under
-- Veterinary Care. Each parent is only created when something belongs in it,
-- so on an empty database this section does nothing and prisma/seed.js
-- builds the tree instead.

-- Poultry (Avinova)
INSERT INTO "Category" ("id", "name", "slug", "description", "image", "sortOrder", "createdAt", "updatedAt")
SELECT 'cat_poultry', 'Poultry', 'poultry',
       'The Avinova poultry health range: anticoccidials, antibacterials, growth promoters, nutritional support and farm hygiene for commercial broiler and layer flocks.',
       'https://images.unsplash.com/photo-1589922583749-6b8473a85048?auto=format&fit=crop&w=800&h=600&q=80',
       0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (
  SELECT 1 FROM "Category" c
  WHERE c."description" LIKE '%Avinova%'
     OR EXISTS (SELECT 1 FROM "Product" p WHERE p."categoryId" = c."id"
                AND (p."specifications" LIKE '%"brand":"Avinova"%' OR p."specifications" LIKE '%"brand": "Avinova"%'))
);

UPDATE "Category" c SET "parentId" = 'cat_poultry'
WHERE c."parentId" IS NULL
  AND c."id" NOT IN ('cat_poultry', 'cat_aquaculture', 'cat_veterinary_care')
  AND (c."description" LIKE '%Avinova%'
       OR EXISTS (SELECT 1 FROM "Product" p WHERE p."categoryId" = c."id"
                  AND (p."specifications" LIKE '%"brand":"Avinova"%' OR p."specifications" LIKE '%"brand": "Avinova"%')));

-- Aquaculture (Blunova)
INSERT INTO "Category" ("id", "name", "slug", "description", "image", "sortOrder", "createdAt", "updatedAt")
SELECT 'cat_aquaculture', 'Aquaculture', 'aquaculture',
       'The Blunova aquaculture range: probiotics, mineral mixtures, feed additives and water-quality solutions for shrimp and fish farming.',
       'https://images.unsplash.com/photo-1723134085909-19da487ac9bd?auto=format&fit=crop&w=800&h=600&q=80',
       1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (
  SELECT 1 FROM "Category" c
  WHERE c."parentId" IS NULL
    AND c."id" NOT IN ('cat_poultry', 'cat_aquaculture', 'cat_veterinary_care')
    AND (c."description" LIKE '%Blunova%'
         OR EXISTS (SELECT 1 FROM "Product" p WHERE p."categoryId" = c."id"
                    AND (p."specifications" LIKE '%"brand":"Blunova"%' OR p."specifications" LIKE '%"brand": "Blunova"%')))
);

UPDATE "Category" c SET "parentId" = 'cat_aquaculture'
WHERE c."parentId" IS NULL
  AND c."id" NOT IN ('cat_poultry', 'cat_aquaculture', 'cat_veterinary_care')
  AND (c."description" LIKE '%Blunova%'
       OR EXISTS (SELECT 1 FROM "Product" p WHERE p."categoryId" = c."id"
                  AND (p."specifications" LIKE '%"brand":"Blunova"%' OR p."specifications" LIKE '%"brand": "Blunova"%')));

-- Veterinary Care (everything else)
INSERT INTO "Category" ("id", "name", "slug", "description", "image", "sortOrder", "createdAt", "updatedAt")
SELECT 'cat_veterinary_care', 'Veterinary Care', 'veterinary-care',
       'General veterinary medicines: anti-infectives, antiparasitics, vaccines, supplements, pain management and wound care.',
       'https://images.unsplash.com/photo-1646082275982-025ccc59bd2e?auto=format&fit=crop&w=800&h=600&q=80',
       2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (
  SELECT 1 FROM "Category" c
  WHERE c."parentId" IS NULL
    AND c."id" NOT IN ('cat_poultry', 'cat_aquaculture', 'cat_veterinary_care')
);

UPDATE "Category" c SET "parentId" = 'cat_veterinary_care'
WHERE c."parentId" IS NULL
  AND c."id" NOT IN ('cat_poultry', 'cat_aquaculture', 'cat_veterinary_care');

-- Subcategories start in alphabetical order within their category; the
-- admin can reorder from there.
UPDATE "Category" c SET "sortOrder" = ranked.position
FROM (
  SELECT "id", (ROW_NUMBER() OVER (PARTITION BY "parentId" ORDER BY "name") - 1)::INTEGER AS position
  FROM "Category"
  WHERE "parentId" IS NOT NULL
) ranked
WHERE c."id" = ranked."id";
