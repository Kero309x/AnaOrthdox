"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import m3Tokens from "./m3-tokens.json";

export type Theme = "light" | "dark" | "system";
export type SeedColorId = "emerald" | "blue" | "gold" | "crimson" | "purple";

export interface ColorSchemeOption {
  id: SeedColorId;
  name: string;
  seedHex: string;
}

export const COLOR_SCHEMES: Record<SeedColorId, ColorSchemeOption> = {
  emerald: {
    id: "emerald",
    name: "الزمردي (Emerald)",
    seedHex: "#145A48",
  },
  blue: {
    id: "blue",
    name: "الأزرق المريمي (Ocean)",
    seedHex: "#00639B",
  },
  gold: {
    id: "gold",
    name: "الذهبي (Warm Amber)",
    seedHex: "#7D5700",
  },
  crimson: {
    id: "crimson",
    name: "القرمزي (Rose / Coral)",
    seedHex: "#9C4146",
  },
  purple: {
    id: "purple",
    name: "الأرجواني (Baseline Purple)",
    seedHex: "#6750A4",
  },
};

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  seedColor: SeedColorId;
  setTheme: (theme: Theme) => void;
  setSeedColor: (color: SeedColorId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [seedColor, setSeedColorState] = useState<SeedColorId>("emerald");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. Read persisted theme or default to system
    const savedTheme = localStorage.getItem("ana_orthodox_theme") as Theme | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
      setThemeState(savedTheme);
    }

    // 2. Read persisted seed color or default to emerald
    const savedColor = localStorage.getItem("ana_orthodox_seed_color") as SeedColorId | null;
    if (savedColor && COLOR_SCHEMES[savedColor]) {
      setSeedColorState(savedColor);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyThemeAndColors = () => {
      let active: "light" | "dark" = "light";
      if (theme === "system") {
        active = mediaQuery.matches ? "dark" : "light";
      } else {
        active = theme;
      }

      setResolvedTheme(active);
      root.setAttribute("data-theme", active);
      if (active === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Apply complete Material 3 dynamic scheme tokens (MCU 2025 specification)
      const paletteTokens = (m3Tokens as any)[seedColor]?.[active];
      if (paletteTokens) {
        for (const [propName, propVal] of Object.entries(paletteTokens)) {
          if (typeof propVal === "string") {
            root.style.setProperty(propName, propVal);
          }
        }
      }
    };

    applyThemeAndColors();

    const listener = () => {
      if (theme === "system") {
        applyThemeAndColors();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, seedColor]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("ana_orthodox_theme", newTheme);
  };

  const setSeedColor = (newColor: SeedColorId) => {
    if (COLOR_SCHEMES[newColor]) {
      setSeedColorState(newColor);
      localStorage.setItem("ana_orthodox_seed_color", newColor);
    }
  };

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, seedColor, setTheme, setSeedColor, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
