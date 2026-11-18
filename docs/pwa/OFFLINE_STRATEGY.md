# OFFLINE_STRATEGY.md

**Purpose:** Granular offline availability rules, data storage quotas, and sync strategies per product domain.  
**Scope:** Client-side CacheStorage, IndexedDB, and Background Sync  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** PWA Agent  
**Related Documents:** PWA_ARCHITECTURE.md, CACHING_POLICY.md

---

## 1. Domain-Specific Offline Availability Matrix

| Domain                      | Offline Availability      | Primary Storage                | Caching Strategy                                          | Max Size / Limits |
| --------------------------- | ------------------------- | ------------------------------ | --------------------------------------------------------- | ----------------- |
| **Holy Bible (Full Text)**  | **100% Full Offline**     | IndexedDB (`bible_store`)      | Pre-cache on initial install / on-demand book download    | ~12 MB total text |
| **Agpeya (Book of Hours)**  | **100% Full Offline**     | CacheStorage & IDB             | Pre-cache at installation                                 | ~1.5 MB           |
| **Katameros (Readings)**    | **Current Month Offline** | IndexedDB (`katameros_store`)  | Stale-While-Revalidate with prefetch for current month    | ~4 MB             |
| **Synaxarium (Saints)**     | **Current Month Offline** | IndexedDB (`synaxarium_store`) | Stale-While-Revalidate with prefetch for current month    | ~8 MB             |
| **Coptic & Liturgical Cal** | **Full Year Offline**     | IndexedDB (`calendar_store`)   | Pre-cache current liturgical year                         | ~1 MB             |
| **Hymns (Lyrics Text)**     | **Full Offline**          | IndexedDB (`hymns_text`)       | Cache-First                                               | ~3 MB             |
| **Hymns (Audio Tracks)**    | **User Selected Only**    | CacheStorage / Origin URL      | User taps "تنزيل للاستماع دون إنترنت" (Explicit Download) | Max 250 MB quota  |
| **User Bookmarks & Notes**  | **Read & Write Offline**  | IndexedDB (`user_sync_queue`)  | Optimistic local write + Background Sync Queue            | ~5 MB             |
| **Churches Directory**      | **Cached Views Only**     | CacheStorage                   | Network-First, fallback to last viewed                    | ~2 MB             |
| **Admin & Editorial**       | **Online Required**       | None                           | Network-Only (no offline caching of admin write flows)    | 0 MB              |

---

## 2. Offline Mutation Sync Protocol (Bookmarks / Notes)

1. **Network Disconnected:** User creates a bookmark or writes a note.
2. **Local Commit:** Action stored immediately in IndexedDB `user_sync_queue` with status `PENDING_SYNC` and temporary client UUID.
3. **UI Feedback:** Note displays subtle sync badge ("في انتظار الاتصال بالإنترنت").
4. **Reconnection Handler:** Browser `online` event or Workbox Background Sync API triggers queue flush:
   - Items dispatched sequentially to NestJS API.
   - Server responds with permanent database UUID and timestamp.
   - Local records updated to `SYNCED`.
