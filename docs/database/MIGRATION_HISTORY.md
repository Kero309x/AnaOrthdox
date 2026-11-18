# Migration History — Ana Orthodox

> **Purpose:** Track all Prisma migrations applied to the Ana Orthodox PostgreSQL database, providing a complete audit trail of schema evolution.
> **Scope:** All environments (development, staging, production).
> **Status:** GREENFIELD — No migrations exist. First migration is pending.
> **Last Updated:** 2026-11-17
> **Owner:** Backend / Database Team
> **Related Documents:**
>
> - `docs/database/DATABASE_DESIGN.md`
> - `docs/database/ENTITY_CATALOG.md`
> - `apps/api/prisma/schema.prisma`
> - `apps/api/prisma/migrations/`

---

## Current State

```
apps/api/prisma/migrations/   ← EMPTY (directory does not yet exist)
apps/api/prisma/schema.prisma ← NOT YET CREATED
```

The database has not been initialized. No Prisma schema has been written, no `prisma init` has been run, and no migration files exist. This is a greenfield project.

---

## Migration Strategy

### Core Principles

1. **Never edit an applied migration.** Once a migration SQL file has been applied to any environment (dev, staging, production), it is immutable. Modify schema via a new migration only.
2. **Prisma is the single migration authority.** No manual DDL changes (`CREATE TABLE`, `ALTER TABLE`, etc.) are permitted directly in any database. All changes flow through `schema.prisma` → `prisma migrate`.
3. **Migrations are committed to source control.** The `apps/api/prisma/migrations/` directory is fully version-controlled. Migration files are reviewed in pull requests alongside the schema diff.
4. **One concern per migration.** Large multi-table changes should be split into logical migrations (e.g., one for Identity, one for Bible, one for Calendar) to aid debugging and rollback reasoning.
5. **Idempotent baseline migrations.** The initial migration (0000) will capture the full initial schema. Subsequent migrations are incremental diffs.

---

### Environment Workflow

```mermaid
flowchart LR
  A[Edit schema.prisma] --> B[prisma migrate dev]
  B --> C[Migration SQL generated in /migrations]
  C --> D[Commit migration to source control]
  D --> E[Open Pull Request]
  E --> F[CI validates migration]
  F --> G[Merge to main]
  G --> H[CI/CD runs prisma migrate deploy on staging]
  H --> I[QA Sign-off]
  I --> J[prisma migrate deploy on production]
```

### Commands Reference

| Command                            | Environment      | Purpose                                                       |
| ---------------------------------- | ---------------- | ------------------------------------------------------------- |
| `prisma init`                      | Development      | Initialize Prisma config and `schema.prisma`                  |
| `prisma migrate dev`               | Development      | Generate + apply migration; regenerate Prisma Client          |
| `prisma migrate dev --name <name>` | Development      | Same as above, with explicit migration name                   |
| `prisma migrate reset`             | Development only | Drop DB, re-apply all migrations from scratch (destroys data) |
| `prisma migrate deploy`            | Staging/Prod     | Apply all pending migrations without prompts; CI/CD-safe      |
| `prisma migrate status`            | Any              | Show which migrations are applied vs pending                  |
| `prisma migrate resolve`           | Any              | Mark a failed migration as resolved (use carefully)           |
| `prisma db seed`                   | Development      | Run seed script (`prisma/seed.ts`) to populate reference data |
| `prisma studio`                    | Development      | GUI database browser (never run against production)           |

> [!CAUTION]
> `prisma migrate reset` **destroys all data** in the target database. It is only safe in isolated development environments. Never run against staging or production.

> [!IMPORTANT]
> In CI/CD, always use `prisma migrate deploy` — never `prisma migrate dev`. The `dev` command prompts interactively and generates new migrations, which is incorrect behaviour in automated pipelines.

---

### Naming Convention

Migration directories are named by Prisma using the pattern:

```
<timestamp>_<descriptive_name>/
  migration.sql
```

**Timestamp format:** `YYYYMMDDHHMMSS` (UTC)

**Descriptive name guidelines:**

| Pattern                   | Example                      |
| ------------------------- | ---------------------------- |
| `init_<group>`            | `init_identity`              |
| `add_<entity>`            | `add_reading_plans`          |
| `alter_<entity>_<change>` | `alter_users_add_avatar_url` |
| `drop_<entity>`           | `drop_legacy_sessions`       |
| `index_<entity>_<field>`  | `index_bible_verses_fts`     |

---

### Seed Data Strategy

Reference data (Bible books, Coptic calendar months, Agpeya hours, etc.) is loaded via `prisma/seed.ts`, not through migrations. This separates structural changes (DDL) from data initialization:

```
prisma/
├── schema.prisma
├── seed.ts           ← Seeds canonical reference data
└── migrations/
    └── ...
```

Seed data is re-runnable (idempotent via `upsert`) and is run after `prisma migrate dev` or `prisma migrate reset` in development.

```typescript
// Example seed pattern — idempotent upsert
await prisma.bibleBook.upsert({
  where: { book_number: 1 },
  update: {},
  create: { book_number: 1, name_ar: "التكوين", name_en: "Genesis", testament: "OT" },
});
```

