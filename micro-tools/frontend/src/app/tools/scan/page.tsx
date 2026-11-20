"use client";
import { useState, useEffect } from "react";

interface Product {
  title: string;
  price: string;
  image?: string;
  variants?: Array<{ title: string; price?: string }>;
}

interface Insight {
  product: string;
  price: string;
  image?: string;
  variants?: Array<{ title: string; price?: string }>;
  score: string;
  trend: string;
  anomaly: string;
  recommendation: string;
}

interface Trends {
  totalProducts: number;
  avgPrice: string;
  priceRange: { min: string; max: string };
  topCategories: Array<{ word: string; count: number }>;
  recommendations: string[];
}

interface ScanData {
  success: boolean;
  mode: string;
  products: Product[];
  insights: Insight[];
  trends: Trends;
  similarity: Array<{ a: string; b: string; score: string }>;
  savedTo?: string;
  url?: string;
  timestamp?: string;
}

export default function Scan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScanData | null>(null);
  const [error, setError] = useState("");
  const [scans, setScans] = useState<ScanData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  async function loadScans() {
    try {
      const res = await fetch("http://localhost:4001/api/scans");
      const json = await res.json();
      if (json.scans) {
        setScans(json.scans);
      }
    } catch (e) {
      console.error("Failed to load scans:", e);
    }
  }

  async function handleScan() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4001/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeUrl: url })
      });

      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
        loadScans();
      }
    } catch (e) {
      setError("Failed to connect to scanner backend.");
    }

    setLoading(false);
  }

  async function handleExport(filename: string) {
    window.open(`http://localhost:4001/api/export/${filename}`, "_blank");
  }

  async function handleLoadScan(filename: string) {
    try {
      const res = await fetch(`http://localhost:4001/api/scans/${filename}`);
      const json = await res.json();
      setData(json);
      setShowHistory(false);
    } catch (e) {
      setError("Failed to load scan");
    }
  }

  return (
    <div
      style={{
        padding: 40,
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#e0e0ff",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(125, 249, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 249, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Scanline effect */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(to bottom, transparent, rgba(125, 249, 255, 0.3), transparent)",
          animation: "scanline 4s linear infinite",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Neon HUD Overlay */}
      {loading && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(#7df9ff 1px, transparent 1px), linear-gradient(90deg, #7df9ff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.15,
            animation: "gridMove 4s linear infinite"
          }} />
          <div style={{
            color: "#7df9ff",
            fontSize: "2.5rem",
            textShadow: "0 0 20px #7df9ff",
            animation: "pulse 1.5s infinite",
            position: "relative",
            zIndex: 1
          }}>
            NEON SCAN IN PROGRESS
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          style={{
            color: "#7df9ff",
            textShadow: "0 0 10px #7df9ff, 0 0 20px #7df9ff, 0 0 30px #7df9ff, 0 0 40px #7df9ff",
            animation: "pulse 2s ease-in-out infinite, holographic 3s ease-in-out infinite",
            marginBottom: 30,
            letterSpacing: "2px"
          }}
        >
          ⚡ Store Scanner — Neon Edition ⚡
        </h1>

        <div style={{ marginBottom: 20 }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Shopify store URL"
            style={{
              width: "350px",
              padding: "12px",
              background: "#111",
              border: "2px solid #7df9ff",
              color: "#7df9ff",
              borderRadius: "4px",
              marginRight: "10px",
              boxShadow: "0 0 10px rgba(125, 249, 255, 0.5)",
              fontFamily: "monospace"
            }}
          />

          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              padding: "12px 20px",
              background: loading ? "#333" : "#7df9ff",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 20px #7df9ff",
              fontWeight: "bold",
              fontFamily: "monospace",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "Scanning..." : "Scan"}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: "12px 20px",
              background: "#ff00ff",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 0 20px #ff00ff",
              fontWeight: "bold",
              fontFamily: "monospace",
              marginLeft: "10px"
            }}
          >
            History ({scans.length})
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "#ff3333",
              marginTop: 20,
              textShadow: "0 0 5px #ff3333, 0 0 10px #ff3333",
              animation: "flicker 1s ease-in-out infinite"
            }}
          >
            {error}
          </p>
        )}

        {showHistory && (
          <div
            style={{
              marginTop: 30,
              padding: 20,
              border: "2px solid #ff00ff",
              borderRadius: 8,
              background: "#1a0a1a",
              boxShadow: "0 0 20px rgba(255, 0, 255, 0.5)"
            }}
          >
            <h2 style={{ color: "#ff00ff", textShadow: "0 0 10px #ff00ff", marginBottom: 20 }}>
              Scan History
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {scans.map((scan, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 15,
                    border: "1px solid #7df9ff",
                    borderRadius: 4,
                    background: "#111",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: "#7df9ff", margin: "5px 0" }}>{scan.url}</p>
                      <p style={{ color: "#e0e0ff", fontSize: "12px", margin: "5px 0" }}>
                        {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : "Unknown date"} • {scan.products?.length || 0} products
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => scan.savedTo && handleLoadScan(scan.savedTo)}
                        disabled={!scan.savedTo}
                        style={{
                          padding: "8px 15px",
                          background: "#7df9ff",
                          color: "#000",
                          border: "none",
                          borderRadius: 4,
                          cursor: scan.savedTo ? "pointer" : "not-allowed",
                          marginRight: "10px",
                          fontFamily: "monospace",
                          opacity: scan.savedTo ? 1 : 0.5
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => scan.savedTo && handleExport(scan.savedTo)}
                        disabled={!scan.savedTo}
                        style={{
                          padding: "8px 15px",
                          background: "#ff00ff",
                          color: "#000",
                          border: "none",
                          borderRadius: 4,
                          cursor: scan.savedTo ? "pointer" : "not-allowed",
                          fontFamily: "monospace",
                          opacity: scan.savedTo ? 1 : 0.5
                        }}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data && (
          <div style={{ marginTop: 40 }}>
            <h2
              style={{
                color: "#ff00ff",
                textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff",
                marginBottom: 20
              }}
            >
              Scan Results
            </h2>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#7df9ff", textShadow: "0 0 5px #7df9ff" }}>
                Products Found: {data.products?.length || 0}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 20,
                  marginTop: 20
                }}
              >
                {data.products?.map((product, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "2px solid #7df9ff",
                      padding: 15,
                      borderRadius: 8,
                      background: "#111",
                      boxShadow: "0 0 15px rgba(125, 249, 255, 0.5)",
                      transition: "all 0.3s ease",
                      animation: `fadeIn 0.5s ease-in ${idx * 0.1}s both`
                    }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: "100%",
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 4,
                          marginBottom: 10,
                          border: "1px solid #7df9ff"
                        }}
                      />
                    )}
                    <h4 style={{ color: "#e0e0ff", margin: "10px 0" }}>{product.title}</h4>
                    <p style={{ color: "#ff00ff", fontWeight: "bold", margin: "5px 0" }}>
                      {product.price || "N/A"}
                    </p>
                    {product.variants && product.variants.length > 0 && (
                      <p style={{ color: "#ffff00", fontSize: "12px", margin: "5px 0" }}>
                        {product.variants.length} variants
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3
                style={{
                  color: "#ff00ff",
                  textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff",
                  marginBottom: 20
                }}
              >
                AI Insights
              </h3>
              <div style={{ display: "grid", gap: 15, marginTop: 20 }}>
                {data.insights?.map((insight, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "2px solid #ff00ff",
                      padding: 15,
                      borderRadius: 8,
                      background: "#1a0a1a",
                      boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)",
                      animation: `slideIn 0.5s ease-in ${idx * 0.1}s both`
                    }}
                  >
                    <h4 style={{ color: "#7df9ff", margin: "0 0 10px 0" }}>{insight.product}</h4>
                    <p style={{ color: "#e0e0ff", margin: "5px 0" }}>Price: {insight.price || "N/A"}</p>
                    {insight.variants && insight.variants.length > 0 && (
                      <p style={{ color: "#ffff00", margin: "5px 0" }}>
                        Variants: {insight.variants.map(v => v.title).join(", ")}
                      </p>
                    )}
                    <p style={{ color: "#ffff00", margin: "5px 0" }}>Score: {insight.score}</p>
                    <p style={{ color: "#ffff00", margin: "5px 0", fontWeight: "bold" }}>
                      Trend: {insight.trend}
                    </p>
                    <p style={{ color: insight.anomaly.includes("⚠️") ? "#ff3333" : "#00ff00", margin: "5px 0" }}>
                      {insight.anomaly}
                    </p>
                    <p style={{ color: "#e0e0ff", margin: "5px 0", fontSize: "12px" }}>
                      {insight.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {data.trends && (
              <div
                style={{
                  marginTop: 40,
                  padding: 20,
                  border: "2px solid #ffff00",
                  borderRadius: 8,
                  background: "#1a1a0a",
                  boxShadow: "0 0 20px rgba(255, 255, 0, 0.5)"
                }}
              >
                <h3
                  style={{
                    color: "#ffff00",
                    textShadow: "0 0 10px #ffff00",
                    marginBottom: 20
                  }}
                >
                  Trend Analysis
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                  <div>
                    <p style={{ color: "#7df9ff", margin: "5px 0" }}>Total Products</p>
                    <p style={{ color: "#e0e0ff", fontSize: "24px", fontWeight: "bold" }}>
                      {data.trends.totalProducts}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#7df9ff", margin: "5px 0" }}>Average Price</p>
                    <p style={{ color: "#e0e0ff", fontSize: "24px", fontWeight: "bold" }}>
                      ${data.trends.avgPrice}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#7df9ff", margin: "5px 0" }}>Price Range</p>
                    <p style={{ color: "#e0e0ff", fontSize: "16px", fontWeight: "bold" }}>
                      ${data.trends.priceRange.min} - ${data.trends.priceRange.max}
                    </p>
                  </div>
                </div>

                {data.trends.topCategories.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{ color: "#ff00ff", margin: "10px 0" }}>Top Keywords:</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {data.trends.topCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "5px 10px",
                            background: "#ff00ff",
                            color: "#000",
                            borderRadius: 4,
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          {cat.word} ({cat.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.trends.recommendations.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{ color: "#ffff00", margin: "10px 0" }}>Recommendations:</p>
                    <ul style={{ color: "#e0e0ff", margin: "10px 0", paddingLeft: 20 }}>
                      {data.trends.recommendations.map((rec, idx) => (
                        <li key={idx} style={{ margin: "5px 0" }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {data.savedTo && (
              <p
                style={{
                  marginTop: 20,
                  color: "#00ff00",
                  textShadow: "0 0 5px #00ff00",
                  fontSize: "12px"
                }}
              >
                ✓ Scan saved to: {data.savedTo}
              </p>
            )}

            {/* Neon 3D Hologram Panel */}
            <div
              style={{
                marginTop: 40,
                padding: 30,
                borderRadius: "12px",
                background: "radial-gradient(circle at top, #7df9ff33, #000 60%)",
                border: "1px solid #7df9ff",
                boxShadow: "0 0 25px #7df9ff",
                transform: "perspective(800px) rotateX(8deg)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "linear-gradient(#7df9ff22 1px, transparent 1px), linear-gradient(90deg, #7df9ff22 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  opacity: 0.4,
                  transform: "translateZ(-50px)"
                }}
              />
              <h2 style={{ color: "#7df9ff", position: "relative", marginBottom: 10 }}>
                Holographic Store Intelligence
              </h2>
              <p style={{ position: "relative", color: "#e0e0ff" }}>
                Live AI insights, similarity mapping, and competitor signals.
              </p>
            </div>

            {/* Floating Hologram Cards for Top Products */}
            {data && data.insights && data.insights.length > 0 && (
              <div
                style={{
                  marginTop: 30,
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
                }}
              >
                {data.insights.slice(0, 4).map((i, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 20,
                      borderRadius: "10px",
                      background: "#050509",
                      border: "1px solid #7df9ff",
                      boxShadow: "0 0 20px #7df9ff",
                      transform: "perspective(600px) rotateY(-6deg)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <h3 style={{ color: "#7df9ff", margin: "0 0 10px 0" }}>{i.product}</h3>
                    <p style={{ color: "#e0e0ff", margin: "5px 0" }}>Trend: {i.trend}</p>
                    <p style={{ color: "#ffff00", margin: "5px 0" }}>Score: {i.score}</p>
                    <p style={{ color: "#e0e0ff", margin: "5px 0", fontSize: "12px" }}>{i.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Similarity Map */}
            {data && data.similarity && data.similarity.length > 0 && (
              <div
                style={{
                  marginTop: 40,
                  padding: 20,
                  border: "2px solid #00ff00",
                  borderRadius: 8,
                  background: "#0a1a0a",
                  boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)"
                }}
              >
                <h3 style={{ color: "#00ff00", textShadow: "0 0 10px #00ff00", marginBottom: 20 }}>
                  Product Similarity Map
                </h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {data.similarity.slice(0, 10).map((sim, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 10,
                        border: "1px solid #00ff00",
                        borderRadius: 4,
                        background: "#111",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#7df9ff", margin: "2px 0", fontSize: "14px" }}>{sim.a}</p>
                        <p style={{ color: "#7df9ff", margin: "2px 0", fontSize: "14px" }}>↕ {sim.b}</p>
                      </div>
                      <span style={{ color: "#00ff00", fontWeight: "bold", marginLeft: "10px" }}>{sim.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        @keyframes holographic {
          0%, 100% {
            textShadow: 0 0 10px #7df9ff, 0 0 20px #7df9ff, 0 0 30px #7df9ff, 0 0 40px #7df9ff;
          }
          50% {
            textShadow: 0 0 15px #ff00ff, 0 0 25px #ff00ff, 0 0 35px #7df9ff, 0 0 45px #ff00ff;
          }
        }
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}