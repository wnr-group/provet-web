const { parseFieldOptions } = require("./feedbackSchema");
const { parseSectionConfig } = require("./sectionTypes");

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

// The public shape deliberately omits `isActive`: callers only ever receive
// links that are already enabled, so the flag would be noise on the wire.
function serializeSocialLink(link) {
  return {
    platform: link.platform,
    url: link.url,
    order: link.order,
  };
}

// The public config drives what the form renders, so it carries no DB
// bookkeeping (id/key/timestamps) - just the shape of the form.
function serializeFeedbackConfig(config) {
  return {
    isEnabled: config.isEnabled,
    title: config.title,
    description: config.description,
  };
}

// Answers to custom fields, stored JSON-encoded like Product.specifications.
// Each entry keeps the label it was submitted under, so an old submission is
// still readable after the field is renamed or deleted.
function parseAnswers(answers) {
  if (!answers) return [];
  try {
    const parsed = JSON.parse(answers);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => a && typeof a === "object" && typeof a.key === "string");
  } catch {
    return [];
  }
}

function serializeFeedbackField(field) {
  return {
    id: field.id,
    key: field.key,
    label: field.label,
    type: field.type,
    placeholder: field.placeholder,
    helpText: field.helpText,
    options: parseFieldOptions(field.options),
    isRequired: field.isRequired,
    isEnabled: field.isEnabled,
    isSystem: field.isSystem,
    order: field.order,
  };
}

function serializeFeedback(feedback) {
  return {
    id: feedback.id,
    name: feedback.name,
    email: feedback.email,
    message: feedback.message,
    answers: parseAnswers(feedback.answers),
    createdAt: feedback.createdAt,
  };
}

// A page's own settings. `seoTitle`/`seoDescription` fall back to the
// visible title and description here rather than in the page component, so
// every caller gets the same resolved metadata.
function serializePage(page) {
  return {
    key: page.key,
    title: page.title,
    description: page.description,
    heroImage: page.heroImage,
    seoTitle: page.seoTitle || page.title,
    seoDescription: page.seoDescription || page.description || null,
  };
}

// One editable section. `config` arrives JSON-encoded and leaves parsed and
// defaulted, so no renderer has to think about a malformed or empty blob.
function serializeSection(block) {
  return {
    key: block.key,
    type: block.type,
    title: block.title,
    body: block.body,
    image: block.image,
    config: parseSectionConfig(block.type, block.config),
    isVisible: block.isVisible,
    order: block.order,
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
  serializePage,
  serializeSection,
  serializeSocialLink,
  serializeFeedbackConfig,
  serializeFeedbackField,
  serializeFeedback,
  parseAnswers,
};
