"use client";

import { Card, CardHeader, CardContent, Badge, StatusIndicator, ProgressBar } from "@/components/ui";

export function TacticalDashboard() {
  return (
    <div className="space-y-4">
      <Card variant="intelligence">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white tracking-wider">OPERATIONAL STATUS</h3>
            <StatusIndicator status="operational" size="sm" label="SYSTEM ONLINE" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
              <div className="text-2xl font-bold text-purple-400">98.7%</div>
              <div className="text-xs text-slate-400">SYSTEM UPTIME</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
              <div className="text-2xl font-bold text-green-400">1.2M</div>
              <div className="text-xs text-slate-400">DATA POINTS</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
              <div className="text-2xl font-bold text-white">847</div>
              <div className="text-xs text-slate-400">ACTIVE TRENDS</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
              <div className="text-2xl font-bold text-red-400">3</div>
              <div className="text-xs text-slate-400">CRITICAL ALERTS</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="default">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white tracking-wider">INTELLIGENCE METRICS</h3>
            <Badge variant="intelligence">LIVE</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <ProgressBar 
                value={87}
                max={100}
                variant="intelligence"
                showLabel
                label="TREND COVERAGE"
              />
            </div>
            <div>
              <ProgressBar 
                value={72}
                max={100}
                variant="classified"
                showLabel
                label="COMPETITOR ANALYSIS"
              />
            </div>
            <div>
              <ProgressBar 
                value={94}
                max={100}
                variant="default"
                showLabel
                label="DATA ACCURACY"
              />
            </div>
            <div>
              <ProgressBar 
                value={65}
                max={100}
                variant="default"
                showLabel
                label="PREDICTION CONFIDENCE"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
