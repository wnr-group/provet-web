// Writes the catalogue backdrop's ribbon art to public/catalogue (see
// lib/catalogueArt.js). Run with `npm run art:catalogue`.
const fs = require("fs");
const path = require("path");
const { RIBBONS, ribbonSvg, ribbonFile } = require("../lib/catalogueArt");

const root = path.join(__dirname, "..");
for (const key of Object.keys(RIBBONS)) {
  const file = path.join(root, ribbonFile(key));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const svg = ribbonSvg(key);
  fs.writeFileSync(file, svg);
  console.log(`${ribbonFile(key)}  ${(svg.length / 1024).toFixed(1)} KB`);
}
