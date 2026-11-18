/**
 * Ana Orthodox — Material 3 Theme Variations & Color Roles
 * Extracted from brand asset: WhatsApp Image 2026-11-17 at 1.22.25 AM.jpeg
 */

export interface ThemeVariation {
  id: string;
  name: string;
  nameArabic: string;
  primary: string;
  surfaceContainer: string;
  description: string;
}

export const THEME_VARIATIONS: Record<string, ThemeVariation> = {
  emeraldGold: {
    id: "emerald-gold",
    name: "Emerald & Gold",
    nameArabic: "الزمرد والذهب",
    primary: "#145A48",
    surfaceContainer: "#D7F0E5",
    description:
      "Provisional default theme evoking traditional Coptic ecclesiastical textiles and icons.",
  },
  cobaltAmber: {
    id: "cobalt-amber",
    name: "Cobalt & Amber",
    nameArabic: "الكوبالت والعنبر",
    primary: "#1E40AF",
    surfaceContainer: "#DBEAFE",
    description: "Deep blue and warm amber.",
  },
  liturgicalPlum: {
    id: "liturgical-plum",
    name: "Liturgical Plum",
    nameArabic: "البرقوق الطقسي",
    primary: "#6B1D4A",
    surfaceContainer: "#FCE7F3",
    description: "Deep liturgical purple appropriate for solemn seasons and fasts.",
  },
  royalIndigo: {
    id: "royal-indigo",
    name: "Royal Indigo",
    nameArabic: "النيلة الملكية",
    primary: "#3730A3",
    surfaceContainer: "#E0E7FF",
    description: "Majestic indigo tone.",
  },
  copticTerracotta: {
    id: "coptic-terracotta",
    name: "Coptic Terracotta",
    nameArabic: "الفخار القبطي",
    primary: "#9A3412",
    surfaceContainer: "#FFEDD5",
    description: "Warm terracotta clay reminiscent of ancient Coptic monastic dwellings.",
  },
  deepBurgundy: {
    id: "deep-burgundy",
    name: "Deep Burgundy",
    nameArabic: "العنابي الداكن",
    primary: "#881337",
    surfaceContainer: "#FFE4E6",
    description: "Rich burgundy used in ecclesiastical vestments.",
  },
  midnightSlate: {
    id: "midnight-slate",
    name: "Midnight Slate",
    nameArabic: "حجر منتصف الليل",
    primary: "#1E293B",
    surfaceContainer: "#CCFBF1",
    description: "Quiet contemplative dark slate.",
  },
  oliveOchre: {
    id: "olive-ochre",
    name: "Olive & Ochre",
    nameArabic: "الزيتون والمغرة",
    primary: "#3F6212",
    surfaceContainer: "#ECFCCB",
    description: "Natural olive branch green with golden ochre.",
  },
};

/**
 * Material 3 Semantic Color Tokens for the Default Provisional Theme (Emerald & Gold)
 */
export const COLOR_ROLES = {
  light: {
    primary: "#145A48",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D7F0E5",
    onPrimaryContainer: "#002018",
    secondary: "#4C635A",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CEE9DC",
    onSecondaryContainer: "#082018",
    tertiary: "#3F6374",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#C3E8FC",
    onTertiaryContainer: "#001F2A",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#FBFDF9",
    onBackground: "#191C1B",
    surface: "#FBFDF9",
    onSurface: "#191C1B",
    surfaceVariant: "#DBE5DF",
    onSurfaceVariant: "#3F4945",
    outline: "#6F7975",
    outlineVariant: "#BFC9C3",
  },
  dark: {
    primary: "#77D8BE",
    onPrimary: "#00382B",
    primaryContainer: "#00513F",
    onPrimaryContainer: "#94F5DA",
    secondary: "#B2CCC1",
    onSecondary: "#1E352D",
    secondaryContainer: "#344B43",
    onSecondaryContainer: "#CEE9DC",
    tertiary: "#A7CCE0",
    onTertiary: "#0B3444",
    tertiaryContainer: "#254B5B",
    onTertiaryContainer: "#C3E8FC",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#191C1B",
    onBackground: "#E1E3DF",
    surface: "#191C1B",
    onSurface: "#E1E3DF",
    surfaceVariant: "#3F4945",
    onSurfaceVariant: "#BFC9C3",
    outline: "#89938E",
    outlineVariant: "#3F4945",
  },
};
