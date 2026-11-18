# Project Manifest — Ana Orthodox / أنا أرثوذكس

| Field                 | Value                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Purpose**           | Single source of truth for project identity, architecture decisions, and product scope                 |
| **Scope**             | Entire Ana Orthodox platform — all applications, services, and domains                                 |
| **Status**            | ✅ ACTIVE — Authoritative                                                                              |
| **Last Updated**      | 2026-11-17                                                                                             |
| **Owner**             | Coordinator / Lead Architect                                                                           |
| **Related Documents** | `REPOSITORY_AUDIT.md`, `PROJECT_STATUS.md`, `CURRENT_PHASE.md`, `docs/architecture/SYSTEM_OVERVIEW.md` |

---

## 1. Project Identity

| Field                      | Value                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project Name (English)** | Ana Orthodox                                                                                                                                                  |
| **Project Name (Arabic)**  | أنا أرثوذكس                                                                                                                                                   |
| **Project Type**           | Coptic Orthodox Digital Platform                                                                                                                              |
| **Mission**                | To provide every Coptic Orthodox Christian with a comprehensive, accessible, and beautiful Arabic-first digital resource for worship, learning, and community |
| **Primary Audience**       | Coptic Orthodox faithful — Arabic-speaking, globally distributed                                                                                              |
| **Secondary Audience**     | Scholars, clergy, and seekers interested in Coptic Christianity                                                                                               |
| **Application Model**      | Responsive Progressive Web App (PWA)                                                                                                                          |
| **Primary Language**       | Arabic (العربية)                                                                                                                                              |
| **Secondary Languages**    | Coptic (ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ), English                                                                                                                                 |
| **Text Direction**         | RTL — `dir="rtl"`, `lang="ar"`                                                                                                                                |
| **Liturgical Calendar**    | Coptic Calendar (Alexandrian) + Gregorian mapping                                                                                                             |

---

## 2. Architecture

### 2.1 Architecture Style

**Modular Monolith in a Monorepo**

The platform is implemented as a modular monolith rather than microservices. This decision prioritizes development speed, operational simplicity, and ease of reasoning for a team of this scale, while maintaining clear module boundaries that could support future extraction.

```
ana-orthodox/                    ← monorepo root
├── apps/
│   ├── web/                     ← Next.js 15 frontend (PWA)
│   └── api/                     ← NestJS backend
├── packages/
│   ├── types/                   ← Shared TypeScript types
│   ├── ui/                      ← Shared UI components (Design System)
│   └── config/                  ← Shared tooling config (ESLint, TSConfig)
├── docs/                        ← All documentation
└── tools/                       ← Scripts, generators
```

### 2.2 Technology Stack

| Layer                  | Technology                         | Version        | Rationale                                                        |
| ---------------------- | ---------------------------------- | -------------- | ---------------------------------------------------------------- |
| **Frontend Framework** | Next.js App Router                 | 15.x           | SSR/SSG, ISR, file-based routing, strong Arabic/RTL ecosystem    |
| **Frontend Language**  | TypeScript                         | 5.x            | Type safety across full stack                                    |
| **UI Framework**       | Material 3 (Material Web / MUI v6) | Latest         | Google's design system; strong RTL support; Coptic-themed tokens |
| **Backend Framework**  | NestJS                             | Latest LTS     | Strongly opinionated, modular, TypeScript-native, DI container   |
| **Backend Runtime**    | Node.js                            | v26.13.0 (LTS) | Available on host; LTS stability                                 |
| **Database**           | PostgreSQL                         | 16             | ACID compliance; full-text search; strong Prisma support         |
| **ORM**                | Prisma                             | Latest         | Type-safe queries; migration management; schema-first            |
| **Authentication**     | JWT (access + refresh tokens)      | —              | Stateless; scalable; well-supported in NestJS                    |
| **Package Manager**    | pnpm                               | Latest         | Efficient disk usage; workspaces support                         |
| **Monorepo Tooling**   | Turborepo                          | Latest         | Incremental builds; caching; task orchestration                  |
| **Testing (unit)**     | Vitest                             | Latest         | Fast; native ESM; compatible with Next.js and NestJS             |
| **Testing (E2E)**      | Playwright                         | Latest         | Cross-browser; strong Arabic/RTL text support                    |
| **Code Quality**       | ESLint + Prettier                  | Latest         | Enforced at CI                                                   |
| **API Docs**           | Swagger / OpenAPI                  | —              | Auto-generated via `@nestjs/swagger`                             |

