"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "intelligence" | "classified" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

export function Badge({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "",
  pulse = false 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full font-medium border";
  
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-600",
    intelligence: "bg-purple-900/30 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    classified: "bg-red-900/30 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    success: "bg-green-900/30 text-green-300 border-green-500/50",
    warning: "bg-yellow-900/30 text-yellow-300 border-yellow-500/50",
    danger: "bg-red-900/50 text-red-200 border-red-500"
  };
  
  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  const pulseStyles = pulse ? "animate-pulse" : "";
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${pulseStyles} ${className}`}>
      {children}
    </span>
  );
}
