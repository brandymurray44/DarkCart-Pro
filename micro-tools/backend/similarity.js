function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ");
}

export function computeSimilarity(a, b) {
  const wa = new Set(normalizeTitle(a));
  const wb = new Set(normalizeTitle(b));

  const intersection = [...wa].filter((w) => wb.has(w));
  const union = new Set([...wa, ...wb]);

  const score = intersection.length / union.size;
  return score;
}

export function buildSimilarityMap(products) {
  const map = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const s = computeSimilarity(products[i].title, products[j].title);
      if (s > 0.4) {
        map.push({
          a: products[i].title,
          b: products[j].title,
          score: s.toFixed(2)
        });
      }
    }
  }

  return map;
}