import express from "express";
import cors from "cors";
import axios from "axios";
import { scrapeStore, scanCollection } from "./scraper.js";
import { analyzeProducts, analyzeTrends } from "./ai.js";
import { analyzeCompetitors } from "./competitors.js";
import { buildSimilarityMap } from "./similarity.js";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const SCANS_DIR = path.join(process.cwd(), "scans");
if (!fs.existsSync(SCANS_DIR)) {
  fs.mkdirSync(SCANS_DIR, { recursive: true });
}

function saveScan(url, data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `scan-${timestamp}.json`;
  const filepath = path.join(SCANS_DIR, filename);

  const scanRecord = {
    timestamp: new Date().toISOString(),
    url,
    ...data
  };

  fs.writeFileSync(filepath, JSON.stringify(scanRecord, null, 2));
  return filename;
}

app.post("/api/scan", async (req, res) => {
  const { storeUrl, mode = "single" } = req.body;

  try {
    let products = [];
    let isCollection = false;

    // Detect if URL is a collection
    if (storeUrl.includes("/collections/") || mode === "collection") {
      isCollection = true;
      const { products: collectionProducts } = await scanCollection(storeUrl, axios);
      products = collectionProducts;
    } else {
      const response = await axios.get(storeUrl);
      const { products: scrapedProducts } = await scrapeStore(response.data, storeUrl);
      products = scrapedProducts;
    }

    const { insights } = await analyzeProducts(products);
    const trends = await analyzeTrends(products);
    const similarity = buildSimilarityMap(products);

    const result = {
      success: true,
      mode: isCollection ? "collection" : "single",
      products,
      insights,
      trends,
      similarity
    };

    // Save to database
    const savedFile = saveScan(storeUrl, result);
    result.savedTo = savedFile;

    res.json(result);
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ error: "Failed to scan store" });
  }
});

app.get("/api/scans", (req, res) => {
  try {
    const files = fs.readdirSync(SCANS_DIR).filter(f => f.endsWith(".json"));
    const scans = files.map(file => {
      const content = fs.readFileSync(path.join(SCANS_DIR, file), "utf-8");
      return JSON.parse(content);
    });
    res.json({ scans });
  } catch (err) {
    console.error("Error reading scans:", err);
    res.status(500).json({ error: "Failed to load scans" });
  }
});

app.get("/api/scans/:filename", (req, res) => {
  try {
    const filepath = path.join(SCANS_DIR, req.params.filename);
    const content = fs.readFileSync(filepath, "utf-8");
    res.json(JSON.parse(content));
  } catch (err) {
    console.error("Error reading scan:", err);
    res.status(404).json({ error: "Scan not found" });
  }
});

