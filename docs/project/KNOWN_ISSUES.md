# Known Issues — Ana Orthodox / أنا أرثوذكس

| Field                 | Value                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Purpose**           | Track known open issues, unresolved decisions, and technical risks that require attention before or during development |
| **Scope**             | All domains — platform-wide                                                                                            |
| **Status**            | ✅ ACTIVE — Updated continuously                                                                                       |
| **Last Updated**      | 2026-11-17                                                                                                             |
| **Owner**             | Coordinator / Lead Architect                                                                                           |
| **Related Documents** | `PROJECT_STATUS.md`, `CURRENT_PHASE.md`, `PROJECT_MANIFEST.md`, `REPOSITORY_AUDIT.md`                                  |

---

## Issue Summary

| ID     | Title                                             | Severity | Category       | Phase     | Status  |
| ------ | ------------------------------------------------- | -------- | -------------- | --------- | ------- |
| KI-001 | Theme color not finalized                         | Medium   | Design         | Phase 0   | 🟡 Open |
| KI-002 | Content data sourcing strategy not defined        | **High** | Content        | Phase 0–1 | 🔴 Open |
| KI-003 | Hosting/deployment environment not selected       | Medium   | Infrastructure | Phase 0–1 | 🟡 Open |
| KI-004 | Arabic font performance (Noto Naskh Arabic size)  | Medium   | Performance    | Phase 0   | 🟡 Open |
| KI-005 | Coptic script rendering across platforms          | Medium   | Compatibility  | Phase 0–1 | 🟡 Open |
| KI-006 | Docker Desktop and WSL2 missing on Windows host   | **High** | Infrastructure | Phase 1.1 | 🔴 Open |
| KI-007 | Remote Git repository not configured (local-only) | Low      | DevOps         | Phase 1.1 | 🟡 Open |

---

## KI-001 — Theme Color Not Finalized

| Field        | Value                                                               |
| ------------ | ------------------------------------------------------------------- |
| **ID**       | KI-001                                                              |
| **Title**    | Theme color not finalized — 8 variants identified, approval pending |
| **Severity** | Medium                                                              |
| **Category** | Design / Product Decision                                           |
| **Reported** | 2026-11-17                                                          |
| **Phase**    | Phase 0                                                             |
| **Status**   | 🟡 Open                                                             |
| **Owner**    | Stakeholder / Design Lead                                           |
| **Blocking** | Design token finalization, `packages/ui/tokens/`, app-wide styling  |

### Description

A Material 3 theme variation sheet (`WhatsApp Image 2026-11-17 at 1.22.25 AM.jpeg`) presents 8 color palette candidates for the Ana Orthodox app. The stakeholder has not yet selected a final theme.

The working default (**Emerald & Gold**, `#145A48` / `#D7F0E5`) has been chosen by the development team as a temporary stand-in to unblock implementation work. This must not be shipped to production without stakeholder approval.

### Candidates

| Variant            | Primary   | Surface   | Status             |
| ------------------ | --------- | --------- | ------------------ |
| **Emerald & Gold** | `#145A48` | `#D7F0E5` | 🟡 Working default |
| Cobalt & Amber     | `#1E40AF` | `#DBEAFE` | Candidate          |
| Liturgical Plum    | `#6B1D4A` | `#FCE7F3` | Candidate          |
| Royal Indigo       | `#3730A3` | `#E0E7FF` | Candidate          |
| Coptic Terracotta  | `#9A3412` | `#FFEDD5` | Candidate          |
| Deep Burgundy      | `#881337` | `#FFE4E6` | Candidate          |
| Midnight Slate     | `#1E293B` | `#CCFBF1` | Candidate          |
| Olive & Ochre      | `#3F6212` | `#ECFCCB` | Candidate          |

### Resolution Path

1. Present all 8 options to the stakeholder with rendered UI mockups showing each palette in context (app icon, primary buttons, cards, navigation)
2. Stakeholder selects one variant
3. Update `packages/ui/src/tokens/colors.css` with the selected palette
4. Update `PROJECT_MANIFEST.md` to remove "PENDING FINAL APPROVAL" notice
5. Close this issue

### Impact if Unresolved

- Design system tokens cannot be finalized
- Brand consistency cannot be enforced
- UI screenshots and mockups will show incorrect branding
- Risk of rework if developers build against the wrong palette

---

## KI-002 — Content Data Sourcing Strategy Not Defined

