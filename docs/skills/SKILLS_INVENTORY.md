# SKILLS_INVENTORY.md

**Purpose:** Comprehensive catalog and audit status of specialized agent skills utilized across project phases.  
**Scope:** Engineering Agent Environment  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Engineering Orchestrator  
**Related Documents:** AGENT_REGISTRY.md, QUALITY_GATES.md

---

## 1. Approved Agent Skills Inventory

| Skill ID        | Skill Name                    | Source / Repository  | Domain                | Status       | Phase Relevance | Audit Notes                                                               |
| --------------- | ----------------------------- | -------------------- | --------------------- | ------------ | --------------- | ------------------------------------------------------------------------- |
| `SKILL-SPEC-01` | `spec-driven-development`     | Builtin Agent Skills | Specifications        | **APPROVED** | Phase 0+        | Mandates PRD and specification authoring prior to implementation.         |
| `SKILL-INCR-01` | `incremental-implementation`  | Builtin Agent Skills | Engineering Lifecycle | **APPROVED** | Phase 0+        | Enforces thin, verifiable implementation slices; prevents monolithic PRs. |
| `SKILL-TDD-01`  | `test-driven-development`     | Builtin Agent Skills | Quality Assurance     | **APPROVED** | Phase 1+        | Red-green-refactor workflow for NestJS services and domain models.        |
| `SKILL-API-01`  | `api-and-interface-design`    | Builtin Agent Skills | Architecture / API    | **APPROVED** | Phase 0+        | Enforces stable REST DTOs, versioning, and strict type contracts.         |
| `SKILL-DOC-01`  | `docs-generator`              | Builtin Agent Skills | Documentation         | **APPROVED** | Phase 0+        | Progressive disclosure and maintenance of technical catalogs.             |
| `SKILL-SEC-01`  | `security-and-hardening`      | Builtin Agent Skills | Security              | **APPROVED** | Phase 1+        | Threat modeling, OWASP Top 10 mitigation, token rotation audits.          |
| `SKILL-UI-01`   | `frontend-ui-engineering`     | Builtin Agent Skills | Frontend              | **APPROVED** | Phase 0+        | Material 3 standards, accessible ARIA roles, WCAG 2.2 AA contrast.        |
| `SKILL-REV-01`  | `code-review-and-quality`     | Builtin Agent Skills | Code Quality          | **APPROVED** | Phase 0+        | Multi-axis review before merging pull requests.                           |
| `SKILL-PLAN-01` | `planning-and-task-breakdown` | Builtin Agent Skills | Project Management    | **APPROVED** | Phase 0+        | Dependency-aware backlog creation and sprint allocation.                  |
| `SKILL-RTL-01`  | `ui-ux-design-system`         | Builtin Agent Skills | Design Tokens         | **APPROVED** | Phase 0+        | Material 3 token mapping and RTL layout verification.                     |

---

## 2. Skills Usage Doctrine

- Third-party skills may only provide advisory execution blueprints; they never override the core Ana Orthodox architecture, security boundaries, or Arabic/Coptic ecclesiastical requirements.
- Any untrusted external script execution is strictly forbidden.