### 2.3 Application Model

The application is a **Responsive PWA**:

- **Server-Side Rendering (SSR):** Dynamic content pages (Bible reader, Synaxarium, Katameros) for SEO and initial load performance
- **Static Site Generation (SSG):** Reference content (Church Fathers, Church History articles) for maximum performance
- **Incremental Static Regeneration (ISR):** Calendar and events pages (daily refresh)
- **Client-Side Interactivity:** Bookmarks, notes, reading progress, search
- **Offline Support:** Service worker caches core content (Agpeya prayers, offline Bible reading)
- **PWA Manifest:** Home screen installation on Android and iOS

---

## 3. Design System

### 3.1 Design Language

**Material 3 — Custom Coptic Theme**

Material 3 (Material You) is the design foundation. A custom Coptic color theme is applied on top of the M3 baseline, drawing from Coptic iconographic and liturgical color traditions.

### 3.2 Typography

| Role                   | Font Family           | Script       | Notes                                      |
| ---------------------- | --------------------- | ------------ | ------------------------------------------ |
| **Primary (body, UI)** | Noto Naskh Arabic     | Arabic       | Google Fonts; high readability; RTL-native |
| **Coptic script**      | Noto Sans Coptic      | Coptic       | Unicode Coptic block support               |
| **Fallback**           | system-ui, sans-serif | Latin/system | Prevents FOUT on slow connections          |
| **Monospace**          | JetBrains Mono        | Latin        | Developer-facing admin/code views          |

> [!WARNING]
> Noto Naskh Arabic is a large font family. Subsetting and `font-display: swap` are required. See `KI-004` in `KNOWN_ISSUES.md`.

### 3.3 Color Theme

> [!CAUTION]
> **PENDING FINAL APPROVAL** — The color theme has not been finalized by stakeholders. `Emerald & Gold` is used as the working default.

**Working Default: Emerald & Gold**

| Token                                 | Value     | Usage                               |
| ------------------------------------- | --------- | ----------------------------------- |
| `--md-sys-color-primary`              | `#145A48` | Buttons, active states, icons       |
| `--md-sys-color-on-primary`           | `#FFFFFF` | Text on primary                     |
| `--md-sys-color-primary-container`    | `#D7F0E5` | Backgrounds, cards, chips           |
| `--md-sys-color-on-primary-container` | `#002117` | Text on primary container           |
| `--md-sys-color-secondary`            | `#D7A83A` | Gold accent (liturgical highlights) |

**All 8 Candidate Themes (for stakeholder review):**

| Variant           | Primary   | Surface Container | Status             |
| ----------------- | --------- | ----------------- | ------------------ |
| Emerald & Gold    | `#145A48` | `#D7F0E5`         | 🟡 Working default |
| Cobalt & Amber    | `#1E40AF` | `#DBEAFE`         | Candidate          |
| Liturgical Plum   | `#6B1D4A` | `#FCE7F3`         | Candidate          |
| Royal Indigo      | `#3730A3` | `#E0E7FF`         | Candidate          |
| Coptic Terracotta | `#9A3412` | `#FFEDD5`         | Candidate          |
| Deep Burgundy     | `#881337` | `#FFE4E6`         | Candidate          |
| Midnight Slate    | `#1E293B` | `#CCFBF1`         | Candidate          |
| Olive & Ochre     | `#3F6212` | `#ECFCCB`         | Candidate          |

### 3.4 Directionality

All UI components, layouts, and text must be **RTL-native**:

- HTML root: `<html dir="rtl" lang="ar">`
- CSS: Use `margin-inline-start`/`margin-inline-end` (not `margin-left`/`margin-right`)
- Material 3 components: Use RTL-aware variants or override with CSS logical properties
- Text alignment: `text-align: start` (not `text-align: right`)
- Icons: Flip directional icons (arrows, navigation) for RTL contexts

---

## 4. Product Domains (20 Modules)

### Module Registry

