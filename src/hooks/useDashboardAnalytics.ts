"use client";

import { useMemo } from "react";
import { useFetch } from "./useFetch";
import { DashboardFilters } from "@/types/dashboard";
import type {
  AnalyticsOverview,
  Opportunity,
  ProductAnalytics,
} from "@/types/analytics";

export type { AnalyticsOverview, Opportunity, ProductAnalytics };

interface UseAnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function buildFilterParams(filters?: DashboardFilters, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (filters?.dateRange) {
    params.append("startDate", filters.dateRange.start.toISOString());
    params.append("endDate", filters.dateRange.end.toISOString());
  }
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => params.append(k, v));
  }
  return params.toString();
}

export function useAnalyticsOverview(filters?: DashboardFilters): UseAnalyticsState<AnalyticsOverview> {
  const qs = useMemo(() => buildFilterParams(filters), [filters]);
  return useFetch<AnalyticsOverview>(`/api/analytics/overview?${qs}`, [qs]);
}

export function useAnalyticsOpportunities(
  filters?: DashboardFilters,
  limit: number = 10
): UseAnalyticsState<Opportunity[]> {
  const qs = useMemo(
    () => buildFilterParams(filters, { limit: Math.min(limit, 50).toString() }),
    [filters, limit]
  );
  const result = useFetch<Opportunity[]>(`/api/analytics/opportunities?${qs}`, [qs], []);
  return { ...result, data: result.data ?? [] };
}

export function useAnalyticsProducts(filters?: DashboardFilters): UseAnalyticsState<ProductAnalytics[]> {
  const qs = useMemo(() => buildFilterParams(filters), [filters]);
  const result = useFetch<ProductAnalytics[]>(`/api/analytics/products?${qs}`, [qs], []);
  return { ...result, data: result.data ?? [] };
}
