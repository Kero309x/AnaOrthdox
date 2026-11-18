# ENDPOINT_CATALOG.md

**Purpose:** Comprehensive inventory of all REST endpoints across the Ana Orthodox platform.  
**Scope:** NestJS `/api/v1` routes  
**Status:** APPROVED (Baseline Architecture)  
**Last Updated:** 2026-11-17  
**Owner:** Backend Agent  
**Related Documents:** API_CONTRACTS.md, AUTHORIZATION_MATRIX.md, ERROR_STANDARDS.md

---

## 1. Authentication & Identity Endpoints (`/api/v1/auth`)

| Endpoint                    | Method   | Description                                           | Request DTO        | Response DTO           | Auth / Credentials                       | Rate Limit |
| --------------------------- | -------- | ----------------------------------------------------- | ------------------ | ---------------------- | ---------------------------------------- | ---------- |
| `/auth/register`            | `POST`   | Register new account, hash Argon2id, create session   | `RegisterDto`      | `AuthSuccessDto`       | Public (Sets `ana_refresh_token` cookie) | 5 req/min  |
| `/auth/login`               | `POST`   | Authenticate credentials with anti-enumeration check  | `LoginDto`         | `AuthSuccessDto`       | Public (Sets `ana_refresh_token` cookie) | 10 req/min |
| `/auth/refresh`             | `POST`   | Rotate opaque token, detect reuse, issue 15m JWT      | None (Cookie)      | `AuthSuccessDto`       | `HttpOnly` Cookie (`ana_refresh_token`)  | 20 req/min |
| `/auth/logout`              | `POST`   | Invalidate current session and clear cookie           | None (Cookie)      | `{ success: boolean }` | Public / Cookie                          | 30 req/min |
| `/auth/logout-all`          | `POST`   | Invalidate all active sessions for authenticated user | None               | `{ success: boolean }` | Bearer JWT (`USER`+)                     | 10 req/min |
| `/auth/me`                  | `GET`    | Retrieve current authenticated user profile           | None               | `UserProfileDto`       | Bearer JWT (`USER`+)                     | 60 req/min |
| `/auth/profile`             | `PATCH`  | Update preferences (theme, font size, tashkeel, etc.) | `UpdateProfileDto` | `UserProfileDto`       | Bearer JWT (`USER`+)                     | 30 req/min |
| `/auth/sessions`            | `GET`    | List active sessions with device & IP metadata        | None               | `UserSessionDto[]`     | Bearer JWT (`USER`+)                     | 30 req/min |
| `/auth/sessions/:sessionId` | `DELETE` | Revoke a specific active session                      | None               | `{ success: boolean }` | Bearer JWT (`USER`+)                     | 30 req/min |

---

## 2. Holy Bible Endpoints (`/api/v1/bible`)

| Endpoint                                         | Method | Description                                  | Request DTO           | Response DTO                | Auth   | Cache Policy          |
| ------------------------------------------------ | ------ | -------------------------------------------- | --------------------- | --------------------------- | ------ | --------------------- |
| `/bible/testaments`                              | `GET`  | List Old & New Testaments with books         | None                  | `TestamentListDto`          | Public | Cache-Control: 1 day  |
| `/bible/books/:bookCode`                         | `GET`  | Get book details & chapter list              | None                  | `BibleBookDto`              | Public | Cache-Control: 1 day  |
| `/bible/books/:bookCode/chapters/:chapterNumber` | `GET`  | Get chapter with all verses in Arabic        | `GetChapterQueryDto`  | `BibleChapterWithVersesDto` | Public | Cache-Control: 7 days |
| `/bible/search`                                  | `GET`  | Search verses by text, keyword, or reference | `BibleSearchQueryDto` | `BibleSearchResultDto`      | Public | 30 req/min            |

---

## 3. Coptic Civil Calendar (`/api/v1/calendar/coptic`)

