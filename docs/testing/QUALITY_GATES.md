# QUALITY_GATES.md

**Purpose:** Enforce non-negotiable quality and security gates required before any code can be merged or any feature marked ACCEPTED.  
**Scope:** Continuous Integration (CI), Pull Requests, Release Candidates  
**Status:** ENFORCED  
**Last Updated:** 2026-11-17  
**Owner:** QA Agent & Engineering Orchestrator  
**Related Documents:** TEST_STRATEGY.md, TRACEABILITY_MATRIX.md

---

## 1. The 10 Mandatory Quality Gates

Every engineering change must satisfy all 10 gates. No exceptions or waivers are permitted.

| Gate #      | Name                       | Verification Command                  | Threshold / Criteria                                                   | Failure Action |
| ----------- | -------------------------- | ------------------------------------- | ---------------------------------------------------------------------- | -------------- |
| **Gate 1**  | TypeScript Strict Compile  | `npm run type-check`                  | Zero `tsc` errors across all workspaces (`--noEmit`)                   | Block merge    |
| **Gate 2**  | Code Quality & Linting     | `npm run lint`                        | Zero ESLint errors or warnings                                         | Block merge    |
| **Gate 3**  | Unit Test Execution        | `npm run test:unit`                   | 100% pass rate; ≥ 85% domain branch coverage                           | Block merge    |
| **Gate 4**  | Integration & DB Tests     | `npm run test:integration`            | 100% pass rate; all migrations tested against PostgreSQL               | Block merge    |
| **Gate 5**  | End-to-End User Journeys   | `npx playwright test`                 | 100% pass rate across mobile & desktop viewports                       | Block merge    |
| **Gate 6**  | Monorepo Build Succeeded   | `npm run build`                       | Next.js and NestJS production builds succeed with zero errors          | Block merge    |
| **Gate 7**  | Database Migration Safety  | `prisma migrate deploy --dry-run`     | Zero unapplied migrations; no non-reversible destructs                 | Block merge    |
| **Gate 8**  | Authorization & RBAC Audit | Automated Security Test Suite         | Every protected endpoint verified for 401 (unauth) and 403 (forbidden) | Block merge    |
| **Gate 9**  | Dead Control Verification  | Automated Playwright interaction scan | Zero non-functional visible buttons or dead links                      | Block merge    |
| **Gate 10** | Continuous Documentation   | `git diff --name-only docs/`          | All affected catalogs (API, Route, Screen, Traceability) updated       | Block merge    |

---

## 2. Anti-Bypass Policy

- Never use `--skip-tests` or `--no-verify`.
- Never replace meaningful assertions with superficial `expect(true).toBe(true)` checks.
- Test counts and coverage percentages must be published with every pull request.
