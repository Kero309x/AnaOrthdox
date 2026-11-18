# API Contracts — Ana Orthodox

> **Purpose:** Define the canonical API contract standards that all NestJS endpoints must conform to, ensuring a consistent, predictable interface for web and mobile consumers.
> **Scope:** All `/api/v1` endpoints across all 20 product domains.
> **Status:** ACTIVE — Authoritative for Phase 0 onwards.
> **Last Updated:** 2026-11-17
> **Owner:** Backend Team
> **Related Documents:**
>
> - `docs/api/AUTHORIZATION_MATRIX.md`
> - `docs/api/ERROR_STANDARDS.md`
> - `docs/architecture/SYSTEM_ARCHITECTURE.md`
> - OpenAPI spec: `/api/docs` (auto-generated via `@nestjs/swagger`)

---

## 1. Base URL & Versioning

### 1.1 Base URL

| Environment | Base URL                                      |
| ----------- | --------------------------------------------- |
| Development | `http://localhost:3001/api/v1`                |
| Staging     | `https://api-staging.ana-orthodox.app/api/v1` |
| Production  | `https://api.ana-orthodox.app/api/v1`         |

All endpoints are prefixed with `/api/v1`. The NestJS global prefix is set in `main.ts`:

```typescript
app.setGlobalPrefix("api/v1");
```

### 1.2 Versioning Strategy

Ana Orthodox uses **URL-based versioning** (`/api/v1`, `/api/v2`, etc.):

- The major version (`v1`) is incremented only for **breaking changes** that cannot be served alongside the existing version.
- Non-breaking additions (new endpoints, new optional response fields) are deployed within the current version without a version bump.
- **Deprecation policy:** A version remains supported for a minimum of 12 months after a successor version is released. Deprecated version responses include the header `Deprecation: <date>`.

| Version | Status  | Supported Until |
| ------- | ------- | --------------- |
| v1      | CURRENT | Active          |
| v2      | PLANNED | —               |

---

## 2. Authentication

### 2.1 Mechanism

Ana Orthodox uses **JWT Bearer token** authentication.

```
Authorization: Bearer <access_token>
```

- Access tokens are short-lived (default: 15 minutes).
- Refresh tokens are long-lived (default: 30 days) and stored server-side (hashed in `refresh_tokens` table).
- Token refresh uses a **rotation strategy**: each refresh returns a new access token and a new refresh token; the old refresh token is invalidated.
- Token reuse detection: if a previously used refresh token is presented, the entire token family is revoked.

### 2.2 Token Endpoints

| Method | Path                      | Purpose                              |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/v1/auth/register`   | Create new user account              |
| POST   | `/api/v1/auth/login`      | Obtain access + refresh token pair   |
| POST   | `/api/v1/auth/refresh`    | Rotate refresh token; get new pair   |
| POST   | `/api/v1/auth/logout`     | Revoke current refresh token         |
| POST   | `/api/v1/auth/logout-all` | Revoke all sessions for current user |

### 2.3 Access Control

- **Anonymous** endpoints: No `Authorization` header required.
- **Authenticated** endpoints: Valid `Authorization: Bearer <token>` required; returns `401` if absent or invalid.
- **Role-restricted** endpoints: Authenticated + correct role; returns `403` if role is insufficient.
- See `docs/api/AUTHORIZATION_MATRIX.md` for per-domain permissions.

---

## 3. Standard Request Headers

| Header            |    Required    | Default            | Values             | Purpose                                        |
| ----------------- | :------------: | ------------------ | ------------------ | ---------------------------------------------- |
| `Content-Type`    | ✅ (write ops) | —                  | `application/json` | Body format declaration                        |
| `Accept`          |       —        | `application/json` | `application/json` | Response format                                |
| `Authorization`   |  Conditional   | —                  | `Bearer <jwt>`     | Authentication                                 |
| `Accept-Language` |       —        | `ar`               | `ar`, `en`, `cop`  | Preferred content language                     |
| `X-Request-ID`    |       —        | —                  | UUID string        | Client-generated trace ID (echoed in response) |

### 3.1 Accept-Language Behaviour

The `Accept-Language` header controls which language variant of translatable content fields is returned:

- `ar` (Arabic) — **default**. Always available; primary content language.
- `en` (English) — Returned if an English translation exists; otherwise falls back to `ar`.
- `cop` (Coptic) — Returned if a Coptic translation exists; otherwise falls back to `ar`.

The active language is echoed in the response `meta.language` field.

---

## 4. Standard Response Envelope

All responses from `/api/v1` are wrapped in a consistent envelope:

### 4.1 Success Response

```json
{
  "data": { ... },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "language": "ar",
    "timestamp": "2026-11-17T10:00:00.000Z",
    "version": "v1"
  },
  "error": null
}
```

### 4.2 Success List Response (Paginated)

```json
{
  "data": [ ... ],
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "language": "ar",
    "timestamp": "2026-11-17T10:00:00.000Z",
    "version": "v1",
    "pagination": {
      "type": "cursor",
      "cursor": "eyJpZCI6InV1aWQifQ==",
      "next_cursor": "eyJpZCI6InV1aWQyIn0=",
      "has_next": true,
      "limit": 20
    }
  },
  "error": null
}
```

### 4.3 Error Response

```json
{
  "data": null,
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "language": "ar",
    "timestamp": "2026-11-17T10:00:00.000Z",
    "version": "v1"
  },
  "error": {
    "code": "ANA-1001",
    "message": "المورد المطلوب غير موجود",
    "details": null
  }
}
```

### 4.4 TypeScript Interface

```typescript
interface ApiResponse<T> {
  data: T | T[] | null;
  meta: ResponseMeta;
  error: ApiError | null;
}

