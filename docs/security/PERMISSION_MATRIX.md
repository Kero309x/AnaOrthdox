# Permission Matrix

**Project:** Ana Orthodox / أنا أرثوذكس  
**Document ID:** SEC-PERM-001  
**Status:** ACTIVE  
**Last Updated:** 2026-11-17  
**Owner:** Security Agent  
**Related Documents:** SECURITY_ARCHITECTURE.md, THREAT_MODEL.md

---

## 1. Purpose

This document is the authoritative reference for all permissions in the Ana Orthodox platform. It defines every permission, maps permissions to roles, and specifies the NestJS guard implementation pattern. All authorization decisions in the codebase must be traceable to this document.

---

## 2. Role Definitions

| Role            | ID            | Description                    | Assigned To                        |
| --------------- | ------------- | ------------------------------ | ---------------------------------- |
| `ANONYMOUS`     | `ROLE_ANON`   | Unauthenticated visitor        | All unauthenticated requests       |
| `USER`          | `ROLE_USER`   | Registered, authenticated user | Standard registered accounts       |
| `EDITOR`        | `ROLE_EDITOR` | Trusted content contributor    | Manually assigned by ADMINISTRATOR |
| `ADMINISTRATOR` | `ROLE_ADMIN`  | Full platform access           | Manually assigned; initial seed    |

### 2.1 Role Hierarchy

```
ADMINISTRATOR  ← Full access: inherits all EDITOR + USER + ANONYMOUS permissions, plus admin permissions
     │
  EDITOR        ← Content management: inherits all USER + ANONYMOUS permissions, plus create/update/delete content
     │
   USER          ← Authenticated: inherits all ANONYMOUS permissions, plus personal data management
     │
 ANONYMOUS       ← Public read access only
```

> **Implementation note:** NestJS guards must check the **user's highest role** and grant all permissions of that role and all roles below it in the hierarchy.

---

## 3. Permission Naming Convention

```
{module}.{resource}.{action}
```

Examples:

- `bible.read` — Read Bible content
- `notes.own.create` — Create the caller's own notes
- `admin.users.delete` — Delete any user account (admin only)

---

## 4. Full Permission Registry

### 4.1 Content Permissions

#### Bible Module

| Permission     | Description                            | Required for          |
| -------------- | -------------------------------------- | --------------------- |
| `bible.read`   | Read Bible books, chapters, and verses | Displaying Bible text |
| `bible.create` | Create new Bible text entries          | Seeding / data import |
| `bible.update` | Update existing Bible text entries     | Content corrections   |
| `bible.delete` | Delete Bible entries                   | Data management       |

#### Commentary Module

| Permission          | Description                         | Required for            |
| ------------------- | ----------------------------------- | ----------------------- |
| `commentary.read`   | Read commentaries on Bible passages | Displaying commentary   |
| `commentary.create` | Create new commentary entries       | Contributing commentary |
| `commentary.update` | Update existing commentary          | Editing commentary      |
| `commentary.delete` | Delete commentary entries           | Content management      |

#### Katameros Module

| Permission         | Description                        | Required for              |
| ------------------ | ---------------------------------- | ------------------------- |
| `katameros.read`   | Read Katameros lectionary readings | Displaying daily readings |
| `katameros.create` | Create Katameros entries           | Data import               |
| `katameros.update` | Update Katameros entries           | Content corrections       |
| `katameros.delete` | Delete Katameros entries           | Data management           |

#### Hymns Module

| Permission     | Description                                    | Required for       |
| -------------- | ---------------------------------------------- | ------------------ |
| `hymns.read`   | Read hymn text, metadata, and audio references | Displaying hymns   |
| `hymns.create` | Create new hymn entries                        | Adding hymns       |
| `hymns.update` | Update hymn content or audio                   | Editing hymns      |
| `hymns.delete` | Delete hymn entries                            | Content management |

#### Agpeya Module

| Permission      | Description              | Required for        |
| --------------- | ------------------------ | ------------------- |
| `agpeya.read`   | Read Agpeya prayer hours | Displaying prayers  |
| `agpeya.create` | Create Agpeya entries    | Data import         |
| `agpeya.update` | Update Agpeya content    | Content corrections |
| `agpeya.delete` | Delete Agpeya entries    | Data management     |

