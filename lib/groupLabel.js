// The product group as shown above a product's name on the cards: the word
// "Aqua" is dropped ("Aqua Probiotics" reads "Probiotics"), since the range's
// own label already says it is aquaculture. Names without it are unchanged.
function groupLabel(name) {
  if (!name) return name;
  return name.replace(/\baqua\b\s*/gi, "").trim() || name;
}

module.exports = { groupLabel };
