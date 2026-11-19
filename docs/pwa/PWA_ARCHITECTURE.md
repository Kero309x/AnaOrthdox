# PWA foundation, v9

Implemented in the existing `apps/web` app. This document reports code state, not user approval.

- Linked Arabic RTL standalone manifest with stable `/` identity and scope.
- Same irregular burgundy/gold cross geometry as `AppMark` and `app/icon.svg`.
- Canonical PNG icons:192/512,512 maskable (central safe area),180 Apple touch,32 favicon and ICO.
- Launch background uses the default cream surface. In-app seed/light/dark choices restore before paint. Browser theme-color follows the displayed surface.
- Installed home-screen icons and the OS launch screen use the canonical brand assets. Theme selection does not promise immediate OS icon/splash changes.
- `/sw.js` registers without a fetch handler. It retires only legacy `ana-orthodox-shell-*` and `ana-orthodox-content-*` caches. No API, auth, private or HTML responses are cached by this worker.
- No push, background sync, offline libraries or guaranteed browser install prompt. Real phone installation is not yet verified.

Local browser tests verify manifest linkage/content, icon responses, worker registration, theme-color changes and network-only cache behavior. Actual OS icon masks/launch rendering require a physical-device test.
