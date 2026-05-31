"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GeneratedProduct {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
}

export default function ReviewScreen() {
  const router = useRouter();
  const [product, setProduct] = useState<GeneratedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("generatedProduct");
    if (stored) {
      const data = JSON.parse(stored);
      setProduct(data);
      setPrice("29.99");
      setBullets([
        "Premium quality materials",
        "Sleek modern design",
        "Perfect for your lifestyle",
      ]);
    }
    setLoading(false);
  }, []);

  const handlePublish = () => {
    if (!product) return;
    
    // Store product data for publish screen
    sessionStorage.setItem("productToPublish", JSON.stringify({
      ...product,
      price: parseFloat(price),
      bullets,
    }));
    
    router.push("/product-creation/publish");
  };

  const handleRegenerate = () => {
    sessionStorage.removeItem("generatedProduct");
    router.push("/product-creation/generate");
  };

  const handleAddBullet = () => {
    setBullets([...bullets, ""]);
  };

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    setBullets(updated);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading product data...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No product data found</p>
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
          >
            Generate a New Product
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Review Product</h1>
            <p className="text-slate-400">Review and edit your AI-generated product before publishing</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
          >
            {editing ? "Done Editing" : "Edit Product"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Product Info */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Product Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
                />
              ) : (
                <p className="text-white text-lg font-semibold">{product.title}</p>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              {editing ? (
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition h-48 resize-none"
                />
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Price ($)
              </label>
              {editing ? (
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
                />
              ) : (
                <p className="text-white text-2xl font-bold">${price}</p>
              )}
            </div>
          </div>

          {/* Right Column - SEO, Tags, Bullets */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                SEO Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={product.seoTitle}
                  onChange={(e) => setProduct({ ...product, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition"
                />
              ) : (
                <p className="text-slate-300 text-sm">{product.seoTitle}</p>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                SEO Description
              </label>
              {editing ? (
                <textarea
                  value={product.seoDescription}
                  onChange={(e) => setProduct({ ...product, seoDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition h-24 resize-none"
                />
              ) : (
                <p className="text-slate-300 text-xs">{product.seoDescription}</p>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-600/30 text-indigo-300 text-sm rounded border border-indigo-600/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-white">
                  Product Features
                </label>
                {editing && (
                  <button
                    onClick={handleAddBullet}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    + Add Feature
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {editing ? (
                      <>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                        />
                        <button
                          onClick={() => handleRemoveBullet(idx)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <p className="text-slate-300 text-sm">{bullet}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Prompts Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Image Prompts</h2>
          <div className="space-y-3">
            {product.imagePrompts.map((prompt, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <p className="text-slate-300 text-sm">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleRegenerate}
            className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Regenerate
          </button>
          <button
            onClick={handlePublish}
            className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
          >
            Continue to Publish
          </button>
        </div>
      </div>
    </main>
  );
}
