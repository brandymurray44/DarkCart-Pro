"use client";

import { ReactNode } from "react";

interface StatusIndicatorProps {
  status: "operational" | "degraded" | "offline" | "classified";
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ 
  status, 
  label, 
  className = "",
  size = "md"
}: StatusIndicatorProps) {
  const sizeStyles = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };
  
  const statusStyles = {
    operational: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
    degraded: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    offline: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    classified: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeStyles[size]} ${statusStyles[status]} rounded-full animate-pulse`} />
      {label && (
        <span className="text-sm text-slate-300">{label}</span>
      )}
    </div>
  );
}
