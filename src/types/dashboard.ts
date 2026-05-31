// Dashboard state & filter types

export interface DateRange {
  start: Date;
  end: Date;
  preset?: "7days" | "30days" | "90days" | "1year" | "custom";
}

export interface DashboardFilters {
  dateRange: DateRange;
  shopId?: string;
  segmentFilters?: Record<string, string | string[]>;
}

export type WidgetId =
  | "overview-metrics"
  | "trend-insights"
  | "competitor-insights"
  | "opportunities-list"
  | "product-performance";

export interface DashboardWidget {
  id: WidgetId;
  title: string;
  description: string;
  visible: boolean;
  order: number;
  size?: "small" | "medium" | "large";
  refreshInterval?: number; // ms, 0 = manual only
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  gridColumns?: number; // responsive grid columns
}

export interface DashboardState {
  filters: DashboardFilters;
  layout: DashboardLayout;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: "overview-metrics",
    title: "Performance Overview",
    description: "Key metrics for the selected period",
    visible: true,
    order: 1,
    size: "large",
    refreshInterval: 60000,
  },
  {
    id: "trend-insights",
    title: "Trend Insights",
    description: "Current trends and momentum",
    visible: true,
    order: 2,
    size: "medium",
    refreshInterval: 60000,
  },
  {
    id: "competitor-insights",
    title: "Competitor Analysis",
    description: "Your position vs competitors",
    visible: true,
    order: 3,
    size: "medium",
    refreshInterval: 120000,
  },
  {
    id: "opportunities-list",
    title: "Top Opportunities",
    description: "High-value opportunities ranked",
    visible: true,
    order: 4,
    size: "large",
    refreshInterval: 60000,
  },
  {
    id: "product-performance",
    title: "Product Performance",
    description: "Top performing products",
    visible: true,
    order: 5,
    size: "large",
    refreshInterval: 120000,
  },
];

export const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: {
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    preset: "30days",
  },
};
