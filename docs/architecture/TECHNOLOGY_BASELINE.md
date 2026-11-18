# TECHNOLOGY_BASELINE.md

**Purpose:** Definitive record of verified package versions, toolchains, runtime compatibility results, and dependency locks.  
**Scope:** Monorepo root, apps, packages, and infrastructure  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Principal Software Architect  
**Related Documents:** ARCHITECTURE.md, ADR-0002.md, ADR-0004.md, QUALITY_GATES.md

---

## 1. Verified Core Runtime & Toolchain Versions

| Component                 | Target Version        | Audited / Installed Version               | Status       | Compatibility Notes                                                                       |
| ------------------------- | --------------------- | ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| **Node.js Runtime**       | Node LTS / 26.x       | `v26.13.0`                                | **VERIFIED** | Tested against NestJS 12, Next.js 16, and Prisma 7 engines. Full compatibility confirmed. |
| **Package Manager**       | pnpm 12.x             | `12.21.0`                                 | **VERIFIED** | Monorepo workspaces managed via `pnpm-workspace.yaml`.                                    |
| **Monorepo Build System** | Turborepo             | `2.11.11`                                 | **VERIFIED** | Cached pipeline execution for `build`, `test`, `lint`, and `type-check`.                  |
| **Frontend Framework**    | Next.js 16 Active LTS | `16.4.6`                                  | **VERIFIED** | React Server Components by default; Turbopack; App Router.                                |
| **UI Runtime**            | React 19.x            | `19.3.1`                                  | **VERIFIED** | Supported by Next.js 16; React Compiler ready.                                            |
| **Backend Framework**     | NestJS 12.x           | `12.5.1`                                  | **VERIFIED** | Native Node.js 26 support; modular dependency injection; Fastify/Express engine.          |
| **Persistence ORM**       | Prisma ORM 7.x Stable | `7.10.1`                                  | **VERIFIED** | Locked to major version 7. Prisma 8 RCs explicitly excluded.                              |
| **Database Engine**       | PostgreSQL 18.x       | PostgreSQL 18.x (Docker/Container target) | **VERIFIED** | Container image: `postgres:18-alpine` with healthcheck.                                   |
| **Caching Engine**        | Redis 7.x             | Redis 7.x (Docker/Container target)       | **VERIFIED** | Container image: `redis:7-alpine` with persistent volume.                                 |
| **Language Compiler**     | TypeScript 5.8/5.9    | `5.8.3`                                   | **VERIFIED** | Strict mode enabled across all monorepo workspaces.                                       |
| **Styling Engine**        | Tailwind CSS 4.x      | `4.3.5`                                   | **VERIFIED** | Logical properties (`ms-`, `me-`, `ps-`, `pe-`) for native RTL.                           |
| **Design System**         | Material 3 Tokens     | Custom Coptic M3 tokens                   | **VERIFIED** | Codified in `packages/design-tokens` (Emerald & Gold provisional theme).                  |

---

## 2. Peer Dependency Compatibility Matrix

```
Node.js 26.13.0
  ├── pnpm 12.21.0
  │     ├── Next.js 16.4.6 ──> React 19.3.1 ──> React-DOM 19.3.1
  │     ├── NestJS 12.5.1 ──> @nestjs/common 12.5.1 ──> rxjs 7.8.2
  │     ├── Prisma 7.10.1 ──> @prisma/client 7.10.1
  │     └── TypeScript 5.8.3
```

---

## 3. Policy on Updates

1. **Prisma:** Under no circumstances should `prisma@8.x` pre-releases be installed. Lock to `~7.10.1`.
2. **Next.js:** Stay on the `16.x` Active LTS branch.
3. **TypeScript:** Strict type checking (`noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`) enforced in `packages/config/tsconfig.base.json`.
