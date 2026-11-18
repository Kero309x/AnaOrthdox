# Entity Catalog — Ana Orthodox

> **Purpose:** Preliminary catalog of all planned database entities, organized by domain group.
> **Scope:** All 20 product domains across the Ana Orthodox platform.
> **Status:** PRELIMINARY — All entities are PLANNED; none exist yet (greenfield).
> **Last Updated:** 2026-11-17
> **Owner:** Backend / Database Team
> **Related Documents:**
>
> - `docs/database/DATABASE_DESIGN.md`
> - `docs/database/MIGRATION_HISTORY.md`
> - `apps/api/prisma/schema.prisma` (authoritative once scaffolded)

---

> [!NOTE]
> Entity statuses will progress from `PLANNED → IN DESIGN → SCHEMA WRITTEN → MIGRATED → TESTED`.
> This document is updated whenever a new entity is added or promoted.

---

## Group 1 — Identity

Manages user accounts, roles, granular permissions, and session/token lifecycle.

| Entity Name     | Table Name         | Domain Module | Key Fields                                                                                             | Status  |
| --------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| User            | `users`            | `auth`        | `id`, `email`, `password_hash`, `display_name`, `role`, `is_active`, `email_verified_at`, `deleted_at` | PLANNED |
| Role            | `roles`            | `auth`        | `id`, `name` (enum: USER/EDITOR/ADMINISTRATOR), `description`                                          | PLANNED |
| Permission      | `permissions`      | `auth`        | `id`, `code` (e.g. `bible.read`), `description`, `module`                                              | PLANNED |
| Role Permission | `role_permissions` | `auth`        | `role_id`, `permission_id` (composite PK)                                                              | PLANNED |
| Session         | `sessions`         | `auth`        | `id`, `user_id`, `device_fingerprint`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`          | PLANNED |
| Refresh Token   | `refresh_tokens`   | `auth`        | `id`, `user_id`, `token_hash`, `expires_at`, `used_at`, `revoked_at`, `family_id`                      | PLANNED |

### Notes

- `users.role` stores the primary role enum. Additional granular permissions may be assigned via `role_permissions`.
- `refresh_tokens.family_id` enables token rotation detection (reuse of a rotated token invalidates the entire family).
- Sessions store metadata for security audit; they are hard-deleted (not soft-deleted) on logout/expiry.

---

## Group 2 — Bible

Hierarchical structure: Book → Chapter → Verse. Supports 73-book Coptic Orthodox canon.

| Entity Name      | Table Name           | Domain Module | Key Fields                                                                                       | Status  |
| ---------------- | -------------------- | ------------- | ------------------------------------------------------------------------------------------------ | ------- |
| Bible Book       | `bible_books`        | `bible`       | `id`, `name_ar`, `name_en`, `name_cop`, `book_number`, `testament` (OT/NT/DEUT), `chapter_count` | PLANNED |
| Bible Chapter    | `bible_chapters`     | `bible`       | `id`, `book_id`, `chapter_number`, `verse_count`                                                 | PLANNED |
| Bible Verse      | `bible_verses`       | `bible`       | `id`, `chapter_id`, `verse_number`, `text_ar`, `text_en`, `text_cop`, `footnotes`                | PLANNED |
| Bible Study Note | `bible_study_notes`  | `bible-study` | `id`, `verse_id`, `title`, `content`, `author_id`, `status`, `deleted_at`                        | PLANNED |
| Bible Commentary | `bible_commentaries` | `commentary`  | `id`, `verse_id`, `father_id`, `source_text`, `source_reference`, `language`, `deleted_at`       | PLANNED |

### Notes

- `bible_verses` stores Arabic, English, and Coptic inline (all three are small fixed strings per verse) rather than a separate translation table, for query simplicity.
- `bible_study_notes` are editor-authored, editorially managed content — soft delete applies.
- `bible_commentaries` link to `church_fathers` via `father_id`.

---

## Group 3 — Liturgical Content

Covers Katameros, Hymns, Agpeya/Prayers, Synaxarium, Church Fathers, and Patristic Library.

### 3.1 Katameros

| Entity Name       | Table Name           | Domain Module | Key Fields                                                                                                                             | Status  |
| ----------------- | -------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Katameros Entry   | `katameros_entries`  | `katameros`   | `id`, `coptic_month_id`, `coptic_day`, `season_id`, `pauline_ref`, `catholic_ref`, `acts_ref`, `psalm_ref`, `gospel_ref`, `deleted_at` | PLANNED |
| Katameros Reading | `katameros_readings` | `katameros`   | `id`, `entry_id`, `reading_type` (enum), `book_id`, `start_chapter`, `start_verse`, `end_chapter`, `end_verse`, `text_ar`              | PLANNED |

### 3.2 Hymns

| Entity Name      | Table Name          | Domain Module | Key Fields                                                                                               | Status  |
| ---------------- | ------------------- | ------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| Hymn             | `hymns`             | `hymns`       | `id`, `title_ar`, `title_cop`, `occasion`, `season_id`, `has_audio`, `melody_type`, `deleted_at`         | PLANNED |
| Hymn Section     | `hymn_sections`     | `hymns`       | `id`, `hymn_id`, `order_index`, `title_ar`, `content_ar`, `content_cop`, `content_en`, `transliteration` | PLANNED |
| Hymn Audio       | `hymn_audios`       | `hymns`       | `id`, `hymn_id`, `language`, `voice_type`, `storage_key`, `duration_seconds`, `file_size_bytes`          | PLANNED |
| Hymn Translation | `hymn_translations` | `hymns`       | `id`, `hymn_id`, `language_code`, `title`, `metadata`                                                    | PLANNED |

### 3.3 Agpeya / Prayers

| Entity Name   | Table Name       | Domain Module | Key Fields                                                                                                        | Status  |
| ------------- | ---------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| Agpeya Hour   | `agpeya_hours`   | `agpeya`      | `id`, `hour_number` (1–7+), `name_ar`, `name_en`, `name_cop`, `time_of_day`, `description_ar`                     | PLANNED |
| Agpeya Prayer | `agpeya_prayers` | `agpeya`      | `id`, `hour_id`, `order_index`, `prayer_type`, `title_ar`, `content_ar`, `content_cop`, `content_en`, `has_audio` | PLANNED |
| Agpeya Audio  | `agpeya_audios`  | `agpeya`      | `id`, `prayer_id`, `language`, `storage_key`, `duration_seconds`                                                  | PLANNED |

### 3.4 Synaxarium

| Entity Name      | Table Name           | Domain Module | Key Fields                                                                                                 | Status  |
| ---------------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| Synaxarium Entry | `synaxarium_entries` | `synaxarium`  | `id`, `coptic_month_id`, `coptic_day`, `title_ar`, `content_ar`, `saint_names`, `feast_type`, `deleted_at` | PLANNED |
| Synaxarium Saint | `synaxarium_saints`  | `synaxarium`  | `id`, `entry_id`, `name_ar`, `name_cop`, `name_en`, `martyr_date`, `feast_month`, `feast_day`              | PLANNED |

### 3.5 Church Fathers & Patristic Library

| Entity Name        | Table Name            | Domain Module    | Key Fields                                                                                                       | Status  |
| ------------------ | --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| Church Father      | `church_fathers`      | `church-fathers` | `id`, `name_ar`, `name_en`, `name_cop`, `title`, `century`, `origin`, `biography_ar`, `feast_month`, `feast_day` | PLANNED |
| Patristic Text     | `patristic_texts`     | `patristic`      | `id`, `father_id`, `title_ar`, `content_ar`, `source_work`, `reference`, `language`, `deleted_at`                | PLANNED |
| Patristic Tag      | `patristic_tags`      | `patristic`      | `id`, `name_ar`, `name_en`, `slug`                                                                               | PLANNED |
| Patristic Text Tag | `patristic_text_tags` | `patristic`      | `text_id`, `tag_id` (composite PK)                                                                               | PLANNED |

---

## Group 4 — Calendar

Covers Coptic Calendar, Liturgical Calendar, Church History milestones, and Coptic Heritage events.

| Entity Name             | Table Name                 | Domain Module         | Key Fields                                                                                                                       | Status  |
| ----------------------- | -------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Coptic Calendar Month   | `coptic_calendar_months`   | `coptic-calendar`     | `id`, `month_number` (1–13), `name_ar`, `name_cop`, `name_en`, `gregorian_start_approx`                                          | PLANNED |
| Coptic Calendar Day     | `coptic_calendar_days`     | `coptic-calendar`     | `id`, `month_id`, `day_number`, `gregorian_month`, `gregorian_day` (non-leap), `gregorian_day_leap`                              | PLANNED |
| Liturgical Season       | `liturgical_seasons`       | `liturgical-calendar` | `id`, `name_ar`, `name_en`, `name_cop`, `color_hex`, `order_index`, `description_ar`                                             | PLANNED |
| Liturgical Calendar Day | `liturgical_calendar_days` | `liturgical-calendar` | `id`, `coptic_day_id`, `season_id`, `commemoration_ar`, `special_notes`, `is_fast`, `is_feast`, `feast_rank`                     | PLANNED |
| Church History Entry    | `church_history_entries`   | `church-history`      | `id`, `year_ad`, `coptic_year`, `title_ar`, `content_ar`, `category`, `significance`, `deleted_at`                               | PLANNED |
| Coptic Heritage Item    | `coptic_heritage_items`    | `coptic-heritage`     | `id`, `title_ar`, `content_ar`, `category`, `media_urls`, `provenance`, `century`, `deleted_at`                                  | PLANNED |
| Event                   | `events`                   | `events`              | `id`, `title_ar`, `description_ar`, `church_id`, `start_at`, `end_at`, `is_recurring`, `recurrence_rule`, `status`, `created_by` | PLANNED |

---

## Group 5 — Geography

Covers churches, monasteries, and their geographic/organizational structure.

| Entity Name | Table Name    | Domain Module | Key Fields                                                                                                                                                       | Status  |
| ----------- | ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Diocese     | `dioceses`    | `churches`    | `id`, `name_ar`, `name_en`, `bishop_name`, `country`, `region`                                                                                                   | PLANNED |
| Church      | `churches`    | `churches`    | `id`, `name_ar`, `name_en`, `diocese_id`, `address`, `city`, `country`, `latitude`, `longitude`, `phone`, `email`, `website`, `service_times`, `deleted_at`      | PLANNED |
| Monastery   | `monasteries` | `monasteries` | `id`, `name_ar`, `name_en`, `patron_saint_id`, `address`, `city`, `country`, `latitude`, `longitude`, `founding_year`, `phone`, `email`, `website`, `deleted_at` | PLANNED |

### Notes

- `churches.service_times` stored as JSONB to accommodate varied schedules (weekday / weekend / holy days).
- Geographic coordinates enable future map-based search.
- Both `churches` and `monasteries` use soft delete to allow deactivation without data loss.

---

## Group 6 — Personal / User Data

All personal data is scoped to `user_id`. Access to these entities requires the `USER` role minimum; administrators may read for support purposes.

| Entity Name       | Table Name           | Domain Module   | Key Fields                                                                                                       | Status  |
| ----------------- | -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| Bookmark          | `bookmarks`          | `bookmarks`     | `id`, `user_id`, `content_type` (enum: verse/prayer/hymn/etc.), `content_id`, `note`, `deleted_at`               | PLANNED |
| Note              | `notes`              | `notes`         | `id`, `user_id`, `content_type`, `content_id`, `title`, `body`, `is_private`, `deleted_at`                       | PLANNED |
| Reading Plan      | `reading_plans`      | `reading-plans` | `id`, `title_ar`, `description_ar`, `created_by`, `is_public`, `duration_days`, `schedule` (JSONB), `deleted_at` | PLANNED |
| User Reading Plan | `user_reading_plans` | `reading-plans` | `id`, `user_id`, `plan_id`, `started_at`, `target_end_at`, `is_active`                                           | PLANNED |
| Reading Progress  | `reading_progress`   | `reading-plans` | `id`, `user_reading_plan_id`, `day_number`, `completed_at`, `content_refs` (JSONB)                               | PLANNED |

### JSONB Schemas

**`reading_plans.schedule`** (example):

```json
{
  "days": [
    {
      "day": 1,
      "readings": [
        { "type": "verse", "book_id": "uuid", "chapter": 1, "verse_start": 1, "verse_end": 10 },
        { "type": "prayer", "agpeya_hour_id": "uuid" }
      ]
    }
  ]
}
```

**`reading_progress.content_refs`** (example):

```json
{
  "completed_items": ["verse:uuid", "prayer:uuid"]
}
```

---

## Group 7 — Search (Future)

A denormalized search index for cross-domain full-text search. This group will be implemented in a later phase, potentially as an external search service (Typesense / Elasticsearch) with this table serving as a synchronization anchor.

| Entity Name  | Table Name     | Domain Module | Key Fields                                                                                                          | Status  |
| ------------ | -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| Search Index | `search_index` | `search`      | `id`, `source_type`, `source_id`, `content_ar`, `content_en`, `content_cop`, `fts_vector`, `metadata`, `indexed_at` | PLANNED |

---

## Entity Count Summary

| Group              | Planned Entities | Tables (est.) |
| ------------------ | :--------------: | :-----------: |
| Identity           |        6         |       6       |
| Bible              |        5         |       5       |
| Liturgical Content |        14        |      14       |
| Calendar           |        7         |       7       |
| Geography          |        3         |       3       |
| Personal           |        5         |       5       |
| Search             |        1         |       1       |
| **Total**          |      **41**      |    **41**     |

---

_All entities are PLANNED. This catalog will be updated as `schema.prisma` is authored and entities move through design and implementation phases._
