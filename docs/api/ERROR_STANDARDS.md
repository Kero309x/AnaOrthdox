# ERROR_STANDARDS.md

**Purpose:** Unified standard for API error codes, error envelope formats, exception filtering, and client error handling.  
**Scope:** NestJS backend exceptions and Next.js frontend consumption  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Backend Agent  
**Related Documents:** API_CONTRACTS.md, SECURITY_ARCHITECTURE.md

---

## 1. Unified Error Response Envelope

Every non-2xx HTTP response from `/api/v1/*` must return the standard JSON envelope:

```json
{
  "success": false,
  "error": {
    "code": "ANA-VALIDATION-4001",
    "message": "Invalid chapter or verse format.",
    "details": [
      {
        "field": "chapterNumber",
        "issue": "chapterNumber must be an integer between 1 and 150"
      }
    ],
    "timestamp": "2026-11-17T02:00:00.000Z",
    "path": "/api/v1/bible/books/GEN/chapters/invalid",
    "traceId": "c8a42c38-8929-4d64-9b7e-0123456789ab"
  }
}
```

---

## 2. Standardized Error Code Taxonomy

| Code Range          | Category           | HTTP Status           | Description                                                 |
| ------------------- | ------------------ | --------------------- | ----------------------------------------------------------- |
| `ANA-AUTH-1001`     | Authentication     | 401 Unauthorized      | Missing or expired JWT access token                         |
| `ANA-AUTH-1002`     | Authentication     | 401 Unauthorized      | Invalid credentials (email/password)                        |
| `ANA-AUTH-1003`     | Authentication     | 401 Unauthorized      | Refresh token revoked or expired                            |
| `ANA-AUTH-1004`     | Authorization      | 403 Forbidden         | User lacks required role or permission                      |
| `ANA-AUTH-1005`     | Authorization      | 403 Forbidden         | Resource ownership violation (IDOR attempt)                 |
| `ANA-VALID-2001`    | Validation         | 400 Bad Request       | Request payload failed class-validator DTO check            |
| `ANA-NOTFOUND-3001` | Entity Resolution  | 404 Not Found         | Requested entity (Bible book, verse, church) not found      |
| `ANA-CONFLICT-4001` | State Conflict     | 409 Conflict          | Unique constraint violation (e.g. duplicate email/bookmark) |
| `ANA-RATE-5001`     | Ingress Protection | 429 Too Many Requests | Rate limit threshold exceeded                               |
| `ANA-SRV-6001`      | Server Internal    | 500 Internal Error    | Unhandled internal exception (generic message to client)    |

---

## 3. Security Error Rules

- **No Stack Traces in Production:** The NestJS `GlobalExceptionFilter` strips all stack traces and database internal errors from outgoing HTTP payloads unless `NODE_ENV === 'development'`.
- **Consistent Login Failures:** Authentication failures must return generic messages ("البريد الإلكتروني أو كلمة المرور غير صحيحة") to prevent account enumeration attacks.
- **Trace IDs:** Every error response includes an opaque UUID `traceId` which correlates with the server log without exposing internal diagnostic data.
