// Dashboard context for filter state management with localStorage persistence

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { DashboardFilters, DashboardLayout, DashboardState, DEFAULT_FILTERS, DEFAULT_WIDGETS } from "@/types/dashboard";

const STORAGE_KEY = "trendpilot-dashboard-preferences";

interface DashboardContextType {
  state: DashboardState;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  setLayout: (layout: Partial<DashboardLayout>) => void;
  toggleWidget: (widgetId: string) => void;
  reorderWidget: (widgetId: string, newOrder: number) => void;
  resetLayout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateTimestamp: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Load preferences from localStorage
function loadPreferences(): Partial<DashboardState> {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    return {
      layout: parsed.layout,
      filters: parsed.filters,
    };
  } catch (error) {
    console.error("[DashboardContext] Failed to load preferences:", error);
    return {};
  }
}

// Save preferences to localStorage
function savePreferences(state: DashboardState) {
  if (typeof window === "undefined") return;
  
  try {
    const toSave = {
      layout: state.layout,
      filters: state.filters,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("[DashboardContext] Failed to save preferences:", error);
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(() => {
    const loaded = loadPreferences();
    return {
      filters: loaded.filters || DEFAULT_FILTERS,
      layout: loaded.layout || { widgets: DEFAULT_WIDGETS, gridColumns: 2 },
      isLoading: false,
      error: null,
      lastUpdate: null,
    };
  });

  // Persist preferences to localStorage on state changes
  useEffect(() => {
    savePreferences(state);
  }, [state.layout, state.filters]);

  const setFilters = useCallback((filters: Partial<DashboardFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const setLayout = useCallback((layout: Partial<DashboardLayout>) => {
    setState((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));
  }, []);

  const toggleWidget = useCallback((widgetId: string) => {
    setState((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        widgets: prev.layout.widgets.map((w) =>
          w.id === widgetId ? { ...w, visible: !w.visible } : w
        ),
      },
    }));
  }, []);

  const reorderWidget = useCallback((widgetId: string, newOrder: number) => {
    setState((prev) => {
      const widgets = [...prev.layout.widgets];
      const widget = widgets.find((w) => w.id === widgetId);
      if (!widget) return prev;

      const oldOrder = widget.order;
      if (newOrder === oldOrder) return prev;

      // Shift other widgets
      if (newOrder > oldOrder) {
        widgets.forEach((w) => {
          if (w.order > oldOrder && w.order <= newOrder) {
            w.order--;
          }
        });
      } else {
        widgets.forEach((w) => {
          if (w.order < oldOrder && w.order >= newOrder) {
            w.order++;
          }
        });
      }

      widget.order = newOrder;

      return {
        ...prev,
        layout: { ...prev.layout, widgets },
      };
    });
  }, []);

  const resetLayout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      layout: { widgets: DEFAULT_WIDGETS, gridColumns: 2 },
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const updateTimestamp = useCallback(() => {
    setState((prev) => ({ ...prev, lastUpdate: new Date() }));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        state,
        setFilters,
        setLayout,
        toggleWidget,
        reorderWidget,
        resetLayout,
        setLoading,
        setError,
        updateTimestamp,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