| Field        | Value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| **ID**       | KI-002                                                                 |
| **Title**    | Content data sourcing strategy not defined for Coptic liturgical texts |
| **Severity** | **High**                                                               |
| **Category** | Content / Data                                                         |
| **Reported** | 2026-11-17                                                             |
| **Phase**    | Phase 0–1                                                              |
| **Status**   | 🔴 Open                                                                |
| **Owner**    | Content Lead / Data Engineer                                           |
| **Blocking** | BIBLE-001, KATA-004, HYMN-007, AGPE-008, SYNA-009, FATH-010, PATR-011  |

### Description

Ana Orthodox depends on a large volume of liturgical and scriptural content that must be legally licensed or freely available, accurately structured, and loaded into the PostgreSQL database. No content sourcing strategy has been defined.

### Affected Content Types

| Content                         | Module             | Concern                                                                                         |
| ------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Arabic Bible text               | BIBLE-001          | Van Dyck translation: widely used but license ambiguous for digital redistribution; must verify |
| Coptic Bible text               | BIBLE-001          | Sahidic or Bohairic dialect; Unicode Coptic encoding required                                   |
| Katameros (lectionary) readings | KATA-004           | Specific daily reading schedule; need authoritative structured source                           |
| Hymns (Coptic + Arabic)         | HYMN-007           | Extensive catalog; Coptic phonetics + native script; audio recordings licensing                 |
| Agpeya text                     | AGPE-008           | Public domain in Arabic; source format (plain text, XML, HTML?) needs identification            |
| Synaxarium entries              | SYNA-009           | 365 daily entries (Coptic calendar); Arabic text; need machine-readable source                  |
| Church Fathers writings         | FATH-010, PATR-011 | Arabic translations; copyright status varies by work and translator                             |

### Known Data Sources to Investigate

| Source                                     | URL / Reference                 | Notes                                                            |
| ------------------------------------------ | ------------------------------- | ---------------------------------------------------------------- |
| Coptic Reader (open source)                | GitHub (search "Coptic Reader") | May have structured Coptic liturgical data                       |
| Tasbeha.org                                | tasbeha.org                     | Hymns data; check licensing                                      |
| CopticWorld.org                            | —                               | Various texts; check licensing                                   |
| Arabic Van Dyck Bible                      | Multiple sources                | Most widely used Arabic Bible; license research required         |
| digitalbiblesociety.org                    | —                               | May have licensed Arabic Bible data                              |
| eBible.org                                 | ebible.org                      | Open-license Bible texts                                         |
| CCEL (Christian Classics Ethereal Library) | ccel.org                        | Church Fathers texts (Latin/Greek); Arabic translations separate |
| St. Takla Haymanot (Coptic)                | st-takla.org                    | Large Coptic Orthodox Arabic content site; check license         |

### Resolution Path (Updated in Phase 1.3 Audit)

1. **Protocanonical Bible Text:** Use raw 1865 Smith & Van Dyck text (verified Public Domain, free of modern publisher additions). Verify integrity using SHA-256 checksums.
2. **Deuterocanonical Books:** Ingestion is **BLOCKED** until formal digital licensing is secured from the Bible Society of Egypt (for the 1988 Synod-approved volume) or the Coptic Orthodox Bishopric of Youth.
3. **Canonical Scope:** Formally follow the official 73-book canon of the Coptic Orthodox Church (`ADR-0006` and `COPTIC_BIBLE_CANON_RESEARCH.md`). Exclude 3 Maccabees from canonical tables.
4. **Zero-Scraping Directive:** Prohibit scraping of third-party Coptic websites or mobile applications.
5. **Phase 2 Safe Boundary:** Implement IAM, User Profiles, and structural schemas first; gate sacred text ingestion on verified licensing and ecclesiastical review.

### Impact if Unresolved Before Phase 1

- **BIBLE-001** cannot ship — the application's most critical module has no data
- **KATA-004**, **HYMN-007**, **AGPE-008**, **SYNA-009** are all blocked
- Phase 1 scope must be reduced to auth + calendar skeleton only, pushing content to Phase 2+
- Risk of legal exposure if unlicensed copyrighted text is used

> [!CAUTION]
> This is the **highest-risk known issue** in the project. It must be resolved before Phase 1 feature development begins. Assign an owner immediately.

---

## KI-003 — Hosting/Deployment Environment Not Selected

| Field        | Value                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **ID**       | KI-003                                                                                           |
| **Title**    | Hosting and deployment environment not selected                                                  |
| **Severity** | Medium                                                                                           |
| **Category** | Infrastructure / DevOps                                                                          |
| **Reported** | 2026-11-17                                                                                       |
| **Phase**    | Phase 0–1                                                                                        |
| **Status**   | 🟡 Open                                                                                          |
| **Owner**    | Lead Architect / DevOps                                                                          |
| **Blocking** | Deployment pipeline, environment variable strategy, production database setup, CDN configuration |

