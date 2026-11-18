# Security Architecture

**Project:** Ana Orthodox / أنا أرثوذكس  
**Document ID:** SEC-ARCH-001  
**Status:** ACTIVE  
**Last Updated:** 2026-11-17  
**Owner:** Security Agent  
**Related Documents:** THREAT_MODEL.md, PERMISSION_MATRIX.md, SECURITY_AUDIT_LOG.md

---

## 1. Purpose

This document defines the security architecture for the Ana Orthodox platform. It covers authentication, authorization, transport security, input validation, secrets management, logging, and protection against common web vulnerabilities. All engineers and agents must adhere to these decisions during development.

---

## 2. Authentication Strategy

### 2.1 JWT Access Tokens & Real-Time Revocation

| Property         | Value                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| Algorithm        | HS256 (development) / RS256 (production)                                    |
| Expiry           | 15 minutes (`900` seconds)                                                  |
| Storage (client) | In-memory only (React Context / memory, never `localStorage`)               |
| Payload          | `{ sub: userId, email: string, role: string, sessionId: string, iat, exp }` |
| Issued by        | NestJS Auth module (`AuthService.generateAccessToken`)                      |
| Revocation       | **Real-time**: `JwtAuthGuard` verifies session active state                 |

**Real-Time Revocation Architecture:** In standard stateless JWT designs, a token remains valid until its expiration even after the user logs out. Ana Orthodox enforces **real-time access token revocation**: `JwtAuthGuard` queries `AuthService.isSessionActive(payload.sessionId)`. If a user logs out, invokes `logout-all`, or revokes a specific device session (`DELETE /auth/sessions/:id`), the session is flagged as `isRevoked: true` in the session store. Any subsequent API request presenting the previously issued access token is immediately rejected with HTTP `401 Unauthorized` without waiting for the 15-minute token TTL to elapse.

### 2.2 Opaque Refresh Tokens

| Property         | Value                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Format           | 32-byte cryptographically secure random opaque token (base64url, 256 bits)                                       |
| Expiry           | 30 days                                                                                                          |
| Storage (client) | `HttpOnly`, `Secure` (production/HTTPS), `SameSite=Strict`, `Path=/api/v1/auth` cookie named `ana_refresh_token` |
| Storage (server) | SHA-256 hash stored in `refresh_tokens` table in PostgreSQL                                                      |
| Rotation         | Atomic single-use rotation: each refresh invalidates old token and issues next successor                         |
| Family tracking  | Refresh token family ID (`family_id` UUID) tracked to detect replay attacks                                      |

### 2.3 Token Refresh Flow & Atomic Concurrency

```
Client (Web PWA)               API (NestJS Auth)               Database (PostgreSQL)
  |                                   |                                   |
  |--POST /api/v1/auth/refresh------->|                                   |
  |   Cookie: ana_refresh_token=...   |                                   |
  |   Header: Origin / Referer        |--Validate Origin (Reject null)--> |
  |                                   |--SHA256(token) & lookup record--->|
  |                                   |<--token, session, user record-----|
  |                                   |--Check isRotated, isRevoked, exp--|
  |                                   |--ATOMIC TRANSACTION:------------->|
  |                                   |   1. UPDATE refresh_tokens        |
  |                                   |      SET is_rotated = true        |
  |                                   |      WHERE id=x AND is_rotated=F  |
  |                                   |   2. INSERT new refresh_token     |
  |                                   |   3. UPDATE session activity      |
  |                                   |<--Transaction committed-----------|
  |<-200 OK---------------------------|                                   |
  |  Set-Cookie: ana_refresh_token=.. |                                   |
  |  Body: { accessToken, user, ... } |                                   |
```

### 2.4 Logout & Session Revocation

- **Current Session Logout (`POST /auth/logout`):** Revokes the refresh token and sets `isRevoked: true` on the associated `UserSession`. Clears `ana_refresh_token` cookie. Subsequent requests with that session's access token fail with 401.
- **Global Logout (`POST /auth/logout-all`):** Atomically revokes all active refresh tokens and all active sessions for the user.
- **Specific Session Revocation (`DELETE /auth/sessions/:id`):** Revokes the target session and its associated refresh tokens.

### 2.5 Password Hashing & NIST SP 800-63B Compliance

