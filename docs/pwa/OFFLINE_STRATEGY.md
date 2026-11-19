# Offline status, v9

The current worker deliberately does not cache responses or intercept requests. It removes only this app's legacy shell/content caches. Pages require a network connection to load. No offline library, scripture download, media download or sync queue is implemented.

Local preferences, profile, game records and church favorites use safe browser localStorage when available. This is device-local persistence, not a guarantee that the application can start offline. Blocked/quota failures are handled without false save success.

A future offline layer needs an explicitly versioned public-asset allowlist, a clear update path, licensed content, date-aware readings and dedicated auth/private-response exclusion tests before enabling caching.
