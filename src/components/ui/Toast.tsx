"use client";

import React, { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, type, message, duration };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-700 text-white";
      case "error":
        return "bg-red-900/90 border-red-700 text-white";
      case "warning":
        return "bg-yellow-900/90 border-yellow-700 text-white";
      case "info":
        return "bg-blue-900/90 border-blue-700 text-white";
      default:
        return "bg-slate-800/90 border-slate-700 text-white";
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  return (
    <div className={`${getTypeStyles(toast.type)} border rounded-lg p-4 shadow-lg min-w-[300px] animate-in slide-in-from-right`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{getIcon(toast.type)}</span>
        <p className="flex-1 text-sm">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white/70 hover:text-white transition"
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
