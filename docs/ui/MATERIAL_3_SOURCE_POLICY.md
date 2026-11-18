# Material Design 3 Source Policy & Component Governance
## Ana Orthodox Platform — Design System Architecture Contract

**Status:** APPROVED & ENFORCED  
**Version:** 2.0.0 (Phase MATERIAL-3-SOURCE-LOCKED)  
**Authority:** Ana Orthodox AI Agent Governance & Product Owner  
**Repository Path:** `docs/ui/MATERIAL_3_SOURCE_POLICY.md`  
**Monorepo Packages:** `@ana-orthodox/ui`, `@ana-orthodox/design-tokens`, `@ana-orthodox/web`

---

## 1. Executive Mandate & Governance Principles

The Ana Orthodox digital platform operates under a strict **Source-Locked Material Design 3 Architecture**. Improvisation of component semantics, substitution of generic UI kits, or approximation of Material 3 using ad-hoc CSS is categorically prohibited.

Every interactive element, elevation surface, color token, typography style, shape, and transition must originate from the approved Material Design 3 source hierarchy.

---

## 2. Mandatory Design Sources & Hierarchy

| Priority | Source Tier | Repository / Specification | Authority & Scope |
|---|---|---|---|
| **Tier 1** | **Official Material 3 Web Guidelines** | `https://m3.material.io/develop/web` | Absolute baseline for semantic color roles, typography scales, 48px touch targets, surface hierarchy, and elevation tokens. |
| **Tier 2** | **Official Material Web Components** | `@material/web` v2.5.0 (`github.com/material-components/material-web`) | Official Google implementation of M3 Web Components. Primary source for Buttons, TextFields, Checkboxes, Switches, Radios, Sliders, Dialogs, Menus, Tabs, Chips, Progress, and Dividers. |
| **Tier 3** | **Material 3 Expressive (M3E)** | `@m3e/web` v2.13.0 (`github.com/matraic/m3e`) | Platform-native M3 Expressive components. Primary source for Cards (`<m3e-card>`), Bottom Sheets (`<m3e-bottom-sheet>`), Snackbars (`<m3e-snackbar>`), and genuine Shimmer Skeletons (`<m3e-skeleton>`). |
| **Tier 4** | **Approved Brand Design Tokens** | `@ana-orthodox/design-tokens` (`packages/design-tokens`) | Canonical Coptic Emerald & Gold palette (`#145A48` / `#D7F0E5`), Noto Naskh Arabic typography, Noto Sans Coptic fonts, and 8 ecclesiastical color variations. |
| **Tier 5** | **Custom Architectural Primitives** | `@ana-orthodox/ui` (`packages/ui/src`) | STRICTLY RESTRICTED to components where no suitable Tier 2 or Tier 3 component exists (e.g. `SourceProvenanceBadge`, `EmptyState`, `ErrorState`, `AppLogo`). Must inherit Tier 1 tokens, RTL layout, and WCAG 2.2 accessibility. |

---

## 3. GitHub Agent Skills Utilization Matrix

The following specialized GitHub skills were audited, loaded, and directly guided this implementation:

| Skill Name | Repository / Source | Why Selected | Applied During Implementation |
|---|---|---|---|
| **`building-components`** | `.agents/skills/building-components` | Composable, accessible UI component engineering, slot architectures, and polymorphic ref forwarding. | Authoring thin React 19 wrappers over `@material/web` and `@m3e/web` web components. |
| **`vercel-composition-patterns`** | `.agents/skills/vercel-composition-patterns` | Scalable React composition patterns, avoiding boolean prop explosion, compound component design. | Architecting explicit variant components (`FilledButton`, `OutlinedButton`, `ElevatedCard`, etc.) and compound slots. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices` | Next.js 16 App Router performance, zero hydration errors, client boundary management. | Implementing `initMaterialWeb()` isomorphic lazy loader in `apps/web/src/components/providers.tsx`. |
| **`web-design-guidelines`** | `.agents/skills/web-design-guidelines` | WCAG 2.2 accessibility compliance, 48px touch targets, color contrast, and keyboard navigation. | Enforcing `min-h-[48px]`, explicit ARIA labels, focus rings, and `aria-busy` states on interactive elements. |
| **`ui-ux-pro-max`** | `.gemini/config/skills/ui-ux-pro-max` | Material 3 token mapping, surface hierarchy, motion tokens, and Arabic typography ergonomics. | Aligning CSS variables to Material Web's `--md-sys-color-*` and `--md-sys-typescale-*` standards. |
| **`source-driven-development`** | `.gemini/config/skills/source-driven-development` | Grounding all implementation decisions in official vendor documentation. | Eliminating invented styles and locking component tags to `@material/web` and `@m3e/web`. |

---

## 4. Library Compatibility & Technical Audit

### A. React 19 & Next.js 16 App Router Compatibility
1. **Native Custom Element Support:** React 19 natively renders custom elements (Web Components). React 19 distinguishes attributes from properties based on custom element instance prototypes, allowing seamless binding of `disabled`, `value`, `checked`, and custom events.
2. **SSR & Hydration Safety:** Web components depend on `window.customElements`. In server environments (`node.exe`), `customElements.define` cannot execute. To guarantee zero hydration mismatch errors, all custom element tags are rendered as semantic HTML tags on the server, and hydrated seamlessly on the client via `initMaterialWeb()` inside client boundaries (`"use client"`).
3. **Event Interoperability:** Custom events (e.g., `closed` on `<md-dialog>`, `change` on `<md-tabs>`) are attached via typed React `useEffect` hooks and standard DOM event listeners, ensuring clean memory cleanup on component unmount.

### B. Upstream Maintenance Analysis
- **Official Material Web (`@material/web` 2.5.0):** Google's Material Web team has placed `@material/web` in maintenance mode (feature-frozen, stable, critical security fixes only). The package is production-stable and represents the authoritative reference implementation for M3 web components.
- **Material 3 Expressive (`@m3e/web` 2.13.0):** Created by matraic as a platform-native community implementation extending Material Web with Expressive features (motion, cards, bottom sheets, snackbars, skeletons, paginators). It is actively maintained and strictly complementary to `@material/web`.

---

## 5. Component Source Decision Matrix (21 Components)

| Component | Official Material Web (`@material/web`) | Material 3 Expressive (`@m3e/web`) | Final Selection | Technical & Architectural Rationale |
|---|---|---|---|---|
| **Buttons** | `<md-filled-button>`, `<md-outlined-button>`, `<md-text-button>`, `<md-elevated-button>`, `<md-filled-tonal-button>` | `button` | **Official Material Web** | Authoritative M3 button implementation with built-in ripple, focus rings, and elevation. |
| **Icon Buttons** | `<md-icon-button>`, `<md-filled-icon-button>`, `<md-filled-tonal-icon-button>`, `<md-outlined-icon-button>` | `icon-button` | **Official Material Web** | Standard 48px touch targets, circular focus rings, four distinct M3 variants. |
| **Cards** | Labs only (unreleased) | `<m3e-card>` | **M3E (`@m3e/web/card`)** | Material Web kept cards in labs; M3E provides production-ready elevated, filled, and outlined cards with M3 elevation and shape tokens. |
| **Text Fields** | `<md-outlined-text-field>`, `<md-filled-text-field>` | `form-field` | **Official Material Web** | Full floating labels, supporting text, error states, and prefix/suffix slots. |
| **Password Fields** | Built on `<md-outlined-text-field>` | N/A | **Official Material Web Wrapper** | Extends `<md-outlined-text-field>` with trailing reveal/hide toggle and NIST SP 800-63B requirements. |
| **Dialogs** | `<md-dialog>` | `dialog` | **Official Material Web** | Accessible modal dialog with native `show()` and `close()` methods, headline/content/actions slots. |
| **Navigation Bar** | Labs only | `<m3e-nav-bar>` / M3 tokenized bar | **M3 Guidelines (`@ana-orthodox/ui`)** | 80px fixed bottom bar with active pill indicator (64x32px), strictly tokenized via `--md-sys-color-*`. |
| **Navigation Rail** | Labs only | `<m3e-nav-rail>` / M3 tokenized rail | **M3 Guidelines (`@ana-orthodox/ui`)** | 80px side rail for tablets (768px-1024px) with vertical icon/label pairs and active indicators. |
| **Navigation Drawer** | Labs only | `<m3e-drawer-container>` / M3 tokenized drawer | **M3 Guidelines (`@ana-orthodox/ui`)** | 360px modal/standard drawer for desktop, compliant with M3 elevation and item pill indicators. |
| **Tabs** | `<md-tabs>`, `<md-primary-tab>`, `<md-secondary-tab>` | `tabs` | **Official Material Web** | Official M3 tab indicator with RTL overflow containment and full keyboard navigation. |
| **Chips** | `<md-chip-set>`, `<md-assist-chip>`, `<md-filter-chip>`, `<md-suggestion-chip>` | `chips` | **Official Material Web** | Official M3 chips with checkmark indicators, assist icons, and accessible selected states. |
| **Checkbox** | `<md-checkbox>` | `checkbox` | **Official Material Web** | Official M3 animated checkbox with checked, unchecked, and indeterminate states. |
| **Radio** | `<md-radio>` | `radio-group` | **Official Material Web** | Official M3 radio button with animated selection circle and group keyboard accessibility. |
| **Switch** | `<md-switch>` | `switch` | **Official Material Web** | Official M3 switch with distinct track, thumb, and icon slots (moon/sun or check). |
| **Select** | `<md-outlined-select>`, `<md-filled-select>`, `<md-select-option>` | `select` | **Official Material Web** | Official M3 dropdown select with menu anchor and floating headline label. |
| **Slider** | `<md-slider>` | `slider` | **Official Material Web** | Official M3 continuous/discrete slider with value popup bubble and ticks. |
| **Menus** | `<md-menu>`, `<md-menu-item>` | `menu` | **Official Material Web** | Official M3 anchored popup menu with keyboard navigation and submenu support. |
| **Snackbar** | Labs only | `<m3e-snackbar>` | **M3E (`@m3e/web/snackbar`)** | Material Web kept snackbar in labs; M3E provides production M3 snackbar with action buttons. |
| **Progress** | `<md-circular-progress>`, `<md-linear-progress>` | `progress-indicator` | **Official Material Web** | Official M3 indeterminate and determinate circular/linear indicators with four-color support. |
| **Skeleton / Loading** | Labs only | `<m3e-skeleton>` + Shimmer CSS Wave | **M3E + M3 Tokens** | True traveling light wave shimmer (`@keyframes m3-shimmer-wave 1.8s infinite`) with static reduced-motion fallback. |
| **FAB (Floating Action Button)** | `<md-fab>` | `fab` | **Official Material Web** | Official M3 FAB with surface/primary/secondary variants, extended labels, and 56px elevation. |
| **Bottom Sheet** | Labs only | `<m3e-bottom-sheet>` | **M3E (`@m3e/web/bottom-sheet`)** | Material Web lacks bottom sheet; M3E provides authentic M3 compact sheet with drag handle. |

---

## 6. Design Tokens & Visual Harmony

### A. Semantic Color Roles (Canonical Emerald & Gold)
```css
/* Light Mode */
--md-sys-color-primary: #145A48;
--md-sys-color-on-primary: #FFFFFF;
--md-sys-color-primary-container: #D7F0E5;
--md-sys-color-on-primary-container: #002018;

