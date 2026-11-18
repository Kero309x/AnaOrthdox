# Route Catalog

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Document**     | ROUTE_CATALOG.md                                             |
| **Purpose**      | Canonical registry of all planned application routes         |
| **Scope**        | apps/web — Next.js 15 App Router                             |
| **Status**       | PLANNING                                                     |
| **Last Updated** | 2026-11-17                                                   |
| **Owner**        | Frontend Team                                                |
| **Related**      | SCREEN_CATALOG.md, COMPONENT_CATALOG.md, FEATURE_REGISTRY.md |

---

## Overview

This catalog documents every planned route in the Ana Orthodox web application (`apps/web`). Routes follow Next.js 15 App Router file-system conventions. Dynamic segments use `[param]` notation. All routes are **RTL-first** (`dir="rtl"`, `lang="ar"`).

> [!NOTE]
> Phase 0 status: No routes exist yet. This catalog is the planning baseline. All entries are PLANNED.

---

## Route Table

| Route ID     | Path                              | Description                                         | Domain              | Component                  | Auth Required     | Status  |
| ------------ | --------------------------------- | --------------------------------------------------- | ------------------- | -------------------------- | ----------------- | ------- |
| RT-HOME-001  | `/`                               | Home / Landing page — featured content, quick links | Home                | `HomePage`                 | No                | PLANNED |
| RT-BIBLE-001 | `/bible`                          | Bible home — book list / search                     | Bible               | `BibleHomePage`            | No                | PLANNED |
| RT-BIBLE-002 | `/bible/[book]/[chapter]`         | Bible chapter reader                                | Bible               | `BibleChapterPage`         | No                | PLANNED |
| RT-BIBLE-003 | `/bible/[book]/[chapter]/[verse]` | Bible verse deep-link                               | Bible               | `BibleVersePage`           | No                | PLANNED |
| RT-COMM-001  | `/commentary`                     | Commentary index — book list                        | Commentary          | `CommentaryHomePage`       | No                | PLANNED |
| RT-COMM-002  | `/commentary/[book]/[chapter]`    | Commentary for a specific chapter                   | Commentary          | `CommentaryChapterPage`    | No                | PLANNED |
| RT-KATA-001  | `/katameros`                      | Katameros home — today's reading                    | Katameros           | `KatamerosHomePage`        | No                | PLANNED |
| RT-KATA-002  | `/katameros/[date]`               | Katameros for a specific date (YYYY-MM-DD)          | Katameros           | `KatamerosDatePage`        | No                | PLANNED |
| RT-CAL-001   | `/calendar`                       | Calendar hub — defaults to liturgical               | Liturgical Calendar | `CalendarHubPage`          | No                | PLANNED |
| RT-CAL-002   | `/calendar/liturgical`            | Liturgical calendar view                            | Liturgical Calendar | `LiturgicalCalendarPage`   | No                | PLANNED |
| RT-CAL-003   | `/calendar/coptic`                | Coptic calendar converter & view                    | Coptic Calendar     | `CopticCalendarPage`       | No                | PLANNED |
| RT-HYMN-001  | `/hymns`                          | Hymns home — categories                             | Hymns               | `HymnsHomePage`            | No                | PLANNED |
| RT-HYMN-002  | `/hymns/[category]`               | Hymns by category (e.g. vespers, midnight, liturgy) | Hymns               | `HymnCategoryPage`         | No                | PLANNED |
| RT-HYMN-003  | `/hymns/[id]`                     | Individual hymn viewer / player                     | Hymns               | `HymnDetailPage`           | No                | PLANNED |
| RT-AGPE-001  | `/agpeya`                         | Agpeya home — select canonical hour                 | Agpeya / Prayers    | `AgpeyaHomePage`           | No                | PLANNED |
| RT-AGPE-002  | `/agpeya/[hour]`                  | Specific canonical hour prayer text                 | Agpeya / Prayers    | `AgpeyaHourPage`           | No                | PLANNED |
| RT-SYNA-001  | `/synaxarium`                     | Synaxarium home — today's saints                    | Synaxarium          | `SynaxariumHomePage`       | No                | PLANNED |
| RT-SYNA-002  | `/synaxarium/[date]`              | Synaxarium for specific date                        | Synaxarium          | `SynaxariumDatePage`       | No                | PLANNED |
| RT-FATH-001  | `/fathers`                        | Church Fathers index                                | Church Fathers      | `FathersIndexPage`         | No                | PLANNED |
| RT-FATH-002  | `/fathers/[id]`                   | Individual Church Father profile & writings         | Church Fathers      | `FatherDetailPage`         | No                | PLANNED |
| RT-PATR-001  | `/patristic`                      | Patristic Library index                             | Patristic Library   | `PatristicIndexPage`       | No                | PLANNED |
| RT-PATR-002  | `/patristic/[id]`                 | Individual patristic text / work                    | Patristic Library   | `PatristicDetailPage`      | No                | PLANNED |
| RT-HIST-001  | `/history`                        | Church History index                                | Church History      | `ChurchHistoryIndexPage`   | No                | PLANNED |
| RT-HIST-002  | `/history/[id]`                   | Church History article / event                      | Church History      | `ChurchHistoryDetailPage`  | No                | PLANNED |
| RT-HERI-001  | `/heritage`                       | Coptic Heritage index                               | Coptic Heritage     | `CopticHeritageIndexPage`  | No                | PLANNED |
| RT-HERI-002  | `/heritage/[id]`                  | Coptic Heritage item detail                         | Coptic Heritage     | `CopticHeritageDetailPage` | No                | PLANNED |
| RT-CHUR-001  | `/churches`                       | Churches directory — list & map                     | Churches Directory  | `ChurchesIndexPage`        | No                | PLANNED |
| RT-CHUR-002  | `/churches/[id]`                  | Individual church profile                           | Churches Directory  | `ChurchDetailPage`         | No                | PLANNED |
| RT-MONO-001  | `/monasteries`                    | Monasteries directory                               | Monasteries         | `MonasteriesIndexPage`     | No                | PLANNED |
| RT-MONO-002  | `/monasteries/[id]`               | Individual monastery profile                        | Monasteries         | `MonasteryDetailPage`      | No                | PLANNED |
| RT-PLAN-001  | `/plans`                          | Reading plans list (user's enrolled + available)    | Reading Plans       | `ReadingPlansPage`         | **Yes**           | PLANNED |
| RT-PLAN-002  | `/plans/[id]`                     | Individual reading plan progress                    | Reading Plans       | `ReadingPlanDetailPage`    | **Yes**           | PLANNED |
| RT-BOOK-001  | `/bookmarks`                      | User's bookmarked verses / content                  | Bookmarks / Notes   | `BookmarksPage`            | **Yes**           | PLANNED |
| RT-NOTE-001  | `/notes`                          | User's notes — list & editor                        | Bookmarks / Notes   | `NotesPage`                | **Yes**           | PLANNED |
| RT-SRCH-001  | `/search`                         | Search home — empty state                           | Search              | `SearchPage`               | No                | PLANNED |
| RT-SRCH-002  | `/search?q=[query]`               | Search results for query                            | Search              | `SearchResultsPage`        | No                | PLANNED |
| RT-EVNT-001  | `/events`                         | Upcoming Coptic events & feasts                     | Events              | `EventsIndexPage`          | No                | PLANNED |
| RT-EVNT-002  | `/events/[id]`                    | Individual event detail                             | Events              | `EventDetailPage`          | No                | PLANNED |
| RT-ADMN-001  | `/admin`                          | Admin dashboard                                     | Administration      | `AdminDashboardPage`       | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-002  | `/admin/users`                    | User management                                     | Administration      | `AdminUsersPage`           | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-003  | `/admin/content`                  | Content management index                            | Administration      | `AdminContentPage`         | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-004  | `/admin/content/bible`            | Bible content management                            | Administration      | `AdminBiblePage`           | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-005  | `/admin/content/hymns`            | Hymns content management                            | Administration      | `AdminHymnsPage`           | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-006  | `/admin/content/synaxarium`       | Synaxarium content management                       | Administration      | `AdminSynaxariumPage`      | **Yes (EDITOR+)** | PLANNED |
| RT-ADMN-007  | `/admin/settings`                 | Platform settings                                   | Administration      | `AdminSettingsPage`        | **Yes (ADMIN)**   | PLANNED |
| RT-AUTH-001  | `/auth/login`                     | Login page                                          | Authentication      | `LoginPage`                | No                | PLANNED |
| RT-AUTH-002  | `/auth/register`                  | User registration                                   | Authentication      | `RegisterPage`             | No                | PLANNED |
| RT-AUTH-003  | `/auth/forgot-password`           | Forgot / reset password flow                        | Authentication      | `ForgotPasswordPage`       | No                | PLANNED |

---

## Route Conventions

### Dynamic Segments

| Segment      | Type               | Example                                            | Validation                  |
| ------------ | ------------------ | -------------------------------------------------- | --------------------------- |
| `[book]`     | String slug        | `genesis`, `matthew`                               | Validated against book list |
| `[chapter]`  | Integer string     | `1`, `22`                                          | Min: 1, max per book        |
| `[verse]`    | Integer string     | `1`, `16`                                          | Min: 1, max per chapter     |
| `[date]`     | ISO 8601 date      | `2026-11-17`                                       | Valid date, range-checked   |
| `[id]`       | UUID or slug       | `uuid-v4` or `kebab-case`                          | Server-validated            |
| `[hour]`     | String slug        | `prime`, `terce`, `sext`                           | Enum of Agpeya hours        |
| `[category]` | String slug        | `vespers`, `midnight`                              | Enum of hymn categories     |
| `[query]`    | URL-encoded string | `%D8%A7%D9%84%D9%85%D8%B2%D8%A7%D9%85%D9%8A%D8%B1` | Sanitized on render         |

### Agpeya Hours Enum

`prime` | `terce` | `sext` | `none` | `vespers` | `compline` | `midnight` | `lauds`

### Auth Roles (ascending privilege)

`GUEST` → `USER` → `EDITOR` → `ADMIN`

### Status Legend

| Status      | Meaning                       |
| ----------- | ----------------------------- |
| PLANNED     | Designed, not yet implemented |
| IN PROGRESS | Active development            |
| DONE        | Merged to main, deployed      |
| DEPRECATED  | Removed or replaced           |

---

## Next.js File-System Mapping (Planned)

```
apps/web/src/app/
├── page.tsx                                    # RT-HOME-001
├── bible/
│   ├── page.tsx                                # RT-BIBLE-001
│   └── [book]/
│       └── [chapter]/
│           ├── page.tsx                        # RT-BIBLE-002
│           └── [verse]/
│               └── page.tsx                    # RT-BIBLE-003
├── commentary/
│   ├── page.tsx                                # RT-COMM-001
│   └── [book]/[chapter]/page.tsx              # RT-COMM-002
├── katameros/
│   ├── page.tsx                                # RT-KATA-001
│   └── [date]/page.tsx                        # RT-KATA-002
├── calendar/
│   ├── page.tsx                                # RT-CAL-001
│   ├── liturgical/page.tsx                    # RT-CAL-002
│   └── coptic/page.tsx                        # RT-CAL-003
├── hymns/
│   ├── page.tsx                                # RT-HYMN-001
│   ├── [category]/page.tsx                    # RT-HYMN-002
│   └── [id]/page.tsx                          # RT-HYMN-003
├── agpeya/
│   ├── page.tsx                                # RT-AGPE-001
│   └── [hour]/page.tsx                        # RT-AGPE-002
├── synaxarium/
│   ├── page.tsx                                # RT-SYNA-001
│   └── [date]/page.tsx                        # RT-SYNA-002
├── fathers/
│   ├── page.tsx                                # RT-FATH-001
│   └── [id]/page.tsx                          # RT-FATH-002
├── patristic/
│   ├── page.tsx                                # RT-PATR-001
│   └── [id]/page.tsx                          # RT-PATR-002
├── history/
│   ├── page.tsx                                # RT-HIST-001
│   └── [id]/page.tsx                          # RT-HIST-002
├── heritage/
│   ├── page.tsx                                # RT-HERI-001
│   └── [id]/page.tsx                          # RT-HERI-002
├── churches/
│   ├── page.tsx                                # RT-CHUR-001
│   └── [id]/page.tsx                          # RT-CHUR-002
├── monasteries/
│   ├── page.tsx                                # RT-MONO-001
│   └── [id]/page.tsx                          # RT-MONO-002
├── plans/
│   ├── page.tsx                                # RT-PLAN-001
│   └── [id]/page.tsx                          # RT-PLAN-002
├── bookmarks/
│   └── page.tsx                                # RT-BOOK-001
├── notes/
│   └── page.tsx                                # RT-NOTE-001
├── search/
│   └── page.tsx                                # RT-SRCH-001 + RT-SRCH-002 (useSearchParams)
├── events/
│   ├── page.tsx                                # RT-EVNT-001
│   └── [id]/page.tsx                          # RT-EVNT-002
├── admin/
│   ├── layout.tsx                             # Admin layout (auth guard EDITOR+)
│   ├── page.tsx                                # RT-ADMN-001
│   ├── users/page.tsx                         # RT-ADMN-002
│   ├── content/
│   │   ├── page.tsx                            # RT-ADMN-003
│   │   ├── bible/page.tsx                     # RT-ADMN-004
│   │   ├── hymns/page.tsx                     # RT-ADMN-005
│   │   └── synaxarium/page.tsx                # RT-ADMN-006
│   └── settings/page.tsx                      # RT-ADMN-007
└── auth/
    ├── login/page.tsx                         # RT-AUTH-001
    ├── register/page.tsx                      # RT-AUTH-002
    └── forgot-password/page.tsx               # RT-AUTH-003
```
