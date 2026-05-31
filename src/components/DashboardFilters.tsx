// Dashboard Filter Controls - Central location for all filtering options

"use client";

import React, { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { DateRange } from "@/types/dashboard";

const PRESET_RANGES = [
  { label: "Last 7 Days", days: 7, id: "7days" as const },
  { label: "Last 30 Days", days: 30, id: "30days" as const },
  { label: "Last 90 Days", days: 90, id: "90days" as const },
  { label: "Last Year", days: 365, id: "1year" as const },
];

export function DashboardFilters() {
  const { state, setFilters } = useDashboard();
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handlePresetSelect = (days: number, presetId: "7days" | "30days" | "90days" | "1year") => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setFilters({
      dateRange: {
        start,
        end,
        preset: presetId,
      },
    });
  };

  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    const date = new Date(value);
    const current = state.filters.dateRange;

    if (type === "start") {
      setFilters({
        dateRange: {
          start: date,
          end: current.end,
          preset: "custom",
        },
      });
    } else {
      setFilters({
        dateRange: {
          start: current.start,
          end: date,
          preset: "custom",
        },
      });
    }
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PRESET_RANGES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.days, preset.id)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                state.filters.dateRange.preset === preset.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustomRange(!showCustomRange)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              state.filters.dateRange.preset === "custom"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {showCustomRange && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formatDate(state.filters.dateRange.start)}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formatDate(state.filters.dateRange.end)}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      )}

      {state.lastUpdate && (
        <p className="text-xs text-gray-500">
          Last updated: {state.lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
