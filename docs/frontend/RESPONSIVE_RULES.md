# RESPONSIVE_RULES.md

**Purpose:** Layout grid specifications, breakpoint definitions, RTL bidirectional rules, and responsive presentation doctrine.  
**Scope:** Material 3 responsive layouts across mobile, tablet, desktop, and large displays  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Design System Agent  
**Related Documents:** COMPONENT_CATALOG.md, SCREEN_CATALOG.md, INTERACTION_CATALOG.md

---

## 1. Material 3 Breakpoint Architecture

| Window Size Class                     | Breakpoint Range | Columns | Margin | Recommended Navigation Pattern                            |
| ------------------------------------- | ---------------- | ------- | ------ | --------------------------------------------------------- |
| **Compact** (Mobile)                  | `< 600px`        | 4       | 16px   | Bottom Navigation Bar (RTL aligned, 3-5 items)            |
| **Medium** (Tablet / Foldable)        | `600px – 839px`  | 8       | 24px   | Navigation Rail (docked on the right in RTL)              |
| **Expanded** (Laptop / Small Desktop) | `840px – 1199px` | 12      | 24px   | Navigation Drawer (permanent on the right in RTL)         |
| **Large** (Desktop / Ultra-wide)      | `≥ 1200px`       | 12      | 32px   | Permanent Navigation Drawer + Contextual Inspector (Left) |

---

## 2. RTL Layout Adaptation Rules

```
+--------------------------------------------------------------+
| [Context Inspector]         [Main Content]      [Nav Drawer] |
| (Left in RTL)                                  (Right in RTL)|
| Bookmarks / Comments        Bible Verses Text   Menu Items   |
+--------------------------------------------------------------+
```

1. **Logical Spacing:**
   - Always use `margin-inline-start`, `margin-inline-end`, `padding-inline-start`, `padding-inline-end`.
   - Never write `margin-left` or `margin-right` in application CSS.
2. **Icon Mirroring:**
   - Navigational arrows indicating direction/progression are mirrored: Back arrow points Right; Forward arrow points Left.
   - Symmetric icons (Cross, Chalice, Heart, Search, Settings) remain un-mirrored.
3. **Typography & Readability:**
   - Arabic text requires 10-15% larger line height (`leading-relaxed` or `line-height: 1.7`) compared to Latin scripts to prevent calligraphic diacritic (Tashkeel) collisions.
   - Minimum font size for body reading text is `18px` (`text-lg`) on mobile screens to ensure effortless scripture reading.
4. **Touch Ergonomics on Compact Screens:**
   - Minimum tap target is `48px × 48px`.
   - Primary reading action buttons (font size adjustment, night mode, next chapter) placed in bottom thumb-zone.