#### Synaxarium Module

| Permission          | Description                          | Required for            |
| ------------------- | ------------------------------------ | ----------------------- |
| `synaxarium.read`   | Read Synaxarium saint commemorations | Displaying daily saints |
| `synaxarium.create` | Create Synaxarium entries            | Data import             |
| `synaxarium.update` | Update Synaxarium entries            | Editing content         |
| `synaxarium.delete` | Delete Synaxarium entries            | Content management      |

#### Patristic Library Module

| Permission         | Description                   | Required for          |
| ------------------ | ----------------------------- | --------------------- |
| `patristic.read`   | Read Church Fathers' writings | Displaying patristics |
| `patristic.create` | Create patristic text entries | Adding texts          |
| `patristic.update` | Update patristic entries      | Editing content       |
| `patristic.delete` | Delete patristic entries      | Content management    |

---

### 4.2 Calendar Permissions

| Permission                   | Description                                               | Required for            |
| ---------------------------- | --------------------------------------------------------- | ----------------------- |
| `calendar.liturgical.read`   | Read the liturgical calendar (feast days, fasts, seasons) | Displaying calendar     |
| `calendar.liturgical.manage` | Create, update, delete liturgical calendar entries        | Calendar management     |
| `calendar.coptic.read`       | Read Coptic date conversions and calendar                 | Displaying Coptic dates |
| `calendar.coptic.manage`     | Create, update, delete Coptic calendar entries            | Calendar management     |

---

### 4.3 Directory Permissions

#### Churches Module

| Permission        | Description                    | Required for          |
| ----------------- | ------------------------------ | --------------------- |
| `churches.read`   | Read church directory listings | Displaying churches   |
| `churches.create` | Add new church to directory    | Contributing churches |
| `churches.update` | Update church information      | Editing listings      |
| `churches.delete` | Remove church from directory   | Content management    |

#### Monasteries Module

| Permission           | Description                       | Required for             |
| -------------------- | --------------------------------- | ------------------------ |
| `monasteries.read`   | Read monastery directory listings | Displaying monasteries   |
| `monasteries.create` | Add new monastery to directory    | Contributing monasteries |
| `monasteries.update` | Update monastery information      | Editing listings         |
| `monasteries.delete` | Remove monastery from directory   | Content management       |

#### Events Module

| Permission      | Description           | Required for       |
| --------------- | --------------------- | ------------------ |
| `events.read`   | Read community events | Displaying events  |
| `events.create` | Create new events     | Publishing events  |
| `events.update` | Update event details  | Editing events     |
| `events.delete` | Delete events         | Content management |

---

### 4.4 Personal Data Permissions

#### Notes Module (User-Owned)

| Permission         | Description                   | Required for              |
| ------------------ | ----------------------------- | ------------------------- |
| `notes.own.read`   | Read the caller's own notes   | Displaying personal notes |
| `notes.own.create` | Create a note for the caller  | Writing notes             |
| `notes.own.update` | Update the caller's own notes | Editing notes             |
| `notes.own.delete` | Delete the caller's own notes | Deleting notes            |

> **Important:** `notes.own.*` permissions are restricted to the resource owner. Even an EDITOR cannot read another USER's notes. Only ADMINISTRATOR can access any user's notes (via admin endpoints, not these permission scopes).

#### Bookmarks Module (User-Owned)

| Permission             | Description                       | Required for         |
| ---------------------- | --------------------------------- | -------------------- |
| `bookmarks.own.read`   | Read the caller's own bookmarks   | Displaying bookmarks |
| `bookmarks.own.create` | Create a bookmark for the caller  | Adding bookmarks     |
| `bookmarks.own.delete` | Delete the caller's own bookmarks | Removing bookmarks   |

#### Reading Plans Module

| Permission                  | Description                                           | Required for           |
| --------------------------- | ----------------------------------------------------- | ---------------------- |
| `reading_plans.own.manage`  | Create, update, delete the caller's own reading plans | Personal reading plans |
| `reading_plans.shared.read` | Read publicly shared reading plans                    | Community plans        |

