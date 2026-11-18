/**
 * Ana Orthodox — Material 3 Typography Tokens (Arabic & Coptic Optimized)
 */

export const TYPOGRAPHY = {
  fontFamilies: {
    primaryArabic:
      "'Noto Naskh Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    copticScript: "'Noto Sans Coptic', sans-serif",
    systemUi: "system-ui, -apple-system, sans-serif",
  },
  typeScale: {
    displayLarge: {
      fontSize: "3.5rem", // 56px
      lineHeight: "4rem", // 64px
      fontWeight: "700",
      letterSpacing: "0",
    },
    displayMedium: {
      fontSize: "2.8rem", // 45px
      lineHeight: "3.25rem", // 52px
      fontWeight: "700",
      letterSpacing: "0",
    },
    headlineLarge: {
      fontSize: "2rem", // 32px
      lineHeight: "2.5rem", // 40px
      fontWeight: "700",
      letterSpacing: "0",
    },
    headlineMedium: {
      fontSize: "1.75rem", // 28px
      lineHeight: "2.25rem", // 36px
      fontWeight: "600",
      letterSpacing: "0",
    },
    titleLarge: {
      fontSize: "1.375rem", // 22px
      lineHeight: "1.75rem", // 28px
      fontWeight: "600",
      letterSpacing: "0",
    },
    titleMedium: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5rem", // 24px
      fontWeight: "600",
      letterSpacing: "0.15px",
    },
    bodyLarge: {
      fontSize: "1.125rem", // 18px (scripture reading baseline)
      lineHeight: "1.875rem", // 30px (high line-height for Arabic Tashkeel)
      fontWeight: "400",
      letterSpacing: "0.5px",
    },
    bodyMedium: {
      fontSize: "0.9375rem", // 15px
      lineHeight: "1.5rem", // 24px
      fontWeight: "400",
      letterSpacing: "0.25px",
    },
    labelLarge: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.25rem", // 20px
      fontWeight: "600",
      letterSpacing: "0.1px",
    },
  },
};

export const SHAPES = {
  none: "0px",
  extraSmall: "4px",
  small: "8px",
  medium: "12px",
  large: "16px",
  extraLarge: "28px",
  full: "9999px",
};

export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
};
