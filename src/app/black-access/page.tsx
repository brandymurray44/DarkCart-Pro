"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlackAccessPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Lightweight gating: check /api/auth/me and a placeholder for premium flag
    async function check() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        const user = json.user;
        // For now, allow access if authenticated; premium gating to be implemented.
        setAllowed(!!user);
      } catch {
        setAllowed(false);
      }
    }
    check();
  }, []);

  if (allowed === null) {
    return <div className="min-h-screen flex items-center justify-center text-slate-300">Checking access…</div>;
  }

  if (!allowed) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-4">Black Access — Restricted</h1>
        <p className="text-slate-400 mb-4">This is a restricted area for premium subscribers. Please connect your Shopify store and upgrade to access.</p>
        <div className="space-x-3">
          <Link href="/settings" className="text-purple-400 hover:underline">Shopify Settings</Link>
          <Link href="/dashboard" className="text-purple-400 hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Black Access — Premium Intel</h1>
      <p className="text-slate-400 mb-6">Welcome to the premium intelligence feed. Advanced trend classification, restricted signals, and priority alerts appear here.</p>
      <div className="space-y-4">
        <Link href="/dashboard" className="text-purple-400 hover:underline">Back to Command Center</Link>
      </div>
    </div>
  );
}
