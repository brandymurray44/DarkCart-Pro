"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  glitch?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", glitch = false, className = "", ...props }, ref) => {
    const baseStyles = "font-semibold transition-all duration-200 relative overflow-hidden";
    
    const variantStyles = {
      primary: "bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600",
      danger: "bg-red-600 hover:bg-red-500 text-white border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
      ghost: "bg-transparent hover:bg-slate-800 text-purple-400 border border-purple-400/30"
    };
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };
    
    const glitchStyles = glitch ? `
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: glitch 2s infinite;
      }
      @keyframes glitch {
        0% { left: -100%; }
        50%, 100% { left: 100%; }
      }
    ` : '';
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        style={glitchStyles ? { animation: 'none' } : undefined}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
