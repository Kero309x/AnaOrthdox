# Threat Model

**Project:** Ana Orthodox / أنا أرثوذكس  
**Document ID:** SEC-THREAT-001  
**Status:** ACTIVE — Phase 0 & Phase 1 Scope  
**Last Updated:** 2026-11-17  
**Owner:** Security Agent  
**Related Documents:** SECURITY_ARCHITECTURE.md, PERMISSION_MATRIX.md

---

## 1. Purpose

This document defines the threat model for Ana Orthodox for Phase 0 (Foundation) and Phase 1 (Authentication + Bible). It identifies threat actors, protected assets, threat scenarios, mitigations, and a risk matrix. It is a living document and must be updated at the start of each new phase.

---

## 2. Methodology

This threat model uses a simplified **STRIDE + attack tree** approach:

- **S** — Spoofing identity
- **T** — Tampering with data
- **R** — Repudiation of actions
- **I** — Information disclosure
- **D** — Denial of service
- **E** — Elevation of privilege

---

## 3. System Boundaries

```
┌─────────────────────────────────────────────────────┐
│                     IN SCOPE                        │
│                                                     │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │  Next.js PWA │────▶│  NestJS REST API         │  │
│  │  (Browser)   │     │  (apps/api)              │  │
│  └──────────────┘     └──────────┬───────────────┘  │
│                                  │                  │
│                       ┌──────────▼───────────────┐  │
│                       │  PostgreSQL 16 Database  │  │
│                       └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘

OUT OF SCOPE (Phase 0):
  - CDN / edge infrastructure
  - DNS hijacking
  - Physical server access
  - Advanced Persistent Threats (APT)
  - Side-channel attacks on hardware
```

---

## 4. Threat Actors

### 4.1 Actor Profiles

| Actor ID | Name                       | Capability                                            | Motivation                                      | Trust Level                                         |
| -------- | -------------------------- | ----------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| TA-01    | Anonymous Attacker         | Low–Medium (script kiddie to competent attacker)      | Vandalism, credential theft, spam               | None                                                |
| TA-02    | Authenticated Attacker     | Medium (legitimate account, attacks lateral scope)    | Access other users' data, privilege escalation  | Partial (authenticated USER role)                   |
| TA-03    | Compromised Editor Account | Medium–High (valid EDITOR credentials)                | Content manipulation, data exfiltration         | Elevated (EDITOR role)                              |
| TA-04    | Malicious Insider          | High (direct system access, organizational knowledge) | Data exfiltration, sabotage                     | Administrative (ADMINISTRATOR role or infra access) |
| TA-05    | Automated Bot / Crawler    | Low (automated tools)                                 | Scraping content, credential stuffing, spamming | None                                                |

---

## 5. Protected Assets

### 5.1 Asset Inventory

| Asset ID | Asset                                   | Category          | Sensitivity       | Phase    |
| -------- | --------------------------------------- | ----------------- | ----------------- | -------- |
| A-01     | User credentials (email, password hash) | Authentication    | Critical          | Phase 0  |
| A-02     | Refresh tokens (database)               | Authentication    | Critical          | Phase 0  |
| A-03     | JWT signing secrets                     | Authentication    | Critical          | Phase 0  |
| A-04     | User personal notes                     | User Data         | High              | Phase 2  |
| A-05     | User bookmarks                          | User Data         | Medium            | Phase 2  |
| A-06     | User account profile                    | User Data         | High              | Phase 1  |
| A-07     | Bible text content                      | Editorial Content | Low (public data) | Phase 1  |
| A-08     | Liturgical calendar data                | Editorial Content | Low               | Phase 1  |
| A-09     | Hymns audio files                       | Editorial Content | Medium            | Phase 2  |
| A-10     | Commentary / editorial content          | Editorial Content | Medium            | Phase 2  |
| A-11     | Database connection string              | Secrets           | Critical          | Phase 0  |
| A-12     | Environment secrets (.env)              | Secrets           | Critical          | Phase 0  |
| A-13     | Aggregate user behavior data            | Analytics         | Medium            | Phase 1+ |

---

## 6. Threat Scenarios

### 6.1 Authentication Threats

#### THREAT-AUTH-01: SQL Injection in Login Endpoint

| Field             | Detail                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Spoofing, Tampering                                                                                                                               |
| **Actor**         | TA-01, TA-05                                                                                                                                      |
| **Asset**         | A-01, entire database                                                                                                                             |
| **Attack**        | Attacker submits `' OR '1'='1` in the email/password field, aiming to bypass authentication or extract data                                       |
| **Mitigation**    | Prisma ORM uses parameterized queries; `ValidationPipe` validates and sanitizes inputs via `class-validator` before they reach the database layer |
| **Residual Risk** | Low                                                                                                                                               |
| **Status**        | Mitigated                                                                                                                                         |

