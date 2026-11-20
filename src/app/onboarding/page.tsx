"use client";
import { useState } from "react";
import Link from "next/link";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <div style={{ padding: 40, color: "#7df9ff", background: "#050509", minHeight: "100vh" }}>
      <h1 style={{ textShadow: "0 0 10px #7df9ff", marginBottom: 40 }}>Welcome to DarkCart-Pro</h1>

      {step === 1 && (
        <div
          style={{
            padding: 30,
            border: "2px solid #7df9ff",
            borderRadius: 8,
            background: "#111",
            boxShadow: "0 0 20px rgba(125, 249, 255, 0.3)",
            maxWidth: 600
          }}
        >
          <h2 style={{ color: "#7df9ff", marginBottom: 20 }}>Step 1 — Create your account</h2>
          <p style={{ color: "#e0e0ff", marginBottom: 20 }}>
            Basic email + password form goes here.
          </p>
          <button
            onClick={() => setStep(2)}
            style={{
              padding: "12px 24px",
              background: "#7df9ff",
              color: "#000",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px #7df9ff"
            }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div
          style={{
            padding: 30,
            border: "2px solid #ff00ff",
            borderRadius: 8,
            background: "#111",
            boxShadow: "0 0 20px rgba(255, 0, 255, 0.3)",
            maxWidth: 600
          }}
        >
          <h2 style={{ color: "#ff00ff", marginBottom: 20 }}>Step 2 — Connect your Shopify store</h2>
          <p style={{ color: "#e0e0ff", marginBottom: 20 }}>
            Explain how to connect via app or API key.
          </p>
          <button
            onClick={() => setStep(3)}
            style={{
              padding: "12px 24px",
              background: "#ff00ff",
              color: "#000",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px #ff00ff"
            }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div
          style={{
            padding: 30,
            border: "2px solid #ffff00",
            borderRadius: 8,
            background: "#111",
            boxShadow: "0 0 20px rgba(255, 255, 0, 0.3)",
            maxWidth: 600
          }}
        >
          <h2 style={{ color: "#ffff00", marginBottom: 20 }}>Step 3 — Choose your plan</h2>
          <p style={{ color: "#e0e0ff", marginBottom: 20 }}>
            Show pricing tiers and link to /billing.
          </p>
          <Link
            href="/billing"
            style={{
              padding: "12px 24px",
              background: "#ffff00",
              color: "#000",
              textDecoration: "none",
              borderRadius: 4,
              fontWeight: "bold",
              display: "inline-block",
              boxShadow: "0 0 15px #ffff00"
            }}
          >
            Go to Billing
          </Link>
        </div>
      )}
    </div>
  );
}