| #   | Module ID  | Arabic Name                  | English Name              | Phase   | Priority |
| --- | ---------- | ---------------------------- | ------------------------- | ------- | -------- |
| 1   | BIBLE-001  | الكتاب المقدس                | Holy Bible                | Phase 1 | P0       |
| 2   | BIBLES-002 | أدوات الدراسة                | Bible Study Tools         | Phase 2 | P1       |
| 3   | COMM-003   | التفسير الآبائي              | Patristic Commentary      | Phase 3 | P2       |
| 4   | KATA-004   | الكطمارس                     | Katameros (Lectionary)    | Phase 1 | P0       |
| 5   | LCAL-005   | التقويم الليتورجي            | Liturgical Calendar       | Phase 1 | P0       |
| 6   | CCAL-006   | التقويم القبطي               | Coptic Calendar           | Phase 1 | P0       |
| 7   | HYMN-007   | الألحان والتسبيح             | Hymns & Tasbeha           | Phase 2 | P0       |
| 8   | AGPE-008   | الأجبية / صلوات الساعات      | Agpeya / Canonical Hours  | Phase 2 | P0       |
| 9   | SYNA-009   | السنكسار                     | Synaxarium                | Phase 2 | P1       |
| 10  | FATH-010   | آباء الكنيسة                 | Church Fathers            | Phase 3 | P1       |
| 11  | PATR-011   | المكتبة الآبائية             | Patristic Library         | Phase 3 | P1       |
| 12  | HIST-012   | تاريخ الكنيسة                | Church History            | Phase 3 | P2       |
| 13  | HERI-013   | التراث القبطي                | Coptic Heritage & Culture | Phase 4 | P2       |
| 14  | CHRC-014   | دليل الكنائس                 | Churches Directory        | Phase 2 | P1       |
| 15  | MONO-015   | دليل الأديرة                 | Monasteries Directory     | Phase 2 | P1       |
| 16  | RPLAN-016  | خطط القراءة                  | Reading Plans             | Phase 2 | P1       |
| 17  | BOOK-017   | الإشارات المرجعية والملاحظات | Bookmarks & Notes         | Phase 1 | P1       |
| 18  | SRCH-018   | البحث الموحد                 | Unified Search            | Phase 4 | P1       |
| 19  | EVNT-019   | الفعاليات والإعلانات         | Events & Announcements    | Phase 3 | P2       |
| 20  | ADMIN-020  | لوحة الإدارة                 | Administration Panel      | Phase 1 | P0       |

### Module Descriptions

**BIBLE-001 — Holy Bible**
Full Arabic Bible text (Van Dyck or equivalent licensed translation) with Coptic parallel text. Verse-level navigation, chapter/book browser, verse sharing, cross-references. The foundational content module on which commentary, Katameros, and reading plans depend.

**BIBLES-002 — Bible Study Tools**
Study notes, word definitions, Strong's concordance integration, comparison between translations, highlighted verse collections.

**COMM-003 — Patristic Commentary**
Commentary on scripture from Church Fathers (St. Athanasius, St. Cyril, St. John Chrysostom, etc.). Linked to Bible verses. Editorial workflow for content editors.

