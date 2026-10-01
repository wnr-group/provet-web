-- The catalogue's access paths (see the Product model in schema.prisma).
-- IF NOT EXISTS: these were first applied directly through the app's
-- connection, so running this migration afterwards must be a no-op.

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_isActive_createdAt_idx" ON "Product"("isActive", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_isActive_isFeatured_idx" ON "Product"("isActive", "isFeatured");
