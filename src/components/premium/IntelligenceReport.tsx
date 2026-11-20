"use client";

import { Card, CardHeader, CardContent, Badge, ProgressBar } from "@/components/ui";

interface IntelligenceReportProps {
  isBlackAccess?: boolean;
}

export function IntelligenceReport({ isBlackAccess = false }: IntelligenceReportProps) {
  return (
    <Card variant={isBlackAccess ? "intelligence" : "default"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">INTELLIGENCE REPORT</h3>
          {isBlackAccess && (
            <Badge variant="intelligence" pulse>
              TOP-SECRET
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isBlackAccess ? (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded p-4">
              <h4 className="text-purple-300 font-semibold mb-2">CLASSIFIED MARKET INTELLIGENCE</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Emerging Trends</span>
                    <span className="text-purple-300">87%</span>
                  </div>
                  <ProgressBar value={87} variant="intelligence" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Competitor Threat Level</span>
                    <span className="text-red-300">HIGH</span>
                  </div>
                  <ProgressBar value={72} variant="classified" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Market Opportunity</span>
                    <span className="text-green-300">94%</span>
                  </div>
                  <ProgressBar value={94} variant="default" />
                </div>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
              <h4 className="text-purple-300 font-semibold mb-2">EXCLUSIVE INSIGHTS</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>3 classified trends identified in your niche</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>2 competitors showing critical threat patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>Market velocity increasing by 23%</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-slate-400 mb-4">Classified intelligence requires Black Access</p>
            <Badge variant="classified">RESTRICTED</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
