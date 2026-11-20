"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "intelligence" | "classified";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className = "", ...props }, ref) => {
    const baseStyles = "w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200";
    
    const variantStyles = {
      default: "border-slate-600 focus:border-purple-500 focus:ring-purple-500/50",
      intelligence: "border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
      classified: "border-red-500/30 focus:border-red-400 focus:ring-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
    };
    
    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : "";
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
