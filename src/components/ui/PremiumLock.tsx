"use client";

import { useRouter } from "next/navigation";
import React from "react";

export const TIER_LEVELS = ["FREE", "STARTER", "PRO", "BLACK"] as const;
export type Tier = (typeof TIER_LEVELS)[number];

export function getTierLevel(tier: Tier): number {
  return TIER_LEVELS.indexOf(tier);
}

export function hasPremiumAccess(userTier: Tier, requiredTier: Tier = "BLACK"): boolean {
  return getTierLevel(userTier) >= getTierLevel(requiredTier);
}

export function usePremiumAccess(requiredTier: Tier = "BLACK") {
  const [tier, setTier] = React.useState<Tier>("FREE");
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);


  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setTier(data.user.tier || "FREE");
          setIsAdmin(data.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const canAccess = hasPremiumAccess(tier, requiredTier) || isAdmin;

  return { tier, loading, canAccess };
}

export function PremiumGate({ children, requiredTier = "BLACK", fallback }: {
  children: React.ReactNode;
  requiredTier?: Tier;
  fallback?: React.ReactNode;
}) {
  const { canAccess, loading } = usePremiumAccess(requiredTier);

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-slate-800/50 border border-slate-700 h-20" />
    );
  }

  if (canAccess) return <>{children}</>;
  return <>{fallback ?? <PremiumLock />}</>;
}

export function PremiumBadge() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/settings")}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md shadow-lg shadow-indigo-500/30"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      BLACK-ACCESS
    </button>
  );
}

export function PremiumLock({ message }: { message?: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-300">{message || "This feature requires Black-Access premium"}</p>
      </div>
      <button
        onClick={() => router.push("/settings")}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Upgrade
      </button>
    </div>
  );
}
