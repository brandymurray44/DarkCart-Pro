"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "intelligence" | "classified" | "alert";
  glitch?: boolean;
}

export function Card({ children, className = "", variant = "default", glitch = false }: CardProps) {
  const baseStyles = "rounded-lg border backdrop-blur-sm transition-all duration-300";
  
  const variantStyles = {
    default: "bg-slate-900/80 border-slate-700 hover:border-purple-500/50",
    intelligence: "bg-slate-900/90 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    classified: "bg-slate-900/95 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    alert: "bg-red-900/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
  };
  
  const glitchStyles = glitch ? "animate-pulse" : "";
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${glitchStyles} ${className} p-6`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-4 border-b border-slate-700 pb-3 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-3 border-t border-slate-700 ${className}`}>
      {children}
    </div>
  );
}