- **Algorithm:** **Argon2id** (OWASP recommended algorithm for password hashing).
- **Parameters:** Memory Cost: `19,456 KiB` (~19 MB), Time Cost: `2` iterations, Parallelism: `1` thread.
- **Benchmark:** ~32ms single hash execution; ~106ms under 10 concurrent requests.
- **NIST SP 800-63B-4 Alignment:**
  - Minimum 15 Unicode code points (evaluated using `Array.from(normalized).length` to prevent surrogate pair undercounting).
  - Maximum 128 characters without silent truncation.
  - Multi-word passphrases with spaces allowed; arbitrary character composition rules prohibited.
  - Unicode NFC normalization applied prior to hashing.
  - Blocklist checking against compromised/dictionary passwords and domain phrases.
  - Anti-enumeration: Constant-time dummy Argon2 verification for non-existent users.

---

## 3. Session Management

### 3.1 Refresh Token Database Schema

```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(256) NOT NULL UNIQUE,
  family_id   UUID NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at  TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_family_id ON refresh_tokens(family_id);
```

### 3.2 Token Reuse Detection

If a refresh token is presented that has already been used (exists in DB but is revoked), the entire **token family** must be revoked. This indicates a stolen token was used. The user must re-authenticate.

```typescript
// Pseudo-code — NestJS AuthService
if (token.revoked_at !== null) {
  // Potential token theft — revoke all tokens in this family
  await this.refreshTokensRepo.revokeByFamilyId(token.family_id);
  throw new UnauthorizedException("Session invalidated — please log in again");
}
```

### 3.3 Session Limits

- Maximum concurrent refresh tokens per user: **5** (Phase 0 default, configurable).
- Oldest token evicted when limit is reached.

---

## 4. Authorization — Role-Based Access Control (RBAC)

### 4.1 Role Hierarchy

```
ADMINISTRATOR
    └── EDITOR
          └── USER
                └── ANONYMOUS
```

Each role **inherits** the permissions of roles below it plus its own additions. The full permission matrix is defined in `PERMISSION_MATRIX.md`.

### 4.2 NestJS Guard Implementation

```typescript
// Decorator usage on controllers/routes
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EDITOR, Role.ADMINISTRATOR)
@Get('/content/:id')
async getContent(@Param('id') id: string) { ... }
```

**Guards executed in order:**

1. `JwtAuthGuard` — validates the access token (signature, expiry, structure).
2. `RolesGuard` — checks the user's roles against the `@Roles()` decorator.

### 4.3 Resource Ownership (Notes, Bookmarks)

For user-owned resources, an additional ownership check is applied in the service layer:

```typescript
// NestJS Service — not just role check, also owner check
if (note.userId !== currentUser.id && !currentUser.roles.includes(Role.ADMINISTRATOR)) {
  throw new ForbiddenException();
}
```

### 4.4 Public Endpoints

Endpoints accessible without a token must be explicitly decorated with `@Public()`. All other endpoints are protected by default.

---

## 5. Transport Security

### 5.1 HTTPS

- **Production:** HTTPS only. HTTP requests are redirected to HTTPS at the reverse proxy (Nginx/Caddy).
- **Development:** HTTP allowed on localhost.
- TLS: Minimum TLS 1.2, TLS 1.3 preferred.

### 5.2 HSTS

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Applied via reverse proxy or Next.js `headers()` configuration.

---

## 6. Security Headers

All responses from the Next.js frontend must include the following headers, configured in `next.config.ts`:

| Header                      | Value                                      | Purpose                  |
| --------------------------- | ------------------------------------------ | ------------------------ |
| `Content-Security-Policy`   | See §6.1                                   | XSS mitigation           |
| `X-Frame-Options`           | `DENY`                                     | Clickjacking prevention  |
| `X-Content-Type-Options`    | `nosniff`                                  | MIME sniffing prevention |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          | Privacy                  |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()` | Feature restriction      |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`      | HTTPS enforcement        |

### 6.1 Content Security Policy (CSP)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{nonce}';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:;
  media-src 'self' blob:;
  connect-src 'self' https://api.anaorthodox.app;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

> **Note:** The nonce approach is used for inline scripts to avoid `'unsafe-inline'`. Next.js supports nonce injection via middleware.

---

## 7. Input Validation

### 7.1 Strategy

All incoming API data is validated using **class-validator** and transformed using **class-transformer** via NestJS `ValidationPipe` applied globally.

```typescript
// main.ts — NestJS bootstrap
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw on unknown properties
    transform: true, // Auto-transform to DTO types
    disableErrorMessages: false,
  })
);
```

### 7.2 DTO Example

```typescript
export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsUUID()
  verseId: string;
}
```

### 7.3 Whitelist Enforcement

