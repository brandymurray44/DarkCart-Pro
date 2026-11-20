"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface OpportunityScoreChartProps {
  trendScore?: number;
  competitorGap?: number;
  merchantReadiness?: number;
  loading?: boolean;
}

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981"];

export function OpportunityScoreChart({
  trendScore = 75,
  competitorGap = 65,
  merchantReadiness = 80,
  loading,
}: OpportunityScoreChartProps) {
  const data = [
    { name: "Trend Score", value: trendScore },
    { name: "Competitor Gap", value: competitorGap },
    { name: "Merchant Readiness", value: merchantReadiness },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 bg-slate-700/30 rounded animate-pulse" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