**KATA-004 — Katameros (Lectionary)**
Daily readings for Liturgy, Vespers, and Matins following the Coptic lectionary cycle. Linked to Bible verses. Calendar-aware (displays today's readings automatically).

**LCAL-005 — Liturgical Calendar**
Full Coptic liturgical year calendar: feasts, fasts, commemorations, and saints' days. Linked to Synaxarium entries, Katameros readings, and Hymns appropriate for each day.

**CCAL-006 — Coptic Calendar**
Coptic calendar (Alexandrian) with Gregorian equivalents. Month/day conversion tools. Display of current Coptic date alongside Gregorian.

**HYMN-007 — Hymns & Tasbeha**
Coptic hymns with Arabic text, Coptic text (phonetic and native script), and audio recordings where available. Categorized by occasion (Kiahk, Palm Sunday, Holy Week, etc.).

**AGPE-008 — Agpeya / Canonical Hours**
The seven canonical hours of prayer. Full Arabic text with Coptic text. Time-aware (suggests current prayer hour). Offline-capable.

**SYNA-009 — Synaxarium**
Daily saints' readings for each day of the Coptic calendar year. Rich content with saint biographies and icons.

**FATH-010 — Church Fathers**
Biographical and theological profiles of Coptic and broader patristic Church Fathers. Linked to their writings in the Patristic Library.

**PATR-011 — Patristic Library**
Searchable collection of patristic writings in Arabic translation. Attributed to Church Fathers. Linked to relevant Bible verses and commentary.

**HIST-012 — Church History**
Structured history of the Coptic Orthodox Church from apostolic foundation to the present. Timeline-based navigation.

**HERI-013 — Coptic Heritage & Culture**
Coptic language learning resources, iconography guides, Coptic art and architecture, and cultural heritage content.

**CHRC-014 — Churches Directory**
Searchable, geolocation-aware directory of Coptic Orthodox churches worldwide. Address, contact, service times, priest information, photos.

**MONO-015 — Monasteries Directory**
Directory of Coptic monasteries with history, location, visiting information, and notable monks/saints.

**RPLAN-016 — Reading Plans**
Structured reading plans (e.g., Bible in a year, Lenten reading, Patristic reading). Progress tracking linked to user accounts.

**BOOK-017 — Bookmarks & Notes**
Personal bookmarks and annotations on any content in the platform. Private by default; shareable on request. Synced across devices.

**SRCH-018 — Unified Search**
Full-text search across all content domains: Bible, Synaxarium, Hymns, Patristic Library, Church History. Arabic text search with diacritics-insensitive matching.

**EVNT-019 — Events & Announcements**
Church-specific and community-wide event listings, announcements, and retreat information. Linked to Churches Directory.

**ADMIN-020 — Administration Panel**
Back-office interface for content editors and administrators. User management, content CRUD, role assignment, audit logs.

---

## 5. Product Decisions

The following decisions have been made and are binding for this project:

| Decision              | Value                                     | Rationale                                                         |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| Monorepo vs. polyrepo | Monorepo (pnpm workspaces + Turborepo)    | Shared types, coordinated deploys, single CI pipeline             |
| Architecture          | Modular Monolith                          | Appropriate scale; avoids premature microservice complexity       |
| Frontend framework    | Next.js 15 App Router                     | SSR/ISR, SEO, strong Arabic RTL support, React ecosystem          |
| Backend framework     | NestJS                                    | TypeScript-native, DI, opinionated module structure               |
| Database              | PostgreSQL 16                             | Relational integrity for complex linked content; full-text search |
| ORM                   | Prisma                                    | Type-safe, schema-first, migration management                     |
| Auth mechanism        | JWT (access + refresh)                    | Stateless, scalable, standard                                     |
| Primary language      | Arabic (RTL)                              | Core audience is Arabic-speaking Copts                            |
| Design system         | Material 3                                | Strong RTL support; flexible theming; Google fonts ecosystem      |
| Application model     | Responsive PWA                            | Single codebase; offline support; home screen install             |
| Package manager       | pnpm                                      | Performance; monorepo workspace support                           |
| Color theme           | Emerald & Gold (working default)          | **PENDING stakeholder approval**                                  |
| Coptic script font    | Noto Sans Coptic                          | Only widely-available Unicode Coptic font                         |
| Arabic font           | Noto Naskh Arabic                         | High legibility; full Unicode Arabic support; Google Fonts        |
| API versioning        | URL-based (`/api/v1`)                     | Simple; widely understood                                         |
| ID strategy           | UUID (non-sequential)                     | Security; prevents enumeration attacks                            |
| Timestamps            | `created_at` + `updated_at` on all tables | Audit trail; Prisma `@updatedAt`                                  |
| Soft deletes          | Only where legally/editorially required   | Avoids complexity; physical deletes preferred                     |

---

## 6. Non-Goals (Out of Scope)

The following are explicitly **not** in scope for Ana Orthodox v1:

- Native iOS or Android applications (PWA only in Phase 0–5)
- Livestreaming or video conferencing
- E-commerce or donation processing
- Forum or social network features
- Microservices architecture (may revisit in v2)
- Multi-tenancy (single-church edition)
- Multilingual CMS (Arabic-only content authoring in v1)

---

## 7. Glossary

| Term       | Definition                                                                         |
| ---------- | ---------------------------------------------------------------------------------- |
| Agpeya     | The Coptic book of canonical hours / daily prayers                                 |
| Katameros  | The Coptic lectionary — the book of daily liturgical readings                      |
| Synaxarium | The Coptic book of saints — a daily reading for each day of the year               |
| Tasbeha    | Coptic praise/hymn service (from Arabic تسبيح, meaning glorification)              |
| Kiahk      | The Coptic month of Kiahk (November–December); rich in hymns and special liturgies |
| RTL        | Right-to-left text direction, as used in Arabic and Coptic                         |
| PWA        | Progressive Web App — a web app with native-like capabilities                      |
| M3         | Material 3 — Google's third-generation design system (Material You)                |
| ADR        | Architecture Decision Record                                                       |
| ORM        | Object-Relational Mapping                                                          |

---

## 8. Document History

| Version | Date       | Author            | Change                                 |
| ------- | ---------- | ----------------- | -------------------------------------- |
| 1.0.0   | 2026-11-17 | Coordinator Agent | Initial creation — greenfield manifest |
