# Primary web app

This is the existing repository's primary `apps/web`, repaired with the delivered Arabic RTL frontend and tested boundaries. It is not a separate application or repository. UI copy remains Arabic; development documentation is English.

## Run

From the repository root, use Node22.12+ and pnpm12.21.0:

```bat
pnpm install --frozen-lockfile
pnpm --filter @ana-orthodox/coptic-calendar build
pnpm --filter @ana-orthodox/web dev
```

Open http://localhost:3000. No database, secrets or environment file is needed for the current local-only frontend. Use `pnpm.cmd` if Windows PowerShell blocks scripts. Do not use npm in a nested package because local dependencies use the workspace protocol.

## Structure

- `src/app`: Next.js route wrappers, metadata, error and not-found handling.
- `src/features`: existing delivered section UI grouped by domain.
- `src/shared/ui`, `theme`, `lib`: common UI, Material3 theme and defensive browser-storage boundary.
- `src/domain`: reading identifiers and adapter for the retained shared Coptic calendar engine.
- `src/data`: validated local favorites repository and future reading port. The reading port returns unavailable and is not presented as a live content service.
- `src/context/auth-context.tsx`, `src/lib/api-client.ts`: original repository infrastructure retained at its original paths, not wired into the new UI yet.
- `tests/unit`, `tests/e2e`: storage/contracts/calendar and Chromium route/interaction/visual checks.

Lint enforces import boundaries: domain cannot import React/UI/data, shared cannot import features/data. The documented `set-state-in-effect` exception is limited to restoring device preferences at mount. Hook ordering/dependency rules remain enabled.

## Check

```bat
pnpm --filter @ana-orthodox/web lint
pnpm --filter @ana-orthodox/web build
pnpm --filter @ana-orthodox/web type-check
pnpm --filter @ana-orthodox/web test
pnpm --filter @ana-orthodox/web exec playwright install chromium
pnpm --filter @ana-orthodox/web test:e2e
```

Build includes the shared calendar build. Browser checks start a production server on port3000; close old servers first. `CHROME_BIN` can select an installed Chrome executable instead of Playwright's Chromium. CI uses installed Chromium.

## Integration and limits

See [foundation changes](../../docs/architecture/FOUNDATION_CHANGES.md) for the preserved/replaced file groups and reasons. All21 delivered routes preserve their Arabic RTL identity. Legacy `/bible`, `/katameros`, `/hymns`, `/library` redirect to section equivalents instead of disappearing. Original public assets are preserved. The old service worker is not registered by the promoted frontend, so full offline/PWA readiness is not claimed.

No live authentication, synchronization, content ingestion, real audio download or push notification delivery is connected. Existing coming-soon/unavailable states remain honest. Local favorites preserve storage keys, validate input and report save failures. Compass listeners are cleaned up; real sensor accuracy still requires physical hardware testing. Calendar conversion uses the existing shared package; fixed-occasion metadata is not a newly approved church content source.

Tests cover Chromium, not Safari/Firefox or real-device certification. Before integration, map API DTOs through adapters, test loading/error/auth flows and decide offline behavior explicitly. Review the draft PR and CI before any merge or deployment.