### Description

The production hosting environment has not been decided. This decision affects CI/CD pipeline configuration, environment variable management, database hosting, CDN and asset delivery, and cost structure.

### Options Under Consideration

| Option                        | Frontend                 | Backend                           | Database                       | Cost Profile              | Notes                                                     |
| ----------------------------- | ------------------------ | --------------------------------- | ------------------------------ | ------------------------- | --------------------------------------------------------- |
| **Vercel + Railway**          | Vercel (Next.js native)  | Railway (NestJS container)        | Railway PostgreSQL or Supabase | Low-medium; usage-based   | Simplest setup; Vercel has best Next.js integration       |
| **Vercel + Render**           | Vercel                   | Render (NestJS)                   | Render PostgreSQL              | Low-medium; usage-based   | Alternative to Railway                                    |
| **AWS (Amplify + ECS + RDS)** | Amplify or S3+CloudFront | ECS Fargate                       | RDS PostgreSQL                 | Medium-high; fine-grained | Most control; most complexity                             |
| **Self-hosted VPS**           | Nginx reverse proxy      | PM2 / Docker                      | PostgreSQL on same VPS         | Low fixed cost            | Most control; highest ops burden                          |
| **Supabase + Vercel**         | Vercel                   | Supabase Edge Functions (limited) | Supabase (PostgreSQL)          | Low; generous free tier   | Note: Supabase Edge Functions are limited vs. full NestJS |

### Recommended Path (Provisional)

> **Vercel (frontend) + Railway (backend + database)** — Best balance of Next.js native integration, NestJS container deployment simplicity, and cost for an early-stage platform.

### Resolution Path

1. Gather budget constraints from stakeholder
2. Evaluate traffic projections (global Coptic diaspora audience)
3. Evaluate data residency requirements (Arabic/Egyptian regulatory context)
4. Write **Infrastructure Decision ADR** (`docs/decisions/ADR-0003.md`)
5. Configure deployment pipeline after decision

### Impact if Unresolved

- CI/CD pipeline cannot include a deployment stage
- Production database cannot be provisioned
- Beta/staging environment cannot be created
- Performance testing against production infrastructure is impossible

---

## KI-004 — Arabic Font Performance (Noto Naskh Arabic Bundle Size)

| Field        | Value                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------- |
| **ID**       | KI-004                                                                                       |
| **Title**    | Arabic font strategy requires performance testing — Noto Naskh Arabic is a large font family |
| **Severity** | Medium                                                                                       |
| **Category** | Performance / Frontend                                                                       |
| **Reported** | 2026-11-17                                                                                   |
| **Phase**    | Phase 0                                                                                      |
| **Status**   | 🟡 Open                                                                                      |
| **Owner**    | Frontend Engineer                                                                            |
| **Blocking** | Font integration in `apps/web`, Core Web Vitals targets                                      |

### Description

**Noto Naskh Arabic** is the selected primary font for the platform. It is a high-quality, widely-distributed Arabic font available on Google Fonts. However, Arabic Unicode fonts are significantly larger than their Latin equivalents due to the number of glyphs, diacritic combinations, and contextual forms required.

An unoptimized Noto Naskh Arabic load can cause:

- **FOUT** (Flash of Unstyled Text) — text renders in fallback font before custom font loads
- **CLS** (Cumulative Layout Shift) — layout jumps when font loads and character widths change
- **LCP delay** (Largest Contentful Paint) — font blocks render if loaded synchronously

### Specific Concerns

| Concern                    | Detail                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ |
| Full font file size        | Noto Naskh Arabic complete WOFF2: ~200–400 KB per weight                             |
| Multiple weights           | Regular (400) + Bold (700) minimum; Medium (500) if used = 3 font files              |
| Diacritic support          | Full Arabic diacritics (tashkeel) required for Quranic/liturgical text               |
| Variable font availability | Check if Noto Naskh Arabic has a variable font version (reduces file count)          |
| Google Fonts CDN caching   | Using `next/font/google` self-hosts fonts; eliminates CDN but ensures no GDPR issues |

### Mitigation Strategies to Evaluate

