export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "strategy" | "content" | "pricing" | "targeting" | "operations";
  priority: "critical" | "high" | "medium" | "low";
  expectedImpact: number; // 1-100
  implementationEffort: number; // 1-5
  estimatedROI: number; // percentage
  actions: ActionItem[];
  timeframe: "immediate" | "week" | "month" | "quarter";
}

export interface ActionItem {
  step: string;
  description: string;
  responsible: string;
}

export type RecommendationCategory = Recommendation["category"];

export function generateRecommendations(analytics: {
  merchantStrength: number;
  opportunityScore: number;
  trendVelocity: number;
  competitorAvgScore: number;
  revenue30Days: number;
  orders30Days: number;
  avgOrderValue: number;
}): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Strategy recommendations based on merchant strength
  if (analytics.merchantStrength < 40) {
    recommendations.push({
      id: "strength-improvement",
      title: "Improve Store Fundamentals",
      description:
        "Your merchant strength score is below 40. Focus on core store metrics: product quality, pricing, and customer service.",
      category: "strategy",
      priority: "critical",
      expectedImpact: 35,
      implementationEffort: 4,
      estimatedROI: 45,
      timeframe: "month",
      actions: [
        { step: "Audit current products", description: "Review all products for quality and relevance", responsible: "Product Team" },
        { step: "Optimize pricing", description: "Analyze competitor pricing and adjust accordingly", responsible: "Pricing Team" },
        {
          step: "Improve descriptions",
          description: "Enhance product descriptions with better keywords and benefits",
          responsible: "Content Team",
        },
      ],
    });
  }

  // Opportunity maximization
  if (analytics.opportunityScore > 60) {
    recommendations.push({
      id: "opportunity-capture",
      title: "Capitalize on Market Opportunities",
      description:
        "High opportunity score detected. Allocate more resources to trending products and marketing.",
      category: "strategy",
      priority: "high",
      expectedImpact: 28,
      implementationEffort: 2,
      estimatedROI: 62,
      timeframe: "week",
      actions: [
        {
          step: "Increase marketing spend",
          description: "Allocate additional budget to highest-opportunity products",
          responsible: "Marketing",
        },
        { step: "Expand product range", description: "Add complementary trending products", responsible: "Product" },
        {
          step: "Optimize content",
          description: "Create targeted content for opportunity products",
          responsible: "Content",
        },
      ],
    });
  }

  // Pricing strategy
  if (analytics.avgOrderValue < 50) {
    recommendations.push({
      id: "aov-optimization",
      title: "Increase Average Order Value",
      description:
        "Your AOV is below $50. Implement strategies to encourage larger purchases.",
      category: "pricing",
      priority: "high",
      expectedImpact: 22,
      implementationEffort: 2,
      estimatedROI: 38,
      timeframe: "week",
      actions: [
        { step: "Create bundles", description: "Group complementary products with discounts", responsible: "Product" },
        {
          step: "Upsell strategy",
          description: "Implement product recommendations at checkout",
          responsible: "Engineering",
        },
        { step: "Free shipping threshold", description: "Set threshold slightly above current AOV", responsible: "Operations" },
      ],
    });
  }

  // Competitive positioning
  if (analytics.competitorAvgScore > analytics.merchantStrength + 20) {
    recommendations.push({
      id: "competitive-gap",
      title: "Close Competitive Gap",
      description:
        "Competitors are outperforming you by a significant margin. Focus on differentiation.",
      category: "strategy",
      priority: "high",
      expectedImpact: 30,
      implementationEffort: 5,
      estimatedROI: 55,
      timeframe: "quarter",
      actions: [
        {
          step: "Competitor analysis",
          description: "Deep dive analysis of top competitor strengths",
          responsible: "Strategy",
        },
        {
          step: "Differentiation strategy",
          description: "Identify unique value propositions",
          responsible: "Product",
        },
        {
          step: "Marketing repositioning",
          description: "Rebrand and reposition in market",
          responsible: "Marketing",
        },
      ],
    });
  }

  // Content strategy
  if (analytics.trendVelocity > 0.3) {
    recommendations.push({
      id: "content-acceleration",
      title: "Accelerate Content Creation",
      description:
        "High trend velocity suggests strong market momentum. Increase content production.",
      category: "content",
      priority: "high",
      expectedImpact: 25,
      implementationEffort: 3,
      estimatedROI: 48,
      timeframe: "week",
      actions: [
        { step: "Scale content team", description: "Increase content creation resources", responsible: "HR" },
        {
          step: "Create trend-focused content",
          description: "Produce content around trending topics",
          responsible: "Content",
        },
        { step: "Distribute strategically", description: "Use multiple channels for distribution", responsible: "Marketing" },
      ],
    });
  }

  // Revenue optimization
  if (analytics.orders30Days < 50) {
    recommendations.push({
      id: "conversion-optimization",
      title: "Improve Conversion Rate",
      description:
        "Low order volume suggests conversion issues. Optimize your funnel.",
      category: "targeting",
      priority: "high",
      expectedImpact: 32,
      implementationEffort: 3,
      estimatedROI: 55,
      timeframe: "week",
      actions: [
        { step: "Audit checkout flow", description: "Test and optimize checkout process", responsible: "Engineering" },
        { step: "A/B test landing pages", description: "Test variations to improve CTR", responsible: "Marketing" },
        {
          step: "Improve product pages",
          description: "Add trust signals, reviews, and clear CTAs",
          responsible: "Design",
        },
      ],
    });
  }

  return recommendations;
}

export function prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return [...recommendations].sort((a, b) => {
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];

    if (aPriority !== bPriority) return aPriority - bPriority;

    // Secondary sort by estimated ROI
    return b.estimatedROI - a.estimatedROI;
  });
}

export function groupRecommendationsByCategory(
  recommendations: Recommendation[],
): Record<RecommendationCategory, Recommendation[]> {
  return {
    strategy: recommendations.filter((r) => r.category === "strategy"),
    content: recommendations.filter((r) => r.category === "content"),
    pricing: recommendations.filter((r) => r.category === "pricing"),
    targeting: recommendations.filter((r) => r.category === "targeting"),
    operations: recommendations.filter((r) => r.category === "operations"),
  };
}

export function calculateRecommendationImpact(recommendations: Recommendation[]): {
  totalImpact: number;
  totalEffort: number;
  roi: number;
} {
  const totalImpact = recommendations.reduce((sum, r) => sum + r.expectedImpact, 0);
  const totalEffort = recommendations.reduce((sum, r) => sum + r.implementationEffort, 0);
  const roi =
    totalEffort > 0
      ? (recommendations.reduce((sum, r) => sum + r.estimatedROI, 0) / recommendations.length) * (totalImpact / 100)
      : 0;

  return {
    totalImpact: Math.round(totalImpact),
    totalEffort,
    roi: Math.round(roi),
  };
}
