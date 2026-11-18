import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { AppShell } from "../components/app-shell";
import Script from "next/script";

const notoSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-arabic",
});

export const viewport: Viewport = {
  themeColor: "#145A48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "أنا أرثوذكس — Ana Orthodox",
    template: "%s | أنا أرثوذكس",
  },
  description:
    "المنصة القبطية الأرثوذكسية الرقمية الشاملة للكتاب المقدس والقراءات الكنسية والتراث الآبائي",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أنا أرثوذكس",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="light"
      data-theme-scheme="expressive"
      data-motion-scheme="expressive"
      data-palette-variant="tonal-spot"
      className={notoSans.variable}
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Material Symbols Rounded — replaces emoji for all icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('PWA ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        {/* Material Web Unofficial — M3 Expressive custom elements bundle */}
        <Script
          src="/md3e/md3-expressive.esm.js"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
