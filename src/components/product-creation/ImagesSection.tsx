"use client";

import React, { useState } from "react";

interface Image {
  url: string;
  alt?: string;
}

interface ImagesSectionProps {
  images: Image[];
  onChange: (images: Image[]) => void;
}

export function ImagesSection({ images, onChange }: ImagesSectionProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleAddImage = () => {
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl) {
      onChange([...images, { url: trimmedUrl }]);
      setUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddImage();
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <label className="text-sm font-semibold text-white mb-3 block">Product Images</label>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {images.map((image, idx) => (
          <div key={idx} className="relative group">
            <img
              src={image.url}
              alt={image.alt || `Product image ${idx + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-slate-600"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23475569'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='12'%3EInvalid URL%3C/text%3E%3C/svg%3E";
              }}
            />
            <button
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-2 text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-400 text-sm">No images added yet</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste image URL..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
        />
        <button
          onClick={handleAddImage}
          disabled={!urlInput.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
