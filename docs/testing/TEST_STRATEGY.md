# TEST_STRATEGY.md

**Purpose:** Comprehensive multi-tiered testing strategy, automation framework standards, coverage thresholds, and verification protocols.  
**Scope:** Backend (NestJS), Frontend (Next.js 15), Database (Prisma/PostgreSQL), PWA, and Security  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** QA Agent  
**Related Documents:** QUALITY_GATES.md, TRACEABILITY_MATRIX.md

---

## 1. Testing Pyramid & Verification Architecture

```
               / \
              /   \
             / E2E \       Playwright (Full RTL User Journeys, PWA Offline)
            /-------\
           /  Integ  \     Supertest + Testcontainers PostgreSQL
          /-----------\
         /    Unit     \   Jest / Vitest (Domain Logic, DTO Validation, Pipes)
        /---------------\
```

---

## 2. Test Execution Tiers

### Tier 1: Unit Testing (Execution target: < 10 seconds)

- **Framework:** Jest / Vitest with TypeScript support (`ts-jest`).
- **Focus:**
  - NestJS domain services (e.g. Coptic calendar date calculation algorithms).
  - DTO input validation rules (`class-validator` constraints).
  - Custom React hooks (e.g. `useBibleReader`, `useHymnPlayer`).
  - Pure utility functions (Arabic text normalization, Tashkeel stripper, date formatters).
- **Target Coverage:** ≥ 85% branch coverage on core domain services.

### Tier 2: Integration & Database Testing (Execution target: < 60 seconds)

- **Framework:** Jest + Supertest running against a transient PostgreSQL container (via Docker / Testcontainers).
- **Focus:**
  - Full HTTP request/response cycle against NestJS controllers.
  - Prisma database queries, joins, constraints, and cascading deletes.
  - JWT Authentication, guard execution, and RBAC rejection (verifying 401 and 403).
  - Transaction rollbacks during partial failures.

### Tier 3: End-to-End (E2E) & Visual Regression Testing

- **Framework:** Playwright with multi-browser engines (Chromium, WebKit / Safari, Firefox).
- **Focus:**
  - Complete user journeys (e.g. Navigating Genesis 1 -> bookmarking verse -> reviewing bookmark in profile).
  - RTL Layout & Bidirectional visual verification (ensuring navigation drawers slide from right, reading progression moves right-to-left).
  - Responsive viewport audits (Mobile 375px, Tablet 768px, Desktop 1440px).
  - PWA offline mode: Simulating network disconnection in Chromium and asserting cached Bible/Agpeya pages remain completely accessible.

---

## 3. Mandatory Verification Commands

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npx playwright test`
- Type checking: `npm run type-check`
- Linting: `npm run lint`