#### THREAT-AUTH-02: Credential Stuffing

| Field             | Detail                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **STRIDE**        | Spoofing                                                                                                                                   |
| **Actor**         | TA-01, TA-05                                                                                                                               |
| **Asset**         | A-01, A-06                                                                                                                                 |
| **Attack**        | Bot tries millions of username/password combinations from leaked credential databases                                                      |
| **Mitigation**    | Rate limiting on `POST /auth/login` (5 attempts per 60s per IP); bcrypt cost factor 12 (slow hashing); future: CAPTCHA on repeated failure |
| **Residual Risk** | Medium (IP rotation by bots not mitigated in Phase 0)                                                                                      |
| **Status**        | Partially Mitigated — Phase 0                                                                                                              |

#### THREAT-AUTH-03: JWT Access Token Theft via XSS

| Field             | Detail                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Spoofing, Information Disclosure                                                                                                                                       |
| **Actor**         | TA-01, TA-02                                                                                                                                                           |
| **Asset**         | A-02, A-03                                                                                                                                                             |
| **Attack**        | XSS payload reads `localStorage` or JavaScript variables to steal JWT tokens                                                                                           |
| **Mitigation**    | Access tokens stored in memory only (not `localStorage`); Content Security Policy restricts script execution; React auto-escapes JSX; `dangerouslySetInnerHTML` banned |
| **Residual Risk** | Low                                                                                                                                                                    |
| **Status**        | Mitigated                                                                                                                                                              |

#### THREAT-AUTH-04: Refresh Token Theft via Network

| Field             | Detail                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Spoofing, Information Disclosure                                                                                                |
| **Actor**         | TA-01                                                                                                                           |
| **Asset**         | A-02                                                                                                                            |
| **Attack**        | Man-in-the-middle intercepts the refresh token cookie                                                                           |
| **Mitigation**    | HTTP-only cookie (JS cannot read); `Secure` flag (HTTPS only); `SameSite=Strict` (not sent on cross-site requests); HSTS header |
| **Residual Risk** | Low                                                                                                                             |
| **Status**        | Mitigated                                                                                                                       |

#### THREAT-AUTH-05: Refresh Token Reuse (Stolen Token)

| Field             | Detail                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **STRIDE**        | Spoofing, Elevation of Privilege                                                                                                                       |
| **Actor**         | TA-01, TA-02                                                                                                                                           |
| **Asset**         | A-02                                                                                                                                                   |
| **Attack**        | Attacker steals a refresh token and uses it. Legitimate user also uses it.                                                                             |
| **Mitigation**    | Single-use refresh token rotation; token family tracking; second use of an already-used token invalidates the entire family, forcing re-authentication |
| **Residual Risk** | Low                                                                                                                                                    |
| **Status**        | Mitigated                                                                                                                                              |

---

### 6.2 Authorization Threats

#### THREAT-AUTHZ-01: Broken Access Control (IDOR)

| Field             | Detail                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **STRIDE**        | Elevation of Privilege, Information Disclosure                                                                                                               |
| **Actor**         | TA-02                                                                                                                                                        |
| **Asset**         | A-04, A-05, A-06                                                                                                                                             |
| **Attack**        | Authenticated user modifies resource ID in request to access another user's notes/bookmarks                                                                  |
| **Mitigation**    | NestJS `RolesGuard` on all endpoints; service-layer ownership check (`note.userId !== currentUser.id`); integration tests assert 403 for unauthorized access |
| **Residual Risk** | Low                                                                                                                                                          |
| **Status**        | Mitigated                                                                                                                                                    |

#### THREAT-AUTHZ-02: Privilege Escalation via Role Manipulation

| Field             | Detail                                                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Elevation of Privilege                                                                                                                                                                  |
| **Actor**         | TA-02                                                                                                                                                                                   |
| **Asset**         | A-06, all editorial content                                                                                                                                                             |
| **Attack**        | User attempts to modify their own role via API (e.g., `PUT /users/me` with `{ role: "ADMINISTRATOR" }`)                                                                                 |
| **Mitigation**    | DTOs use `whitelist: true` and `forbidNonWhitelisted: true` — `role` field not in `UpdateProfileDto`; role changes only possible via admin endpoints protected by `ADMINISTRATOR` guard |
| **Residual Risk** | Low                                                                                                                                                                                     |
| **Status**        | Mitigated                                                                                                                                                                               |

#### THREAT-AUTHZ-03: Content Manipulation by Compromised Editor

