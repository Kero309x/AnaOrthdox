import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { RouteMotion } from "@/shared/ui/RouteMotion";
import { ReminderRunner } from "@/shared/ui/ReminderRunner";
import { FaviconSync } from "@/shared/ui/FaviconSync";

export const metadata: Metadata = {
  title: "أنا أرثوذكسي",
  description: "بيتك الروحي، كله في مكان واحد",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "أنا أرثوذكسي", statusBarStyle: "default" },
  icons: { apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
};

export const viewport: Viewport = {
  themeColor: "#fff8f6",
};

// Replays every persisted display choice before first paint: dark class,
// font scale (with migration from the old fontSize key), and the derived
// Material 3 theme variables saved by theming.ts.
const themeInit = `(function(){try{var t=window.localStorage.getItem("theme");var p=new URLSearchParams(window.location.search).get("theme");var d=t?t==="dark":p?p==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark")}var fs=window.localStorage.getItem("fontScale");if(!fs){var old=window.localStorage.getItem("fontSize");if(old){fs=old==="large"?"115":"100";window.localStorage.setItem("fontScale",fs);window.localStorage.removeItem("fontSize")}}if(fs){document.documentElement.style.fontSize=fs+"%"}var tv=window.localStorage.getItem("themeVars");if(tv){var o=JSON.parse(tv);for(var k in o){document.documentElement.style.setProperty(k,o[k])}}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <FaviconSync />
        <RouteMotion />
        <ReminderRunner />
        {children}
      </body>
    </html>
  );
}
