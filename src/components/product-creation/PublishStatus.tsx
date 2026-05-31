"use client";

import React from "react";

type PublishStatus = "loading" | "success" | "error";

interface PublishStatusProps {
  status: PublishStatus;
  productTitle: string;
  shopifyUrl?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onBack?: () => void;
  onViewDashboard?: () => void;
  onCreateAnother?: () => void;
}

export function PublishStatus({
  status,
  productTitle,
  shopifyUrl,
  errorMessage,
  onRetry,
  onBack,
  onViewDashboard,
  onCreateAnother,
}: PublishStatusProps) {
  if (status === "loading") {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <svg className="animate-spin h-16 w-16 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Publishing to Shopify...</h3>
        <p className="text-slate-400 mb-4">{productTitle}</p>
        <p className="text-slate-400 text-sm">This may take a few moments</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Product Published Successfully!</h3>
        <p className="text-slate-300 mb-4">{productTitle}</p>
        {shopifyUrl && (
          <a
            href={shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 text-indigo-400 hover:text-indigo-300 text-sm underline"
          >
            View in Shopify →
          </a>
        )}
        <div className="flex gap-4 justify-center">
          {onViewDashboard && (
            <button
              onClick={onViewDashboard}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
            >
              View in Dashboard
            </button>
          )}
          {onCreateAnother && (
            <button
              onClick={onCreateAnother}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Create Another Product
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Publishing Failed</h3>
        <p className="text-slate-300 mb-6">{errorMessage || "An unexpected error occurred"}</p>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
            >
              Retry
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Back to Review
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
