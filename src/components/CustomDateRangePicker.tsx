"use client";

import { useState } from "react";

interface CustomDateRangePickerProps {
  onDateChange?: (startDate: Date, endDate: Date) => void;
  disabled?: boolean;
}

export function CustomDateRangePicker({ onDateChange, disabled }: CustomDateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());

  const handleApply = () => {
    onDateChange?.(startDate, endDate);
    setShowPicker(false);
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        disabled={disabled}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
      >
        📅 {formatDate(startDate)} → {formatDate(endDate)}
      </button>

      {showPicker && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg z-50 min-w-max">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formatDate(startDate)}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={formatDate(endDate)}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>

            <div className="bg-slate-700/50 p-2 rounded text-xs text-slate-300">
              📊 {daysDiff} days selected
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApply}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm"
              >
                Apply
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
