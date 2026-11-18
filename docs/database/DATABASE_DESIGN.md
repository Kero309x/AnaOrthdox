# DATABASE_DESIGN.md

**Purpose:** Comprehensive architectural specification for persistence, data modeling, indexing, and migration governance.  
**Engine Target:** PostgreSQL 18.x  
**ORM Target:** Prisma ORM 7.x Stable (Locked major: 7.10.x; no v8 release candidates)  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Database Agent  
**Related Documents:** ENTITY_CATALOG.md, MIGRATION_HISTORY.md, ADR-0004.md

---

## 1. Engine & ORM Specifications

| Property               | Value                         | Rationale                                                                           |
| ---------------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| **RDBMS Engine**       | PostgreSQL 18.x               | Advanced JSONB, partition routing, GIN/tsvector indexing, enterprise reliability    |
| **ORM Framework**      | Prisma ORM 7.x Stable         | Declarative schema, full TypeScript type safety, strict schema migrations           |
| **Connection Pooling** | PgBouncer / Prisma Accelerate | Manages connection limits under high concurrent reading loads                       |
| **Primary Keys**       | UUID v4 (`gen_random_uuid()`) | Prevents sequential ID enumeration attacks, supports distributed data generation    |
| **Character Encoding** | UTF-8                         | Full multilingual support: Arabic, Coptic (Unicode block 2C80–2CFF), English, Greek |
| **Timestamp Standard** | UTC ISO-8601 (`timestamptz`)  | Standardized global time representation across timezones                            |

### 1.1 Prisma 7 Driver Adapter Architecture

In Prisma ORM 7.x:

1. **No Datasource URL in `schema.prisma`:** The `url` property in `datasource db` is deprecated. Datasource URLs and connection pooling configuration reside in `apps/api/prisma.config.ts`.
2. **Driver Adapter Requirement:** Direct PostgreSQL connections are powered by `@prisma/adapter-pg` and `pg.Pool`.
3. **PrismaService Lifecycle:** `PrismaClient` is instantiated passing `{ adapter: new PrismaPg(pool) }`. NestJS handles connection lifecycle via `onModuleInit` (`$connect()`) and `onModuleDestroy` (`$disconnect()`). If PostgreSQL is unreachable, errors are caught gracefully and logged, enabling health probes to accurately report degraded infrastructure.

---

## 2. Naming Conventions & Schema Rules

1. **Tables:** `snake_case` plural (e.g. `bible_verses`, `user_bookmarks`, `liturgical_feasts`).
2. **Columns:** `snake_case` (e.g. `book_id`, `chapter_number`, `created_at`, `is_active`).
3. **Foreign Keys:** `[singular_parent_table]_id` referencing `id` with explicit `ON DELETE CASCADE` or `RESTRICT`.
4. **Indexes:** `idx_[table]_[columns]` for B-Tree, `gin_[table]_[column]` for Full-Text Search.
5. **No Blind Soft Deletes:** Soft deletes (`deleted_at`) applied exclusively to editorial and user-authored content requiring audit retention. Canonical sacred texts are immutable.

---

## 3. Full-Text Search Strategy for Arabic Sacred Texts

PostgreSQL GIN (Generalized Inverted Index) with Arabic configuration:

```sql
CREATE INDEX idx_bible_verses_arabic_search
ON bible_verses
USING gin(to_tsvector('arabic', verse_text));
```

- Ingestion pipeline runs diacritic-insensitive normalization so searches for "يسوع" match both with and without Tashkeel.
- Cross-references use indexed composite keys `(book_id, chapter_number, verse_number)`.

---

## 4. Phase 1 Smoke-Test Schema

The baseline schema established in `apps/api/prisma/schema.prisma` implements:

- `SmokeCheck`: Verification entity for health-check probes.
- `User`: Identity baseline with UUID, email uniqueness, hashed passwords.
- `RefreshToken`: Single-use refresh token store with revocation flags and user relations.
- `SystemAuditLog`: Security audit log tracking administrative and security-sensitive mutations.

---

## 5. Phase 2A Implemented Entity Models (Identity & Access Management)

In accordance with ADR-0007, the following entities are fully implemented in `apps/api/prisma/schema.prisma`:

### 5.1 `users`

- `id` (UUID v4, PK)
- `email` (VARCHAR, Unique, normalized lowercase)
- `password_hash` (VARCHAR, Argon2id with 19 MiB memory cost, 2 iterations)
- `full_name` (VARCHAR, min 2, max 64 chars)
- `role` (VARCHAR, default "USER")
- `is_active` (BOOLEAN, default true)
- `email_verified` (BOOLEAN, default false)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- Relations: `profile` (1:1), `sessions` (1:N), `refreshTokens` (1:N)

### 5.2 `user_profiles`

- `id` (UUID v4, PK)
- `user_id` (UUID v4, Unique, FK -> `users.id` ON DELETE CASCADE)
- `preferred_theme` (VARCHAR, default "system")
- `font_size` (INTEGER, default 18, range 14–32)
- `tashkeel_enabled` (BOOLEAN, default true)
- `coptic_script` (BOOLEAN, default true)
- `preferred_bible_id` (VARCHAR, optional)
- `updated_at` (TIMESTAMPTZ)

### 5.3 `user_sessions`

- `id` (UUID v4, PK)
- `user_id` (UUID v4, FK -> `users.id` ON DELETE CASCADE)
- `family_id` (UUID v4, links session to token rotation lineage)
- `user_agent` (TEXT, optional client identifier)
- `ip_address` (VARCHAR, optional client IP)
- `is_revoked` (BOOLEAN, default false)
- `created_at`, `last_active_at`, `expires_at` (TIMESTAMPTZ)
- Relations: `refreshTokens` (1:N)

### 5.4 `refresh_tokens`

- `id` (UUID v4, PK)
- `token_hash` (VARCHAR, Unique, SHA-256 of raw 32-byte opaque base64url token)
- `user_id` (UUID v4, FK -> `users.id` ON DELETE CASCADE)
- `session_id` (UUID v4, optional FK -> `user_sessions.id` ON DELETE CASCADE)
- `family_id` (UUID v4, rotation family grouping)
- `is_rotated` (BOOLEAN, default false; trigger for compromise reuse detection)
- `is_revoked` (BOOLEAN, default false)
- `expires_at` (TIMESTAMPTZ, 30 days)
- `created_at` (TIMESTAMPTZ)

### 5.5 `system_audit_logs`

- `id` (UUID v4, PK)
- `action` (VARCHAR, e.g. `SECURITY_TOKEN_REUSE_DETECTED`)
- `actor_id` (UUID v4, optional)
- `target` (VARCHAR, e.g. `family:<uuid>`)
- `details` (JSONB, security incident context)
- `ip_address` (VARCHAR)
- `created_at` (TIMESTAMPTZ)

---

## 6. Phase 2B+ Proposed Sacred Text Entity Models (Gated)

Detailed specifications for Bible and Liturgical data models are codified in `docs/architecture/PHASE_2_ARCHITECTURE_PROPOSAL.md` and `docs/architecture/decisions/ADR-0006.md`:

- **Holy Bible Domain:** `bible_editions`, `bible_books` (73 Alexandrian canonical books), `bible_chapters`, `bible_verses`.
- **Liturgical Lectionaries:** `katameros_readings`, `synaxarium_days`, `agpeya_hours`.
- Full Bible text ingestion is strictly gated on licensing and ecclesiastical approval. Zero unverified text scraping.
