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
