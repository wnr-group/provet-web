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
  // per line (the format the "Why Choose Us" block already uses).
  const items = lines.length === 1 ? lines[0].split(INLINE_SEPARATOR) : lines;

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

module.exports = { splitItems, parseStatItems };
