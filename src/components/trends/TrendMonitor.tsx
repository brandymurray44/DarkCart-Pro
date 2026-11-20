"use client";

import { useEffect, useState } from "react";
import { StatusIndicator } from "@/components/ui";

interface TrendMonitorProps {
  shopId?: string;
}

interface TrendStatus {
  status: "operational" | "degraded" | "offline";
  lastUpdate: Date;
  activeTrends: number;
  classifiedTrends: number;
}

export function TrendMonitor({ shopId }: TrendMonitorProps) {
  const [status, setStatus] = useState<TrendStatus>({
    status: "operational",
    lastUpdate: new Date(),
    activeTrends: 0,
    classifiedTrends: 0,
  });

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        activeTrends: Math.floor(Math.random() * 50) + 10,
        classifiedTrends: Math.floor(Math.random() * 10) + 2,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [shopId]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">TREND MONITOR</h3>
        <StatusIndicator 
          status={status.status}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-2xl font-bold text-purple-400">
            {status.activeTrends}
          </div>
          <div className="text-xs text-slate-400">ACTIVE TRENDS</div>
        </div>

        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-2xl font-bold text-red-400">
            {status.classifiedTrends}
          </div>
          <div className="text-xs text-slate-400">CLASSIFIED</div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        LAST UPDATE: {status.lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}
