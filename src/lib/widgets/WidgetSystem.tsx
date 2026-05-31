// Widget base types and registry system

import { ReactNode } from "react";
import { DashboardFilters, WidgetId } from "@/types/dashboard";

export interface WidgetProps {
  id: WidgetId;
  filters: DashboardFilters;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export interface WidgetComponent {
  id: WidgetId;
  Component: React.ComponentType<WidgetProps>;
  title: string;
  description: string;
  defaultSize?: "small" | "medium" | "large";
  refreshInterval?: number;
}

/**
 * Widget registry - centralized component storage
 * Allows dynamic widget loading and composition
 */
class WidgetRegistry {
  private widgets: Map<WidgetId, WidgetComponent> = new Map();

  register(widget: WidgetComponent): void {
    this.widgets.set(widget.id, widget);
  }

  get(id: WidgetId): WidgetComponent | undefined {
    return this.widgets.get(id);
  }

  getAll(): WidgetComponent[] {
    return Array.from(this.widgets.values());
  }

  has(id: WidgetId): boolean {
    return this.widgets.has(id);
  }
}

export const widgetRegistry = new WidgetRegistry();

// Register all widgets
// Note: This should be called during app initialization
export function registerWidgets() {
  // Widgets will be registered when their components are imported
  // This is a placeholder for explicit registration if needed
}

/**
 * Error boundary for individual widgets
 */
export function WidgetErrorBoundary({
  widgetId,
  children,
  onError,
}: {
  widgetId: WidgetId;
  children: ReactNode;
  onError?: (error: Error) => void;
}) {
  try {
    return <>{children}</>;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    console.error(`[Widget ${widgetId}]`, err);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-red-800">Widget Error</h3>
        <p className="text-xs text-red-600 mt-1">
          {err.message || "An error occurred in this widget"}
        </p>
      </div>
    );
  }
}

/**
 * Widget skeleton loader
 */
export function WidgetSkeleton() {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
        <div className="h-3 bg-slate-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

/**
 * Widget wrapper with loading/error states
 */
export interface WidgetContainerProps {
  title: string;
  size?: "small" | "medium" | "large";
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  children?: ReactNode;
}

export function WidgetContainer({
  title,
  size = "medium",
  loading,
  error,
  onRefresh,
  children,
}: WidgetContainerProps) {
  const sizeClass = {
    small: "col-span-1",
    medium: "col-span-1 lg:col-span-2",
    large: "col-span-1 lg:col-span-3",
  }[size];

  return (
    <div className={`${sizeClass} bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1 hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh widget"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-4">
        {loading && <WidgetSkeleton />}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        {!loading && !error && children}
      </div>
    </div>
  );
}
