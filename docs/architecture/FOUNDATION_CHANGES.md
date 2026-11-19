# Changes to the existing project

Review baseline: main9842b2fa1ffbcaad174f9c54b41bec7808868228. This work changes the existing monorepo and its primary `apps/web`; it creates no second app or repository. The review branch is only an ordinary Git review boundary.

## Frontend repair

The baseline had null section routes and coming-soon home/account screens, while the separately delivered frontend had the intended21-page design. The intended UI is integrated into `apps/web`, not left under a competing preview directory.

- Replaced primary route bodies with thin wrappers around feature components.
- Replaced the old shell/theme/provider implementation with the delivered shared chrome/theme, so two global theme and navigation systems are not mounted together. Superseded files: `src/components/app-shell.tsx`, `providers.tsx`, `src/context/theme-context.tsx`, `m3-tokens.json`, and unused custom-element declarations. Their history remains in Git.
- Retained original `src/context/auth-context.tsx`, `src/lib/api-client.ts`, existing backend/shared packages and public assets unchanged. AuthProvider is deliberately not mounted until real auth integration is reviewed.
- Retained old section URLs through redirects. No backend domain is deleted by a frontend redirect.
- Split feature UI, shared UI/theme/storage, calendar domain adapter and data contracts. No extra generic framework was added.
- Preserved local preference/favorites keys. Added validation, corrupt-storage handling and honest favorite save failures. Fixed320px filter overflow and compass cleanup.
- No service-worker registration was copied from an old build. Offline behavior remains a planned integration decision.

## Backend foundation

Existing NestJS services and Prisma schema remain. Central config checks reject unsafe production setup and require a live production DB. Correct sample env keys match the code. The baseline migration creates the existing schema from empty; it must not be applied blindly to existing data.

PostgreSQL18 compose uses the official versioned data-directory layout. Existing volumes require a separate reviewed backup/layout/major-version migration plan. No local or hosted database was changed here.

## Verification repair

API/UI lint now runs ESLint, not echo. API compiled test discovery recursively finds nested suites. Tests depend on their own build to avoid stale compiled results. Frontend tests include unit contracts/storage and a Chromium matrix at320/390/1280px, dark/large font, local favorites, settings, invalid readings and legacy paths.

CI builds before tests, applies migrations only to an isolated PostgreSQL18 test DB, runs auth smoke and browser tests, and retains browser artifacts7days. The local environment lacked a PostgreSQL server, so migration/auth smoke and remote CI are explicitly pending. No security certification or production readiness is implied by unit tests.

Run/setup commands are in the root README and apps/web/README. Development documentation, commit and PR text use English; Arabic RTL UI remains unchanged as the product language.
