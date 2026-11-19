"use client";

import { useEffect } from "react";
import { syncFavicon } from "@/shared/theme/theming";

// Keep browser chrome aligned with the displayed seed and light/dark mode.
// Install icons use the canonical default brand, not a transient data URL.
export function FaviconSync() {
  useEffect(() => {
    const sync = () => {
      syncFavicon();
      const root = document.documentElement;
      const color = getComputedStyle(root).getPropertyValue(root.classList.contains("dark") ? "--color-night" : "--color-cream").trim();
      const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (color && meta) meta.content = color;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
        // Browsing remains available if registration is blocked by the browser.
      });
    }
    return () => observer.disconnect();
  }, []);
  return null;
}