| Endpoint                          | Method | Description                                              | Request DTO        | Response DTO                    | Auth   | Cache Policy         |
| --------------------------------- | ------ | -------------------------------------------------------- | ------------------ | ------------------------------- | ------ | -------------------- |
| `/calendar/coptic/from-gregorian` | `GET`  | Convert Gregorian date (YYYY-MM-DD) to Coptic Civil date | `FromGregorianDto` | `CalendarConversionResponseDto` | Public | Cache-Control: 1 day |
| `/calendar/coptic/to-gregorian`   | `GET`  | Convert Coptic date (year, month, day) to Gregorian date | `ToGregorianDto`   | `CalendarConversionResponseDto` | Public | Cache-Control: 1 day |

---

## 4. Katameros & Liturgical Calendar (`/api/v1/liturgy`)

| Endpoint                    | Method | Description                                  | Request DTO | Response DTO           | Auth   | Cache Policy          |
| --------------------------- | ------ | -------------------------------------------- | ----------- | ---------------------- | ------ | --------------------- |
| `/liturgy/calendar/today`   | `GET`  | Today's Coptic & Gregorian calendar details  | None        | `CalendarDayDto`       | Public | Cache-Control: 1 hour |
| `/liturgy/calendar/:date`   | `GET`  | Specific Gregorian date calendar details     | None        | `CalendarDayDto`       | Public | Cache-Control: 1 day  |
| `/liturgy/katameros/today`  | `GET`  | Full liturgical readings for today's liturgy | None        | `KatamerosReadingsDto` | Public | Cache-Control: 1 hour |
| `/liturgy/katameros/:date`  | `GET`  | Liturgical readings for specific date        | None        | `KatamerosReadingsDto` | Public | Cache-Control: 1 day  |
| `/liturgy/synaxarium/today` | `GET`  | Commemorations & saints of the day           | None        | `SynaxariumDayDto`     | Public | Cache-Control: 1 hour |
| `/liturgy/synaxarium/:date` | `GET`  | Commemorations for specific date             | None        | `SynaxariumDayDto`     | Public | Cache-Control: 1 day  |

---

## 4. Agpeya (Book of Hours) (`/api/v1/agpeya`)

| Endpoint                    | Method | Description                                            | Request DTO | Response DTO            | Auth   | Cache Policy           |
| --------------------------- | ------ | ------------------------------------------------------ | ----------- | ----------------------- | ------ | ---------------------- |
| `/agpeya/prayers`           | `GET`  | List all 7 canonical prayer hours                      | None        | `AgpeyaPrayerListDto`   | Public | Cache-Control: 30 days |
| `/agpeya/prayers/:prayerId` | `GET`  | Complete text of an hour with psalms, gospel, passages | None        | `AgpeyaPrayerDetailDto` | Public | Cache-Control: 30 days |

---

## 5. Hymns & Liturgical Melodies (`/api/v1/hymns`)

| Endpoint     | Method | Description                                                                | Request DTO     | Response DTO    | Auth   | Cache Policy          |
| ------------ | ------ | -------------------------------------------------------------------------- | --------------- | --------------- | ------ | --------------------- |
| `/hymns`     | `GET`  | List hymn collections filtered by liturgical season                        | `HymnFilterDto` | `HymnListDto`   | Public | Cache-Control: 1 day  |
| `/hymns/:id` | `GET`  | Detailed hymn with lyrics (Arabic, Coptic, transliteration) and audio link | None            | `HymnDetailDto` | Public | Cache-Control: 7 days |

---

## 6. Personal User Data Endpoints (`/api/v1/user`)

