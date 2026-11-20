"use client";

import { useEffect, useState } from "react";
import { StatusIndicator, Badge } from "@/components/ui";

interface CompetitorMonitorProps {
  userId?: string;
}

interface MonitorStatus {
  status: "operational" | "degraded" | "offline";
  activeTargets: number;
  criticalThreats: number;
  lastScan: Date;
  scanning: boolean;
}

export function CompetitorMonitor({ userId }: CompetitorMonitorProps) {
  const [status, setStatus] = useState<MonitorStatus>({
    status: "operational",
    activeTargets: 0,
    criticalThreats: 0,
    lastScan: new Date(),
    scanning: false,
  });

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastScan: new Date(),
        activeTargets: Math.floor(Math.random() * 15) + 5,
        criticalThreats: Math.floor(Math.random() * 3),
        scanning: Math.random() > 0.7,
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">COMPETITOR MONITOR</h3>
        <div className="flex items-center gap-2">
          {status.scanning && (
            <Badge variant="intelligence" pulse>
              SCANNING
            </Badge>
          )}
          <StatusIndicator 
            status={status.status}
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-2xl font-bold text-purple-400">
            {status.activeTargets}
          </div>
          <div className="text-xs text-slate-400">ACTIVE TARGETS</div>
        </div>

        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-2xl font-bold text-red-400">
            {status.criticalThreats}
          </div>
          <div className="text-xs text-slate-400">CRITICAL THREATS</div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        LAST SCAN: {status.lastScan.toLocaleTimeString()}
      </div>
    </div>
  );
}
