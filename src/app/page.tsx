"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    const authParam = params.get("auth_required");

    if (shop && !user) {
      router.push(`/api/shopify/auth?shop=${encodeURIComponent(shop)}`);
    } else if (authParam && !user) {
      setAuthRequired(true);
    }
  }, [user, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </main>
    );
  }

  if (user) {
    // Redirect authenticated users to dashboard
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white">DarkCart-Pro</h1>
          <p className="text-2xl text-slate-300">
            AI-powered Shopify intelligence and growth engine
          </p>
        </div>

        <p className="text-lg text-slate-400 leading-relaxed">
          Discover trending products, generate high-converting content, and publish directly to Shopify—all powered by AI.
        </p>

        {authRequired && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded">
            Please install this app from the Shopify App Store to get started.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
          >
            Install from Shopify
          </Link>
          <Link
            href="/api/ping"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            API Status
          </Link>
        </div>
      </div>
    </main>
  );
}
