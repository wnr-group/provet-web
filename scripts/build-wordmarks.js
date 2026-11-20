// Cuts each product's wordmark (the product name as drawn on its label) out
// of its label artwork in public/content/products, so the site can show the
// name in the brand's own lettering and colour instead of in text. Writes
// public/content/wordmarks/<slug>.png and lib/wordmarks.json (slug -> size).
// Run: node scripts/build-wordmarks.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "../public/content/products");
const OUT = path.join(__dirname, "../public/content/wordmarks");
const INSET = 14; // skip the label's thin frame line
const INK = 200; // darker than this on any channel counts as ink
const PAD = 8;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  for (const file of fs.readdirSync(SRC).filter((f) => /\.(jpg|png)$/i.test(f))) {
    const slug = file.replace(/\.(jpg|png)$/i, "");
    const { data, info } = await sharp(path.join(SRC, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const ink = (x, y) => {
      const i = (y * w + x) * 3;
      return Math.min(data[i], data[i + 1], data[i + 2]) < INK;
    };
    const rows = [];
    for (let y = INSET; y < h - INSET; y++) {
      let any = false;
      for (let x = INSET; x < w - INSET && !any; x++) any = ink(x, y);
      rows.push(any);
    }
    // First band of ink rows = the wordmark (the tagline comes after a gap).
    let y0 = rows.indexOf(true);
    if (y0 < 0) continue;
    let y1 = y0;
    let gap = 0;
    for (let y = y0; y < rows.length; y++) {
      if (rows[y]) { y1 = y; gap = 0; } else if (++gap > 4) break;
    }
    y0 += INSET; y1 += INSET;
    let x0 = w, x1 = 0;
    for (let y = y0; y <= y1; y++) for (let x = INSET; x < w - INSET; x++) if (ink(x, y)) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    const left = Math.max(0, x0 - PAD), top = Math.max(0, y0 - PAD);
    const width = Math.min(w - left, x1 - x0 + 1 + PAD * 2), height = Math.min(h - top, y1 - y0 + 1 + PAD * 2);
    await sharp(path.join(SRC, file)).extract({ left, top, width, height }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${slug}.png`));
    manifest[slug] = [width, height];
  }
  fs.writeFileSync(path.join(__dirname, "../lib/wordmarks.json"), JSON.stringify(manifest, null, 1) + "\n");
  console.log(Object.keys(manifest).length, "wordmarks");
})();
