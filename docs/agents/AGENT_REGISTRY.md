# AGENT_REGISTRY.md

**Purpose:** Definitive directory of all specialized agent roles, capabilities, boundaries, and ownership scopes.  
**Scope:** AI Agent Orchestration Framework for Ana Orthodox  
**Status:** ENFORCED  
**Last Updated:** 2026-11-17  
**Owner:** Principal Engineering Orchestrator  
**Related Documents:** HANDOFF_PROTOCOL.md, EXECUTION_LOG.md

---

## 1. Primary Orchestrator Role

- **Agent Name:** Principal Software Architect & Engineering Orchestrator
- **Mandate:** Overall architectural integrity, task decomposition, dependency orchestration, quality gate validation, final PR acceptance, and institutional memory governance.
- **Authority:** Final sign-off on architecture drift, ADRs, database migrations, and release milestones.

---

## 2. Specialized Subagent Directory

| Agent ID       | Role Name           | Domain & File Ownership                          | Key Responsibilities                                                           | Quality Verification                             |
| -------------- | ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| **AGT-ARCH**   | Architecture Agent  | `docs/architecture/*`, monorepo boundaries       | Enforces clean architecture, module separation, prevents circular dependencies | ADR compliance checks, dependency linting        |
| **AGT-FRONT**  | Frontend Agent      | `apps/web/*`, `docs/frontend/*`                  | Next.js 15 App Router, React Server Components, client state, Tailwind RTL     | Next build, Lighthouse audit, zero dead controls |
| **AGT-BACK**   | Backend Agent       | `apps/api/*`, `docs/api/*`                       | NestJS modules, domain services, DTO validation, REST endpoints                | Unit & integration tests, OpenAPI validation     |
| **AGT-DB**     | Database Agent      | `apps/api/prisma/*`, `docs/database/*`           | PostgreSQL schemas, migrations, relations, indexes, performance tuning         | Prisma migration checks, query explain plans     |
| **AGT-DESIGN** | Design System Agent | `packages/design-tokens/*`, CSS variables        | Material 3 tokens, Arabic typography, Coptic fonts, RTL ergonomic standards    | WCAG 2.2 AA contrast, RTL visual inspections     |
| **AGT-PWA**    | PWA Agent           | `apps/web/public/manifest.json`, service workers | Service worker lifecycle, IndexedDB offline caching, install prompts           | Playwright offline simulation tests              |
| **AGT-SEC**    | Security Agent      | `docs/security/*`, NestJS guards, auth           | Threat modeling, RBAC validation, IDOR checks, OWASP Top 10 remediation        | Security audit test suites, token rotation tests |
| **AGT-QA**     | QA Agent            | `test/*`, `apps/*/test/*`, Playwright            | Unit, integration, E2E, visual regression, and load testing suites             | Test pass rate, coverage reports, quality gates  |
| **AGT-DOCS**   | Documentation Agent | `docs/*`, catalogs, handover files               | Catalogs synchronization, traceability matrix updates, handover logs           | Link verification, catalog consistency audits    |
