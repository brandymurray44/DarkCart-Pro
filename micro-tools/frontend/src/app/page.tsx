import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        padding: 40,
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#e0e0ff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h1
        style={{
          color: "#7df9ff",
          textShadow: "0 0 10px #7df9ff, 0 0 20px #7df9ff, 0 0 30px #7df9ff",
          marginBottom: 40,
          textAlign: "center"
        }}
      >
        ⚡ StoreScanner — Micro-Tools Fork ⚡
      </h1>

      <div
        style={{
          padding: 30,
          border: "2px solid #7df9ff",
          borderRadius: 8,
          background: "#111",
          boxShadow: "0 0 20px rgba(125, 249, 255, 0.3)",
          maxWidth: 600,
          width: "100%"
        }}
      >
        <h2 style={{ color: "#7df9ff", marginBottom: 20 }}>Welcome to StoreScanner</h2>
        <p style={{ color: "#e0e0ff", marginBottom: 30 }}>
          AI-powered Shopify store scanner with competitor analysis, trend detection, and neon cyberpunk UI.
        </p>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link
            href="/tools/scan"
            style={{
              padding: "15px 30px",
              background: "#7df9ff",
              color: "#000",
              textDecoration: "none",
              borderRadius: 4,
              fontWeight: "bold",
              boxShadow: "0 0 20px #7df9ff"
            }}
          >
            Launch Scanner
          </Link>

          <Link
            href="/tools/history"
            style={{
              padding: "15px 30px",
              background: "#ff00ff",
              color: "#000",
              textDecoration: "none",
              borderRadius: 4,
              fontWeight: "bold",
              boxShadow: "0 0 20px #ff00ff"
            }}
          >
            View History
          </Link>
        </div>
      </div>

      <p style={{ marginTop: 40, color: "#e0e0ff", fontSize: "12px" }}>
        Backend running on port 4001 • Frontend running on port 3001
      </p>
    </div>
  );
}