// Helpers to translate between the DB representation (JSON-encoded strings
// for `images` and `specifications`) and the API representation (parsed
// array/object), as specified by the API contract.

function parseImages(images) {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseSpecifications(specifications) {
  if (!specifications) return {};
  try {
    const parsed = JSON.parse(specifications);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function serializeCategory(category, productCount) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    ...(productCount !== undefined ? { productCount } : {}),
  };
}

function serializeProductListItem(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.shortDescription,
    images: parseImages(product.images),
    packSize: product.packSize,
    isFeatured: product.isFeatured,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
  };
}

function serializeProductDetail(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.shortDescription,
    composition: product.composition,
    uses: product.uses,
    dosage: product.dosage,
    applications: product.applications,
    specifications: parseSpecifications(product.specifications),
    images: parseImages(product.images),
    packSize: product.packSize,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
  };
}

function serializeBanner(banner) {
  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    ctaText: banner.ctaText,
    ctaLink: banner.ctaLink,
  };
}

module.exports = {
  parseImages,
  parseSpecifications,
  serializeCategory,
  serializeProductListItem,
  serializeProductDetail,
  serializeBanner,
};
