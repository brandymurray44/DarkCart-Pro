"use client";

import { useState, useEffect } from "react";

export interface MetricAlert {
  id: string;
  metric: string;
  threshold: number;
  operator: "below" | "above";
  enabled: boolean;
  notifyEmail?: boolean;
  notifyUI?: boolean;
}

interface AlertConfig {
  revenue: { threshold: number; operator: "below" | "above" };
  orders: { threshold: number; operator: "below" | "above" };
  merchantStrength: { threshold: number; operator: "below" | "above" };
  opportunityScore: { threshold: number; operator: "below" | "above" };
}

const DEFAULT_ALERTS: AlertConfig = {
  revenue: { threshold: 1000, operator: "below" },
  orders: { threshold: 5, operator: "below" },
  merchantStrength: { threshold: 50, operator: "below" },
  opportunityScore: { threshold: 40, operator: "below" },
};

export function useAlertThresholds() {
  const [alerts, setAlerts] = useState<AlertConfig>(DEFAULT_ALERTS);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("alert-thresholds");
    if (saved) {
      try {
        setAlerts(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load alerts:", error);
      }
    }
  }, []);

  const updateAlert = (metric: keyof AlertConfig, config: (typeof DEFAULT_ALERTS)[keyof AlertConfig]) => {
    const updated = { ...alerts, [metric]: config };
    setAlerts(updated);
    localStorage.setItem("alert-thresholds", JSON.stringify(updated));
  };

  const checkMetrics = (data: {
    revenue?: number;
    orders?: number;
    merchantStrength?: number;
    opportunityScore?: number;
  }) => {
    const triggered: string[] = [];

    if (data.revenue !== undefined) {
      const config = alerts.revenue;
      if ((config.operator === "below" && data.revenue < config.threshold) ||
          (config.operator === "above" && data.revenue > config.threshold)) {
        triggered.push(`revenue`);
      }
    }

    if (data.orders !== undefined) {
      const config = alerts.orders;
      if ((config.operator === "below" && data.orders < config.threshold) ||
          (config.operator === "above" && data.orders > config.threshold)) {
        triggered.push(`orders`);
      }
    }

    if (data.merchantStrength !== undefined) {
      const config = alerts.merchantStrength;
      if ((config.operator === "below" && data.merchantStrength < config.threshold) ||
          (config.operator === "above" && data.merchantStrength > config.threshold)) {
        triggered.push(`merchantStrength`);
      }
    }

    if (data.opportunityScore !== undefined) {
      const config = alerts.opportunityScore;
      if ((config.operator === "below" && data.opportunityScore < config.threshold) ||
          (config.operator === "above" && data.opportunityScore > config.threshold)) {
        triggered.push(`opportunityScore`);
      }
    }

    setActiveAlerts(triggered);
    return triggered;
  };

  return { alerts, updateAlert, checkMetrics, activeAlerts };
}

interface AlertBannerProps {
  metric: string;
  value: number;
  threshold: number;
  operator: "below" | "above";
}

export function AlertBanner({ metric, value, threshold, operator }: AlertBannerProps) {
  const message = `⚠️ ${metric} is ${operator} threshold (${value} ${operator === "below" ? "<" : ">"} ${threshold})`;

  return (
    <div className="px-4 py-3 bg-amber-900/20 border border-amber-700 rounded-lg text-amber-300 text-sm">
      {message}
    </div>
  );
}

interface AlertConfiguratorProps {
  alerts: AlertConfig;
  onUpdate: (metric: keyof AlertConfig, config: (typeof DEFAULT_ALERTS)[keyof AlertConfig]) => void;
}

export function AlertConfigurator({ alerts, onUpdate }: AlertConfiguratorProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
      >
        🔔 Alerts ({Object.keys(alerts).length})
      </button>

      {show && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg z-50 min-w-80">
          <div className="space-y-4">
            {Object.entries(alerts).map(([metric, config]) => (
              <div key={metric} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 capitalize">
                  {metric.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="flex gap-2">
                  <select
                    value={config.operator}
                    onChange={(e) =>
                      onUpdate(metric as keyof AlertConfig, {
                        ...config,
                        operator: e.target.value as "below" | "above",
                      })
                    }
                    className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value="below">Below</option>
                    <option value="above">Above</option>
                  </select>
                  <input
                    type="number"
                    value={config.threshold}
                    onChange={(e) =>
                      onUpdate(metric as keyof AlertConfig, {
                        ...config,
                        threshold: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
