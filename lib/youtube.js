// YouTube links -> an embeddable video, as pure functions.
//
// Admins paste whatever link YouTube gave them: a watch page, a youtu.be
// share link, a Shorts or live URL, an embed URL, with or without a start
// time and tracking parameters. parseYouTubeUrl reduces all of them to the
// 11-character video id (plus an optional start time) or rejects the link, so
// validation on save and rendering on the page always agree.
//
// Nothing is downloaded or stored: the page embeds YouTube's own player.
//
// Shared by the section schema (lib/sectionTypes.js), the admin editor and the
// public player, so it has no dependencies and runs on server and client.

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

// Path prefixes that carry the id as the next segment.
const ID_PATHS = ["embed", "shorts", "live", "v", "e"];

// "90", "90s", "1m30s", "1h2m3s" -> seconds. Anything else -> 0.
function parseStart(value) {
  if (!value) return 0;
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return Number(text);
  const match = text.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match || !match[0]) return 0;
  const [, h = 0, m = 0, s = 0] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

// Returns { id, start, url } for a link to a single YouTube video, or null.
// `url` is the canonical watch URL, handy as a no-JavaScript fallback link.
function parseYouTubeUrl(input) {
  if (typeof input !== "string") return null;
  let text = input.trim();
  if (!text) return null;
  // Tolerate a pasted link without its scheme ("youtu.be/abc...").
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;

  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (!HOSTS.has(host)) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  let id = null;

  if (host.endsWith("youtu.be")) {
    id = segments[0];
  } else if (segments[0] === "watch") {
    id = url.searchParams.get("v");
  } else if (ID_PATHS.includes(segments[0])) {
    id = segments[1];
  }

  if (!id || !VIDEO_ID.test(id)) return null;

  const start = parseStart(url.searchParams.get("t") || url.searchParams.get("start"));
  const canonical = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`;
  return { id, start, url: canonical };
}

function isYouTubeUrl(input) {
  return parseYouTubeUrl(input) !== null;
}

// The privacy-enhanced embed: youtube-nocookie.com sets no cookies until the
// visitor actually plays the video. `rel=0` keeps "related videos" to this
// channel rather than any channel.
function youTubeEmbedUrl(id, { start = 0, autoplay = false } = {}) {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
  if (autoplay) params.set("autoplay", "1");
  if (start) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

// hqdefault exists for every video (maxresdefault does not), so it is the
// safe poster frame.
function youTubeThumbnailUrl(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

module.exports = { parseYouTubeUrl, isYouTubeUrl, youTubeEmbedUrl, youTubeThumbnailUrl, parseStart };
