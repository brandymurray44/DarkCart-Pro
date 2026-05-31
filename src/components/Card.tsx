import { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  children?: ReactNode;
  loading?: boolean;
}

export function Card({ title, value, subtitle, trend, children, loading }: CardProps) {
  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-24 mb-2"></div>
          {subtitle && <div className="h-4 bg-slate-700 rounded w-20"></div>}
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend === "up" && <span className="text-xs text-green-400">↑</span>}
            {trend === "down" && <span className="text-xs text-red-400">↓</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
        </>
      )}
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-20 mb-3"></div>
      <div className="h-8 bg-slate-700 rounded w-32"></div>
    </div>
  );
}