---

### 4.5 Search Permission

| Permission    | Description                                       | Required for   |
| ------------- | ------------------------------------------------- | -------------- |
| `search.read` | Execute search queries across all indexed content | Search feature |

---

### 4.6 Administration Permissions

| Permission                | Description                                     | Required for                 |
| ------------------------- | ----------------------------------------------- | ---------------------------- |
| `admin.users.list`        | List all registered users with their details    | User management dashboard    |
| `admin.users.update`      | Update any user's profile, role, or status      | Moderation / role assignment |
| `admin.users.delete`      | Delete any user account                         | Account removal              |
| `admin.content.publish`   | Publish content to production (make it visible) | Content workflow             |
| `admin.content.unpublish` | Unpublish / hide content without deleting it    | Content moderation           |
| `admin.roles.manage`      | Assign and revoke roles for any user            | Role management              |

---

## 5. Role → Permission Assignment Matrix

Legend:

- ✅ **Granted** — Role has this permission
- ❌ **Denied** — Role does not have this permission
- 👤 **Own only** — Granted only for the user's own resources

| Permission                   | ANONYMOUS | USER | EDITOR | ADMINISTRATOR |
| ---------------------------- | :-------: | :--: | :----: | :-----------: |
| **Bible**                    |           |      |        |               |
| `bible.read`                 |    ✅     |  ✅  |   ✅   |      ✅       |
| `bible.create`               |    ❌     |  ❌  |   ✅   |      ✅       |
| `bible.update`               |    ❌     |  ❌  |   ✅   |      ✅       |
| `bible.delete`               |    ❌     |  ❌  |   ❌   |      ✅       |
| **Commentary**               |           |      |        |               |
| `commentary.read`            |    ✅     |  ✅  |   ✅   |      ✅       |
| `commentary.create`          |    ❌     |  ❌  |   ✅   |      ✅       |
| `commentary.update`          |    ❌     |  ❌  |   ✅   |      ✅       |
| `commentary.delete`          |    ❌     |  ❌  |   ❌   |      ✅       |
| **Katameros**                |           |      |        |               |
| `katameros.read`             |    ✅     |  ✅  |   ✅   |      ✅       |
| `katameros.create`           |    ❌     |  ❌  |   ✅   |      ✅       |
| `katameros.update`           |    ❌     |  ❌  |   ✅   |      ✅       |
| `katameros.delete`           |    ❌     |  ❌  |   ❌   |      ✅       |
| **Hymns**                    |           |      |        |               |
| `hymns.read`                 |    ✅     |  ✅  |   ✅   |      ✅       |
| `hymns.create`               |    ❌     |  ❌  |   ✅   |      ✅       |
| `hymns.update`               |    ❌     |  ❌  |   ✅   |      ✅       |
| `hymns.delete`               |    ❌     |  ❌  |   ❌   |      ✅       |
| **Agpeya**                   |           |      |        |               |
| `agpeya.read`                |    ✅     |  ✅  |   ✅   |      ✅       |
| `agpeya.create`              |    ❌     |  ❌  |   ✅   |      ✅       |
| `agpeya.update`              |    ❌     |  ❌  |   ✅   |      ✅       |
| `agpeya.delete`              |    ❌     |  ❌  |   ❌   |      ✅       |
| **Synaxarium**               |           |      |        |               |
| `synaxarium.read`            |    ✅     |  ✅  |   ✅   |      ✅       |
| `synaxarium.create`          |    ❌     |  ❌  |   ✅   |      ✅       |
| `synaxarium.update`          |    ❌     |  ❌  |   ✅   |      ✅       |
| `synaxarium.delete`          |    ❌     |  ❌  |   ❌   |      ✅       |
| **Patristic**                |           |      |        |               |
| `patristic.read`             |    ✅     |  ✅  |   ✅   |      ✅       |
| `patristic.create`           |    ❌     |  ❌  |   ✅   |      ✅       |
| `patristic.update`           |    ❌     |  ❌  |   ✅   |      ✅       |
| `patristic.delete`           |    ❌     |  ❌  |   ❌   |      ✅       |
| **Liturgical Calendar**      |           |      |        |               |
| `calendar.liturgical.read`   |    ✅     |  ✅  |   ✅   |      ✅       |
| `calendar.liturgical.manage` |    ❌     |  ❌  |   ✅   |      ✅       |
| **Coptic Calendar**          |           |      |        |               |
| `calendar.coptic.read`       |    ✅     |  ✅  |   ✅   |      ✅       |
| `calendar.coptic.manage`     |    ❌     |  ❌  |   ✅   |      ✅       |
| **Churches**                 |           |      |        |               |
| `churches.read`              |    ✅     |  ✅  |   ✅   |      ✅       |
| `churches.create`            |    ❌     |  ❌  |   ✅   |      ✅       |
| `churches.update`            |    ❌     |  ❌  |   ✅   |      ✅       |
| `churches.delete`            |    ❌     |  ❌  |   ❌   |      ✅       |
| **Monasteries**              |           |      |        |               |
| `monasteries.read`           |    ✅     |  ✅  |   ✅   |      ✅       |
| `monasteries.create`         |    ❌     |  ❌  |   ✅   |      ✅       |
| `monasteries.update`         |    ❌     |  ❌  |   ✅   |      ✅       |
| `monasteries.delete`         |    ❌     |  ❌  |   ❌   |      ✅       |
| **Events**                   |           |      |        |               |
| `events.read`                |    ✅     |  ✅  |   ✅   |      ✅       |
| `events.create`              |    ❌     |  ❌  |   ✅   |      ✅       |
| `events.update`              |    ❌     |  ❌  |   ✅   |      ✅       |
| `events.delete`              |    ❌     |  ❌  |   ❌   |      ✅       |
| **User Notes (own)**         |           |      |        |               |
| `notes.own.read`             |    ❌     |  👤  |   👤   |      ✅       |
| `notes.own.create`           |    ❌     |  👤  |   👤   |      ✅       |
| `notes.own.update`           |    ❌     |  👤  |   👤   |      ✅       |
| `notes.own.delete`           |    ❌     |  👤  |   👤   |      ✅       |
| **User Bookmarks (own)**     |           |      |        |               |
| `bookmarks.own.read`         |    ❌     |  👤  |   👤   |      ✅       |
| `bookmarks.own.create`       |    ❌     |  👤  |   👤   |      ✅       |
| `bookmarks.own.delete`       |    ❌     |  👤  |   👤   |      ✅       |
| **Reading Plans**            |           |      |        |               |
| `reading_plans.own.manage`   |    ❌     |  👤  |   👤   |      ✅       |
| `reading_plans.shared.read`  |    ✅     |  ✅  |   ✅   |      ✅       |
| **Search**                   |           |      |        |               |
| `search.read`                |    ✅     |  ✅  |   ✅   |      ✅       |
| **Administration**           |           |      |        |               |
| `admin.users.list`           |    ❌     |  ❌  |   ❌   |      ✅       |
| `admin.users.update`         |    ❌     |  ❌  |   ❌   |      ✅       |
| `admin.users.delete`         |    ❌     |  ❌  |   ❌   |      ✅       |
| `admin.content.publish`      |    ❌     |  ❌  |   ❌   |      ✅       |
| `admin.content.unpublish`    |    ❌     |  ❌  |   ❌   |      ✅       |
| `admin.roles.manage`         |    ❌     |  ❌  |   ❌   |      ✅       |

