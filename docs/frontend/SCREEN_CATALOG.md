# Screen Catalog

| Field            | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| **Document**     | SCREEN_CATALOG.md                                              |
| **Purpose**      | Canonical registry of all planned application screens          |
| **Scope**        | apps/web — All UI screens                                      |
| **Status**       | PLANNING                                                       |
| **Last Updated** | 2026-11-17                                                     |
| **Owner**        | Frontend Team                                                  |
| **Related**      | ROUTE_CATALOG.md, COMPONENT_CATALOG.md, INTERACTION_CATALOG.md |

---

## Overview

This catalog enumerates all planned screens in the Ana Orthodox application. Each screen entry defines its identity, route linkage, domain ownership, expected loading/empty/error states, authentication requirement, and RTL verification status.

> [!IMPORTANT]
> All screens are **RTL-first**. `dir="rtl"` and `lang="ar"` are set on the root `<html>` element. RTL Verified = PENDING for all entries until visual QA is completed on a real device.

> [!NOTE]
> Phase 0 status: No screens exist yet. All entries are PLANNED.

---

## Screen Table

| Screen ID     | Name (Arabic / English)              | Route                             | Domain              | Loading State          | Empty State                                 | Error State                 | Auth Required     | RTL Verified | Status  |
| ------------- | ------------------------------------ | --------------------------------- | ------------------- | ---------------------- | ------------------------------------------- | --------------------------- | ----------------- | ------------ | ------- |
| SCR-HOME-001  | الرئيسية / Home                      | `/`                               | Home                | Skeleton cards         | —                                           | Generic error boundary      | No                | PENDING      | PLANNED |
| SCR-BIBLE-001 | الكتاب المقدس / Bible Home           | `/bible`                          | Bible               | Skeleton list          | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-BIBLE-002 | قراءة الإصحاح / Bible Chapter Reader | `/bible/[book]/[chapter]`         | Bible               | Skeleton text lines    | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-BIBLE-003 | الآية / Bible Verse Deep-link        | `/bible/[book]/[chapter]/[verse]` | Bible               | Skeleton paragraph     | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-COMM-001  | شرح الكتاب المقدس / Commentary Home  | `/commentary`                     | Commentary          | Skeleton list          | No commentary yet — coming soon             | Retry button                | No                | PENDING      | PLANNED |
| SCR-COMM-002  | الشرح / Commentary Chapter           | `/commentary/[book]/[chapter]`    | Commentary          | Skeleton text          | No commentary for this chapter              | Retry + report              | No                | PENDING      | PLANNED |
| SCR-KATA-001  | الكتامارس / Katameros Home           | `/katameros`                      | Katameros           | Skeleton card          | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-KATA-002  | قراءة اليوم / Katameros Date         | `/katameros/[date]`               | Katameros           | Skeleton sections      | No reading for this date                    | Retry button                | No                | PENDING      | PLANNED |
| SCR-CAL-001   | التقويم / Calendar Hub               | `/calendar`                       | Liturgical Calendar | Skeleton calendar      | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-CAL-002   | التقويم الطقسي / Liturgical Calendar | `/calendar/liturgical`            | Liturgical Calendar | Skeleton month grid    | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-CAL-003   | التقويم القبطي / Coptic Calendar     | `/calendar/coptic`                | Coptic Calendar     | Skeleton converter     | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-HYMN-001  | الألحان / Hymns Home                 | `/hymns`                          | Hymns               | Skeleton category grid | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-HYMN-002  | ألحان الفئة / Hymns by Category      | `/hymns/[category]`               | Hymns               | Skeleton list          | No hymns in this category                   | Retry button                | No                | PENDING      | PLANNED |
| SCR-HYMN-003  | اللحن / Hymn Detail & Player         | `/hymns/[id]`                     | Hymns               | Skeleton text + player | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-AGPE-001  | الأجبية / Agpeya Home                | `/agpeya`                         | Agpeya / Prayers    | Skeleton hour grid     | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-AGPE-002  | صلاة الساعة / Agpeya Hour            | `/agpeya/[hour]`                  | Agpeya / Prayers    | Skeleton prayer text   | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-SYNA-001  | السنكسار / Synaxarium Home           | `/synaxarium`                     | Synaxarium          | Skeleton saint card    | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-SYNA-002  | قديسو اليوم / Synaxarium Date        | `/synaxarium/[date]`              | Synaxarium          | Skeleton saint list    | No saints for this date                     | Retry button                | No                | PENDING      | PLANNED |
| SCR-FATH-001  | آباء الكنيسة / Church Fathers Index  | `/fathers`                        | Church Fathers      | Skeleton list          | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-FATH-002  | الأب / Father Profile                | `/fathers/[id]`                   | Church Fathers      | Skeleton profile       | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-PATR-001  | المكتبة الآبائية / Patristic Library | `/patristic`                      | Patristic Library   | Skeleton list          | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-PATR-002  | النص الآبائي / Patristic Text        | `/patristic/[id]`                 | Patristic Library   | Skeleton reader        | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-HIST-001  | تاريخ الكنيسة / Church History       | `/history`                        | Church History      | Skeleton timeline      | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-HIST-002  | الحدث التاريخي / History Article     | `/history/[id]`                   | Church History      | Skeleton article       | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-HERI-001  | التراث القبطي / Coptic Heritage      | `/heritage`                       | Coptic Heritage     | Skeleton gallery grid  | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-HERI-002  | التراث / Heritage Item               | `/heritage/[id]`                  | Coptic Heritage     | Skeleton detail        | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-CHUR-001  | دليل الكنائس / Churches Directory    | `/churches`                       | Churches Directory  | Skeleton list + map    | No churches found                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-CHUR-002  | الكنيسة / Church Profile             | `/churches/[id]`                  | Churches Directory  | Skeleton profile       | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-MONO-001  | الأديرة / Monasteries Directory      | `/monasteries`                    | Monasteries         | Skeleton list          | —                                           | Retry button                | No                | PENDING      | PLANNED |
| SCR-MONO-002  | الدير / Monastery Profile            | `/monasteries/[id]`               | Monasteries         | Skeleton profile       | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-PLAN-001  | خطط القراءة / Reading Plans          | `/plans`                          | Reading Plans       | Skeleton plan cards    | No plans enrolled — browse available        | Retry button                | **Yes**           | PENDING      | PLANNED |
| SCR-PLAN-002  | خطة القراءة / Reading Plan Detail    | `/plans/[id]`                     | Reading Plans       | Skeleton progress view | —                                           | Retry + report              | **Yes**           | PENDING      | PLANNED |
| SCR-BOOK-001  | المفضلة / Bookmarks                  | `/bookmarks`                      | Bookmarks / Notes   | Skeleton list          | No bookmarks yet — start reading            | Retry button                | **Yes**           | PENDING      | PLANNED |
| SCR-NOTE-001  | ملاحظاتي / Notes                     | `/notes`                          | Bookmarks / Notes   | Skeleton note cards    | No notes yet — create one                   | Retry button                | **Yes**           | PENDING      | PLANNED |
| SCR-SRCH-001  | البحث / Search                       | `/search`                         | Search              | —                      | Enter a search term                         | Retry button                | No                | PENDING      | PLANNED |
| SCR-SRCH-002  | نتائج البحث / Search Results         | `/search?q=`                      | Search              | Skeleton result list   | No results for "…" — try different keywords | Retry button                | No                | PENDING      | PLANNED |
| SCR-EVNT-001  | الأحداث / Events Index               | `/events`                         | Events              | Skeleton event cards   | No upcoming events                          | Retry button                | No                | PENDING      | PLANNED |
| SCR-EVNT-002  | الحدث / Event Detail                 | `/events/[id]`                    | Events              | Skeleton event detail  | —                                           | Retry + report              | No                | PENDING      | PLANNED |
| SCR-ADMN-001  | لوحة الإدارة / Admin Dashboard       | `/admin`                          | Administration      | Skeleton stat cards    | —                                           | Retry button                | **Yes (EDITOR+)** | PENDING      | PLANNED |
| SCR-ADMN-002  | إدارة المستخدمين / User Management   | `/admin/users`                    | Administration      | Skeleton table         | No users found                              | Retry button                | **Yes (EDITOR+)** | PENDING      | PLANNED |
| SCR-ADMN-003  | إدارة المحتوى / Content Management   | `/admin/content`                  | Administration      | Skeleton list          | —                                           | Retry button                | **Yes (EDITOR+)** | PENDING      | PLANNED |
| SCR-ADMN-004  | الإعدادات / Admin Settings           | `/admin/settings`                 | Administration      | Skeleton form          | —                                           | Retry button                | **Yes (ADMIN)**   | PENDING      | PLANNED |
| SCR-AUTH-001  | تسجيل الدخول / Login                 | `/auth/login`                     | Authentication      | —                      | —                                           | Invalid credentials message | No                | PENDING      | PLANNED |
| SCR-AUTH-002  | إنشاء حساب / Register                | `/auth/register`                  | Authentication      | —                      | —                                           | Validation errors inline    | No                | PENDING      | PLANNED |
| SCR-AUTH-003  | نسيت كلمة المرور / Forgot Password   | `/auth/forgot-password`           | Authentication      | —                      | —                                           | Email not found message     | No                | PENDING      | PLANNED |

