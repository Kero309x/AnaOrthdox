import { localStore } from "@/shared/lib/storage";
// Material 3 color themes: each seed color generates full tonal palettes with
// the official HCT color space (@material/material-color-utilities, Google's
// reference implementation of the Material 3 color system). Primary tones come
// from the seed's hue/chroma, neutrals use low chroma of the same hue, and the
// accent ("gold") palette is the Material tertiary pattern: hue rotated +60.
import { Hct, argbFromHex, hexFromArgb } from "@material/material-color-utilities";

export type Seed = { id: string; label: string; hex: string };

export const SEEDS: Seed[] = [
  { id: "default", label: "الأساسي", hex: "#9c404f" },
  { id: "blue", label: "أزرق", hex: "#3c609e" },
  { id: "teal", label: "فيروزي", hex: "#18756d" },
  { id: "green", label: "أخضر", hex: "#35704c" },
  { id: "purple", label: "بنفسجي", hex: "#6d50a4" },
  { id: "orange", label: "برتقالي", hex: "#a85a17" },
];

// Every custom property the theme can override. Kept in one list so returning
// to the default seed can remove each inline override again.
export const VAR_NAMES = [
  "--color-cream",
  "--color-ink",
  "--color-primary",
  "--color-primary-dark",
  "--color-primary-deep",
  "--color-cross-bg",
  "--color-gold",
  "--color-gold-bright",
  "--color-gold-soft",
  "--color-gold-badge",
  "--color-gold-ink",
  "--color-rose",
  "--color-rose-badge",
  "--color-blush",
  "--color-navbg",
  "--color-nav-muted",
  "--color-nav-label",
  "--color-subtitle",
  "--color-night",
  "--color-night-card",
  "--color-night-nav",
  "--color-night-chip",
  "--color-night-ink",
  "--color-card-border",
  "--color-card-border-dark",
  "--color-divider",
  "--color-divider-dark",
  "--color-switch-off",
  "--color-moon",
  "--hero-1",
  "--hero-2",
  "--hero-3",
  "--hero-1d",
  "--hero-2d",
  "--hero-3d",
  "--starburst",
] as const;

export function varsFromSeed(hex: string): Record<string, string> {
  const hct = Hct.fromInt(argbFromHex(hex));
  const hue = hct.hue;
  const chroma = Math.max(hct.chroma, 40);
  const p = (tone: number) =>
    hexFromArgb(Hct.from(hue, chroma, tone).toInt());
  const n = (tone: number) => hexFromArgb(Hct.from(hue, 8, tone).toInt());
  const nv = (tone: number) => hexFromArgb(Hct.from(hue, 16, tone).toInt());
  const acc = (tone: number) =>
    hexFromArgb(Hct.from((hue + 60) % 360, 32, tone).toInt());
  return {
    "--color-cream": n(98),
    "--color-ink": nv(20),
    "--color-primary": p(40),
    "--color-primary-dark": p(35),
    "--color-primary-deep": p(25),
    "--color-cross-bg": p(42),
    "--color-gold": acc(85),
    "--color-gold-bright": acc(83),
    "--color-gold-soft": acc(94),
    "--color-gold-badge": acc(90),
    "--color-gold-ink": acc(28),
    "--color-rose": p(80),
    "--color-rose-badge": p(92),
    "--color-blush": p(94),
    "--color-navbg": nv(94),
    "--color-nav-muted": nv(40),
    "--color-nav-label": nv(60),
    "--color-subtitle": p(85),
    "--color-night": n(10),
    "--color-night-card": nv(18),
    "--color-night-nav": nv(16),
    "--color-night-chip": nv(30),
    "--color-night-ink": n(92),
    "--color-card-border": nv(90),
    "--color-card-border-dark": nv(32),
    "--color-divider": nv(92),
    "--color-divider-dark": nv(28),
    "--color-switch-off": nv(85),
    "--color-moon": nv(45),
    "--hero-1": p(42),
    "--hero-2": p(37),
    "--hero-3": p(32),
    "--hero-1d": p(36),
    "--hero-2d": p(31),
    "--hero-3d": p(26),
    "--starburst": p(55),
  };
}

function applyVars(vars: Record<string, string> | null) {
  const root = document.documentElement;
  if (!vars) {
    for (const name of VAR_NAMES) root.style.removeProperty(name);
    return;
  }
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
}

// Applies the seed immediately and persists both the choice and the derived
// variables, so the inline script in layout.tsx can replay them before paint.
export function applySeed(id: string) {
  if (id === "default") {
    applyVars(null);
    localStore.removeItem("themeVars");
    localStore.setItem("themeSeed", "default");
    syncFavicon();
    return;
  }
  const seed = SEEDS.find((s) => s.id === id);
  if (!seed) return;
  const vars = varsFromSeed(seed.hex);
  applyVars(vars);
  localStore.setItem("themeVars", JSON.stringify(vars));
  localStore.setItem("themeSeed", id);
  syncFavicon();
}

export function clearColorTheme() {
  applyVars(null);
  localStore.removeItem("themeVars");
  localStore.removeItem("themeSeed");
  syncFavicon();
}

export const FONT_MIN = 85;
export const FONT_MAX = 130;
export const FONT_STEP = 5;
export const FONT_DEFAULT = 100;

export function applyFontScale(pct: number) {
  const clamped = Math.min(FONT_MAX, Math.max(FONT_MIN, pct));
  document.documentElement.style.fontSize = `${clamped}%`;
  localStore.setItem("fontScale", String(clamped));
}

export function clearFontScale() {
  document.documentElement.style.fontSize = "";
  localStore.removeItem("fontScale");
  localStore.removeItem("fontSize");
}

// The browser tab icon follows the same two theme variables as the in-app
// mark. Rebuilt from the live computed colors so it works for every seed and
// for the default theme (which has no inline overrides).
export function syncFavicon() {
  if (typeof document === "undefined") return;
  const styles = getComputedStyle(document.documentElement);
  const bg = styles.getPropertyValue("--color-cross-bg").trim() || "#8b3747";
  const gold = styles.getPropertyValue("--color-gold").trim() || "#ffd9a8";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<path fill="${bg}" d="M31 1C19 1 9 13 4 29-2 49 1 73 12 89 23 105 47 101 63 93 85 82 96 58 99 39 104 17 77 7 57 4 46 2 39 1 31 1Z"/>` +
    `<path fill="${gold}" d="M47.8 28h5.1v12.3h10.3v5H52.9V73h-5.1V45.3H37.5v-5h10.3Z"/>` +
    `</svg>`;
  const href = "data:image/svg+xml," + encodeURIComponent(svg);
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}
