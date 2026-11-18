# COMPONENT_CATALOG.md — Material 3 Component Registry

| Field            | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| **Document**     | COMPONENT_CATALOG.md                                      |
| **Purpose**      | Canonical registry of all shared Material 3 UI components |
| **Scope**        | `@ana-orthodox/ui` & `apps/web` components                |
| **Status**       | **ACTIVE & IMPLEMENTED** (Phase UI-0 Baseline)            |
| **Last Updated** | 2026-11-17                                                |
| **Owner**        | Design System Agent & Frontend Agent                      |
| **Related**      | ADR-0009.md, RESPONSIVE_RULES.md, SKILLS_INVENTORY.md     |

---

## 1. Overview & Architectural Principles

All shared components reside in `@ana-orthodox/ui`, consume semantic tokens from `@ana-orthodox/design-tokens`, and follow official **Material Design 3 (M3)** specifications:

1. **RTL Native:** Arabic typography (`Noto Naskh Arabic`), mirrored progress tracks, logical inline paddings (`ps-*`, `pe-*`), and right-to-left layout hierarchy.
2. **Accessible (WCAG 2.2 AA):** Minimum 48x48px touch targets, explicit ARIA roles (`dialog`, `menu`, `tablist`, `progressbar`, `status`, `alert`, `region`), and visible dual-ring focus states (`focus-visible`).
3. **Compound & Composable:** Conforms to `vercel-composition-patterns` and `building-components` guidelines.
4. **10-State Data Model:** Data-driven components handle all 10 states: Initial, Loading, Loaded, Empty, No Search Results, Error, Offline, Partial Data, Refreshing, and Disabled.
5. **Skeleton & Shimmer System:** Layout-mimicking skeleton components respecting `prefers-reduced-motion` with zero cumulative layout shift (CLS).

---

## 2. Implemented Material 3 Components Inventory

