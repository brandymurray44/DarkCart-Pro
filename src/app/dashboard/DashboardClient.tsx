"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContainer } from "@/components/DashboardContainer";
import { CommandCenter, Header, MainContent } from "@/components/layout";
import { Button, Badge, StatusIndicator, Card, CardContent } from "@/components/ui";
import { TrendMonitor } from "@/components/trends";
import { CompetitorMonitor } from "@/components/competitors";
import type { AuthUser } from "@/lib/authServer";
import "@/lib/widgets/registerWidgets";

export default function DashboardClient({ user }: { user: AuthUser }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed");
    }
  }

  return (
    <CommandCenter>
      <Header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-wider">
              DARKCART-PRO
              <span className="text-purple-500 ml-2">COMMAND CENTER</span>
            </h1>
            <p className="text-slate-400 text-sm">
              OPERATOR: {user.name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator status="operational" label="SYSTEM" size="sm" />
            <Link href="/settings">
              <Button variant="secondary" size="sm">
                SHOPIFY CONFIG
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              TERMINATE SESSION
            </Button>
          </div>
        </div>
      </Header>

      <MainContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card variant="default">
            <CardContent>
              <p className="text-sm text-slate-400 mb-1">TOTAL PRODUCTS</p>
              <p className="text-3xl font-bold text-white">--</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <p className="text-sm text-slate-400 mb-1">COMPETITORS TRACKED</p>
              <p className="text-3xl font-bold text-white">--</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <p className="text-sm text-slate-400 mb-1">TRENDS ANALYZED</p>
              <p className="text-3xl font-bold text-white">--</p>
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Monitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TrendMonitor />
          <CompetitorMonitor userId={user.id} />
        </div>

        {/* Dashboard Container with modular widgets */}
        <DashboardContainer />

        {/* Tactical Quick Actions */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4 tracking-wider">
            TACTICAL OPERATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Link
              href="/product-creation/generate"
              className="block p-4 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="default">AI</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                GENERATE PRODUCT
              </h3>
              <p className="text-sm text-slate-400">Create AI-powered product listings</p>
            </Link>
            <Link
              href="/competitors"
              className="block p-4 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="intelligence">INTEL</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                ANALYZE COMPETITOR
              </h3>
              <p className="text-sm text-slate-400">Spy on competitor stores and products</p>
            </Link>
            <Link
              href="/trends"
              className="block p-4 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="intelligence">TRENDS</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                TREND ENGINE
              </h3>
              <p className="text-sm text-slate-400">Discover trending products and niches</p>
            </Link>
            <Link
              href="/tools/scan"
              className="block p-4 bg-slate-800/50 border border-cyan-500/50 hover:border-cyan-400/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="default" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">SCAN</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                STORE SCANNER
              </h3>
              <p className="text-sm text-slate-400">Scan any Shopify store and get AI-powered insights</p>
            </Link>
            <Link
              href="/onboarding"
              className="block p-4 bg-slate-800/50 border border-yellow-500/50 hover:border-yellow-400/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="intelligence" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">SETUP</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                FINISH ONBOARDING
              </h3>
              <p className="text-sm text-slate-400">Complete your account setup and configuration</p>
            </Link>
            <Link
              href="/settings"
              className="block p-4 bg-purple-900/20 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="intelligence">CONFIG</Badge>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                SETTINGS
              </h3>
              <p className="text-sm text-slate-400">AI models, API keys, and store config</p>
            </Link>
          </div>
        </div>
      </MainContent>
    </CommandCenter>
  );
}