---

## 6. NestJS Implementation Guide

### 6.1 Permission Enum

```typescript
// src/auth/enums/permission.enum.ts
export enum Permission {
  // Bible
  BIBLE_READ = "bible.read",
  BIBLE_CREATE = "bible.create",
  BIBLE_UPDATE = "bible.update",
  BIBLE_DELETE = "bible.delete",

  // Commentary
  COMMENTARY_READ = "commentary.read",
  COMMENTARY_CREATE = "commentary.create",
  COMMENTARY_UPDATE = "commentary.update",
  COMMENTARY_DELETE = "commentary.delete",

  // ... (all permissions)

  // Admin
  ADMIN_USERS_LIST = "admin.users.list",
  ADMIN_USERS_UPDATE = "admin.users.update",
  ADMIN_USERS_DELETE = "admin.users.delete",
  ADMIN_CONTENT_PUBLISH = "admin.content.publish",
  ADMIN_CONTENT_UNPUBLISH = "admin.content.unpublish",
  ADMIN_ROLES_MANAGE = "admin.roles.manage",
}
```

### 6.2 Role-Permission Map (Server-Side)

```typescript
// src/auth/constants/role-permissions.ts
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ANONYMOUS]: [
    Permission.BIBLE_READ,
    Permission.COMMENTARY_READ,
    Permission.KATAMEROS_READ,
    Permission.HYMNS_READ,
    Permission.AGPEYA_READ,
    Permission.SYNAXARIUM_READ,
    Permission.PATRISTIC_READ,
    Permission.CALENDAR_LITURGICAL_READ,
    Permission.CALENDAR_COPTIC_READ,
    Permission.CHURCHES_READ,
    Permission.MONASTERIES_READ,
    Permission.EVENTS_READ,
    Permission.READING_PLANS_SHARED_READ,
    Permission.SEARCH_READ,
  ],
  [Role.USER]: [
    // All ANONYMOUS permissions +
    Permission.NOTES_OWN_READ,
    Permission.NOTES_OWN_CREATE,
    Permission.NOTES_OWN_UPDATE,
    Permission.NOTES_OWN_DELETE,
    Permission.BOOKMARKS_OWN_READ,
    Permission.BOOKMARKS_OWN_CREATE,
    Permission.BOOKMARKS_OWN_DELETE,
    Permission.READING_PLANS_OWN_MANAGE,
  ],
  [Role.EDITOR]: [
    // All USER permissions +
    Permission.BIBLE_CREATE,
    Permission.BIBLE_UPDATE,
    Permission.COMMENTARY_CREATE,
    Permission.COMMENTARY_UPDATE,
    // ... all create/update content permissions
    Permission.CALENDAR_LITURGICAL_MANAGE,
    Permission.CALENDAR_COPTIC_MANAGE,
    Permission.CHURCHES_CREATE,
    Permission.CHURCHES_UPDATE,
    Permission.MONASTERIES_CREATE,
    Permission.MONASTERIES_UPDATE,
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
  ],
  [Role.ADMINISTRATOR]: [
    // All EDITOR permissions +
    Permission.BIBLE_DELETE,
    Permission.COMMENTARY_DELETE,
    // ... all delete permissions
    Permission.ADMIN_USERS_LIST,
    Permission.ADMIN_USERS_UPDATE,
    Permission.ADMIN_USERS_DELETE,
    Permission.ADMIN_CONTENT_PUBLISH,
    Permission.ADMIN_CONTENT_UNPUBLISH,
    Permission.ADMIN_ROLES_MANAGE,
  ],
};
```