| Field             | Detail                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Tampering                                                                                                                                                                                    |
| **Actor**         | TA-03                                                                                                                                                                                        |
| **Asset**         | A-07–A-10                                                                                                                                                                                    |
| **Attack**        | Compromised EDITOR account publishes false religious content or modifies authentic texts                                                                                                     |
| **Mitigation**    | ADMINISTRATOR approval required for publishing (`admin.content.publish` permission); audit log records all content changes with userId and timestamp; content versioning planned for Phase 2 |
| **Residual Risk** | Medium (single ADMINISTRATOR may be compromised)                                                                                                                                             |
| **Status**        | Partially Mitigated                                                                                                                                                                          |

---

### 6.3 Injection Threats

#### THREAT-INJ-01: Cross-Site Scripting (XSS)

| Field             | Detail                                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Tampering, Information Disclosure                                                                                                                                                                  |
| **Actor**         | TA-01, TA-02                                                                                                                                                                                       |
| **Asset**         | A-01, A-04, A-05                                                                                                                                                                                   |
| **Attack**        | Attacker injects `<script>` tags into user notes or comments that execute in other users' browsers                                                                                                 |
| **Mitigation**    | React JSX auto-escaping; `dangerouslySetInnerHTML` banned; CSP `script-src 'self' 'nonce-{n}'` blocks inline scripts; server-side input validation (class-validator `@IsString()`, `@MaxLength()`) |
| **Residual Risk** | Low                                                                                                                                                                                                |
| **Status**        | Mitigated                                                                                                                                                                                          |

#### THREAT-INJ-02: SQL Injection

| Field             | Detail                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Tampering, Information Disclosure                                                                                             |
| **Actor**         | TA-01                                                                                                                         |
| **Asset**         | Entire database                                                                                                               |
| **Attack**        | Malicious SQL payload in any user-supplied input field                                                                        |
| **Mitigation**    | Prisma ORM parameterizes all queries by default; `$queryRawUnsafe` is forbidden; global `ValidationPipe` validates all inputs |
| **Residual Risk** | Low                                                                                                                           |
| **Status**        | Mitigated                                                                                                                     |

#### THREAT-INJ-03: CSRF (Cross-Site Request Forgery)

| Field             | Detail                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **STRIDE**        | Tampering                                                                                                                                                          |
| **Actor**         | TA-01                                                                                                                                                              |
| **Asset**         | A-04, A-05, A-06                                                                                                                                                   |
| **Attack**        | Malicious site tricks an authenticated user's browser into making requests to the API                                                                              |
| **Mitigation**    | `SameSite=Strict` on refresh cookie; CORS origin validation; mutation endpoints require `Content-Type: application/json` (browsers enforce CORS preflight on this) |
| **Residual Risk** | Low                                                                                                                                                                |
| **Status**        | Mitigated                                                                                                                                                          |

---

### 6.4 Denial of Service Threats

#### THREAT-DOS-01: API Abuse / Rate-Based DoS

| Field             | Detail                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Denial of Service                                                                                        |
| **Actor**         | TA-01, TA-05                                                                                             |
| **Asset**         | API availability                                                                                         |
| **Attack**        | Flood of requests overwhelming the NestJS API                                                            |
| **Mitigation**    | `@nestjs/throttler` global rate limiting (100 req/60s/IP); stricter limits on auth endpoints (5 req/60s) |
| **Residual Risk** | Medium (volumetric DDoS not mitigated — out of scope for Phase 0)                                        |
| **Status**        | Partially Mitigated                                                                                      |

#### THREAT-DOS-02: Resource Exhaustion via Large Payloads

| Field             | Detail                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Denial of Service                                                                                           |
| **Actor**         | TA-01                                                                                                       |
| **Asset**         | API availability, database                                                                                  |
| **Attack**        | Sending extremely large request bodies to exhaust memory or database storage                                |
| **Mitigation**    | NestJS body size limit (default 1 MB, configurable); `@MaxLength()` validators on all string fields in DTOs |
| **Residual Risk** | Low                                                                                                         |
| **Status**        | Mitigated                                                                                                   |

---

### 6.5 Information Disclosure Threats

#### THREAT-INFO-01: Verbose Error Messages Leaking Stack Traces

| Field             | Detail                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRIDE**        | Information Disclosure                                                                                                                       |
| **Actor**         | TA-01                                                                                                                                        |
| **Asset**         | System architecture details                                                                                                                  |
| **Attack**        | Triggering errors to expose stack traces, database schemas, or internal paths                                                                |
| **Mitigation**    | NestJS global exception filter returns generic error messages in production; stack traces only logged server-side (never returned to client) |
| **Residual Risk** | Low                                                                                                                                          |
| **Status**        | Mitigated                                                                                                                                    |

#### THREAT-INFO-02: Account Enumeration via Login Response

