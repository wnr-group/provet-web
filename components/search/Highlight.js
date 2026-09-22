// Wraps every occurrence of the query inside `text` in a <mark>, so a result
// shows *why* it matched.
//
// Walks the string with indexOf rather than splitting on a RegExp built from
// the query: the query is raw visitor input, and "c++" or "(5 mg)" would
// either throw or match the wrong thing once compiled as a pattern.
export default function Highlight({ text, query }) {
  if (!text) return null;

  const source = String(text);
  const needle = (query || "").trim();
  if (!needle) return source;

  const haystack = source.toLowerCase();
  const target = needle.toLowerCase();
  const parts = [];
  let cursor = 0;

  for (;;) {
    const index = haystack.indexOf(target, cursor);
    if (index === -1) break;
    if (index > cursor) parts.push(source.slice(cursor, index));
    parts.push(
      <mark key={index} className="rounded bg-accent-100 px-0.5 text-accent-700">
        {source.slice(index, index + needle.length)}
      </mark>
    );
    cursor = index + needle.length;
  }

  if (cursor === 0) return source;
  if (cursor < source.length) parts.push(source.slice(cursor));
  return parts;
}