| Component ID | Component Name                    | Category        | Implemented Variants                                         | Key Props & Features                                                                 | Accessibility & RTL Features                                                                        | Test Status |
| :----------- | :-------------------------------- | :-------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :---------: |
| `CMP-M3-001` | **`AppButton`**                   | Action          | `filled`, `tonal`, `outlined`, `text`, `elevated`            | `variant`, `size` (sm/md/lg), `leadingIcon`, `trailingIcon`, `isLoading`, `disabled` | Min 48px touch target; `aria-busy` during loading; active scale feedback.                           |  **PASS**   |
| `CMP-M3-002` | **`AppIconButton`**               | Action          | `standard`, `filled`, `tonal`, `outlined`                    | `aria-label` (mandatory), `size` (sm/md), `disabled`                                 | 48px target; required accessible label; active press animation.                                     |  **PASS**   |
| `CMP-M3-003` | **`AppCard`**                     | Surface         | `elevated`, `filled`, `outlined`                             | `variant`, `interactive`, `className`                                                | 16px corner radii (M3 large shape); elevation shadows; dark mode surfaces.                          |  **PASS**   |
| `CMP-M3-004` | **`AppBadge`**                    | Status          | `primary`, `secondary`, `neutral`, `error`                   | `label`, `variant`                                                                   | Compact pill shape; high contrast text.                                                             |  **PASS**   |
| `CMP-M3-005` | **`AppTextField`**                | Form            | `outlined`, `filled`                                         | `label`, `supportingText`, `errorText`, `leadingIcon`, `trailingIcon`                | `aria-invalid` on error; `aria-describedby` error mapping; right-aligned Arabic text.               |  **PASS**   |
| `CMP-M3-006` | **`AppSelect`**                   | Form            | `outlined`                                                   | `label`, `options`, `placeholder`, `supportingText`, `errorText`                     | Native accessible select; custom RTL chevron indicator on left.                                     |  **PASS**   |
| `CMP-M3-007` | **`AppDialog`**                   | Feedback        | Modal dialog                                                 | `isOpen`, `onClose`, `title`, `icon`, `actions`                                      | ARIA `role="dialog"`; `aria-modal="true"`; ESC key listener; background scroll lock; 28px corners.  |  **PASS**   |
| `CMP-M3-008` | **`AppMenu`**                     | Navigation      | Dropdown menu                                                | `trigger`, `items`, `align` (`start`/`end`)                                          | ARIA `role="menu"`; `role="menuitem"`; click-outside auto-dismiss.                                  |  **PASS**   |
| `CMP-M3-009` | **`AppTopAppBar`**                | Navigation      | Sticky Header                                                | `title`, `leadingIcon`, `actions`                                                    | 64px height; backdrop blur; RTL header layout.                                                      |  **PASS**   |
| `CMP-M3-010` | **`AppNavigationBar`**            | Navigation      | Bottom Bar                                                   | `destinations`                                                                       | 80px height; 64x32px active pill indicator; compact viewports (< 768px).                            |  **PASS**   |
| `CMP-M3-011` | **`AppNavigationRail`**           | Navigation      | Side Rail                                                    | `destinations`, `headerAction`                                                       | 80px width; vertical destination stack; medium viewports (768px – 1024px).                          |  **PASS**   |
| `CMP-M3-012` | **`AppTabs`**                     | Navigation      | `primary`, `secondary`                                       | `tabs`, `activeTabId`, `onChange`, `variant`                                         | ARIA `role="tablist"`; `role="tab"`; 3px active underline bar; keyboard arrow navigation.           |  **PASS**   |
| `CMP-M3-013` | **`AppChip`**                     | Action / Filter | `assist`, `filter`, `input`, `suggestion`                    | `label`, `selected`, `leadingIcon`, `trailingIcon`                                   | 32px height; `aria-pressed` on filter chips; 8px small corners.                                     |  **PASS**   |
| `CMP-M3-014` | **`AppList`** & **`AppListItem`** | Display         | 1-line, 2-line, 3-line list                                  | `headline`, `supportingText`, `overlineText`, `leading`, `trailing`, `interactive`   | ARIA `role="list"`; interactive keyboard tab-index; rounded-2xl list container.                     |  **PASS**   |
| `CMP-M3-015` | **`AppSnackbar`**                 | Feedback        | Toast notification                                           | `message`, `isOpen`, `onClose`, `actionLabel`, `duration`                            | ARIA `role="status"`; auto-dismiss timer; floating bottom placement; high contrast inverse surface. |  **PASS**   |
| `CMP-M3-016` | **`AppProgressIndicator`**        | Feedback        | `linear`, `circular` (determinate & indeterminate)           | `type`, `value` (0–100), `size`                                                      | ARIA `role="progressbar"`; `aria-valuenow`; 4px linear track; rotating circular indicator.          |  **PASS**   |
| `CMP-M3-017` | **`Skeleton`** Suite              | Loading         | Text, Avatar, Image, Card, List, Calendar, Page              | `shimmer` (boolean)                                                                  | `aria-hidden="true"`; `animate-pulse`; disabled on `prefers-reduced-motion`.                        |  **PASS**   |
| `CMP-M3-018` | **`StateViews`** Suite            | Presentation    | Empty, Error, Offline, NoResults, InlineLoading, PageLoading | `title`, `message`, `onRetry`, `onClear`                                             | Standardized pattern for all 10 data states with retry actions and descriptive error codes.         |  **PASS**   |
| `CMP-M3-019` | **`SourceProvenanceBadge`**       | Trust & Gov     | Trust Badge & Detail Modal                                   | `sourceId`, `institution`, `title`, `edition`, `approvalStatus`                      | User-facing source inspection dialog; connects UI content directly to `SOURCE_REGISTRY.md`.         |  **PASS**   |

---

## 3. Responsive Component Adaptation Matrix

| Component           | Compact Viewports (< 600px)                               | Medium Viewports (600px – 840px)            | Expanded Viewports (> 840px)                      |
| :------------------ | :-------------------------------------------------------- | :------------------------------------------ | :------------------------------------------------ |
| **Main Navigation** | Fixed Bottom `AppNavigationBar` (80px height)             | Left/Right `AppNavigationRail` (80px width) | Top App Bar + Integrated Navigation Drawer        |
| **Cards Grid**      | 1 Column (`grid-cols-1`)                                  | 2 Columns (`grid-cols-2`)                   | 3 Columns (`grid-cols-3` or List-Detail split)    |
| **Dialogs**         | Full width with 16px margins (`max-w-[calc(100vw-32px)]`) | Centered modal (`max-w-md`)                 | Centered modal (`max-w-lg`)                       |
| **Touch Targets**   | All interactive controls $\ge 48\text{px}$                | All interactive controls $\ge 48\text{px}$  | Standard cursor & touch targets $\ge 48\text{px}$ |