---

## State Specifications

### Loading States

All loading states use **skeleton UI** (not spinners) for perceived performance. Skeletons match the layout of the populated content — same number of rows, same heights, same column widths.

```
Pattern: <ComponentName>Skeleton
Example: <BibleChapterSkeleton /> mirrors <BibleChapterContent />
```

### Empty States

Empty states include:

- An illustrative icon or SVG (domain-relevant)
- Arabic headline: explains why empty
- Arabic sub-text: actionable guidance
- Optional CTA button (e.g. "ابدأ القراءة")

### Error States

Two tiers:

1. **Inline error** (component-level): retry button + short Arabic message
2. **Page-level error boundary**: full-page Arabic error message, retry, home link

---

## RTL Verification Checklist (per screen)

When implementing each screen, verify:

- [ ] Text reads right-to-left ✓
- [ ] Navigation icons face the correct direction
- [ ] Form fields right-aligned with label above
- [ ] Lists/cards stack from right
- [ ] Progress bars fill right-to-left
- [ ] Pagination controls: next is on the left (RTL)
- [ ] No hardcoded `left`/`right` in CSS — use `start`/`end` or Tailwind RTL modifiers
- [ ] Tested in Chrome, Firefox, Safari with `dir="rtl"`

---

## Status Legend

| Status      | Meaning                         |
| ----------- | ------------------------------- |
| PLANNED     | Designed, not yet implemented   |
| IN PROGRESS | Active development              |
| DONE        | Merged, visually QA'd on device |
| DEPRECATED  | Removed or replaced             |

| RTL Verified | Meaning                                 |
| ------------ | --------------------------------------- |
| PENDING      | Not yet tested in RTL                   |
| PASS         | Visually verified RTL-correct on device |
| FAIL         | RTL issue found — see linked issue      |
