# AUTHORIZATION_MATRIX.md

**Purpose:** Definitive Role-Based Access Control (RBAC) and permission matrix for all operations.  
**Scope:** Client presentation, API Gateway, NestJS Guards, and Database row-level checks  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Security Agent  
**Related Documents:** PERMISSION_MATRIX.md, ENDPOINT_CATALOG.md, SECURITY_ARCHITECTURE.md

---

## 1. System Roles Definition

| Role              | Role Code     | Description                          | Typical User                                         |
| ----------------- | ------------- | ------------------------------------ | ---------------------------------------------------- |
| **ANONYMOUS**     | `ROLE_ANON`   | Unauthenticated public visitor       | Any internet user, offline PWA reader                |
| **USER**          | `ROLE_USER`   | Authenticated community member       | Registered church member, student, reader            |
| **EDITOR**        | `ROLE_EDITOR` | Content curator / theological review | Priest, servant, church historian, authorized editor |
| **ADMINISTRATOR** | `ROLE_ADMIN`  | Technical platform administrator     | Engineering lead, system operator, diocesan IT admin |

---

## 2. Global Authorization Decision Matrix

Legend:

- `C` = Create
- `R` = Read
- `U` = Update
- `D` = Delete
- `P` = Publish / Approve
- `*` = Own resources only
- `—` = Forbidden

| Domain / Resource                | Anonymous | User            | Editor          | Administrator   |
| -------------------------------- | --------- | --------------- | --------------- | --------------- |
| **Holy Bible & Canon**           | `R`       | `R`             | `R, C, U`       | `R, C, U, D`    |
| **Commentaries & Studies**       | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Katameros & Readings**         | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Liturgical & Coptic Calendar** | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Synaxarium**                   | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Agpeya (Prayers)**             | `R`       | `R`             | `R, C, U`       | `R, C, U, D`    |
| **Hymns & Audio Library**        | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Patristic Writings**           | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Churches Directory**           | `R`       | `R`             | `R, C, U`       | `R, C, U, D`    |
| **Monasteries Directory**        | `R`       | `R`             | `R, C, U`       | `R, C, U, D`    |
| **Community Events**             | `R`       | `R`             | `R, C, U, P`    | `R, C, U, D, P` |
| **Personal Bookmarks**           | `—`       | `C, R*, D*`     | `C, R*, D*`     | `C, R*, D*`     |
| **Personal Notes & Highlights**  | `—`       | `C, R*, U*, D*` | `C, R*, U*, D*` | `C, R*, U*, D*` |
| **Personal Reading Plans**       | `—`       | `C, R*, U*, D*` | `C, R*, U*, D*` | `C, R*, U*, D*` |
| **User Profile & Settings**      | `—`       | `R*, U*`        | `R*, U*`        | `R, U, D`       |
| **Role Assignment**              | `—`       | `—`             | `—`             | `R, U`          |
| **Audit Logs**                   | `—`       | `—`             | `—`             | `R`             |
| **System Health & Metrics**      | `—`       | `—`             | `—`             | `R`             |

---

## 3. Enforcement Guard Architecture in NestJS

All endpoints enforce authorization through declarative composite guards:

```typescript
// Example: Controller Endpoint Protection
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EDITOR, Role.ADMIN)
@Permissions('synaxarium.update')
@Put('synaxarium/:id')
async updateCommemoration(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateSynaxariumDto,
) {
  return this.synaxariumService.update(id, dto);
}
```

### Defense-in-Depth Rules:

1. **Never rely on frontend UI hiding:** Disabling an edit button is a cosmetic UX pattern; server validation with 401/403 rejection is mandatory.
2. **Strict Resource Ownership Guard:** Any endpoint acting on personal data (bookmarks, notes) queries the database with `WHERE id = :resourceId AND user_id = :authenticatedUserId` to categorically prevent Insecure Direct Object References (IDOR).

---

## 4. Phase 2A Fixed Role Model & Anti-Mass-Assignment Governance

### 4.1 Fixed Role Architecture vs Dynamic Permissions

In Phase 2A, the system enforces a **fixed role model** on the `User` entity (`role: String` default `"USER"`), containing the four foundational roles:

- `ANONYMOUS`: Unauthenticated public reader.
- `USER`: Authenticated member with personal bookmarking and preference management.
- `EDITOR`: Liturgical text review and curation rights.
- `ADMINISTRATOR`: Full system operations and user lifecycle governance.

Dynamic permission join tables (`permissions`, `role_permissions`, `user_roles`) are deliberately deferred to **Phase 3 Editorial & Admin Governance** to keep the core monorepo schema minimal and maintainable.

### 4.2 Server-Side Anti-Mass-Assignment Protection

- Registration requests (`RegisterDto`) and profile updates (`UpdateProfileDto`) strictly omit `role`.
- NestJS global `ValidationPipe` enforces `{ whitelist: true, forbidNonWhitelisted: true }`. Any request payload containing `role` or unauthorized privilege properties is rejected immediately with `HTTP 400 Bad Request`.
- `AuthService.register()` hardcodes `role: "USER"`. Client-side elevation is architecturally impossible.
