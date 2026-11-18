# HANDOFF_PROTOCOL.md

**Purpose:** Protocol governing task dispatch, inter-agent communication, completion verification, and context handoff.  
**Scope:** Agent execution lifecycle  
**Status:** ENFORCED  
**Last Updated:** 2026-11-17  
**Owner:** Principal Engineering Orchestrator  
**Related Documents:** AGENT_REGISTRY.md, QUALITY_GATES.md

---

## 1. Task Dispatch Contract

Every task dispatched to an agent or subagent must include:

1. **Task ID:** Unique identifier (e.g. `TASK-BIB-001`).
2. **Specification Reference:** Absolute path to feature specification or ADR.
3. **Target Files:** Explicit whitelist of files the agent is authorized to create or modify.
4. **Acceptance Criteria:** Unambiguous list of observable technical and functional checks.
5. **Quality Gates:** Explicit list of tests that must pass.

---

## 2. Handoff Completion Report Format

Upon finishing a task, the assigned agent must return a structured report containing:

- **Files Created / Modified:** File paths and line summaries.
- **Verification Evidence:** Terminal command output showing passing compilation, linting, and tests.
- **Updated Catalogs:** Proof of corresponding updates to documentation catalogs (routes, endpoints, components, interactions).
- **Known Limitations:** Any edge cases deferred to subsequent tasks.

---

## 3. Orchestrator Acceptance Gate

The Principal Orchestrator will reject any handoff if:

- Any file was modified outside the assigned scope without prior justification.
- Tests were mocked or skipped.
- UI controls were left non-functional.
- Documentation was not updated in the same changeset.
