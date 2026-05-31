// Main Dashboard Container - Orchestrates all widgets, filters, and real-time updates

"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useRealtimeAnalytics } from "@/hooks/useRealtimeAnalytics";
import { DashboardFilters } from "@/components/DashboardFilters";
import { WidgetCustomizer } from "@/components/WidgetCustomizer";
import {
  OverviewMetricsWidget,
  TrendInsightsWidget,
  CompetitorInsightsWidget,
  OpportunitiesListWidget,
  ProductPerformanceWidget,
} from "@/components/Widgets";

const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "overview-metrics": OverviewMetricsWidget,
  "trend-insights": TrendInsightsWidget,
  "competitor-insights": CompetitorInsightsWidget,
  "opportunities-list": OpportunitiesListWidget,
  "product-performance": ProductPerformanceWidget,
};

export function DashboardContainer() {
  const { state, setError, updateTimestamp, setLoading, toggleWidget, resetLayout } = useDashboard();
  const { connected, data, lastUpdate } = useRealtimeAnalytics();
  const [refreshing, setRefreshing] = useState(false);

  // Handle real-time updates
  useEffect(() => {
    if (data) {
      console.log("[Dashboard] Real-time update received:", data);
      updateTimestamp();
    }
  }, [data, updateTimestamp]);

  // Handle global refresh
  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      // Refresh all widgets by re-fetching
      updateTimestamp();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh";
      setError(message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const visibleWidgets = state.layout.widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Real-time connected
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
              Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGlobalRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <WidgetCustomizer
            visibleWidgets={state.layout.widgets.filter(w => w.visible).map(w => w.id as any)}
            onToggle={(widgetId) => toggleWidget(widgetId)}
            onReset={resetLayout}
          />
        </div>
      </div>

      {/* Error state */}
      {state.error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-sm text-red-300">{state.error}</p>
        </div>
      )}

      {/* Filters */}
      <DashboardFilters />

      {/* Widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {visibleWidgets.map((widget) => {
          const Component = WIDGET_COMPONENTS[widget.id];

          if (!Component) {
            console.warn(`[Dashboard] Widget component not found: ${widget.id}`);
            return null;
          }

          return (
            <div key={widget.id} className={getGridSize(widget.size)}>
              <Component
                id={widget.id}
                filters={state.filters}
                isLoading={state.isLoading}
                onRefresh={updateTimestamp}
              />
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {visibleWidgets.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">
            No widgets are currently visible. Use the Customize button to show widgets.
          </p>
          <WidgetCustomizer
            visibleWidgets={state.layout.widgets.filter(w => w.visible).map(w => w.id as any)}
            onToggle={(widgetId) => toggleWidget(widgetId)}
            onReset={resetLayout}
          />
        </div>
      )}
    </div>
  );
}

function getGridSize(size?: string): string {
  switch (size) {
    case "small":
      return "col-span-1";
    case "large":
      return "col-span-1 lg:col-span-3";
    case "medium":
    default:
      return "col-span-1 lg:col-span-2";
  }
}
