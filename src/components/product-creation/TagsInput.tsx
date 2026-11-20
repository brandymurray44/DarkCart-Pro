"use client";

import React, { useState } from "react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

export function TagsInput({ tags, onChange, suggestions = [] }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <label className="text-sm font-semibold text-white mb-3 block">Tags</label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-indigo-600/30 text-indigo-300 text-sm rounded border border-indigo-600/50 flex items-center gap-2"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(idx)}
              className="text-indigo-400 hover:text-indigo-300 transition"
              aria-label="Remove tag"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Type a tag and press Enter..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleAddTag(suggestion)}
                className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-700 transition text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
