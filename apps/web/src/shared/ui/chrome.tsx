"use client";

import { localStore } from "@/shared/lib/storage";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppMark,
  ChevronRightIcon,
  GearIcon,
  HomeIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
} from "@/shared/ui/icons";
import { applyFontScale, applySeed, FONT_DEFAULT } from "@/shared/theme/theming";

// Theme: saved choice wins, otherwise the ?theme=dark share link,
// otherwise the system preference. Same behaviour on every page.
export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // The pre-paint script already resolved saved/system theme. Never reset it
    // to false on a route mount, which flashes light before dark is restored.
    const sync = () => setDark(document.documentElement.classList.contains("dark"));
    sync();
    window.addEventListener("app-theme-change", sync);
    return () => window.removeEventListener("app-theme-change", sync);
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStore.setItem("theme", next ? "dark" : "light");
    setDark(next);
    window.dispatchEvent(new Event("app-theme-change"));
  }

  return { dark, toggleTheme };
}

// Seed color for the Material 3 tonal theme. The derived variables are
// applied live and persisted, and replayed before paint by layout.tsx.
export function useColorTheme() {
  const [seedId, setSeedId] = useState("default");

  useEffect(() => {
    setSeedId(localStore.getItem("themeSeed") || "default");
  }, []);

  function pickSeed(id: string) {
    const saved = applySeed(id);
    setSeedId(id);
    return saved;
  }

  return { seedId, pickSeed };
}

// Font scale as a percentage (85–130). Applies to the root element so every
// rem-based size in the app follows, and persists across pages and visits.
export function useFontScale() {
  const [scale, setScale] = useState(FONT_DEFAULT);

  useEffect(() => {
    const saved = Number(localStore.getItem("fontScale"));
    if (saved >= 85 && saved <= 130) setScale(saved);
  }, []);

  function changeScale(next: number) {
    const saved = applyFontScale(next);
    setScale(next);
    return saved;
  }

  return { scale, changeScale };
}

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }

  return { toast, showToast };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-28 z-30 flex justify-center transition-all duration-300 ${
        message ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {message && (
        <span className="bg-ink dark:bg-night-ink dark:text-night rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {message}
        </span>
      )}
    </div>
  );
}

export function Header({
  title,
  dark,
  onToggleTheme,
  back,
  backHref = "/",
}: {
  title: string;
  dark: boolean;
  onToggleTheme: () => void;
  back?: boolean;
  backHref?: string;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pt-6">
      <div className="flex items-center gap-3">
        {back ? (
          <Link
            href={backHref}
            aria-label="رجوع"
            className="bg-blush dark:bg-night-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <ChevronRightIcon className="text-moon h-5 w-5 dark:text-night-ink" />
          </Link>
        ) : (
          <AppMark className="h-12 w-12 shrink-0" />
        )}
        <h1 className="text-ink dark:text-night-ink text-xl font-black">
          {title}
        </h1>
      </div>
      <button
        type="button"
        aria-label={dark ? "الوضع النهاري" : "الوضع الليلي"}
        onClick={onToggleTheme}
        className="bg-blush dark:bg-night-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
      >
        {dark ? (
          <SunIcon className="h-5 w-5 text-gold" />
        ) : (
          <MoonIcon className="text-moon h-5 w-5" />
        )}
      </button>
    </header>
  );
}

const tabs = [
  { key: "home", label: "الرئيسية", href: "/", Icon: HomeIcon },
  { key: "account", label: "حسابي", href: "/account", Icon: PersonIcon },
  { key: "settings", label: "الإعدادات", href: "/settings", Icon: GearIcon },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function BottomNav({ active }: { active?: TabKey }) {
  const pathname = usePathname();
  const current = active ?? (pathname === "/" ? "home" : pathname.startsWith("/account") ? "account" : pathname.startsWith("/settings") ? "settings" : undefined);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20">
      <div className="bg-navbg dark:bg-night-nav mx-auto flex max-w-md items-end justify-around px-6 pt-3 pb-5">
        {tabs.map(({ key, label, href, Icon }) => (
          <NavLink key={key} label={label} href={href} active={current === key}>
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  label,
  href,
  active,
  children,
}: {
  label: string;
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className="app-nav-link flex flex-col items-center gap-1.5">
      <span
        className={`app-nav-indicator flex h-9 w-16 items-center justify-center rounded-full ${
          active
            ? "bg-primary text-white"
            : "text-nav-muted dark:text-night-ink/80"
        }`}
      >
        {children}
      </span>
      <span
        className={`text-xs ${active ? "text-ink dark:text-night-ink font-extrabold" : "text-nav-label dark:text-night-ink/60 font-bold"}`}
      >
        {label}
      </span>
    </Link>
  );
}

// Card container shared by the account and settings sections.
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="divide-divider dark:divide-divider-dark rounded-3xl border border-card-border bg-white shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-ink/60 dark:text-night-ink/60 px-2 pt-6 pb-2 text-sm font-extrabold">
      {children}
    </h2>
  );
}

// A tappable settings row: icon badge, label, optional hint, trailing content.
export function Row({
  icon,
  label,
  hint,
  onClick,
  href,
  trailing,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick?: () => void;
  href?: string;
  trailing?: React.ReactNode;
  danger?: boolean;
}) {
  const body = (
    <>
      <span
        className={`icon-badge icon-badge--soft-square flex h-10 w-10 shrink-0 items-center justify-center ${
          danger
            ? "bg-rose-badge text-primary"
            : "bg-gold-soft text-gold-ink"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 text-right">
        <span
          className={`block text-[15px] font-extrabold ${
            danger ? "text-primary dark:text-rose" : "text-ink dark:text-night-ink"
          }`}
        >
          {label}
        </span>
        {hint && (
          <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
            {hint}
          </span>
        )}
      </span>
      {trailing}
    </>
  );
  const className =
    "flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-blush/60 dark:active:bg-night-chip/40";
  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }
  // No row-level action: the trailing control (e.g. a switch) is interactive,
  // so the row must be a plain div to avoid nesting buttons.
  return <div className={className}>{body}</div>;
}

// Sliding switch used for real local settings.
export function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="-my-2.5 flex h-12 w-12 shrink-0 items-center justify-center"
    >
      <span
        className={`relative h-7 w-12 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-switch-off dark:bg-night-chip"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? "right-6" : "right-1"
          }`}
        />
      </span>
    </button>
  );
}
