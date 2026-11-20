export async function analyzeCompetitors(primaryStoreScan, competitorScans) {
  // primaryStoreScan: { products, insights }
  // competitorScans: array of { storeUrl, products, insights }

  const summary = [];

  competitorScans.forEach((comp) => {
    const compProducts = comp.products || [];
    const primaryProducts = primaryStoreScan.products || [];

    const compCount = compProducts.length;
    const primaryCount = primaryProducts.length;

    const productNamesPrimary = primaryProducts.map((p) => p.title.toLowerCase());
    const productNamesComp = compProducts.map((p) => p.title.toLowerCase());

    const overlap = productNamesComp.filter((name) =>
      productNamesPrimary.includes(name)
    );

    summary.push({
      competitor: comp.storeUrl,
      productCount: compCount,
      overlapCount: overlap.length,
      overlapExamples: overlap.slice(0, 5),
      verdict:
        overlap.length > 10
          ? "High overlap — direct competitor"
          : overlap.length > 3
          ? "Moderate overlap — partial competitor"
          : "Low overlap — adjacent niche"
    });
  });

  return { competitors: summary };
}