interface ResponseMeta {
  request_id: string;
  language: "ar" | "en" | "cop";
  timestamp: string; // ISO 8601 UTC
  version: string; // 'v1'
  pagination?: PaginationMeta;
}

interface PaginationMeta {
  type: "cursor" | "page";
  // Cursor-based
  cursor?: string;
  next_cursor?: string | null;
  has_next?: boolean;
  limit?: number;
  // Page-based
  page?: number;
  per_page?: number;
  total_pages?: number;
  total_count?: number;
}

interface ApiError {
  code: string; // e.g. 'ANA-1001'
  message: string; // Human-readable, in Accept-Language
  details: Record<string, unknown> | null;
}
```

---

## 5. Pagination

Ana Orthodox uses **two pagination strategies** depending on context.

### 5.1 Cursor-Based Pagination (Content Lists)

Used for all content endpoints where data may be large and ordering is stable (Bible verses, Hymns, Synaxarium, etc.).

**Why cursor?**

- Consistent results even when records are inserted or deleted between pages.
- Efficient for PostgreSQL (seeks by indexed cursor column rather than OFFSET).
- Mandatory for infinite-scroll UIs.

**Request parameters:**

| Parameter | Type   | Default | Description                               |
| --------- | ------ | ------- | ----------------------------------------- |
| `cursor`  | string | —       | Opaque cursor from previous `next_cursor` |
| `limit`   | int    | `20`    | Records per page. Max: `100`              |
| `order`   | string | `asc`   | `asc` or `desc`                           |

**Example:**

```
GET /api/v1/bible/verses?book_id=<uuid>&chapter=1&limit=30
GET /api/v1/bible/verses?cursor=eyJpZCI6InV1aWQifQ%3D%3D&limit=30
```

**Cursor encoding:** Base64-encoded JSON `{ "id": "<uuid>" }`. Never expose raw UUID in cursor — allows future multi-field cursors without breaking the client interface.

### 5.2 Page-Based Pagination (Admin / Dashboard)

Used for admin-panel endpoints where total count is needed and datasets are bounded.

**Request parameters:**

| Parameter  | Type | Default | Description           |
| ---------- | ---- | ------- | --------------------- |
| `page`     | int  | `1`     | 1-indexed page number |
| `per_page` | int  | `20`    | Max: `100`            |

**Example:**

```
GET /api/v1/admin/users?page=2&per_page=25
```

---

## 6. HTTP Methods & Status Codes

### 6.1 Method Conventions

| Method   | Semantics                      | Body? |   Idempotent?    |
| -------- | ------------------------------ | ----- | :--------------: |
| `GET`    | Retrieve resource(s)           | No    |        ✅        |
| `POST`   | Create new resource            | Yes   |        ❌        |
| `PUT`    | Full replacement of resource   | Yes   |        ✅        |
| `PATCH`  | Partial update of resource     | Yes   | ❌ (effectively) |
| `DELETE` | Remove resource (soft or hard) | No    |        ✅        |

Ana Orthodox **prefers `PATCH` over `PUT`** for updates, as most update operations are partial.

### 6.2 Standard Status Codes

| HTTP Code                   | Meaning                  | Used When                                  |
| --------------------------- | ------------------------ | ------------------------------------------ |
| `200 OK`                    | Success                  | GET, PATCH, DELETE (soft)                  |
| `201 Created`               | Resource created         | POST that creates a resource               |
| `204 No Content`            | Success, no body         | DELETE (hard), logout                      |
| `400 Bad Request`           | Malformed request        | Invalid JSON, wrong param types            |
| `401 Unauthorized`          | No valid auth            | Missing or expired token                   |
| `403 Forbidden`             | Authenticated but denied | Insufficient role/permission               |
| `404 Not Found`             | Resource missing         | UUID not found, route not found            |
| `409 Conflict`              | State conflict           | Duplicate unique field (e.g., email)       |
| `422 Unprocessable Entity`  | Validation failed        | Valid JSON but business rule violation     |
| `429 Too Many Requests`     | Rate limit hit           | Exceeds rate limit policy                  |
| `500 Internal Server Error` | Unexpected failure       | Server-side error; never exposes internals |

---

## 7. Rate Limiting

| Tier          | Limit               | Window   | Burst | Key        |
| ------------- | ------------------- | -------- | ----- | ---------- |
| Anonymous     | 100 requests        | 1 minute | 20    | IP address |
| Authenticated | 500 requests        | 1 minute | 50    | User UUID  |
| Editor        | 1000 requests       | 1 minute | 100   | User UUID  |
| Administrator | Unlimited (default) | —        | —     | User UUID  |

Rate limit headers are included on every response:

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 492
X-RateLimit-Reset: 1731844800
Retry-After: 47          ← Only present when rate-limited (429)
```

