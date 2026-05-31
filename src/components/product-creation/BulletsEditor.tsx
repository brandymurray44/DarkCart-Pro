"use client";

import React from "react";

interface BulletsEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

export function BulletsEditor({ bullets, onChange }: BulletsEditorProps) {
  const handleAddBullet = () => {
    onChange([...bullets, ""]);
  };

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemoveBullet = (index: number) => {
    onChange(bullets.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-white">Product Features</label>
        <button
          onClick={handleAddBullet}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          + Add Feature
        </button>
      </div>
      <div className="space-y-2">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <input
              type="text"
              value={bullet}
              onChange={(e) => handleBulletChange(idx, e.target.value)}
              placeholder="Enter a feature..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-indigo-500 focus:outline-none transition"
            />
            <button
              onClick={() => handleRemoveBullet(idx)}
              className="text-red-400 hover:text-red-300 transition"
              aria-label="Remove feature"
            >
              ✕
            </button>
          </div>
        ))}
        {bullets.length === 0 && (
          <p className="text-slate-400 text-sm">No features added yet. Click "+ Add Feature" to add one.</p>
        )}
      </div>
    </div>
  );
}