| Field             | Detail                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **STRIDE**        | Information Disclosure                                                                                                         |
| **Actor**         | TA-01, TA-05                                                                                                                   |
| **Asset**         | A-01                                                                                                                           |
| **Attack**        | Distinguish "email not found" from "wrong password" to enumerate registered accounts                                           |
| **Mitigation**    | Login endpoint returns identical response for both cases: "Invalid credentials"; same response timing (bcrypt runs regardless) |
| **Residual Risk** | Low                                                                                                                            |
| **Status**        | Mitigated                                                                                                                      |

---

## 7. Out of Scope — Phase 0

The following threats are **explicitly out of scope** for Phase 0 and Phase 1. They must be revisited before launch:

| Threat                                  | Reason Out of Scope                                | Revisit Phase                 |
| --------------------------------------- | -------------------------------------------------- | ----------------------------- |
| DDoS (volumetric)                       | Infrastructure concern (CDN/WAF layer)             | Before production launch      |
| Advanced Persistent Threats (APT)       | Nation-state level — beyond app scope              | Ongoing                       |
| Physical server attacks                 | Hosting provider responsibility                    | Before production launch      |
| Payment card fraud                      | No payment processing in Phase 0–1                 | Phase 3+ if applicable        |
| Mobile app security (Android/iOS)       | PWA only in Phase 0                                | Phase 3+ if native apps added |
| Zero-day exploits in Node.js/PostgreSQL | Vendor responsibility; npm audit covers known CVEs | Ongoing                       |
| DNS hijacking                           | Infrastructure/registrar responsibility            | Before production launch      |
| Side-channel attacks                    | Beyond scope of web application security           | N/A                           |

---

## 8. Risk Matrix

### 8.1 Scoring

**Likelihood:** 1 (Rare) → 5 (Almost Certain)  
**Impact:** 1 (Negligible) → 5 (Critical)  
**Risk Score** = Likelihood × Impact

| Score Range | Rating   |
| ----------- | -------- |
| 1–4         | Low      |
| 5–9         | Medium   |
| 10–14       | High     |
| 15–25       | Critical |

### 8.2 Risk Register

| Threat ID       | Threat Name                 | Likelihood | Impact | Score | Rating       | Status                          |
| --------------- | --------------------------- | ---------- | ------ | ----- | ------------ | ------------------------------- |
| THREAT-AUTH-01  | SQL Injection in Login      | 2          | 5      | 10    | **High**     | ✅ Mitigated → Low              |
| THREAT-AUTH-02  | Credential Stuffing         | 4          | 3      | 12    | **High**     | ⚠️ Partially Mitigated → Medium |
| THREAT-AUTH-03  | JWT Theft via XSS           | 2          | 4      | 8     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-AUTH-04  | Refresh Token Network Theft | 1          | 5      | 5     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-AUTH-05  | Refresh Token Reuse         | 2          | 4      | 8     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-AUTHZ-01 | IDOR — User Data Access     | 3          | 4      | 12    | **High**     | ✅ Mitigated → Low              |
| THREAT-AUTHZ-02 | Privilege Escalation        | 2          | 5      | 10    | **High**     | ✅ Mitigated → Low              |
| THREAT-AUTHZ-03 | Compromised Editor          | 2          | 4      | 8     | **Medium**   | ⚠️ Partially Mitigated → Medium |
| THREAT-INJ-01   | XSS                         | 3          | 4      | 12    | **High**     | ✅ Mitigated → Low              |
| THREAT-INJ-02   | SQL Injection               | 3          | 5      | 15    | **Critical** | ✅ Mitigated → Low              |
| THREAT-INJ-03   | CSRF                        | 2          | 3      | 6     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-DOS-01   | API Rate-Based DoS          | 4          | 3      | 12    | **High**     | ⚠️ Partially Mitigated → Medium |
| THREAT-DOS-02   | Large Payload Exhaustion    | 2          | 3      | 6     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-INFO-01  | Verbose Error Leakage       | 3          | 2      | 6     | **Medium**   | ✅ Mitigated → Low              |
| THREAT-INFO-02  | Account Enumeration         | 4          | 2      | 8     | **Medium**   | ✅ Mitigated → Low              |

### 8.3 Residual Risks Requiring Monitoring

| Risk                               | Monitoring Mechanism                                                    |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Credential stuffing (TA-05)        | Monitor failed login rate; alert on > 50 failures/minute from single IP |
| Compromised editor account (TA-03) | Audit log review; content approval by ADMINISTRATOR                     |
| Rate-based DoS                     | Monitor API latency and request queue depth; alert on threshold breach  |

---

## 9. Update Schedule

This threat model must be reviewed and updated:

- **At the start of each Phase** before implementation begins.
- **When a new module is added** that handles user data or authentication.
- **After any security incident**.
- **Quarterly** even if no changes have occurred.

---

_Document maintained by the Security Agent._
