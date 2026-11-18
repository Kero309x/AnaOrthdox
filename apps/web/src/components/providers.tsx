"use client";

import React, { useEffect } from "react";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-context";
import { initMaterialWeb } from "@ana-orthodox/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
