"use client";

import { useState } from "react";

export type DashboardWidget = "performance" | "trends" | "competitors" | "opportunities" | "charts";

interface DashboardLayoutManager {
  visibleWidgets: DashboardWidget[];
  toggleWidget: (widget: DashboardWidget) => void;
  resetLayout: () => void;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  "performance",
  "trends",
  "competitors",
  "opportunities",
  "charts",
];

export function useDashboardLayout(): DashboardLayoutManager {
  const [visibleWidgets, setVisibleWidgets] = useState<DashboardWidget[]>(() => {
    if (typeof window === "undefined") return DEFAULT_WIDGETS;

    const saved = localStorage.getItem("dashboard-layout");
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  const toggleWidget = (widget: DashboardWidget) => {
    setVisibleWidgets((prev) => {
      const updated = prev.includes(widget)
        ? prev.filter((w) => w !== widget)
        : [...prev, widget];

      if (typeof window !== "undefined") {
        localStorage.setItem("dashboard-layout", JSON.stringify(updated));
      }

      return updated;
    });
  };

  const resetLayout = () => {
    setVisibleWidgets(DEFAULT_WIDGETS);
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard-layout", JSON.stringify(DEFAULT_WIDGETS));
    }
  };

  return { visibleWidgets, toggleWidget, resetLayout };
}

interface WidgetToggleProps {
  widget: DashboardWidget;
  label: string;
  isVisible: boolean;
  onToggle: (widget: DashboardWidget) => void;
}

export function WidgetToggle({ widget, label, isVisible, onToggle }: WidgetToggleProps) {
  return (
    <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-700/50 rounded">
      <input
        type="checkbox"
        checked={isVisible}
        onChange={() => onToggle(widget)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}

interface WidgetCustomizerProps {
  visibleWidgets: DashboardWidget[];
  onToggle: (widget: DashboardWidget) => void;
  onReset: () => void;
}

export function WidgetCustomizer({ visibleWidgets, onToggle, onReset }: WidgetCustomizerProps) {
  const [showMenu, setShowMenu] = useState(false);

  const widgets = [
    { id: "performance" as const, label: "Performance Metrics" },
    { id: "trends" as const, label: "Trend Intelligence" },
    { id: "competitors" as const, label: "Competitor Analysis" },
    { id: "opportunities" as const, label: "Top Opportunities" },
    { id: "charts" as const, label: "Data Visualizations" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
      >
        ⚙️ Customize
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg z-50 min-w-max">
          <div className="space-y-1 mb-3">
            {widgets.map((widget) => (
              <WidgetToggle
                key={widget.id}
                widget={widget.id}
                label={widget.label}
                isVisible={visibleWidgets.includes(widget.id)}
                onToggle={onToggle}
              />
            ))}
          </div>

          <button
            onClick={() => {
              onReset();
              setShowMenu(false);
            }}
            className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium border-t border-slate-600 pt-3 mt-3"
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
