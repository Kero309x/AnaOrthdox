# PWA_ARCHITECTURE.md

**Purpose:** Comprehensive architectural blueprint for Progressive Web Application (PWA) installation, lifecycle, service workers, and storage.  
**Scope:** Next.js 16 PWA frontend, service worker layer, and browser runtime environments  
**Status:** APPROVED  
**Last Updated:** 2026-11-17  
**Owner:** PWA Agent  
**Related Documents:** OFFLINE_STRATEGY.md, RESPONSIVE_RULES.md, TECHNOLOGY_BASELINE.md

---

## 1. PWA Architectural Strategy

Ana Orthodox is designed first and foremost as an installable, mobile-ergonomic application that operates seamlessly in low-connectivity and offline church environments.

```
+--------------------------------------------------------------+
|                         User Interface                       |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|             Workbox / Service Worker Layer (sw.js)           |
|   +--------------------+  +-------------------------------+   |
|   | Cache-First Policy |  | Stale-While-Revalidate Policy |   |
|   +--------------------+  +-------------------------------+   |
+--------------------------------------------------------------+
          |                                        |
          v                                        v
+-----------------------+              +-----------------------+
|  CacheStorage / IDB   |              |  Origin API / CDN     |
|  (Offline Sacred Text)|              |  (Live Updates)       |
+-----------------------+              +-----------------------+
```

---

## 2. Web App Manifest Specification (`/public/manifest.webmanifest`)

- **Name:** أنا أرثوذكس — Ana Orthodox
- **Short Name:** أنا أرثوذكس
- **Theme Color:** `#145A48` (Emerald Green)
- **Background Color:** `#D7F0E5` (Light Surface)
- **Direction:** `rtl`
- **Language:** `ar`
- **Display:** `standalone`
- **Orientation:** `portrait-primary`
- **Icons Generated from Brand Asset:**
  - `/icons/icon-192.png` (192x192)
  - `/icons/icon-512.png` (512x512)
  - `/icons/icon-maskable.png` (512x512 maskable)
  - `/apple-touch-icon.png` (180x180)
  - `/favicon.ico` (64x64)

---

## 3. Service Worker Strategy (Hardened in Phase 1.1)

- **Partitioned Versioned Caching:**
  - `STATIC_CACHE_NAME = 'ana-orthodox-shell-v1.1'`: Pre-caches app shell (`/`, `/manifest.webmanifest`, `/favicon.ico`, `/apple-touch-icon.png`, `/icons/*`).
  - `DYNAMIC_CACHE_NAME = 'ana-orthodox-content-v1.1'`: Stale-While-Revalidate caching for static scripts, fonts, and public content.
- **Date-Aware Daily Lectionary Caching:** Katameros and Synaxarium daily content requests are cached keyed with the query date parameter to ensure readers visiting on subsequent days receive the correct daily liturgy.
- **Strict Personal & Auth Bypass:**
  - All non-GET requests bypass the service worker cache.
  - Requests containing an `Authorization` header bypass the service worker cache.
  - Routes matching `/account/*`, `/api/v1/auth/*`, `/api/v1/user/*`, and `/api/v1/admin/*` are strictly network-only to prevent caching sensitive personal credentials or tokens.
- **Offline HTML Fallback:** When offline and navigating to an un-cached route, returns the cached `/` app shell gracefully.

---

## 4. Platform Compatibility & iOS WebKit Limitations

- **Android / Chromium:** Full PWA install prompt, background sync, web push support.
- **iOS Safari / WebKit:**
  - User must tap "Add to Home Screen" (`Share -> Add to Home Screen`).
  - Cache quota bounded to ~50MB.
  - Caches purged if PWA is not launched within 7 days.
  - Solution: Sacred texts stored in IndexedDB (`idb`) which enjoys persistent storage quota.
