
import React from 'react';

export const RadarSweep = () => (
  <div className="relative w-64 h-64 border-2 border-emerald-500/30 rounded-full flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(0,255,204,0.4)_100%)] animate-spin-slow" />
    <div className="z-10 text-emerald-400 font-mono text-xs tracking-widest animate-pulse">
      SCANNING COMPETITOR...
    </div>
  </div>
);
