"use client";

import React from "react";
import { Button, Badge, StatusIndicator } from "@/components/ui";

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
      <div className="bg-slate-900/80 border border-purple-500/30 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
            <svg className="animate-spin h-16 w-16 text-purple-500 relative" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
        <div className="mb-4">
          <Badge variant="intelligence" pulse>DEPLOYING</Badge>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wider">PUBLISHING TO SHOPIFY</h3>
        <p className="text-slate-400 mb-4">{productTitle}</p>
        <div className="flex items-center justify-center gap-2">
          <StatusIndicator status="operational" size="sm" />
          <p className="text-slate-400 text-sm">TACTICAL DEPLOYMENT IN PROGRESS</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
            <svg className="h-16 w-16 text-green-400 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mb-4">
          <Badge variant="success">DEPLOYMENT COMPLETE</Badge>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wider">PRODUCT DEPLOYED SUCCESSFULLY</h3>
        <p className="text-slate-300 mb-4">{productTitle}</p>
        {shopifyUrl && (
          <a
            href={shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 text-purple-400 hover:text-purple-300 text-sm underline"
          >
            VIEW IN SHOPIFY →
          </a>
        )}
        <div className="flex gap-4 justify-center">
          {onViewDashboard && (
            <Button variant="primary" onClick={onViewDashboard}>
              COMMAND CENTER
            </Button>
          )}
          {onCreateAnother && (
            <Button variant="secondary" onClick={onCreateAnother}>
              DEPLOY ANOTHER
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
            <svg className="h-16 w-16 text-red-400 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mb-4">
          <Badge variant="danger">DEPLOYMENT FAILED</Badge>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wider">PUBLISHING ERROR</h3>
        <p className="text-slate-300 mb-6">{errorMessage || "An unexpected error occurred during tactical deployment"}</p>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              RETRY DEPLOYMENT
            </Button>
          )}
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              ABORT MISSION
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
