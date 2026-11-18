# FEATURE_REGISTRY.md

**Purpose:** Comprehensive registry of all planned, active, and completed features across the 20 product domains.  
**Scope:** Complete product lifecycle from Phase 0 to general availability  
**Status:** APPROVED (Updated for Phase 1.3 Audit)  
**Last Updated:** 2026-11-17  
**Owner:** Engineering Orchestrator  
**Related Documents:** TRACEABILITY_MATRIX.md, CURRENT_PHASE.md, PROJECT_STATUS.md, PHASE_2_ARCHITECTURE_PROPOSAL.md, COPTIC_BIBLE_CANON_RESEARCH.md

---

## 1. Domain Feature Inventory

| Feature ID        | Domain     | Feature Name                                         | Priority | Phase      | Dependencies   | Status / Governance Gate                                                                                              |
| ----------------- | ---------- | ---------------------------------------------------- | -------- | ---------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **FEAT-FND-001**  | Foundation | Monorepo & Workspaces Setup (Turborepo + pnpm)       | P0       | Phase 1    | Node LTS       | **IMPLEMENTED & VERIFIED**                                                                                            |
| **FEAT-FND-002**  | Foundation | Material 3 Design Tokens & RTL Baseline              | P0       | Phase 1    | Theme Baseline | **IMPLEMENTED & VERIFIED**                                                                                            |
| **FEAT-FND-003**  | Foundation | NestJS 12 + Prisma 7 PostgreSQL Scaffold             | P0       | Phase 1    | Node.js 26     | **IMPLEMENTED & VERIFIED** (Container blocked on host)                                                                |
| **FEAT-FND-004**  | Foundation | Next.js 16 App Router & PWA Service Worker           | P0       | Phase 1    | FEAT-FND-001   | **IMPLEMENTED & VERIFIED**                                                                                            |
| **FEAT-FND-005**  | Foundation | System Health Liveness & Readiness Probes (200/503)  | P0       | Phase 1.2  | FEAT-FND-003   | **IMPLEMENTED & VERIFIED** (Tested with mocks & real HTTP test)                                                       |
| **FEAT-AUTH-001** | Auth       | User Registration, Login & JWT Refresh Flow          | P1       | Phase 2A   | FEAT-FND-003   | **IMPLEMENTED & VERIFIED** (Argon2id, Opaque Tokens, Reuse Detection, HttpOnly Cookies, M3 Account UI)                |
| **FEAT-AUTH-002** | Auth       | Role-Based Access Control (RBAC) & Guards            | P1       | Phase 2A   | FEAT-AUTH-001  | **IMPLEMENTED & VERIFIED** (JwtAuthGuard, RolesGuard, CurrentUser Decorator)                                          |
| **FEAT-BIB-001**  | Bible      | Canonical 73-Book Coptic Bible Schema & Hierarchy    | P1       | Phase 2    | FEAT-FND-003   | **SCHEMA READY** (Content ingestion gated on licensing)                                                               |
| **FEAT-BIB-002**  | Bible      | Responsive Arabic Bible Reader with Font Adjustments | P1       | Phase 2    | FEAT-BIB-001   | **READY FOR IMPLEMENTATION**                                                                                          |
| **FEAT-BIB-003**  | Bible      | Offline Bible Text IndexedDB Pre-caching             | P1       | Phase 2    | FEAT-BIB-002   | **READY FOR IMPLEMENTATION**                                                                                          |
| **FEAT-CAL-001**  | Calendar   | Coptic Civil Calendar Engine & Gregorian Conversions | P1       | Phase 2B.1 | FEAT-FND-003   | **IMPLEMENTED & VERIFIED** (Deterministic Rata Die math, 13 months, leap year logic, NestJS endpoints, web converter) |
| **FEAT-UI-001**   | UI/UX      | Material 3 Design System, Adaptive Shell & States    | P0       | Phase UI-0 | FEAT-FND-002   | **IMPLEMENTED & VERIFIED** (19 M3 components, 10 UI states, Skeleton Shimmer, Adaptive Rail/Bar, 15 Viewport Tests)   |
| **FEAT-GOV-001**  | Governance | Canonical Source Registry & Content Provenance Trust | P0       | Phase UI-0 | FEAT-FND-001   | **IMPLEMENTED & VERIFIED** (SOURCE_REGISTRY.md, 8 publication states, SourceProvenanceBadge, structured DTO metadata) |
| **FEAT-LIT-001**  | Liturgy    | Alexandrian Paschalion & Movable Feasts Computus     | P1       | Phase 2B.2 | FEAT-CAL-001   | **RESEARCH BASELINE READY** (Ecclesiastical Metonic cycle codified in RES-CAL-002)                                    |
| **FEAT-LIT-002**  | Liturgy    | Katameros Daily Liturgical Readings Engine           | P1       | Phase 2    | FEAT-LIT-001   | **LOGIC READY** (Pericope mapping gated on liturgical review)                                                         |
| **FEAT-LIT-003**  | Liturgy    | Daily Synaxarium Saints & Commemorations             | P1       | Phase 2    | FEAT-LIT-001   | **MAPPING READY** (Hagiography text gated on source review)                                                           |
| **FEAT-AGP-001**  | Agpeya     | Book of Hours Canonical Prayers Reader               | P1       | Phase 2    | FEAT-FND-003   | **STRUCTURE READY** (Text gated on theological review)                                                                |
| **FEAT-HYM-001**  | Hymns      | Coptic/Arabic Hymn Lyrics Library                    | P2       | Phase 2    | FEAT-FND-003   | **BACKLOG** (Awaiting licensed audio/text sources)                                                                    |
| **FEAT-HYM-002**  | Hymns      | Audio Streaming Player with Offline Download         | P2       | Phase 2    | FEAT-HYM-001   | **BACKLOG**                                                                                                           |
| **FEAT-USR-001**  | User Data  | Personal Verse Bookmarks & Highlights                | P2       | Phase 2    | FEAT-AUTH-001  | **READY FOR IMPLEMENTATION** (Safe software domain)                                                                   |
| **FEAT-USR-002**  | User Data  | Personal Spiritual Journal & Notes                   | P2       | Phase 2    | FEAT-AUTH-001  | **READY FOR IMPLEMENTATION** (Safe software domain)                                                                   |
| **FEAT-PAT-001**  | Patristics | Church Fathers Biographies & Patristic Library       | P2       | Phase 2    | FEAT-FND-003   | **BACKLOG** (Awaiting patristic text licensing)                                                                       |
| **FEAT-PLC-001**  | Geography  | Coptic Churches & Monasteries Global Directory       | P3       | Phase 3    | FEAT-FND-003   | **BACKLOG**                                                                                                           |
| **FEAT-SRH-001**  | Search     | Full-Text Search across Bible, Synaxarium, Hymns     | P3       | Phase 3    | FEAT-BIB-001   | **BACKLOG**                                                                                                           |
| **FEAT-ADM-001**  | Admin      | Editorial Management & Publishing Dashboard          | P2       | Phase 2    | FEAT-AUTH-002  | **BACKLOG**                                                                                                           |