`whitelist: true` ensures that any properties not declared in the DTO are stripped before reaching the service layer, preventing mass assignment attacks.

---

## 8. SQL Injection Prevention

**Primary defense: Prisma ORM**

Prisma uses parameterized queries for all database operations. Raw SQL is **forbidden** unless explicitly required, and if used, must use `prisma.$queryRaw(Prisma.sql\`...\`)` with tagged template literals (not string interpolation).

```typescript
// FORBIDDEN — Never do this
const result = await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = '${id}'`);

// REQUIRED — Always use parameterized form
const result = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE id = ${id}`);
```

---

## 9. XSS Prevention

| Layer            | Mechanism                                                                      |
| ---------------- | ------------------------------------------------------------------------------ |
| React (Next.js)  | JSX auto-escapes all values by default; `dangerouslySetInnerHTML` is forbidden |
| CSP              | Restricts script sources; nonce-based inline scripts                           |
| Input validation | All server-side input is validated and sanitized                               |
| Output encoding  | API responses are JSON — browsers parse, not interpret, JSON                   |

**Rule:** `dangerouslySetInnerHTML` is **banned** in this project. No exceptions. Coptic/Arabic text content is rendered via standard React string rendering.

---

## 10. File Uploads

File upload is not planned for Phase 0 or Phase 1. When implemented (Phase 2+), the following security controls are **mandatory**:

| Control                | Requirement                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| MIME type validation   | Server-side validation using `file-type` library (not client Content-Type header)  |
| File size limit        | Maximum 10 MB per file (audio), 5 MB (images)                                      |
| File name sanitization | Reject path traversal characters; generate a UUID-based storage name               |
| Storage                | Store outside the web root (object storage: S3-compatible)                         |
| Virus scanning         | ClamAV or cloud-native scan before serving                                         |
| Serving                | Serve via signed URL with content-disposition:attachment, never inline for uploads |

---

## 11. Secrets Management

### 11.1 Rules

1. **No secrets in source code** — ever. This includes connection strings, API keys, JWT secrets, and passwords.
2. **No secrets in git history** — `.gitignore` must include `.env`, `.env.local`, `.env.production`.
3. **`.env.example`** — Documents all required environment variables with placeholder values, committed to the repository.
4. **Environment variables** — All secrets injected at runtime via environment variables.
5. **CI/CD** — Secrets stored in CI/CD secret store (GitHub Actions Secrets, etc.), never in YAML files.

### 11.2 Required Environment Variables (`.env.example`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/anaorthodox_dev"

# JWT
JWT_ACCESS_SECRET="change_me_min_32_chars_random"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_SECRET="change_me_min_64_chars_random"
JWT_REFRESH_EXPIRY="7d"

# App
NODE_ENV="development"
API_PORT=3001
FRONTEND_URL="http://localhost:3000"

# Rate limiting
THROTTLE_TTL_SECONDS=60
THROTTLE_LIMIT=100
```

### 11.3 Secret Rotation

- JWT secrets: Rotate every 90 days in production, or immediately on suspected compromise.
- Refresh tokens in DB are automatically invalidated on JWT secret rotation (all sessions terminated).

---

## 12. Logging Security

### 12.1 What MUST NOT Be Logged

| Data                                   | Category      | Reason                   |
| -------------------------------------- | ------------- | ------------------------ |
| Passwords (plain or hashed)            | Credentials   | Credential exposure      |
| JWT tokens (access or refresh)         | Credentials   | Token theft              |
| Cookie values                          | Credentials   | Session theft            |
| Credit card / payment data             | Financial PII | Compliance (N/A Phase 0) |
| Full request bodies for auth endpoints | Credentials   | May contain passwords    |
| Personal user notes/bookmarks content  | User PII      | Privacy                  |

### 12.2 What MUST Be Logged (Security Events)

| Event                         | Log Level | Fields                             |
| ----------------------------- | --------- | ---------------------------------- |
| Successful login              | INFO      | userId, IP, timestamp, user-agent  |
| Failed login (wrong password) | WARN      | IP, email (truncated), timestamp   |
| Token refresh                 | DEBUG     | userId, tokenFamily, timestamp     |
| Token reuse detected          | ERROR     | userId, tokenFamily, IP, timestamp |
| Authorization failure (403)   | WARN      | userId, resource, action, IP       |
| Rate limit hit                | WARN      | IP, endpoint, timestamp            |
| Account lockout               | ERROR     | userId, IP, timestamp              |
| Password change               | INFO      | userId, timestamp                  |

### 12.3 Log Format & Audit Retention

Structured JSON logs using **Pino** (NestJS logger replacement):

```json
{
  "level": "warn",
  "time": "2026-11-17T10:00:00.000Z",
  "event": "auth.login.failed",
  "ip": "1.2.3.4",
  "email_prefix": "user@...",
  "msg": "Login failed — invalid password"
}
```

**Audit Log Retention Reality:** Critical security alerts (`SECURITY_TOKEN_REUSE_DETECTED`, `SECURITY_CONCURRENT_ROTATION_REUSE_DETECTED`) are written persistently to the `system_audit_logs` table via Prisma. The 90-day retention period is an approved architectural policy; automated cron deletion is deferred until scheduled background worker infrastructure is operational.

---

## 13. Rate Limiting Architecture

### 13.1 Global Rate Limit & Process-Local Counters

Applied via `@nestjs/throttler` globally:

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60_000, // 60 seconds window
    limit: 100, // 100 requests per IP per window
  },
]);
```

