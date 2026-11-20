"use client";

import { ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ children, className = "", intensity = "medium" }: GlitchTextProps) {
  const intensityStyles = {
    low: "hover:animate-pulse",
    medium: "hover:animate-bounce",
    high: "hover:animate-ping"
  };
  
  return (
    <span className={`inline-block ${intensityStyles[intensity]} ${className}`}>
      {children}
    </span>
  );
}