--md-sys-color-secondary: #4C635A;
--md-sys-color-on-secondary: #FFFFFF;
--md-sys-color-secondary-container: #CEE9DC;
--md-sys-color-on-secondary-container: #082018;

--md-sys-color-surface: #FBFDF9;
--md-sys-color-on-surface: #191C1B;
--md-sys-color-surface-container: #EFF2EE;
--md-sys-color-surface-container-high: #E9ECE8;
--md-sys-color-surface-container-highest: #E3E6E2;

--md-sys-color-outline: #6F7975;
--md-sys-color-outline-variant: #BFC9C3;
```

```css
/* Dark Mode */
--md-sys-color-primary: #77D8BE;
--md-sys-color-on-primary: #00382B;
--md-sys-color-primary-container: #00513F;
--md-sys-color-on-primary-container: #94F5DA;

--md-sys-color-surface: #191C1B;
--md-sys-color-on-surface: #E1E3DF;
--md-sys-color-surface-container: #1D201E;
--md-sys-color-surface-container-high: #272B29;
```

### B. Typography Baseline
- **Arabic Font Family:** Noto Naskh Arabic (`--font-family-arabic`) with `line-height: 1.7` baseline for clear diacritics and sacred text readability.
- **Coptic Font Family:** Noto Sans Coptic (`--font-family-coptic`).
- **Material 3 Scales:** Display (57px/45px/36px), Headline (32px/28px/24px), Title (22px/16px/14px), Body (16px/14px/12px), Label (14px/12px/11px).

### C. Authentic Shimmer Animation Contract
```css
@keyframes m3-shimmer-wave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.m3-skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--md-sys-skeleton-base) 0%,
    var(--md-sys-skeleton-highlight) 50%,
    var(--md-sys-skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: m3-shimmer-wave 1.8s infinite ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .m3-skeleton-shimmer {
    animation: none !important;
    background: var(--md-sys-skeleton-base) !important;
  }
}
```

---

## 7. RTL & Responsive Governance

### A. RTL Coordinate System & Containment
In Chromium-based browsers, elements overflowing horizontally in right-to-left (`dir="rtl"`) layouts can generate negative coordinates (e.g. `left: -848px`). Without explicit containment, this expands the document's total scroll width, resulting in viewport displacement.
**Mandatory Pattern:** All horizontal scrolling containers (such as `<md-tabs>`) MUST be wrapped with:
```tsx
<div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
  <md-tabs style={{ display: "flex", width: "100%", maxWidth: "100%", overflowX: "auto", contain: "paint" }}>
    ...
  </md-tabs>
</div>
```
This guarantees `document.documentElement.scrollWidth === viewport.width` at 390px, 360px, and 320px with zero horizontal drift.

### B. Adaptive Layout Breakpoints
- **Compact Viewports (< 768px):** Navigation Bar (80px bottom bar with 64x32px active pill), full-width cards, stack layouts.
- **Medium Viewports (768px - 1024px):** Navigation Rail (80px side rail with vertical icons/labels), 2-column grid.
- **Expanded / Large Viewports (>= 1024px):** Top App Bar with horizontal navigation links, 360px Navigation Drawer, 3-4 column grid, max container width `1280px` (`max-w-7xl mx-auto`).

---

## 8. Brand Logo Integrity

The original brand logo is sourced directly from the owner-provided asset (`WhatsApp Image 2026-11-17 at 1.22.25 AM.jpeg`).
- **Squircle Asset:** `public/brand/logo-squircle.png` (96x96, 72x72, 48x48, 36x36px).
- **Lettermark Asset:** `public/brand/logo-mark.png`.
- **Favicon & Apple Touch Icon:** `public/favicon.ico`, `public/apple-touch-icon.png`.
- **Integrity Rule:** Replacement with generic crosses, emoji, or text-only placeholders is strictly prohibited.
