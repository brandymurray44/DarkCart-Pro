"use client";

import { useState } from "react";
import { Button, Input, Badge } from "@/components/ui";

interface TrendFilterPanelProps {
  onFilterChange: (filters: TrendFilters) => void;
}

export interface TrendFilters {
  niche?: string;
  source?: string;
  intelligenceLevel?: "public" | "restricted" | "classified" | "top-secret";
  minConfidence?: number;
}

export function TrendFilterPanel({ onFilterChange }: TrendFilterPanelProps) {
  const [filters, setFilters] = useState<TrendFilters>({});

  const handleFilterChange = (key: keyof TrendFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">INTELLIGENCE FILTERS</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
        >
          CLEAR
        </Button>
      </div>

      <Input
        label="Niche"
        placeholder="e.g., electronics, fashion"
        value={filters.niche || ""}
        onChange={(e) => handleFilterChange("niche", e.target.value)}
      />

      <Input
        label="Source"
        placeholder="e.g., TikTok, Instagram"
        value={filters.source || ""}
        onChange={(e) => handleFilterChange("source", e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Intelligence Level
        </label>
        <div className="flex flex-wrap gap-2">
          {["public", "restricted", "classified", "top-secret"].map((level) => (
            <button
              key={level}
              onClick={() => handleFilterChange(
                "intelligenceLevel", 
                filters.intelligenceLevel === level ? undefined : level as any
              )}
            >
              <Badge
                variant={filters.intelligenceLevel === level ? "intelligence" : "default"}
              >
                {level.toUpperCase()}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Minimum Confidence: {filters.minConfidence || 0}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.minConfidence || 0}
          onChange={(e) => handleFilterChange("minConfidence", parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
    </div>
  );
}
