"use client";
import { useState, useEffect } from "react";

interface ScanHistory {
  filename: string;
  timestamp: string;
  url: string;
  productCount: number;
  mode: string;
}

export default function History() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("http://localhost:4001/api/history");
      const data = await res.json();
      if (Array.isArray(data)) {
        setScans(data);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 40,
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#e0e0ff",
        fontFamily: "monospace"
      }}
    >
      <h1
        style={{
          color: "#7df9ff",
          textShadow: "0 0 10px #7df9ff, 0 0 20px #7df9ff",
          marginBottom: 30
        }}
      >
        Scan History
      </h1>

      {loading ? (
        <p style={{ color: "#7df9ff" }}>Loading...</p>
      ) : scans.length === 0 ? (
        <p style={{ color: "#e0e0ff" }}>No scans found. Start scanning to build your history.</p>
      ) : (
        <div style={{ display: "grid", gap: 15 }}>
          {scans.map((scan, idx) => (
            <div
              key={idx}
              style={{
                padding: 20,
                border: "2px solid #7df9ff",
                borderRadius: 8,
                background: "#111",
                boxShadow: "0 0 15px rgba(125, 249, 255, 0.3)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ color: "#7df9ff", margin: "0 0 10px 0" }}>{scan.url}</h3>
                  <p style={{ color: "#e0e0ff", fontSize: "12px", margin: "5px 0" }}>
                    {new Date(scan.timestamp).toLocaleString()}
                  </p>
                  <p style={{ color: "#ff00ff", fontSize: "14px", margin: "5px 0" }}>
                    {scan.productCount} products • {scan.mode}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`http://localhost:4001/api/export/${scan.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "10px 20px",
                      background: "#ff00ff",
                      color: "#000",
                      textDecoration: "none",
                      borderRadius: 4,
                      fontWeight: "bold",
                      boxShadow: "0 0 15px #ff00ff"
                    }}
                  >
                    Export
                  </a>
                  <a
                    href={`http://localhost:4001/api/report/${scan.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "10px 20px",
                      background: "#ffff00",
                      color: "#000",
                      textDecoration: "none",
                      borderRadius: 4,
                      fontWeight: "bold",
                      boxShadow: "0 0 15px #ffff00"
                    }}
                  >
                    Report
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}