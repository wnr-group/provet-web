// The detail panel behind each point of the homepage trust strip (Reliable
// Supply, Certified Quality, ...). A point's details are stored in the
// "feature-strip" block's config as { heading, text, links }, matched to the
// strip's own rows by heading, so reordering or renaming a row never attaches
// the wrong text to it.

// Finds the details written for a strip point, ignoring case and surrounding
// space. Returns null when the point has none (or only empty ones).
function detailFor(details, heading) {
  const wanted = String(heading || "").trim().toLowerCase();
  const found = (details || []).find((d) => String(d?.heading || "").trim().toLowerCase() === wanted);
  if (!found) return null;
  const blocks = parseDetailText(found.text);
  const links = parseDetailLinks(found.links);
  return blocks.length || links.length ? { blocks, links } : null;
}

// Blank lines separate paragraphs; a paragraph whose every line starts with
// "- " is a bullet list. -> [{ type: "p", text } | { type: "ul", items }]
function parseDetailText(text) {
  return String(text || "")
    .split(/\r?\n\s*\r?\n/)
    .map((chunk) => chunk.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length)
    .map((lines) =>
      lines.every((line) => /^[-•]\s+/.test(line))
        ? { type: "ul", items: lines.map((line) => line.replace(/^[-•]\s+/, "")) }
        : { type: "p", text: lines.join(" ") }
    );
}

// One link per line, written "Label | address". The address may be a page on
// this site ("/contact"), an uploaded file ("/uploads/..."), or an http(s)
// link; anything else (javascript:, data:, a bare word) is dropped, since it
// ends up in a real <a href>. A line with no label shows its address.
function parseDetailLinks(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.lastIndexOf("|");
      const label = at === -1 ? "" : line.slice(0, at).trim();
      const url = (at === -1 ? line : line.slice(at + 1)).trim();
      return { label: label || url, url };
    })
    .filter(({ url }) => isSafeLink(url));
}

function isSafeLink(url) {
  if (/^https?:\/\/[^\s]+$/i.test(url)) return true;
  return /^\/(?!\/)[^\s]*$/.test(url) && !url.includes("..");
}

// Whether a link leaves the site (opens in a new tab) rather than staying on it.
const isExternalLink = (url) => /^https?:\/\//i.test(url);

module.exports = { detailFor, parseDetailText, parseDetailLinks, isSafeLink, isExternalLink };
