import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  theme: EffectiveTheme; // effective theme after resolving system
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): EffectiveTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: EffectiveTheme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    return (stored as ThemeMode) || "system";
  });

  const [system, setSystem] = useState<EffectiveTheme>(() => getSystemTheme());

  // Subscribe to system theme changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystem(getSystemTheme());
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);

  const theme: EffectiveTheme = mode === "system" ? system : mode;

  // Apply class and persist mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
      applyThemeClass(theme);
    }
  }, [mode, theme]);

  const value = useMemo(() => ({ mode, theme, setMode }), [mode, theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

