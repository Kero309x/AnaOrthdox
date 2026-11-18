# SKILLS_INVENTORY.md — Project Agent Skills & Toolchain Governance

**Purpose:** Authoritative inventory and security governance for agent skills installed in the Ana Orthodox project.  
**Scope:** Engineering Agent Environment & UI Component Toolchain  
**Status:** AUDITED & APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Engineering Orchestrator & Principal Software Architect  
**Related Documents:** AGENT_REGISTRY.md, HANDOFF_PROTOCOL.md, QUALITY_GATES.md, ADR-0009.md

---

## 1. Project-Level Installed Agent Skills

The following skills are pinned and installed under `.agents/skills/` in the project repository:

| Skill Name                        | Source Repository           | Local Path                                            | License | Purpose & Agent Trigger                                                                                                 | Security Review & Compatibility                                                                                           |
| :-------------------------------- | :-------------------------- | :---------------------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **`vercel-react-best-practices`** | `vercel-labs/agent-skills`  | `.agents/skills/vercel-react-best-practices/SKILL.md` | MIT     | Next.js 16 App Router and React 19 performance, hydration-safe patterns, server/client boundary segregation.            | **CLEAN / VERIFIED** (Static markdown guidance, no dangerous shell scripts; full React 19 & Next.js 16 compatibility).    |
| **`vercel-composition-patterns`** | `vercel-labs/agent-skills`  | `.agents/skills/vercel-composition-patterns/SKILL.md` | MIT     | Designing scalable component APIs, compound components, eliminating boolean prop explosion, React 19 patterns.          | **CLEAN / VERIFIED** (Static markdown guidance; directly governs `@ana-orthodox/ui` component APIs).                      |
| **`web-design-guidelines`**       | `vercel-labs/agent-skills`  | `.agents/skills/web-design-guidelines/SKILL.md`       | MIT     | WCAG 2.2 AA accessibility audit, keyboard navigation, focus indicators, minimum touch targets (48x48px).                | **CLEAN / VERIFIED** (Static rules; applied across all M3 components and pages).                                          |
| **`building-components`**         | `vercel/components.build`   | `.agents/skills/building-components/SKILL.md`         | MIT     | Component taxonomy (primitives, components, blocks), state management, design tokens, slots, and polymorphic rendering. | **CLEAN / VERIFIED** (Static guidelines; governs M3 token binding and component packaging).                               |
| **`next-dev-loop`**               | `vercel/next.js`            | `.agents/skills/next-dev-loop/SKILL.md`               | MIT     | Verifying live Next.js runtime behavior, server-side console logs, route rendering, and dev-loop verification.          | **CLEAN / VERIFIED** (Standard Next.js dev verification loop; works directly with `pnpm --filter @ana-orthodox/web dev`). |
| **`agent-browser`**               | `vercel-labs/agent-browser` | `.agents/skills/agent-browser/SKILL.md`               | MIT     | Browser automation, accessibility tree extraction, automated DOM verification, and visual proof across viewports.       | **CLEAN / VERIFIED** (CLI discovery stub & Playwright/Puppeteer browser inspection contracts).                            |

---

## 2. Skill Usage Registry for Phase UI-0

| Engineering Milestone                        | Applicable Installed Skill                            | How Invoked                                                                                                                         |
| :------------------------------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Material 3 Component System Architecture** | `building-components` & `vercel-composition-patterns` | Used to structure `@ana-orthodox/ui` into primitives, state machines, compound components, and slots.                               |
| **React Component Implementation**           | `vercel-react-best-practices`                         | Used to ensure server/client boundary clarity (`"use client"` only where stateful), eliminate hydration mismatches.                 |
| **Complete UI State Machine (10 States)**    | `building-components`                                 | Governs the 10 data states: Initial, Loading, Loaded, Empty, No Search Results, Error, Offline, Partial Data, Refreshing, Disabled. |
| **Skeleton & Shimmer Loading System**        | `web-design-guidelines` & `building-components`       | Enforces zero layout shifts, subtle shimmer, and strict `prefers-reduced-motion` compliance.                                        |
| **Responsive & Adaptive Strategy**           | `web-design-guidelines`                               | Fluid breakpoints (Compact, Medium, Expanded), minimum 48px touch targets, safe area insets.                                        |
| **Accessibility & RTL Verification**         | `web-design-guidelines`                               | WCAG 2.2 AA contrast ratios, ARIA attributes, semantic HTML, keyboard focus rings (`focus-visible`).                                |
| **Runtime Dev Verification**                 | `next-dev-loop` & `agent-browser`                     | Running local dev server, testing rendered DOM across viewports, recording visual evidence.                                         |

---

## 3. Skill Security & Governance Rules

1. **No Arbitrary Script Execution:** External skills may contain instructions and templates; no untrusted binaries or background daemons are permitted to execute without explicit review.
2. **Project Scope Isolation:** Installed skills reside in `.agents/skills/` and are tracked in git for version consistency across agents and machines.
3. **Ecclesiastical & Theological Authority:** External skills advise strictly on software engineering, accessibility, and UI performance. Theological, liturgical, and Coptic canon governance remains exclusively governed by `docs/features/` and the Holy Synod canons.
