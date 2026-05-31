"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface OrdersDistributionChartProps {
  data?: Array<{
    name: string;
    orders: number;
  }>;
  loading?: boolean;
}

const mockData = [
  { name: "Mon", orders: 24 },
  { name: "Tue", orders: 32 },
  { name: "Wed", orders: 19 },
  { name: "Thu", orders: 28 },
  { name: "Fri", orders: 35 },
  { name: "Sat", orders: 42 },
  { name: "Sun", orders: 31 },
];

export function OrdersDistributionChart({ data = mockData, loading }: OrdersDistributionChartProps) {
  if (loading) {
    return (
      <div className="w-full h-64 bg-slate-700/30 rounded animate-pulse" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
        <Legend />
        <Bar
          dataKey="orders"
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          name="Orders"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
