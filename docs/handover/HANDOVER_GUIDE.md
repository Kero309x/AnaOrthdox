# HANDOVER_GUIDE.md

**Purpose:** Comprehensive guide enabling any incoming engineer, architect, or AI agent to instantly resume work on the Ana Orthodox platform without knowledge loss.  
**Scope:** Repository setup, architecture orientation, execution workflows, and governance  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Principal Software Architect  
**Related Documents:** NEXT_ACTIONS.md, SESSION_SUMMARY.md, PROJECT_STATUS.md

---

## 1. Quick Orientation

- **Repository Path:** `c:\Users\Kero309x\Desktop\Ana Orthdox`
- **Active Git Branch:** `main`
- **Platform Vision:** Coptic Orthodox Digital Platform (Holy Bible, Katameros, Agpeya, Synaxarium, Hymns, Patristics, Churches Directory, Community).
- **Core Stack:** Modular Monolith with Next.js 16 Active LTS App Router (PWA) + NestJS 12 REST API + PostgreSQL 18 + Prisma 7.10.1 ORM.
- **Current Lifecycle State:** **Phase 2B.1 — Coptic Civil Calendar Engine (Complete & Verified)**. Next: Phase 2B.2 (Alexandrian Paschal Computus & Movable Feasts).

---

## 2. Institutional Memory & Source of Truth Structure

All architectural decisions, contracts, and inventories are preserved in `docs/`:

```
docs/
├── project/       -> Status, manifests, known issues, repository audit
├── architecture/  -> System context, data flow, module boundaries, ADRs
├── database/      -> Prisma schema design, entity catalogs, migration history
├── api/           -> REST contracts, endpoint catalog, authorization matrix, error codes
├── frontend/      -> Routes, screens, components, interactions, responsive rules
├── features/      -> Feature registry, full-stack traceability matrix
├── security/      -> Threat model, security architecture, permission matrix, audit logs
├── testing/       -> Testing pyramid, strategy, 10 mandatory quality gates
├── pwa/           -> PWA architecture, offline caching strategy, web manifest
├── agents/        -> Agent roles, task dispatch contracts, handoff protocol
├── skills/        -> Approved skills inventory and usage policy
└── handover/      -> Handover guide, session summaries, prioritized next actions
```

---

## 3. Environment Prerequisites

- Node.js LTS (v26.13.0 verified)
- pnpm (v12.21.0 verified)
- Git (2.56.0.windows.4 verified)
- PostgreSQL 18 + Redis 7 (via Docker Compose or external cloud instance). See `KI-006` in `docs/project/KNOWN_ISSUES.md`.

---

## 4. Development Workflow & Golden Rules

1. **Never commit undocumented code:** Every new route, endpoint, or table must update its respective catalog in `docs/`.
2. **Never commit without tests:** All changes must satisfy the 10 quality gates defined in `docs/testing/QUALITY_GATES.md`.
3. **Preserve RTL & Arabic-First standards:** Every UI component must be tested in RTL orientation with Arabic typography.
4. **Follow the task backlog:** Check `docs/handover/NEXT_ACTIONS.md` for the exact prioritized next action.
