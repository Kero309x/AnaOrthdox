"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../context/theme-context";
import { AppLogo, AppIconButton, AppRipple } from "@ana-orthodox/ui";

export interface AppShellProps {
  children: React.ReactNode;
}

/** Material Symbols icon — RTL-safe, no emoji */
function Icon({
  name,
  fill = false,
  size = 24,
  className = "",
}: {
  name: string;
  fill?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/", icon: "home", iconFilled: "home" },
  { label: "حسابي", href: "/account", icon: "person", iconFilled: "person" },
  { label: "الإعدادات", href: "/settings", icon: "settings", iconFilled: "settings" },
] as const;

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const shellRef = useRef<HTMLDivElement>(null);

  /* Sync dark class to html element for md3e custom elements */
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [resolvedTheme]);

  return (
    <div
      ref={shellRef}
      className="app-shell"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--md-sys-color-background)",
        color: "var(--md-sys-color-on-background)",
        transition: `background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard),
                     color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
      }}
    >
      {/* =====================================================
          TOP APP BAR — Material 3 Small Top App Bar
          Uses surface container with elevation 2 on scroll.
          ===================================================== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          height: "64px",
          paddingInline: "4px 16px",
          gap: "4px",
          background: "var(--md-sys-color-surface-container)",
          borderBottom: "1px solid var(--md-sys-color-outline-variant)",
          transition: `background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
        }}
        role="banner"
      >
        {/* Leading: logo + app name */}
        <Link
          href="/"
          aria-label="أنا أرثوذكس — الصفحة الرئيسية"
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "6px 12px",
            borderRadius: "var(--md-sys-shape-corner-medium)",
            textDecoration: "none",
            color: "inherit",
            flexShrink: 0,
            transition: `background-color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)`,
          }}
          className="m3-state-layer"
        >
          <AppRipple />
          <AppLogo
            size={38}
            variant="themed"
            style={{
              borderRadius: "var(--md-sys-shape-corner-small)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-family-arabic)",
              fontSize: "var(--md-sys-typescale-title-large-size)",
              lineHeight: "var(--md-sys-typescale-title-large-line-height)",
              fontWeight: 600,
              color: "var(--md-sys-color-on-surface)",
              letterSpacing: "0",
              whiteSpace: "nowrap",
            }}
          >
            أنا أرثوذكس
          </span>
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop navigation — Navigation Rail style in top bar for Expanded */}
        <nav
          aria-label="التنقل الرئيسي"
          style={{
            display: "none",
            alignItems: "center",
            gap: "4px",
          }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "12px 16px 8px",
                  borderRadius: "var(--md-sys-shape-corner-full)",
                  textDecoration: "none",
                  color: isActive
                    ? "var(--md-sys-color-on-surface)"
                    : "var(--md-sys-color-on-surface-variant)",
                  transition: `background-color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard),
                               color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)`,
                  position: "relative",
                  minWidth: "64px",
                }}
                className="m3-state-layer"
              >
                {/* Active indicator pill */}
                <div
                  style={{
                    position: "relative",
                    width: "64px",
                    height: "32px",
                    borderRadius: "var(--md-sys-shape-corner-full)",
                    background: isActive
                      ? "var(--md-sys-color-secondary-container)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    transition: `background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized)`,
                  }}
                >
                  <AppRipple />
                  <Icon
                    name={item.icon}
                    fill={isActive}
                    size={24}
                    className={
                      isActive
                        ? "text-on-secondary-container"
                        : "text-on-surface-variant"
                    }
                  />
                </div>
                <span
                  style={{
                    fontSize: "var(--md-sys-typescale-label-medium-size)",
                    lineHeight: "var(--md-sys-typescale-label-medium-line-height)",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? "var(--md-sys-color-on-surface)"
                      : "var(--md-sys-color-on-surface-variant)",
                    transition: `color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)`,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle icon button — Official Material 3 Component */}
        <AppIconButton
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === "dark"
              ? "التبديل إلى الوضع النهاري"
              : "التبديل إلى الوضع الليلي"
          }
          variant="standard"
          style={{
            color: "var(--md-sys-color-on-surface-variant)",
            flexShrink: 0,
          }}
        >
          <Icon
            name={resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
            size={24}
          />
        </AppIconButton>
      </header>

      {/* =====================================================
          MAIN CONTENT AREA
          Responsive padding — leaves space for bottom nav on mobile
          ===================================================== */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 16px 100px",
        }}
        className="page-content"
      >
        {children}
      </main>

      {/* =====================================================
          BOTTOM NAVIGATION BAR — Compact/Mobile only (< 768px)
          M3 Navigation Bar: 80px height, 3 destinations,
          active indicator pill (64×32), label below icon
          ===================================================== */}
      <nav
        aria-label="التنقل الرئيسي للهاتف"
        style={{
          position: "fixed",
          bottom: 0,
          insetInline: "0 0",
          left: 0,
          right: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "80px",
          background: "var(--md-sys-color-surface-container)",
          borderTop: "1px solid var(--md-sys-color-outline-variant)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          transition: `background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
        }}
        className="mobile-nav"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                flex: 1,
                height: "100%",
                textDecoration: "none",
                color: isActive
                  ? "var(--md-sys-color-on-surface)"
                  : "var(--md-sys-color-on-surface-variant)",
                transition: `color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)`,
              }}
            >
              {/* Active indicator pill */}
              <div
                style={{
                  position: "relative",
                  width: "64px",
                  height: "32px",
                  borderRadius: "var(--md-sys-shape-corner-full)",
                  background: isActive
                    ? "var(--md-sys-color-secondary-container)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: `background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized)`,
                }}
              >
                <AppRipple />
                <Icon name={item.icon} fill={isActive} size={24} />
              </div>
              <span
                style={{
                  fontSize: "var(--md-sys-typescale-label-medium-size)",
                  lineHeight: "var(--md-sys-typescale-label-medium-line-height)",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          RESPONSIVE STYLES (injected as style element)
          ===================================================== */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
          .page-content { padding-bottom: 24px !important; }
        }
        @media (min-width: 1200px) {
          .page-content { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
};
