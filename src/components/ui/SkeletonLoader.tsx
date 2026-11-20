"use client";

import React from "react";

interface SkeletonLoaderProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLoader({ variant = "text", width, height, className = "" }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-slate-700 rounded";
  
  const variantClasses = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <SkeletonLoader variant="rectangular" width="100%" height={150} className="mb-4" />
      <SkeletonLoader variant="text" width="75%" className="mb-2" />
      <SkeletonLoader variant="text" width="50%" className="mb-4" />
      <div className="space-y-2">
        <SkeletonLoader variant="text" width="100%" />
        <SkeletonLoader variant="text" width="90%" />
        <SkeletonLoader variant="text" width="80%" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="h-12 bg-slate-700/50 border-b border-slate-600"></div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-16 border-b border-slate-600/50 flex items-center px-6">
          <SkeletonLoader variant="text" width="30%" className="mr-4" />
          <SkeletonLoader variant="text" width="20%" className="mr-4" />
          <SkeletonLoader variant="text" width="20%" className="mr-4" />
          <SkeletonLoader variant="text" width="15%" />
        </div>
      ))}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <SkeletonLoader variant="text" width="40%" className="mb-4" />
      <SkeletonLoader variant="text" width="60%" height={32} className="mb-2" />
      <SkeletonLoader variant="text" width="30%" />
    </div>
  );
}