Rate limit configuration is managed via environment variables and can be adjusted per-deployment without code changes.

---

## 8. OpenAPI / Swagger

Ana Orthodox uses `@nestjs/swagger` to auto-generate the OpenAPI specification from NestJS decorators.

| Item             | Detail                                        |
| ---------------- | --------------------------------------------- |
| Served at        | `/api/docs`                                   |
| Format           | OpenAPI 3.1                                   |
| JSON spec        | `/api/docs-json`                              |
| YAML spec        | `/api/docs-yaml`                              |
| Auth in Swagger  | Bearer token via `Authorize` button           |
| Enabled in Prod? | **NO** — Swagger UI is disabled in production |

All DTOs **must** be decorated with `@nestjs/swagger` decorators for complete spec generation:

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookmarkDto {
  @ApiProperty({ description: "Type of content being bookmarked", enum: ContentType })
  content_type: ContentType;

  @ApiProperty({ description: "UUID of the content item", format: "uuid" })
  content_id: string;

  @ApiProperty({ description: "Optional personal note", required: false })
  note?: string;
}
```

---

## 9. Content Negotiation

Ana Orthodox currently supports **JSON only**:

```
Content-Type: application/json
Accept: application/json
```

Future considerations:

- `application/vnd.api+json` (JSON:API) — evaluated in v2 if strict spec compliance is required.
- Streaming responses (`text/event-stream`) — for real-time features (future phase).

---

## 10. Filtering, Sorting & Searching

### 10.1 Filtering

Filter parameters are passed as query string parameters with the pattern `filter[field]=value`:

```
GET /api/v1/churches?filter[country]=EG&filter[diocese_id]=<uuid>
GET /api/v1/events?filter[is_recurring]=true&filter[start_after]=2026-01-01
```

### 10.2 Sorting

```
GET /api/v1/synaxarium?sort=coptic_month,coptic_day&order=asc
```

Multiple sort fields are comma-separated. Sortable fields are explicitly allowlisted per endpoint.

### 10.3 Full-Text Search

```
GET /api/v1/search?q=<query>&lang=ar&domain=bible,synaxarium&limit=20
```

The search endpoint is a first-class domain with its own module. See the search section of `AUTHORIZATION_MATRIX.md`.

---

## 11. RTL / Arabic-Specific Conventions

As an Arabic-first platform, the API follows these conventions:

- **Default language is Arabic** — `Accept-Language: ar` is assumed if the header is absent.
- **Text fields are Arabic** — All `*_ar` fields are primary; `*_en` / `*_cop` are supplementary.
- **Date formatting** — All dates are returned as ISO 8601 UTC strings; calendar conversion (Gregorian ↔ Coptic) is a client or presentation-layer concern.
- **Text direction metadata** — The API does not return `dir` attributes; layout direction is determined by the client based on language.
- **Locale-aware sorting** — Arabic text sorting is handled with PostgreSQL Arabic collation (`ar_EG.UTF-8` or ICU collation).

---

## 12. API Module Route Prefixes

| Domain              | Route Prefix                  | Module ID |
| ------------------- | ----------------------------- | --------- |
| Authentication      | `/api/v1/auth`                | AUTH-000  |
| Bible               | `/api/v1/bible`               | BIBLE-001 |
| Bible Study         | `/api/v1/bible/study`         | BSTU-002  |
| Commentary          | `/api/v1/commentary`          | COMM-003  |
| Katameros           | `/api/v1/katameros`           | KATA-004  |
| Liturgical Calendar | `/api/v1/calendar/liturgical` | LCAL-005  |
| Coptic Calendar     | `/api/v1/calendar/coptic`     | CCAL-006  |
| Hymns               | `/api/v1/hymns`               | HYMN-007  |
| Agpeya / Prayers    | `/api/v1/agpeya`              | AGPE-008  |
| Synaxarium          | `/api/v1/synaxarium`          | SYNA-009  |
| Church Fathers      | `/api/v1/fathers`             | FATH-010  |
| Patristic Library   | `/api/v1/patristic`           | PATR-011  |
| Church History      | `/api/v1/history`             | HIST-012  |
| Coptic Heritage     | `/api/v1/heritage`            | HERI-013  |
| Churches Directory  | `/api/v1/churches`            | CHRC-014  |
| Monasteries         | `/api/v1/monasteries`         | MONA-015  |
| Reading Plans       | `/api/v1/reading-plans`       | RPLN-016  |
| Bookmarks & Notes   | `/api/v1/personal`            | PERS-017  |
| Search              | `/api/v1/search`              | SRCH-018  |
| Events              | `/api/v1/events`              | EVNT-019  |
| Administration      | `/api/v1/admin`               | ADMN-020  |
| Health & System     | `/api/v1/health`              | SYST-021  |

---

## 13. System Health & Orchestration Probes (`/api/v1/health`)

Standard container and cluster health contracts:

### 13.1 Liveness Probe (`GET /api/v1/health/live`)

- **Purpose:** Verifies that the Node.js API process is responsive and executing event loops.
- **HTTP Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "success": true,
    "data": {
      "status": "alive",
      "uptime": 12.34,
      "timestamp": "2026-11-17T15:00:00.000Z",
      "pid": 1234
    },
    "meta": { "timestamp": "2026-11-17T15:00:00.000Z", "version": "v1" }
  }
  ```

### 13.2 Readiness Probe (`GET /api/v1/health/ready`)

- **Purpose:** Verifies whether the service can accept incoming user traffic by checking PostgreSQL and Redis dependencies.
- **HTTP Status:**
  - `200 OK`: When all required dependencies are operational (`status: "ready"`, `ready: true`).
  - `503 Service Unavailable`: When one or more dependencies are offline or degraded (`status: "degraded" | "unready"`, `ready: false`).
- **Response Shape:**
  ```json
  {
    "success": true,
    "data": {
      "status": "ready",
      "ready": true,
      "timestamp": "2026-11-17T15:00:00.000Z",
      "checks": {
        "database": { "status": "up", "message": "PostgreSQL connection active", "latencyMs": 2 },
        "redis": { "status": "up", "message": "Redis instance connected", "latencyMs": 1 }
      }
    },
    "meta": { "timestamp": "2026-11-17T15:00:00.000Z", "version": "v1" }
  }
  ```

---

_This document governs all API contracts. Any deviation from these standards requires a documented exception and team approval._
