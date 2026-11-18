# NEXT_ACTIONS.md

**Purpose:** Prioritized, dependency-aware tactical execution roadmap for immediate implementation.  
**Scope:** Phase 2B.1 completion through Phase 2B.2 execution  
**Status:** ACTIVE  
**Last Updated:** 2026-11-17  
**Owner:** Engineering Orchestrator  
**Related Documents:** HANDOVER_GUIDE.md, CURRENT_PHASE.md, PROJECT_STATUS.md, KNOWN_ISSUES.md, ADR-0008.md, PASCHALION_COMPUTUS_RESEARCH.md

---

## 1. Immediate Infrastructure Actions (User / Host Action Required)

1. **Resolve KI-006 (Install Docker Desktop & WSL2):**
   - Run `wsl --install --no-distribution` in PowerShell as Administrator.
   - Install Docker Desktop for Windows.
   - Run `docker compose up -d` in project root to start PostgreSQL 18 and Redis 7 containers.
   - _Alternative:_ Supply an external PostgreSQL 18 connection string in `apps/api/.env` and `.env.local` to execute `prisma migrate deploy`.
2. **Resolve KI-007 (Configure Remote Git Repository):**
   - Create a private repository on GitHub (e.g. `ana-orthodox`).
   - Run:
     ```bash
     git remote add origin https://github.com/<username>/ana-orthodox.git
     git branch -M main
     git push -u origin main
     ```

---

## 2. Phase 2B.1 Completed Milestones

- [x] **ADR-0008 Approved:** Documented Deterministic Fixed-Day Coptic Calendar Mathematics & Epoch Convention ($1 \text{ Thout } 1 \text{ AM} = \text{R.D. } 103,605$).
- [x] **Standalone Calendar Engine Package (`@ana-orthodox/coptic-calendar`):** Pure TypeScript package implementing Rata Die conversions, leap-year calculations ($\text{floorMod}(y, 4) \equiv 3$), Nasie day validation, and date arithmetic.
- [x] **Authoritative Historical Cases Verified:** 100% agreement with historical standards:
  - $1 \text{ Thout } 1743 \text{ AM} = 11 \text{ September } 2026$.
  - $30 \text{ Thout } 1743 \text{ AM} = 10 \text{ October } 2026$.
  - $29 \text{ Koiak } 1743 \text{ AM} = 7 \text{ January } 2027$ (Coptic Nativity).
  - $6 \text{ Nasie } 1743 \text{ AM} = 11 \text{ September } 2027$.
  - $1 \text{ Thout } 1744 \text{ AM} = 12 \text{ September } 2027$.
- [x] **Full-Year Invariance Testing:** Verified roundtrip consistency across all 366 days of leap year 1743 AM and all 365 days of common year 1744 AM.
- [x] **NestJS Backend Endpoints:** Implemented and tested `GET /api/v1/calendar/coptic/from-gregorian` and `GET /api/v1/calendar/coptic/to-gregorian` with Swagger OpenAPI docs and standard envelopes.
- [x] **Next.js 16 Web Application Converter:** Interactive, offline-capable calendar conversion tool on `/calendar`.
- [x] **Paschal Computus Research Codified:** Authored `docs/research/PASCHALION_COMPUTUS_RESEARCH.md` detailing the tabular Metonic cycle versus astronomical moon phases.
- [x] **Automated Tests:** 91 tests passing across monorepo (100% pass rate).

---

## 3. Phase 2B.2 Roadmap: Alexandrian Paschal Computus & Movable Feasts

Once Phase 2B.1 is committed, proceed with Phase 2B.2:

1. **Step 2B.2.1 — Implement Alexandrian Paschalion Algorithm:**
   - In `@ana-orthodox/coptic-calendar`:
     - Implement the 19-year Metonic cycle and Epact (الأبقطي) calculation per Council of Nicaea (325 AD) rules.
     - Calculate Paschal Full Moon (ذبح الخروف) between 25 Baramhat and 23 Baramouda.
     - Compute the Sunday of Pascha (عيد القيامة المجيد) for any given Coptic/Gregorian year.
2. **Step 2B.2.2 — Compute Movable Feast & Fast Schedules:**
   - Jonah's Fast (صوم يونان - 9 weeks before Pascha).
   - Great Lent (الصوم الكبير - 55 days before Pascha).
   - Palm Sunday (أحد الشعانين - 7 days before Pascha).
   - Holy Week (أسبوع الآلام).
   - Ascension (عيد الصعود - 40 days after Pascha).
   - Pentecost (عيد العنصرة - 50 days after Pascha).
   - Apostles' Fast (صوم الرسل - begins day after Pentecost, ends 5 Epip).
3. **Step 2B.2.3 — Liturgy / Calendar API Endpoints:**
   - `GET /api/v1/liturgy/pascha/:year`
   - `GET /api/v1/liturgy/feasts/movable/:year`
4. **Step 2B.2.4 — Comprehensive Regression & Historical Benchmark Tests:**
   - Validate against historic Pascha dates across centuries (e.g. 2024, 2025, 2026, 2027, 2028).

---

## 4. Strict Content Governance Boundaries (Unchanged)

1. **Full Bible Text Ingestion:** Prohibited until formal licensing agreement is secured from the Bible Society of Egypt or the Coptic Orthodox Bishopric of Youth for the Deuterocanonical books.
2. **Katameros Lectionary Readings:** Ingestion gated on liturgical calendar committee review.
3. **Synaxarium Biographies:** Ingestion gated on authenticated text provenance.
4. **Agpeya Text:** Ingestion gated on approved public-domain text verification.
