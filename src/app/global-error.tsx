"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
              500
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
              Something went wrong
            </p>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "2rem" }}>
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
