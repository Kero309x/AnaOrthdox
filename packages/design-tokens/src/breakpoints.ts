/**
 * Ana Orthodox — Material 3 Window Size Classes & Breakpoints
 * Based on official Material Design 3 adaptive layout specifications.
 */

export const BREAKPOINTS = {
  compact: "600px",
  medium: "840px",
  expanded: "1200px",
  large: "1600px",
} as const;

export type WindowSizeClass = "compact" | "medium" | "expanded" | "large";

export const WINDOW_SIZE_QUERIES = {
  compact: "(max-width: 599.98px)",
  medium: "(min-width: 600px) and (max-width: 839.98px)",
  expanded: "(min-width: 840px) and (max-width: 1199.98px)",
  large: "(min-width: 1200px)",
} as const;
