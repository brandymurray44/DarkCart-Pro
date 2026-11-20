"use client";

import { ReactNode } from "react";

interface CommandCenterProps {
  children: ReactNode;
  className?: string;
}

export function CommandCenter({ children, className = "" }: CommandCenterProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 ${className}`}>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export function Header({ children, className = "" }: HeaderProps) {
  return (
    <header className={`bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        {children}
      </div>
    </header>
  );
}

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <main className={`container mx-auto px-4 py-8 ${className}`}>
      {children}
    </main>
  );
}
