// Turns the free-text body of a Website Content block into the structure a
// homepage section needs. The admin types plain text in a textarea, so these
// parsers stay deliberately forgiving about separators rather than demanding
// one exact format.

const BULLET_PREFIX = /^[-–—•*]\s+/;
// " - ", " — ", " • ", " | " with surrounding spaces. Requiring the spaces is
// what keeps a hyphenated word ("cold-chain") from being split in half.
const INLINE_SEPARATOR = /\s+[-–—•|]\s+/;

// A stat's value is the leading token that contains a digit: "20+", "100+",
// "1,200", "98%". Anything after it is the caption.
const LEADING_VALUE = /^(\S*\d\S*)\s+(.+)$/s;

function splitItems(body) {
  if (!body) return [];
  const lines = String(body)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // One line means the admin used inline separators; several means one item
  // per line (the format the "Why Choose Us" block already uses). A body
  // containing a line break is always one item per line, even with a single
  // item - that is how the admin's row editor (rowsToBody) saves one row whose
  // text happens to contain " - " without it being split apart.
  const inline = lines.length === 1 && !/\n/.test(String(body));
  const items = inline ? lines[0].split(INLINE_SEPARATOR) : lines;

  return items.map((item) => item.replace(BULLET_PREFIX, "").trim()).filter(Boolean);
}

// [{ value, label }] - `value` is null when the item has no leading number,
// so a trailing sentence in the same block still renders as a caption instead
// of being dropped.
function parseStatItems(body) {
  return splitItems(body).map((item) => {
    const match = item.match(LEADING_VALUE);
    if (!match) return { value: null, label: item };
    return { value: match[1], label: match[2].trim() };
  });
}

// [{ heading, text }] from "Heading: text" items - the format card blocks use
// ("Vision: To be recognized as..."). An item with no colon becomes a heading
// with no text rather than being dropped.
function parseHeadedItems(body) {
  return splitItems(body).map((item) => {
    const at = item.indexOf(":");
    if (at <= 0) return { heading: item, text: "" };
    return { heading: item.slice(0, at).trim(), text: item.slice(at + 1).trim() };
  });
}

// The text of the item headed `name` (case-insensitive), or null.
function findHeadedText(body, name) {
  const wanted = String(name).trim().toLowerCase();
  const item = parseHeadedItems(body).find((i) => i.heading.toLowerCase() === wanted);
  return item?.text || null;
}

// The admin edits list-shaped bodies as a table of rows rather than as text.
// These convert between the two, through the same parsers the public site
// renders with, so the rows the admin sees are exactly the items the page
// shows. Formats:
//   "lines"  - [{ text }]           one item per line (bullet lists)
//   "headed" - [{ heading, text }]  "Heading: text" (cards, numbered rows)
//   "stats"  - [{ value, label }]   "20+ years experience" (figures)
//   "brands" - [{ heading, text }]  "product-slug: tagline" (Top Brands)
const ROW_FORMATS = {
  lines: {
    parse: (body) => splitItems(body).map((text) => ({ text })),
    format: (row) => (row.text || "").trim(),
  },
  headed: {
    parse: (body) => parseHeadedItems(body),
    format: (row) => {
      const heading = (row.heading || "").trim();
      const text = (row.text || "").trim();
      if (heading && text) return `${heading}: ${text}`;
      return heading || text;
    },
  },
  stats: {
    parse: (body) => parseStatItems(body).map(({ value, label }) => ({ value: value || "", label })),
    format: (row) => [(row.value || "").trim(), (row.label || "").trim()].filter(Boolean).join(" "),
  },
};

// A Top Brands row is a headed item whose heading is the product picked.
ROW_FORMATS.brands = ROW_FORMATS.headed;

function bodyToRows(format, body) {
  return (ROW_FORMATS[format] || ROW_FORMATS.lines).parse(body);
}

// One line per row, rows left completely empty dropped. Always ends with a
// line break, so a single row is read back as one item (see splitItems).
function rowsToBody(format, rows) {
  const lines = rows.map((ROW_FORMATS[format] || ROW_FORMATS.lines).format).filter(Boolean);
  return lines.length ? `${lines.join("\n")}\n` : "";
}

module.exports = { splitItems, parseStatItems, parseHeadedItems, findHeadedText, bodyToRows, rowsToBody };