| Endpoint              | Method   | Description                       | Request DTO         | Response DTO         | Auth       | Ownership        |
| --------------------- | -------- | --------------------------------- | ------------------- | -------------------- | ---------- | ---------------- |
| `/user/bookmarks`     | `GET`    | List current user bookmarks       | `PaginationDto`     | `BookmarkListDto`    | Bearer JWT | Own records only |
| `/user/bookmarks`     | `POST`   | Add a bookmark to a verse or text | `CreateBookmarkDto` | `BookmarkDto`        | Bearer JWT | User scoped      |
| `/user/bookmarks/:id` | `DELETE` | Remove a bookmark                 | None                | `SuccessResponseDto` | Bearer JWT | Verified owner   |
| `/user/notes`         | `GET`    | List personal notes               | `PaginationDto`     | `NoteListDto`        | Bearer JWT | Own records only |
| `/user/notes`         | `POST`   | Create a personal note            | `CreateNoteDto`     | `NoteDto`            | Bearer JWT | User scoped      |
| `/user/notes/:id`     | `PUT`    | Update a personal note            | `UpdateNoteDto`     | `NoteDto`            | Bearer JWT | Verified owner   |
| `/user/notes/:id`     | `DELETE` | Delete a personal note            | None                | `SuccessResponseDto` | Bearer JWT | Verified owner   |

---

## 7. Churches & Monasteries Directory (`/api/v1/places`)

| Endpoint                  | Method | Description                                         | Request DTO          | Response DTO         | Auth   | Cache Policy          |
| ------------------------- | ------ | --------------------------------------------------- | -------------------- | -------------------- | ------ | --------------------- |
| `/places/churches`        | `GET`  | Search churches by diocese, city, country           | `ChurchFilterDto`    | `ChurchListDto`      | Public | Cache-Control: 1 day  |
| `/places/churches/:id`    | `GET`  | Detailed church profile, priest contacts, schedules | None                 | `ChurchDetailDto`    | Public | Cache-Control: 1 day  |
| `/places/monasteries`     | `GET`  | List historical Coptic monasteries                  | `MonasteryFilterDto` | `MonasteryListDto`   | Public | Cache-Control: 7 days |
| `/places/monasteries/:id` | `GET`  | Monastery history, visitation rules, map            | None                 | `MonasteryDetailDto` | Public | Cache-Control: 7 days |

---

## 8. Editorial & Administration Endpoints (`/api/v1/admin`)

| Endpoint                 | Method | Description                                | Request DTO         | Response DTO       | Auth       | Role Required     |
| ------------------------ | ------ | ------------------------------------------ | ------------------- | ------------------ | ---------- | ----------------- |
| `/admin/content/publish` | `POST` | Publish or revalidate curated content      | `PublishContentDto` | `PublishResultDto` | Bearer JWT | `EDITOR`, `ADMIN` |
| `/admin/users`           | `GET`  | List and search registered users           | `AdminUserQueryDto` | `AdminUserListDto` | Bearer JWT | `ADMINISTRATOR`   |
| `/admin/users/:id/role`  | `PUT`  | Assign or revoke roles                     | `AssignRoleDto`     | `UserProfileDto`   | Bearer JWT | `ADMINISTRATOR`   |
| `/admin/audit-logs`      | `GET`  | Query security and operational audit trail | `AuditQueryDto`     | `AuditLogListDto`  | Bearer JWT | `ADMINISTRATOR`   |

---

## 9. System & Health Probes (`/api/v1/health`)

| Endpoint        | Method | Description                                                  | Request DTO | Response DTO           | Auth   | Expected Status / Cache Policy |
| --------------- | ------ | ------------------------------------------------------------ | ----------- | ---------------------- | ------ | ------------------------------ |
| `/health`       | `GET`  | Platform health overview and subsystem connectivity status   | None        | `HealthStatusResponse` | Public | HTTP 200 (No Cache)            |
| `/health/live`  | `GET`  | Kubernetes / Container process liveness probe                | None        | `LivenessResponse`     | Public | HTTP 200 (No Cache)            |
| `/health/ready` | `GET`  | Dependency readiness probe (PostgreSQL + Redis dependencies) | None        | `ReadinessResponse`    | Public | HTTP 200 (Ready) / 503 (Down)  |
