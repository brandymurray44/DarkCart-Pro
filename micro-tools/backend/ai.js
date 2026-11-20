export async function analyzeProducts(products) {
  const insights = [];

  // Cluster analysis: group products by price similarity
  const clusters = {};
  products.forEach((p) => {
    const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
    const bucket = Math.floor(priceNum / 20) * 20;
    if (!clusters[bucket]) clusters[bucket] = [];
    clusters[bucket].push(p);
  });

  products.forEach((p) => {
    const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, ""));
    const variantCount = p.variants?.length || 0;
    const hasImage = Boolean(p.image);

    const score =
      (priceNum ? Math.min(priceNum / 100, 1) * 0.25 : 0) +
      (variantCount > 2 ? 0.25 : 0.1) +
      (hasImage ? 0.25 : 0) +
      (p.title.length > 12 ? 0.25 : 0);

    // Anomaly detection: flag products that deviate from cluster norms
    const bucket = Math.floor(priceNum / 20) * 20;
    const cluster = clusters[bucket];
    const avgPrice =
      cluster.reduce((sum, x) => sum + (parseFloat(x.price.replace(/[^0-9.]/g, "")) || 0), 0) /
      cluster.length;

    const anomaly = Math.abs(priceNum - avgPrice) > avgPrice * 0.4;

    insights.push({
      product: p.title,
      price: p.price,
      variants: p.variants,
      image: p.image,
      score: score.toFixed(2),
      trend:
        score > 0.75
          ? "🔥 Trending Strong"
          : score > 0.5
          ? "⚡ Moderate Trend"
          : "🧊 Weak Trend",
      anomaly: anomaly ? "⚠️ Price anomaly detected" : "Normal",
      recommendation:
        anomaly
          ? "Review pricing — product deviates from cluster norms"
          : score > 0.75
          ? "Promote heavily"
          : score > 0.5
          ? "Optimize listing"
          : "Consider revising product"
    });
  });

  return { insights };
}

export async function analyzeTrends(products) {
  const trends = {
    totalProducts: products.length,
    avgPrice: 0,
    priceRange: { min: 0, max: 0 },
    topCategories: [],
    recommendations: [],
    clusters: {}
  };

  if (products.length === 0) return trends;

  // Calculate price statistics
  const prices = products.map(p => parseFloat(p.price.replace(/[^0-9.]/g, ""))).filter(p => !isNaN(p));

  if (prices.length > 0) {
    trends.avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
    trends.priceRange.min = Math.min(...prices).toFixed(2);
    trends.priceRange.max = Math.max(...prices).toFixed(2);
  }

  // Cluster analysis
  const clusters = {};
  products.forEach(p => {
    const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
    const bucket = Math.floor(priceNum / 20) * 20;
    if (!clusters[bucket]) clusters[bucket] = [];
    clusters[bucket].push(p.title);
  });

  trends.clusters = Object.entries(clusters).map(([price, products]) => ({
    priceRange: `$${price} - $${(parseInt(price) + 19).toFixed(0)}`,
    count: products.length,
    products: products.slice(0, 3)
  }));

  // Analyze product titles for categories
  const keywords = {};
  products.forEach(p => {
    const words = p.title.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) {
        keywords[word] = (keywords[word] || 0) + 1;
      }
    });
  });

  const sortedKeywords = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  trends.topCategories = sortedKeywords;

  // Generate recommendations
  if (prices.length > 0) {
    const avgPrice = parseFloat(trends.avgPrice);
    if (avgPrice < 20) {
      trends.recommendations.push("Consider premium pricing strategy");
    } else if (avgPrice > 100) {
      trends.recommendations.push("Luxury market detected — emphasize quality");
    }
  }

  const productsWithImages = products.filter(p => p.image).length;
  if (productsWithImages / products.length < 0.5) {
    trends.recommendations.push("Add more product images to increase conversion");
  }

  const productsWithVariants = products.filter(p => p.variants && p.variants.length > 0).length;
  if (productsWithVariants / products.length > 0.7) {
    trends.recommendations.push("Strong variant strategy — highlight size/color options");
  }

  // Anomaly warnings
  const anomalies = products.filter(p => {
    const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
    const bucket = Math.floor(priceNum / 20) * 20;
    const cluster = clusters[bucket];
    if (!cluster || cluster.length < 2) return false;
    const avgPrice = cluster.reduce((sum, x) => sum + (parseFloat(x.price.replace(/[^0-9.]/g, "")) || 0), 0) / cluster.length;
    return Math.abs(priceNum - avgPrice) > avgPrice * 0.4;
  });

  if (anomalies.length > 0) {
    trends.recommendations.push(`⚠️ ${anomalies.length} product(s) with unusual pricing detected`);
  }

  return trends;
}