"use client";

import { ReactNode } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "intelligence" | "classified";
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  variant = "default", 
  className = "",
  showLabel = false,
  label
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const baseStyles = "h-2 rounded-full overflow-hidden";
  
  const variantStyles = {
    default: "bg-slate-700",
    intelligence: "bg-purple-900/30",
    classified: "bg-red-900/30"
  };
  
  const fillVariantStyles = {
    default: "bg-purple-500",
    intelligence: "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
    classified: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-slate-300">{label}</span>}
          {showLabel && <span className="text-slate-400">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`${baseStyles} ${variantStyles[variant]}`}>
        <div 
          className={`h-full transition-all duration-500 ${fillVariantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