app.get("/api/history", (req, res) => {
  try {
    const files = fs.readdirSync(SCANS_DIR).filter(f => f.endsWith(".json"));
    const scans = files.map(file => {
      const content = fs.readFileSync(path.join(SCANS_DIR, file), "utf-8");
      const data = JSON.parse(content);
      return {
        filename: file,
        timestamp: data.timestamp,
        url: data.url,
        productCount: data.products?.length || 0,
        mode: data.mode
      };
    });
    res.json(scans);
  } catch (err) {
    console.error("Error reading history:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

app.get("/api/report/:filename", (req, res) => {
  try {
    const filepath = path.join(SCANS_DIR, req.params.filename);
    const content = fs.readFileSync(filepath, "utf-8");
    const data = JSON.parse(content);

    // Generate text report
    let report = `STORESCANNER INTELLIGENCE REPORT\n`;
    report += `================================\n\n`;
    report += `Store URL: ${data.url}\n`;
    report += `Scan Date: ${new Date(data.timestamp).toLocaleString()}\n`;
    report += `Scan Mode: ${data.mode}\n\n`;
    report += `PRODUCT SUMMARY\n`;
    report += `---------------\n`;
    report += `Total Products Scanned: ${data.products.length}\n\n`;

    report += `PRODUCTS\n`;
    report += `--------\n\n`;
    data.products.forEach((p, i) => {
      report += `${i + 1}. ${p.title}\n`;
      report += `   Price: ${p.price || "N/A"}\n`;
      if (p.variants && p.variants.length > 0) {
        report += `   Variants: ${p.variants.length}\n`;
      }
      report += `\n`;
    });

    report += `\nAI INSIGHTS & TRENDS\n`;
    report += `--------------------\n\n`;

    data.insights.forEach(insight => {
      report += `${insight.product}\n`;
      report += `  Score: ${insight.score}/1.0\n`;
      report += `  Trend: ${insight.trend}\n`;
      report += `  Status: ${insight.anomaly}\n`;
      report += `  Action: ${insight.recommendation}\n\n`;
    });

    report += `\nMARKET ANALYSIS\n`;
    report += `---------------\n\n`;
    report += `Total Products: ${data.trends.totalProducts}\n`;
    report += `Average Price: $${data.trends.avgPrice}\n`;
    report += `Price Range: $${data.trends.priceRange.min} - $${data.trends.priceRange.max}\n\n`;

    if (data.trends.topCategories.length > 0) {
      report += `Top Keywords:\n`;
      data.trends.topCategories.forEach(cat => {
        report += `  - ${cat.word} (${cat.count} occurrences)\n`;
      });
      report += `\n`;
    }

    if (data.trends.recommendations.length > 0) {
      report += `Strategic Recommendations:\n`;
      data.trends.recommendations.forEach(rec => {
        report += `  • ${rec}\n`;
      });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=store-intelligence-report-${req.params.filename.replace(".json", ".txt")}`);
    res.send(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.post("/api/competitors", async (req, res) => {
  const { primaryStoreScan, competitorScans } = req.body;

  try {
    const result = await analyzeCompetitors(primaryStoreScan, competitorScans);
    res.json(result);
  } catch (e) {
    console.error("Competitor analysis error:", e);
    res.status(500).json({ error: "Failed to analyze competitors" });
  }
});

app.get("/api/export/:filename", (req, res) => {
  try {
    const filepath = path.join(SCANS_DIR, req.params.filename);
    const content = fs.readFileSync(filepath, "utf-8");
    const data = JSON.parse(content);

    // Generate text report
    let report = `STORESCANNER REPORT\n`;
    report += `==================\n\n`;
    report += `URL: ${data.url}\n`;
    report += `Date: ${data.timestamp}\n`;
    report += `Mode: ${data.mode}\n\n`;
    report += `PRODUCTS (${data.products.length})\n`;
    report += `-------------------\n\n`;

    data.products.forEach((p, i) => {
      report += `${i + 1}. ${p.title}\n`;
      report += `   Price: ${p.price || "N/A"}\n`;
      if (p.variants && p.variants.length > 0) {
        report += `   Variants: ${p.variants.length}\n`;
      }
      report += `\n`;
    });

    report += `\nINSIGHTS\n`;
    report += `--------\n\n`;

    data.insights.forEach(insight => {
      report += `${insight.product}\n`;
      report += `  Score: ${insight.score}\n`;
      report += `  ${insight.verdict}\n\n`;
    });

    report += `\nTRENDS\n`;
    report += `------\n\n`;
    report += `Total Products: ${data.trends.totalProducts}\n`;
    report += `Average Price: $${data.trends.avgPrice}\n`;
    report += `Price Range: $${data.trends.priceRange.min} - $${data.trends.priceRange.max}\n\n`;

    if (data.trends.topCategories.length > 0) {
      report += `Top Keywords:\n`;
      data.trends.topCategories.forEach(cat => {
        report += `  - ${cat.word} (${cat.count})\n`;
      });
      report += `\n`;
    }

    if (data.trends.recommendations.length > 0) {
      report += `Recommendations:\n`;
      data.trends.recommendations.forEach(rec => {
        report += `  • ${rec}\n`;
      });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=scan-report-${req.params.filename.replace(".json", ".txt")}`);
    res.send(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.listen(4001, () => console.log("Micro-tool backend running on 4001"));