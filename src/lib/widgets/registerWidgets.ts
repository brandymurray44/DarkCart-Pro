// Widget registration - registers all dashboard widgets with the registry

import { widgetRegistry } from "./WidgetSystem";
import OverviewMetricsWidget from "@/components/Widgets/OverviewMetricsWidget";
import TrendInsightsWidget from "@/components/Widgets/TrendInsightsWidget";
import CompetitorInsightsWidget from "@/components/Widgets/CompetitorInsightsWidget";
import OpportunitiesListWidget from "@/components/Widgets/OpportunitiesListWidget";
import ProductPerformanceWidget from "@/components/Widgets/ProductPerformanceWidget";

export function registerDashboardWidgets() {
  // Register Overview Metrics Widget
  widgetRegistry.register({
    id: "overview-metrics",
    Component: OverviewMetricsWidget,
    title: "Performance Overview",
    description: "Key metrics for the selected period",
    defaultSize: "large",
    refreshInterval: 60000,
  });

  // Register Trend Insights Widget
  widgetRegistry.register({
    id: "trend-insights",
    Component: TrendInsightsWidget,
    title: "Trend Insights",
    description: "Current trends and momentum",
    defaultSize: "medium",
    refreshInterval: 60000,
  });

  // Register Competitor Insights Widget
  widgetRegistry.register({
    id: "competitor-insights",
    Component: CompetitorInsightsWidget,
    title: "Competitor Analysis",
    description: "Your position vs competitors",
    defaultSize: "medium",
    refreshInterval: 120000,
  });

  // Register Opportunities List Widget
  widgetRegistry.register({
    id: "opportunities-list",
    Component: OpportunitiesListWidget,
    title: "Top Opportunities",
    description: "High-value opportunities ranked",
    defaultSize: "large",
    refreshInterval: 60000,
  });

  // Register Product Performance Widget
  widgetRegistry.register({
    id: "product-performance",
    Component: ProductPerformanceWidget,
    title: "Product Performance",
    description: "Top performing products",
    defaultSize: "large",
    refreshInterval: 120000,
  });
}

// Auto-register on import
registerDashboardWidgets();