### 6.3 Guard Usage in Controllers

```typescript
// Protected content creation endpoint
@Post()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.BIBLE_CREATE)
async createBibleEntry(@Body() dto: CreateBibleEntryDto) { ... }

// Protected public read endpoint (also accessible anonymously)
@Get(':id')
@Public()
async getBibleChapter(@Param('id') id: string) { ... }

// Protected admin endpoint
@Delete(':userId')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.ADMIN_USERS_DELETE)
async deleteUser(@Param('userId') userId: string) { ... }
```

---

## 7. Permission Change Procedure

Changes to this matrix require:

1. **Update this document** (`PERMISSION_MATRIX.md`) with the new permission.
2. **Update the Permission enum** in `src/auth/enums/permission.enum.ts`.
3. **Update the ROLE_PERMISSIONS map** in `src/auth/constants/role-permissions.ts`.
4. **Write authorization tests** asserting the new 401/403 behavior.
5. **Code review** by at least one additional agent/developer.
6. **Update SECURITY_ARCHITECTURE.md** if the change affects the authorization strategy.

> [!CAUTION]
> Never grant permissions directly in controller code without updating this matrix first. This matrix is the source of truth — code must reflect it, not the other way around.

---

_Document maintained by the Security Agent. All authorization decisions must trace back to this matrix._