---

## Migration Log

### Legend

| Status    | Meaning                                                 |
| --------- | ------------------------------------------------------- |
| `PENDING` | Migration not yet created (future / not yet scaffolded) |
| `APPLIED` | Migration has been applied to this environment          |
| `FAILED`  | Migration failed; must be resolved before proceeding    |
| `SKIPPED` | Migration skipped (e.g., environment-specific only)     |

---

### 0000 — Initial Schema (Identity + Core Foundation)

| Field            | Value                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**           | 0000                                                                                                                                                                                                                          |
| **Name**         | `init_identity`                                                                                                                                                                                                               |
| **Status**       | `PENDING`                                                                                                                                                                                                                     |
| **Target Env**   | Development (first)                                                                                                                                                                                                           |
| **Created By**   | (Will be generated by Prisma)                                                                                                                                                                                                 |
| **Created At**   | (Pending — will be populated on first `prisma migrate dev`)                                                                                                                                                                   |
| **Description**  | Initial migration. Creates all Identity group tables: `users`, `roles`, `permissions`, `role_permissions`, `sessions`, `refresh_tokens`. Establishes the UUID primary key pattern, timestamp standards, and baseline indexes. |
| **Tables Added** | `users`, `roles`, `permissions`, `role_permissions`, `sessions`, `refresh_tokens`                                                                                                                                             |
| **Indexes**      | `uq_users_email`, `idx_sessions_user_id`, `idx_refresh_tokens_user_id`, `idx_refresh_tokens_family_id`                                                                                                                        |

**Prerequisites before this migration can be created:**

- [ ] NestJS API scaffolded at `apps/api/`
- [ ] Prisma installed: `npm install prisma @prisma/client`
- [ ] `prisma init` run to create `schema.prisma` and `.env` with `DATABASE_URL`
- [ ] PostgreSQL 16 instance running and accessible
- [ ] `DATABASE_URL` set in `apps/api/.env`

---

### Planned Future Migrations (Provisional)

The following migrations are planned but not yet created. Order and grouping may change.

| ID   | Provisional Name         | Tables                                                                                             | Phase |
| ---- | ------------------------ | -------------------------------------------------------------------------------------------------- | ----- |
| 0001 | `init_bible`             | `bible_books`, `bible_chapters`, `bible_verses`                                                    | 1     |
| 0002 | `init_katameros`         | `katameros_entries`, `katameros_readings`                                                          | 2     |
| 0003 | `init_hymns`             | `hymns`, `hymn_sections`, `hymn_audios`, `hymn_translations`                                       | 2     |
| 0004 | `init_agpeya`            | `agpeya_hours`, `agpeya_prayers`, `agpeya_audios`                                                  | 2     |
| 0005 | `init_synaxarium`        | `synaxarium_entries`, `synaxarium_saints`                                                          | 2     |
| 0006 | `init_patristic`         | `church_fathers`, `patristic_texts`, `patristic_tags`, `patristic_text_tags`                       | 3     |
| 0007 | `init_calendar`          | `coptic_calendar_months`, `coptic_calendar_days`, `liturgical_seasons`, `liturgical_calendar_days` | 3     |
| 0008 | `init_geography`         | `dioceses`, `churches`, `monasteries`                                                              | 3     |
| 0009 | `init_events`            | `events`                                                                                           | 3     |
| 0010 | `init_personal`          | `bookmarks`, `notes`, `reading_plans`, `user_reading_plans`, `reading_progress`                    | 4     |
| 0011 | `init_history_heritage`  | `church_history_entries`, `coptic_heritage_items`                                                  | 4     |
| 0012 | `index_fts_bible_verses` | GIN FTS index on `bible_verses.text_ar`                                                            | 5     |
| 0013 | `index_fts_synaxarium`   | GIN FTS index on `synaxarium_entries.content_ar`                                                   | 5     |
| 0014 | `init_search_index`      | `search_index`                                                                                     | 5+    |

> [!NOTE]
> This provisional list will change as schema design progresses. Migration IDs here are illustrative; actual IDs are timestamps generated by Prisma.

---

## Rollback Policy

PostgreSQL migrations through Prisma are **forward-only** by default. Prisma does not generate automatic rollback (down) migrations.

**Rollback strategy by risk level:**

| Risk                                                | Strategy                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Low (additive only: new table, new nullable column) | Deploy fix migration forward                                                               |
| Medium (column rename, type change)                 | Deploy compensating migration; coordinate with application deploy                          |
| High (data loss risk)                               | Restore from backup snapshot taken before deploy; apply corrective migration               |
| Critical (production incident)                      | Revert application code to previous version first; then rollback DB via snapshot if needed |

> [!CAUTION]
> Database backup snapshots must be taken immediately before any production migration run. This is a CI/CD pipeline responsibility.

---

## Schema Drift Detection

In CI, run the following to detect unauthorized schema drift (database state does not match migration history):

```bash
prisma migrate status
```

If any migration is listed as `Not applied` or the schema shows drift, the CI pipeline **must fail** until resolved.

---

_This document is updated after every migration is created or applied. The migration log is the authoritative record of schema history alongside the migration files themselves._
