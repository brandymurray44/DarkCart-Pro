"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Shop {
  id: string;
  shopifyDomain: string;
  accessToken: string;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user);

        if (data.user) {
          // Load user's shop
          const shopResponse = await fetch(`/api/shopify/shop?userId=${data.user.id}`);
          if (shopResponse.ok) {
            const shopData = await shopResponse.json();
            setShop(shopData.data);
          }
        }
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleConnectShop(e: React.FormEvent) {
    e.preventDefault();
    setConnecting(true);
    setError("");

    try {
      if (!shopDomain.trim()) {
        throw new Error("Please enter your Shopify domain");
      }

      // Normalize domain
      let normalizedDomain = shopDomain.trim().toLowerCase();
      if (!normalizedDomain.includes(".")) {
        normalizedDomain = `${normalizedDomain}.myshopify.com`;
      }

      // Redirect to Shopify OAuth
      window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(normalizedDomain)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setConnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and integrations</p>
        </div>

        {/* Account Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Email</p>
              <p className="text-lg text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Name</p>
              <p className="text-lg text-white">{user?.name || "-"}</p>
            </div>
          </div>
        </div>

        {/* Shopify Integration Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Shopify Integration</h2>

          {shop ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <p className="text-sm text-green-300 mb-1">Connected Store</p>
                <p className="text-lg font-semibold text-white">{shop.shopifyDomain}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Connected on {new Date(shop.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShop(null)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
              >
                Disconnect Store
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnectShop} className="space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-700/50 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Shopify Store Domain
                </label>
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="e.g., mystore or mystore.myshopify.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Enter your Shopify store domain (with or without .myshopify.com)
                </p>
              </div>
              <button
                type="submit"
                disabled={connecting}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg font-medium transition"
              >
                {connecting ? "Connecting..." : "Connect Shopify Store"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
