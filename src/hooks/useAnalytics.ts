import { useEffect, useState, useCallback } from "react";

interface AnalyticsOverview {
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

interface UseAnalyticsState {
  data: AnalyticsOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalyticsOverview(): UseAnalyticsState {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics/overview");
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("[useAnalyticsOverview] Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
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

interface UseOpportunitiesState {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(limit: number = 10): UseOpportunitiesState {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/opportunities?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
      }
      const json = await response.json();
      setOpportunities(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("[useOpportunities] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { opportunities, loading, error, refetch: fetchData };
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

interface UseProductAnalyticsState {
  products: ProductAnalytics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProductAnalytics(): UseProductAnalyticsState {
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics/products");
      if (!response.ok) {
        throw new Error(`Failed to fetch product analytics: ${response.statusText}`);
      }
      const json = await response.json();
      setProducts(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("[useProductAnalytics] Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, loading, error, refetch: fetchData };
}
