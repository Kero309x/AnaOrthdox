# MODULE_DEPENDENCIES.md

**Purpose:** Comprehensive dependency matrix and dependency-direction rules across all 20 domain modules.  
**Scope:** NestJS backend modules and Next.js frontend route boundaries  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** Architecture Agent  
**Related Documents:** DOMAIN_BOUNDARIES.md, ARCHITECTURE.md

---

## 1. Architectural Dependency Hierarchy (Clean Architecture)

Dependencies must strictly follow an inward directional flow. Outer layers may depend on inner layers, never the reverse:

```
[ Presentation (Controllers / Next.js Pages) ]
                    ↓
[ Application Services (Use Cases, DTOs) ]
                    ↓
[ Domain Layer (Entities, Domain Rules, Interfaces) ]
                    ↑
[ Infrastructure Layer (Prisma ORM, PostgreSQL, External APIs) ]
```

---

## 2. Cross-Module Dependency Matrix

Legend:

- `D` = Direct Dependency (imports service or entity)
- `E` = Event / PubSub Decoupled Dependency
- `O` = Optional Reference (ID foreign key only, no service coupling)
- `—` = Independent

| Module Name         | Auth | Bible | Liturgical Cal | Coptic Cal | Hymns | Agpeya | Synaxarium | Patristic | Church Dir | User Data | Search | Admin |
| ------------------- | ---- | ----- | -------------- | ---------- | ----- | ------ | ---------- | --------- | ---------- | --------- | ------ | ----- |
| **Auth**            | —    | —     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Bible**           | —    | —     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Bible Study**     | —    | D     | —              | —          | —     | —      | —          | O         | —          | —         | —      | —     |
| **Commentary**      | —    | D     | —              | —          | —     | —      | —          | D         | —          | —         | —      | —     |
| **Katameros**       | —    | D     | D              | D          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Liturgical Cal**  | —    | —     | —              | D          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Coptic Cal**      | —    | —     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Hymns**           | —    | —     | O              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Agpeya**          | —    | D     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Synaxarium**      | —    | —     | —              | D          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Church Fathers**  | —    | —     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Patristic Lib**   | —    | —     | —              | —          | —     | —      | —          | D         | —          | —         | —      | —     |
| **Church History**  | —    | —     | —              | —          | —     | —      | O          | O         | —          | —         | —      | —     |
| **Coptic Heritage** | —    | —     | —              | —          | O     | —      | —          | —         | —          | —         | —      | —     |
| **Churches Dir**    | —    | —     | —              | —          | —     | —      | —          | —         | —          | —         | —      | —     |
| **Monasteries**     | —    | —     | —              | —          | —     | —      | —          | —         | O          | —         | —      | —     |
| **Reading Plans**   | —    | D     | —              | —          | —     | —      | —          | —         | —          | D         | —      | —     |
| **Bookmarks/Notes** | D    | D     | —              | —          | O     | O      | O          | O         | —          | —         | —      | —     |
| **Search**          | —    | D     | D              | D          | D     | D      | D          | D         | D          | —         | —      | —     |
| **Admin**           | D    | D     | D              | D          | D     | D      | D          | D         | D          | D         | —      | —     |

---

## 3. Dependency Rules & Anti-Cycles

1. **No Circular Dependencies:** A module must never import another module that directly or transitively depends on it. Circular references in NestJS (`forwardRef()`) are strictly prohibited unless explicitly approved in an ADR.
2. **Decoupling via IDs:** Where domain modules need to associate data (e.g., Bookmarks referencing a Bible Verse or a Hymn), the Bookmarks module stores the entity type and UUID only. It does not import the other module's database repository.
3. **Common & Shared Kernel:** Common utility functions, shared DTOs, and global constants live in `packages/shared-types` or `apps/api/src/common` to avoid direct peer-to-peer coupling.
