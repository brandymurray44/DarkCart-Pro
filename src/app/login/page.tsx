"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Shopify OAuth authentication
    const shopParam = new URLSearchParams(window.location.search).get("shop");
    if (shopParam) {
      router.push(`/api/shopify/auth?shop=${encodeURIComponent(shopParam)}`);
    } else {
      // If no shop parameter, redirect to home page with instructions
      router.push("/?auth_required=true");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-slate-300">Redirecting to Shopify authentication...</p>
      </div>
    </main>
  );
}
