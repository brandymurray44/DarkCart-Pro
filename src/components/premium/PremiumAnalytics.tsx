"use client";

import { Card, CardHeader, CardContent, Badge, StatusIndicator } from "@/components/ui";

interface PremiumAnalyticsProps {
  isBlackAccess?: boolean;
}

export function PremiumAnalytics({ isBlackAccess = false }: PremiumAnalyticsProps) {
  return (
    <Card variant={isBlackAccess ? "intelligence" : "default"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">PREMIUM ANALYTICS</h3>
          {isBlackAccess && (
            <Badge variant="intelligence">CLASSIFIED</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isBlackAccess ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-2xl font-bold text-purple-400">2.3M</div>
                <div className="text-xs text-slate-400">TOTAL IMPRESSIONS</div>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-2xl font-bold text-green-400">+34%</div>
                <div className="text-xs text-slate-400">GROWTH RATE</div>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-2xl font-bold text-white">847</div>
                <div className="text-xs text-slate-400">ACTIVE TRENDS</div>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-2xl font-bold text-red-400">12</div>
                <div className="text-xs text-slate-400">CRITICAL THREATS</div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">SYSTEM STATUS</h4>
                <StatusIndicator status="operational" size="sm" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trend Engine</span>
                  <span className="text-green-400">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Competitor Spy</span>
                  <span className="text-green-400">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Analysis</span>
                  <span className="text-yellow-400">Processing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Pipeline</span>
                  <span className="text-green-400">Operational</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-slate-400 mb-4">Premium analytics require Black Access</p>
            <Badge variant="default">UPGRADE REQUIRED</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
