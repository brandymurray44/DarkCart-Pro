"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommandCenter, Header, MainContent } from "@/components/layout";
import { Button, Input, Badge, StatusIndicator, Card, CardHeader, CardContent } from "@/components/ui";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Shop {
  id: string;
  shopifyDomain: string;
  createdAt: string;
}

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
      <CommandCenter>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-300">INITIALIZING...</div>
        </div>
      </CommandCenter>
    );
  }

  return (
    <CommandCenter>
      <Header>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
            ← COMMAND CENTER
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-wider">
            OPERATOR CONFIGURATION
          </h1>
        </div>
      </Header>

      <MainContent>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Operator Profile */}
          <Card variant="intelligence">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white tracking-wider">OPERATOR PROFILE</h3>
                <StatusIndicator status="operational" size="sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">IDENTIFIER</p>
                  <p className="text-lg text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">CODENAME</p>
                  <p className="text-lg text-white">{user?.name || "UNASSIGNED"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Model Selection */}
          <Card variant="default">
            <CardHeader>
              <h3 className="text-xl font-bold text-white tracking-wider">AI MODEL CONFIGURATION</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">AI PROVIDER</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                    defaultValue="openai"
                  >
                    <option value="openai">OpenAI (Cloud)</option>
                    <option value="lmstudio">LM Studio (Local Qwen)</option>
                    <option value="anthropic">Anthropic (Cloud)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">MODEL</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                    defaultValue="gpt-4"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="qwen2.5-7b-instruct">Qwen 2.5 7B (Local)</option>
                    <option value="qwen2.5-14b-instruct">Qwen 2.5 14B (Local)</option>
                  </select>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-xs text-slate-400">
                    <strong className="text-white">Local Mode:</strong> Ensure LM Studio is running on port 1234 with the selected Qwen model loaded.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card variant="default">
            <CardHeader>
              <h3 className="text-xl font-bold text-white tracking-wider">API KEYS</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">OPENAI API KEY</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                    defaultValue=""
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">ANTHROPIC API KEY</label>
                  <input
                    type="password"
                    placeholder="sk-ant-..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                    defaultValue=""
                  />
                </div>
                <Button variant="secondary" className="w-full">
                  SAVE API KEYS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shopify Integration */}
          <Card variant={shop ? "intelligence" : "default"}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white tracking-wider">SHOPIFY INTEGRATION</h3>
                {shop && (
                  <Badge variant="intelligence">CONNECTED</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {shop ? (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIndicator status="operational" size="sm" />
                      <p className="text-sm text-purple-300">ACTIVE CONNECTION</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{shop.shopifyDomain}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      ESTABLISHED: {new Date(shop.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="danger" 
                    className="w-full"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                  >
                    {disconnecting ? "TERMINATING CONNECTION..." : "TERMINATE CONNECTION"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleConnectShop} className="space-y-4">
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  <Input
                    label="SHOPIFY STORE DOMAIN"
                    value={shopDomain}
                    onChange={(e) => setShopDomain(e.target.value)}
                    placeholder="e.g., mystore or mystore.myshopify.com"
                    error={error ? undefined : undefined}
                  />
                  <p className="text-xs text-slate-400">
                    Enter your Shopify store domain (with or without .myshopify.com)
                  </p>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    type="submit"
                    disabled={connecting}
                  >
                    {connecting ? "ESTABLISHING CONNECTION..." : "ESTABLISH CONNECTION"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </CommandCenter>
  );
}