| Strategy                   | Description                                                                         | Impact                                              |
| -------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| `font-display: swap`       | Show fallback text immediately, swap when font loads                                | Eliminates FOUT; may cause small CLS                |
| `font-display: optional`   | Only use custom font if loaded within ~100ms                                        | Zero CLS; risk of never loading on slow connections |
| Unicode subsetting         | Only include the Arabic Unicode range (U+0600–U+06FF, U+FB50–U+FDFF, U+FE70–U+FEFF) | Major size reduction                                |
| Variable font              | Single file covers all weights                                                      | Reduces HTTP requests                               |
| Preload critical weight    | `<link rel="preload">` for the primary weight only                                  | Improves LCP                                        |
| `size-adjust` CSS property | Adjust fallback font metrics to match Noto Naskh Arabic                             | Eliminates CLS on font swap                         |

### Resolution Path

1. Integrate `next/font/google` with Noto Naskh Arabic in `apps/web`
2. Measure bundle size and load time on a simulated 3G connection (Chrome DevTools throttling)
3. Measure Core Web Vitals (CWV): LCP, CLS, FID/INP
4. Apply subsetting and `font-display: swap` as minimum mitigations
5. If CWV targets not met, implement `size-adjust` for fallback font
6. Document final font loading strategy in `docs/architecture/`

### Core Web Vitals Targets

| Metric | Target  | Good    | Needs Improvement |
| ------ | ------- | ------- | ----------------- |
| LCP    | ≤ 2.5s  | ≤ 2.5s  | 2.5–4.0s          |
| CLS    | ≤ 0.1   | ≤ 0.1   | 0.1–0.25          |
| INP    | ≤ 200ms | ≤ 200ms | 200–500ms         |

---

## KI-005 — Coptic Script Rendering Across Platforms

| Field        | Value                                                     |
| ------------ | --------------------------------------------------------- |
| **ID**       | KI-005                                                    |
| **Title**    | Coptic script rendering requires testing across platforms |
| **Severity** | Medium                                                    |
| **Category** | Compatibility / Frontend                                  |
| **Reported** | 2026-11-17                                                |
| **Phase**    | Phase 0–1                                                 |
| **Status**   | 🟡 Open                                                   |
| **Owner**    | QA Engineer / Frontend Engineer                           |
| **Blocking** | BIBLE-001 (Coptic parallel text), HYMN-007, AGPE-008      |

### Description

Ana Orthodox will render **Coptic script** (Unicode Coptic block: U+2C80–U+2CFF) for hymns, prayers, the Agpeya, and the Bible's Bohairic Coptic text. Coptic script has very limited native OS font support. Without the correct font loaded, Coptic characters render as empty boxes (tofu) or fall back to incorrect glyphs.

**Selected font:** `Noto Sans Coptic` (Google Fonts) — the most complete freely available Coptic Unicode font.

### Known Platform Concerns

| Platform         | Coptic Native Support                         | Risk                                         |
| ---------------- | --------------------------------------------- | -------------------------------------------- |
| Windows 11       | Very limited (Segoe UI does not cover Coptic) | High — will tofu without Noto Sans Coptic    |
| Windows 10       | None                                          | High                                         |
| macOS 14+        | Partial (some Coptic in Apple symbols)        | Medium — may render incorrectly without Noto |
| iOS 17+          | Very limited                                  | High                                         |
| Android 12+      | Partial via Noto fallback chain               | Medium                                       |
| Chrome (desktop) | Depends on OS font stack                      | Requires web font                            |
| Firefox          | Same as Chrome                                | Requires web font                            |
| Safari (iOS)     | Relies on OS fonts                            | High risk                                    |

### Testing Matrix

Before Phase 1 ships Coptic text, the following must be verified:

| Test                                       | Environment          | Pass Criteria                   |
| ------------------------------------------ | -------------------- | ------------------------------- |
| Coptic Unicode characters render correctly | Chrome on Windows 11 | No tofu; correct glyph shapes   |
| Coptic Unicode characters render correctly | Safari on iOS 17     | No tofu; correct glyph shapes   |
| Coptic Unicode characters render correctly | Chrome on Android    | No tofu; correct glyph shapes   |
| Coptic Unicode characters render correctly | Firefox on macOS     | No tofu; correct glyph shapes   |
| Mixed Arabic + Coptic inline text renders  | All above            | Correct bidirectional rendering |
| Coptic text does not cause layout breaks   | All above            | Line height, baseline correct   |
| Font loads within acceptable time          | 3G simulated         | < 3s to first Coptic render     |

### Resolution Path

