"use client";

import { useFetch } from "./useFetch";
import type {
  AnalyticsOverview,
  Opportunity,
  ProductAnalytics,
} from "@/types/analytics";

export type { AnalyticsOverview, Opportunity, ProductAnalytics };

interface UseAnalyticsState {
  data: AnalyticsOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalyticsOverview(): UseAnalyticsState {
  return useFetch<AnalyticsOverview>("/api/analytics/overview");
}

interface UseOpportunitiesState {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(limit: number = 10): UseOpportunitiesState {
  const { data, loading, error, refetch } = useFetch<Opportunity[]>(
    `/api/analytics/opportunities?limit=${limit}`,
    [limit],
    []
  );

  return { opportunities: data ?? [], loading, error, refetch };
}

interface UseProductAnalyticsState {
  products: ProductAnalytics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProductAnalytics(): UseProductAnalyticsState {
  const { data, loading, error, refetch } = useFetch<ProductAnalytics[]>(
    "/api/analytics/products",
    [],
    []
  );

  return { products: data ?? [], loading, error, refetch };
}
