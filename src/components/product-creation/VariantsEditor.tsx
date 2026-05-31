"use client";

import React from "react";

interface Variant {
  optionName: string;
  values: string[];
}

interface VariantsEditorProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function VariantsEditor({ variants, onChange }: VariantsEditorProps) {
  const handleAddVariant = () => {
    onChange([...variants, { optionName: "", values: [""] }]);
  };

  const handleRemoveVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const handleVariantNameChange = (index: number, name: string) => {
    const updated = [...variants];
    updated[index].optionName = name;
    onChange(updated);
  };

  const handleVariantValueChange = (variantIndex: number, valueIndex: number, value: string) => {
    const updated = [...variants];
    updated[variantIndex].values[valueIndex] = value;
    onChange(updated);
  };

  const handleAddVariantValue = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].values.push("");
    onChange(updated);
  };

  const handleRemoveVariantValue = (variantIndex: number, valueIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].values = updated[variantIndex].values.filter((_, i) => i !== valueIndex);
    onChange(updated);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-semibold text-white">Product Variants (Optional)</label>
        <button
          onClick={handleAddVariant}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          + Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="text-slate-400 text-sm">No variants added. Click "+ Add Variant" to add options like size, color, etc.</p>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, variantIdx) => (
            <div key={variantIdx} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={variant.optionName}
                  onChange={(e) => handleVariantNameChange(variantIdx, e.target.value)}
                  placeholder="Option name (e.g., Size, Color)"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                />
                <button
                  onClick={() => handleRemoveVariant(variantIdx)}
                  className="text-red-400 hover:text-red-300 transition"
                  aria-label="Remove variant"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Values:</label>
                {variant.values.map((value, valueIdx) => (
                  <div key={valueIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleVariantValueChange(variantIdx, valueIdx, e.target.value)}
                      placeholder={`Value ${valueIdx + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                    />
                    {variant.values.length > 1 && (
                      <button
                        onClick={() => handleRemoveVariantValue(variantIdx, valueIdx)}
                        className="text-red-400 hover:text-red-300 transition"
                        aria-label="Remove value"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleAddVariantValue(variantIdx)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  + Add Value
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
