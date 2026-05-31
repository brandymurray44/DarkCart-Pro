"use client";

import { useState } from "react";

interface DateRangePickerProps {
  onDateChange?: (startDate: Date, endDate: Date) => void;
  disabled?: boolean;
}

export function DateRangePicker({ onDateChange, disabled }: DateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [preset, setPreset] = useState("30days");

  const getDateRange = (presetValue: string) => {
    const today = new Date();
    let startDate = new Date();

    switch (presetValue) {
      case "7days":
        startDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(today.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(today.getDate() - 90);
        break;
      case "1year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 30);
    }

    return { startDate, endDate: today };
  };

  const handlePresetChange = (newPreset: string) => {
    setPreset(newPreset);
    const { startDate, endDate } = getDateRange(newPreset);
    onDateChange?.(startDate, endDate);
  };

  const { startDate, endDate } = getDateRange(preset);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        disabled={disabled}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
      >
        📅 {preset === "30days" ? "Last 30 Days" : preset === "7days" ? "Last 7 Days" : preset === "90days" ? "Last 90 Days" : "Last Year"}
      </button>

      {showPicker && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg z-50 min-w-max">
          <div className="space-y-2 text-sm">
            <button
              onClick={() => handlePresetChange("7days")}
              className={`block w-full text-left px-3 py-2 rounded ${
                preset === "7days"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handlePresetChange("30days")}
              className={`block w-full text-left px-3 py-2 rounded ${
                preset === "30days"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => handlePresetChange("90days")}
              className={`block w-full text-left px-3 py-2 rounded ${
                preset === "90days"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Last 90 Days
            </button>
            <button
              onClick={() => handlePresetChange("1year")}
              className={`block w-full text-left px-3 py-2 rounded ${
                preset === "1year"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Last Year
            </button>
            <div className="border-t border-slate-600 pt-2 mt-2 text-xs text-slate-400">
              📊 {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
