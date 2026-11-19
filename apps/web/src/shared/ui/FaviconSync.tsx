"use client";

import { useEffect } from "react";
import { syncFavicon } from "@/shared/theme/theming";

// Syncs the tab icon once after mount; applySeed/clearColorTheme re-sync it
// on every later change.
export function FaviconSync() {
  useEffect(() => {
    syncFavicon();
  }, []);
  return null;
}
