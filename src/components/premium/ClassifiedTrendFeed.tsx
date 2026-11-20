"use client";

import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import { TrendIntelligenceCard } from "@/components/trends";

interface ClassifiedTrendFeedProps {
  isBlackAccess?: boolean;
}

export function ClassifiedTrendFeed({ isBlackAccess = false }: ClassifiedTrendFeedProps) {
  const mockClassifiedTrends = [
    {
      source: "Classified Source",
      title: "Emerging Market Opportunity",
      url: "#",
      score: 95,
      niche: "electronics",
      metadata: {},
      intelligenceLevel: "top-secret" as const,
      confidence: 98,
      velocity: 2.5
    },
    {
      source: "Intel Feed",
      title: "Competitor Movement Detected",
      url: "#",
      score: 88,
      niche: "fashion",
      metadata: {},
      intelligenceLevel: "classified" as const,
      confidence: 92,
      velocity: 1.8
    },
    {
      source: "Restricted Channel",
      title: "Supply Chain Intelligence",
      url: "#",
      score: 82,
      niche: "home-goods",
      metadata: {},
      intelligenceLevel: "restricted" as const,
      confidence: 85,
      velocity: 1.2
    }
  ];

  return (
    <Card variant={isBlackAccess ? "intelligence" : "default"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">CLASSIFIED TREND FEED</h3>
          {isBlackAccess && (
            <Badge variant="intelligence" pulse>
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isBlackAccess ? (
          <div className="space-y-3">
            {mockClassifiedTrends.map((trend, index) => (
              <TrendIntelligenceCard 
                key={index}
                trend={trend}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-slate-400 mb-4">Classified trend feed requires Black Access</p>
            <Badge variant="classified">RESTRICTED</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
