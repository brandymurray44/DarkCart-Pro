"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RevenueTrendChartProps {
  data?: Array<{
    date: string;
    revenue: number;
  }>;
  loading?: boolean;
}

const mockData = [
  { date: "Jan 1", revenue: 2400 },
  { date: "Jan 8", revenue: 2210 },
  { date: "Jan 15", revenue: 2290 },
  { date: "Jan 22", revenue: 2000 },
  { date: "Jan 29", revenue: 2181 },
  { date: "Feb 5", revenue: 2500 },
  { date: "Feb 12", revenue: 2100 },
  { date: "Feb 19", revenue: 2800 },
];

export function RevenueTrendChart({ data = mockData, loading }: RevenueTrendChartProps) {
  if (loading) {
    return (
      <div className="w-full h-64 bg-slate-700/30 rounded animate-pulse" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4f46e5"
          dot={{ fill: "#4f46e5", r: 4 }}
          activeDot={{ r: 6 }}
          name="Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
