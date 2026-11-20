import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StoreScanner - Micro-Tools",
  description: "AI-powered Shopify store scanner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f" }}>
        {children}
      </body>
    </html>
  );
}