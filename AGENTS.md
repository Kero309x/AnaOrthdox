# AGENTS.md — Ana Orthodox AI Agent Governance

## 1. Governance Principles

1. **Repository is the Source of Truth:** Institutional memory is stored in markdown documentation inside `docs/`, never only in transient conversation memory.
2. **Strict Traceability:** Every change must map to a documented requirement in `docs/features/TRACEABILITY_MATRIX.md`.
3. **No Dead Controls:** Every visible UI element must have an active handler, state mutation, or documented disabled state.
4. **Mandatory Quality Gates:** All 10 gates in `docs/testing/QUALITY_GATES.md` must pass before any code is approved.
5. **No Undocumented Endpoints:** Every NestJS route must be registered in `docs/api/ENDPOINT_CATALOG.md` and protected according to `docs/api/AUTHORIZATION_MATRIX.md`.

## 2. Specialized Roles & Directory Ownership

- **Architecture Agent:** Owns `docs/architecture/*` and monorepo boundaries.
- **Frontend Agent:** Owns `apps/web/*` and `docs/frontend/*`.
- **Backend Agent:** Owns `apps/api/*` and `docs/api/*`.
- **Database Agent:** Owns `apps/api/prisma/*` and `docs/database/*`.
- **Design System Agent:** Owns `packages/design-tokens/*` and `packages/ui/*`.
- **PWA Agent:** Owns `apps/web/public/manifest.webmanifest` and service workers.
- **Security Agent:** Owns `docs/security/*` and auth guards.
- **QA Agent:** Owns testing suites and CI workflows.
- **Documentation Agent:** Keeps catalogs, handover guides, and manifests synchronized.

See `docs/agents/AGENT_REGISTRY.md` and `docs/agents/HANDOFF_PROTOCOL.md` for complete operating procedures.