1. Integrate `Noto Sans Coptic` via `next/font/google` with correct Unicode ranges
2. Create a test page at `/test/coptic-rendering` with a range of Coptic characters and mixed Arabic-Coptic text
3. Run test matrix on real devices (iOS, Android) and browsers
4. Document results and any platform-specific workarounds
5. Add Coptic rendering test to E2E test suite (Playwright)
6. Confirm no tofu on all primary target platforms before Phase 1 goes to staging

---

## KI-006 — Docker Desktop and WSL2 Missing on Windows Host

| Field        | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| **ID**       | KI-006                                                             |
| **Title**    | Docker Desktop and WSL2 not installed on Windows host              |
| **Severity** | **High**                                                           |
| **Category** | Infrastructure / Local Environment                                 |
| **Reported** | 2026-11-17                                                         |
| **Phase**    | Phase 1.1                                                          |
| **Status**   | 🔴 Open                                                            |
| **Owner**    | Host System Administrator / Lead Architect                         |
| **Blocking** | Local PostgreSQL 18 & Redis 7 container spin-up via Docker Compose |

### Description

During the Phase 1.1 infrastructure audit, `Get-Command docker` and `wsl --status` confirmed that neither Docker Desktop, Docker Engine, nor Windows Subsystem for Linux (WSL2) is installed on the Windows host machine.

Per strict architectural rules:

- Docker services must not be reported as running when they are not.
- Production and development database configurations must not be silently replaced with in-memory mocks, SQLite, or PGlite.
- When PostgreSQL and Redis are unreachable, the NestJS health probe correctly reports `status: "error"` and services as `disconnected`.

### Impact

- `docker compose up -d` cannot be executed locally.
- Development database migrations (`prisma migrate dev`) cannot run against local containerized PostgreSQL 18 until Docker or a local/remote PostgreSQL instance is available.
- Local Redis caching runs disconnected (gracefully rejected by the NestJS health probe).

### Resolution Path

**Option A (Recommended for Docker containers):**

1. Install WSL2 in an elevated PowerShell prompt:
   ```powershell
   wsl --install --no-distribution
   ```
2. Restart the Windows machine if prompted.
3. Download and install Docker Desktop for Windows:
   `https://www.docker.com/products/docker-desktop/`
4. Launch Docker Desktop and ensure the WSL2 backend is active.
5. In the repository root, start containers:
   ```powershell
   docker compose up -d
   ```

**Option B (External PostgreSQL & Redis):**

1. Provision a PostgreSQL 18 database (e.g. Supabase, Neon, Railway, or local native Windows PostgreSQL).
2. Set `DATABASE_URL` in `.env.local` / `apps/api/.env`.
3. Set `REDIS_URL` in `.env.local` / `apps/api/.env`.
4. Run `pnpm --filter @ana-orthodox/api exec prisma migrate dev`.

---

## KI-007 — Remote Git Repository Not Configured (Local-Only)

| Field        | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| **ID**       | KI-007                                                                |
| **Title**    | Remote Git repository (e.g. GitHub/GitLab) not configured             |
| **Severity** | Low                                                                   |
| **Category** | DevOps / Source Control                                               |
| **Reported** | 2026-11-17                                                            |
| **Phase**    | Phase 1.1                                                             |
| **Status**   | 🟡 Open                                                               |
| **Owner**    | Project Lead / DevOps                                                 |
| **Blocking** | Remote backup, GitHub Actions CI execution, collaborative code review |

### Description

`git remote -v` returns empty. The repository exists purely on the local Windows filesystem.

### Resolution Path

1. Create a private repository on GitHub (e.g., `ana-orthodox`).
2. Add remote origin:
   ```bash
   git remote add origin git@github.com:<username>/ana-orthodox.git
   ```
3. Push initial branches and tags:
   ```bash
   git push -u origin main
   ```

---

## Issue Resolution Log

| Date       | ID                    | Action           | Outcome                       |
| ---------- | --------------------- | ---------------- | ----------------------------- |
| 2026-11-17 | KI-001 through KI-005 | Initial creation | All open — no resolutions yet |

---

## Adding New Issues

When a new known issue is identified, add it to this document with:

1. A new ID: `KI-NNN` (increment from last used)
2. All fields in the standard table header
3. Description, impact, and resolution path
4. Update the **Issue Summary** table at the top
5. Set status: 🔴 Open (High/Critical), 🟡 Open (Medium/Low), 🟢 Resolved

When an issue is resolved:

1. Update status to 🟢 Resolved
2. Add resolution date and description
3. Add entry to **Issue Resolution Log**
4. Remove "PENDING" notices from related documents
