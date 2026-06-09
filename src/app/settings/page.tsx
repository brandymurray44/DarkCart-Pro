"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
}

interface Shop {
  id: string;
  shopifyDomain: string;
  createdAt: string;
}

const PLANS = [
  { tier: "FREE", label: "Free", price: "$0/mo", features: ["5 trends/day", "1 competitor", "Basic AI"] },
  { tier: "STARTER", label: "Starter", price: "$29/mo", features: ["50 trends/day", "5 competitors", "Standard AI", "Basic analytics"] },
  { tier: "PRO", label: "Pro", price: "$79/mo", features: ["Unlimited trends", "25 competitors", "Advanced AI", "Full analytics", "Priority support"] },
  { tier: "BLACK", label: "Black-Access", price: "$199/mo", features: ["Everything in Pro", "Unlimited competitors", "Premium AI", "White-label reports", "API access", "Priority support"] },
];

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user);

        if (data.user) {
          // Load user's shop
          const shopResponse = await fetch(`/api/shopify/shop`);
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

  async function handleDisconnect() {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect your Shopify store? This will also remove all associated products and trend data."
    );
    if (!confirmed) return;

    setDisconnecting(true);
    setError("");

    try {
      const response = await fetch("/api/shopify/disconnect", {
        method: "DELETE",
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to disconnect store");
      }

      setShop(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect store");
    } finally {
      setDisconnecting(false);
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

        {/* Plan & Billing Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Plan & Billing</h2>
          {user?.tier && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md ${
                  user.tier === "BLACK"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : user.tier === "PRO"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : user.tier === "STARTER"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}>
                  {user.tier === "BLACK" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {user.tier === "BLACK" ? "Black-Access" : user.tier + " Tier"}
                </span>
                {user.subscriptionStatus && (
                  <span className="text-sm text-slate-400 capitalize">{user.subscriptionStatus}</span>
                )}
              </div>
              <p className="text-sm text-slate-400">
                {user.subscriptionPlan
                  ? `Current plan: ${user.subscriptionPlan}`
                  : "You are on the free tier. Upgrade to unlock premium features."}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`p-4 rounded-lg border ${
                  user?.tier === plan.tier
                    ? "bg-indigo-900/20 border-indigo-500"
                    : "bg-slate-700/50 border-slate-600"
                }`}
              >
                <p className="text-sm font-bold text-white mb-1">{plan.label}</p>
                <p className="text-lg font-bold text-indigo-400 mb-3">{plan.price}</p>
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-slate-400">• {f}</li>
                  ))}
                </ul>
                {user?.tier !== plan.tier && (
                  <button
                    onClick={() => {
                      const target = `/api/shopify/billing?plan=${plan.tier}`;
                      fetch(target)
                        .then((r) => r.json())
                        .then((data) => {
                          if (data.url) window.location.href = data.url;
                          else if (data.message) alert(data.message);
                        })
                        .catch(() => alert("Failed to process upgrade."));
                    }}
                    className="mt-3 block w-full text-center px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            ))}
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
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg font-medium transition"
              >
                {disconnecting ? "Disconnecting..." : "Disconnect Store"}
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
