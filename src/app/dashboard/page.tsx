"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { DashboardContainer } from "@/components/DashboardContainer";
import "@/lib/widgets/registerWidgets";

interface User {
  id: string;
  email: string;
  name: string | null;
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/login");
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load user");
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed");
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Welcome, {user?.name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
            >
              Shopify Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Container with modular widgets */}
        <DashboardContainer />

        {/* Quick Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Link
              href="/trends"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              <h3 className="font-semibold text-white mb-1">📊 Find Trends</h3>
              <p className="text-sm text-slate-300">Discover trending products from TikTok, Etsy & Reddit</p>
            </Link>
            <Link
              href="/editor"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              <h3 className="font-semibold text-white mb-1">✏️ Generate Content</h3>
              <p className="text-sm text-slate-300">Use AI to create product descriptions</p>
            </Link>
            <Link
              href="/analytics/opportunities"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              <h3 className="font-semibold text-white mb-1">🎯 View Opportunities</h3>
              <p className="text-sm text-slate-300">See all scoring & opportunity details</p>
            </Link>
            <Link
              href="/settings"
              className="block p-4 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition"
            >
              <h3 className="font-semibold text-white mb-1">🔗 Connect Shopify</h3>
              <p className="text-sm text-slate-300">Authorize your Shopify store and publish products directly.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
