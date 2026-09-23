// "Key details" table for the product detail page.
//
// Two things this exists to get right, both of which the previous inline pill
// row got wrong:
//
//   * Deduplication. `packSize` is both a column on Product and, for every
//     seeded row, a key inside `specifications` - so the pills rendered
//     "Pack: 100ml" immediately followed by "PackSize: 100ml". Keys are
//     matched on a normalized form (case and separators stripped) so
//     "packSize", "pack_size" and "Pack Size" all collapse together.
//   * Labels. Spec keys arrive camelCased from the admin's JSON; `capitalize`
//     left them as "PackSize". humanizeKey splits the words out properly.
//
// A definition list rather than pills: values like "Store below 25°C, protect
// from light" are a sentence, and a sentence in a pill wraps into an unreadable
// lozenge.

const LABEL_OVERRIDES = {
  sku: "SKU",
};

function normalizeKey(key) {
  return String(key).replace(/[\s_-]+/g, "").toLowerCase();
}

function humanizeKey(key) {
  const normalized = LABEL_OVERRIDES[normalizeKey(key)];
  if (normalized) return normalized;
  return String(key)
    // camelCase / PascalCase -> spaced words, before the separator pass so
    // "packSize_v2" splits on both the case change and the underscore.
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[\s_-]+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

// The column fields first, in a fixed order, then whatever the admin put in
// `specifications` - minus any key already covered above.
export function buildSpecRows(product) {
  const rows = [];
  const seen = new Set();

  const push = (key, value) => {
    if (value === null || value === undefined) return;
    const text = String(value).trim();
    if (!text) return;
    const id = normalizeKey(key);
    if (seen.has(id)) return;
    seen.add(id);
    rows.push({ key: id, label: humanizeKey(key), value: text });
  };

  push("sku", product.sku);
  push("packSize", product.packSize);
  for (const [key, value] of Object.entries(product.specifications || {})) {
    push(key, value);
  }

  return rows;
}

// A short value sits happily in a half-width tile; a sentence like "Store
// below 25°C, protect from light" needs the full row or it wraps to three
// cramped lines beside an empty neighbour.
const WIDE_VALUE_CHARS = 28;

export default function ProductSpecs({ product, className = "" }) {
  const rows = buildSpecRows(product);
  if (!rows.length) return null;

  return (
    <dl className={`grid grid-cols-1 gap-2.5 sm:grid-cols-2 ${className}`}>
      {rows.map((row) => (
        <div
          key={row.key}
          className={`stat-tile hover:bg-mist-100 ${row.value.length > WIDE_VALUE_CHARS ? "sm:col-span-2" : ""}`}
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/70">{row.label}</dt>
          <dd className="mt-1 font-display text-sm font-semibold text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
