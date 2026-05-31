"use client";

import React, { useState } from "react";
import { BulletsEditor } from "./BulletsEditor";
import { TagsInput } from "./TagsInput";
import { ImagesSection } from "./ImagesSection";
import { VariantsEditor } from "./VariantsEditor";
import { useGenerateProduct } from "@/hooks/useGenerateProduct";

interface ProductData {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
  price: number;
  compareAtPrice?: number;
  bullets: string[];
  images: Array<{ url: string; alt?: string }>;
  variants: Array<{ optionName: string; values: string[] }>;
}

interface ReviewEditorProps {
  product: ProductData;
  onChange: (product: ProductData) => void;
  onPublish: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export function ReviewEditor({ product, onChange, onPublish, onRegenerate, onBack }: ReviewEditorProps) {
  const { generate, loading: regenerating } = useGenerateProduct();
  const [regeneratingDesc, setRegeneratingDesc] = useState(false);

  const handleRegenerateDescription = async () => {
    setRegeneratingDesc(true);
    const result = await generate({
      provider: "openai",
      model: "gpt-4",
      productName: product.title,
      niche: product.tags[0] || "general",
      targetAudience: "general",
      keywords: product.tags,
    });

    if (result) {
      onChange({ ...product, description: result.description });
    }
    setRegeneratingDesc(false);
  };

  const handleChange = (field: keyof ProductData, value: any) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <label className="block text-sm font-semibold text-white mb-2">Product Title</label>
        <input
          type="text"
          value={product.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
        />
        <p className="text-xs text-slate-400 mt-2">{product.title.length} / 255 characters</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-white">Description</label>
          <button
            onClick={handleRegenerateDescription}
            disabled={regeneratingDesc}
            className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition"
          >
            {regeneratingDesc ? "Regenerating..." : "Regenerate Description"}
          </button>
        </div>
        {regeneratingDesc ? (
          <div className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        ) : (
          <textarea
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition h-48 resize-none"
          />
        )}
        <p className="text-xs text-slate-400 mt-2">{product.description.length} / 5000 characters</p>
      </div>

      <BulletsEditor bullets={product.bullets} onChange={(bullets) => handleChange("bullets", bullets)} />

      <TagsInput tags={product.tags} onChange={(tags) => handleChange("tags", tags)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <label className="block text-sm font-semibold text-white mb-2">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <label className="block text-sm font-semibold text-white mb-2">Compare-at Price ($) (Optional)</label>
          <input
            type="number"
            step="0.01"
            value={product.compareAtPrice || ""}
            onChange={(e) => handleChange("compareAtPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <label className="block text-sm font-semibold text-white mb-2">SEO Title</label>
          <input
            type="text"
            value={product.seoTitle}
            onChange={(e) => handleChange("seoTitle", e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <label className="block text-sm font-semibold text-white mb-2">SEO Description</label>
          <textarea
            value={product.seoDescription}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition h-24 resize-none"
          />
        </div>
      </div>

      <ImagesSection images={product.images} onChange={(images) => handleChange("images", images)} />

      <VariantsEditor variants={product.variants} onChange={(variants) => handleChange("variants", variants)} />

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
        >
          Back
        </button>
        <button
          onClick={onRegenerate}
          className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
        >
          Regenerate
        </button>
        <button
          onClick={onPublish}
          className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
        >
          Publish to Shopify
        </button>
      </div>
    </div>
  );
}
