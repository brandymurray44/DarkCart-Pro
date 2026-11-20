// Enhanced data fetching hooks with typing and filter support

import { useEffect, useState, useCallback } from "react";
import { DashboardFilters } from "@/types/dashboard";

export interface AnalyticsOverview {
  shop: {
    domain: string;
    name: string;
  };
  performance: {
    revenue30Days: number;
    orders30Days: number;
    salesVelocity: number;
    avgOrderValue: number;
    merchantStrength: number;
  };
  trends: {
    topTrends: number;
    trendVelocity: number;
    averageTrendScore: number;
  };
  competitors: {
    count: number;
    avgScore: number;
  };
  overlap: {
    trendCoverage: number;
    opportunityScore: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  trendScore: number;
  competitorWeakness: number;
  merchantReadiness: number;
  opportunityScore: number;
  reason: string;
}

export interface ProductAnalytics {
  id: string;
  title: string;
  price: number;
  published: boolean;
  trendAlignment: number;
  competitorComparison: {
    priceCompetitiveness: number;
    reviewCompetitiveness: number;
  };
}

interface UseAnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch analytics overview with support for filter changes
 */
export function useAnalyticsOverview(filters?: DashboardFilters): UseAnalyticsState<AnalyticsOverview> {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.dateRange) {
        params.append("startDate", filters.dateRange.start.toISOString());
        params.append("endDate", filters.dateRange.end.toISOString());
      }

      const response = await fetch(`/api/analytics/overview?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("[useAnalyticsOverview]", message);
    } finally {
      setLoading(false);
    }
  }, [filters?.dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch opportunities with support for pagination and filters
 */
export function useAnalyticsOpportunities(
  filters?: DashboardFilters,
  limit: number = 10
): UseAnalyticsState<Opportunity[]> {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("limit", Math.min(limit, 50).toString());

      if (filters?.dateRange) {
        params.append("startDate", filters.dateRange.start.toISOString());
        params.append("endDate", filters.dateRange.end.toISOString());
      }

      const response = await fetch(`/api/analytics/opportunities?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("[useAnalyticsOpportunities]", message);
    } finally {
      setLoading(false);
    }
  }, [limit, filters?.dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch product analytics with support for filters
 */
export function useAnalyticsProducts(filters?: DashboardFilters): UseAnalyticsState<ProductAnalytics[]> {
  const [data, setData] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filters?.dateRange) {
        params.append("startDate", filters.dateRange.start.toISOString());
        params.append("endDate", filters.dateRange.end.toISOString());
      }

      const response = await fetch(`/api/analytics/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("[useAnalyticsProducts]", message);
    } finally {
      setLoading(false);
    }
  }, [filters?.dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