**Architectural Reality & Boundaries:**

- **In-Memory Storage:** The rate limiting counters reside entirely in process-local memory.
- **Single Instance Scope:** Counters reset upon server restart and are not shared across multiple Node.js instances or container replicas.
- **Proxy Trust Requirement:** Rate limiting relies on `req.ip`. When deployed behind reverse proxies (Nginx, Cloudflare, Traefik), `trust proxy` must be enabled on Express so that `req.ip` reflects the true client IP address.
- **Argon2id DoS Mitigation:** By limiting `POST /auth/register` to 5 req/min and `POST /auth/login` to 10 req/min, computationally expensive Argon2id hashing cannot be abused to starve server CPU.
- **Redis Throttler Storage:** Distributed rate limiting with Redis storage (`@nest-lab/throttler-storage-redis`) is planned for Phase 3 when Redis container infrastructure is unblocked.

### 13.2 Endpoint-Specific Limits

| Endpoint                     | TTL  | Limit | Rationale                                 |
| ---------------------------- | ---- | ----- | ----------------------------------------- |
| `POST /auth/login`           | 60s  | 10    | Brute force & Argon2id CPU DoS protection |
| `POST /auth/register`        | 60s  | 5     | Spam registration & Argon2id protection   |
| `POST /auth/refresh`         | 60s  | 30    | Refresh token rotation abuse prevention   |
| `POST /auth/forgot-password` | 300s | 3     | Account enumeration prevention            |
| `GET /api/v1/*`              | 60s  | 200   | General API access                        |

### 13.3 Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700000060
```

---

## 14. Dependency Security

- **`npm audit`** runs in CI on every pull request.
- **High/Critical vulnerabilities** block merge (non-negotiable).
- **Moderate vulnerabilities** must have a documented mitigation plan within 7 days.
- **Dependabot** (or Renovate) configured for automated dependency updates.
- Dependencies reviewed quarterly for abandoned packages.

---

## 15. CORS Configuration

```typescript
// NestJS main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL, // Not '*' in production
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Required for HTTP-only cookies
});
```

**Production:** `origin` is set to the exact frontend domain. Wildcard `*` is **forbidden** in production.

---

## 16. CSRF Protection & Origin Validation

| Mechanism               | Implementation                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| SameSite=Strict cookie  | Refresh token cookie (`ana_refresh_token`) prevents cross-site request forgery                          |
| Server Origin Check     | `validateOrigin()` checks `Origin` and `Referer` against trusted `CORS_ORIGINS`                         |
| Explicit Null Rejection | Requests presenting `Origin: "null"` (sandboxed iframes, privacy extensions) are rejected with HTTP 403 |
| Malformed Header Block  | Unparseable or invalid URL origin headers fail closed with HTTP 403                                     |
| Custom request header   | Mutation requests require `Content-Type: application/json` enforcing browser CORS preflights            |

---

## 17. Security Review Checklist (Per Feature)

Before merging any feature that touches authentication, authorization, or data access:

- [ ] New endpoints have `@UseGuards` applied
- [ ] Public endpoints explicitly marked `@Public()`
- [ ] All DTOs use class-validator decorators
- [ ] No `dangerouslySetInnerHTML` introduced
- [ ] No secrets added to source code
- [ ] No raw SQL without parameterization
- [ ] Logging added for security events introduced by the feature
- [ ] Rate limiting applied to new sensitive endpoints
- [ ] 401/403 tests written for all protected endpoints

---

_Document maintained by the Security Agent. Update when security decisions change._
