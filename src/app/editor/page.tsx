"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface GeneratedContent {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productTitle = searchParams.get("title") || "";
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const generateContent = async () => {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "openai",
          model: "gpt-4",
          productName: productTitle,
          niche: "home office",
          targetAudience: "remote workers and home office enthusiasts",
        }),
      });
      const json = await response.json();
      setContent(json.data);
      setLoading(false);
    };
    generateContent();
  }, [productTitle]);

  const handlePublish = async () => {
    if (!content) return;
    const response = await fetch("/api/shopify/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopDomain: "myshop.myshopify.com",
        title: content.title,
        description: content.description,
        tags: content.tags,
        seoTitle: content.seoTitle,
        seoDescription: content.seoDescription,
      }),
    });
    if (response.ok) {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Generating product content...</div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Error generating content</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Product Editor</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium"
          >
            {editing ? "Done" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-semibold text-white mb-2">Title</label>
              {editing ? (
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-indigo-500 focus:outline-none"
                />
              ) : (
                <p className="text-white text-lg font-semibold">{content.title}</p>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-semibold text-white mb-2">Description</label>
              {editing ? (
                <textarea
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-indigo-500 focus:outline-none h-32 resize-none"
                />
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap text-sm">{content.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-semibold text-white mb-2">SEO Title</label>
              <p className="text-slate-300 text-sm mb-2">{content.seoTitle}</p>
              <label className="block text-sm font-semibold text-white mb-2 mt-4">SEO Description</label>
              <p className="text-slate-300 text-xs">{content.seoDescription}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-semibold text-white mb-3">Tags</label>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-indigo-600/30 text-indigo-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Image Prompts</h2>
          {content.imagePrompts.map((prompt, idx) => (
            <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700 rounded text-slate-300 text-sm">
              {prompt}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/trends")}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium"
          >
            Back to Trends
          </button>
          <button
            onClick={handlePublish}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
          >
            Publish to Shopify
          </button>
        </div>
      </div>
    </main>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    }>
      <EditorContent />
    </Suspense>
  );
}
