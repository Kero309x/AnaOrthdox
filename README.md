# أنا أرثوذكس | Ana Orthodox

Arabic RTL web app and NestJS API monorepo. This branch prepares the primary frontend and backend foundations; it is not a connected, content-complete product or a production deployment.

## What is ready

- `apps/web`: 21 delivered frontend routes, Material 3 theme, local preferences and church favorites, calendar adapter, error/not-found states, feature/shared/domain/data boundaries.
- `apps/api`: existing NestJS modules, Prisma PostgreSQL schema, auth/session foundation, new environment validation and baseline migration.
- Shared packages are retained. Original frontend auth context/API client and existing public assets are preserved, but not connected to the new UI yet.
- Legacy `/bible`, `/katameros`, `/hymns`, `/library` routes redirect to the corresponding frontend section. Those redirects do not imply content availability.

## Run the frontend on Windows

Node 22.12+ (tested on22.23.5), pnpm12.21.0. Use Command Prompt; use `pnpm.cmd` if PowerShell blocks scripts.

```bat
corepack enable
corepack prepare pnpm@12.21.0 --activate
pnpm install --frozen-lockfile
pnpm --filter @ana-orthodox/coptic-calendar build
pnpm --filter @ana-orthodox/web dev
```

Open http://localhost:3000. Frontend preview needs no secrets or database. Run commands from this repository root, not from an old ZIP or a nested npm project. See [frontend details](apps/web/README.md).

## Backend local setup, empty development database only

Docker Desktop is required for the following commands. These are setup instructions, not a claim that Docker or PostgreSQL has been exercised in this review.

```bat
copy .env.example .env
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
docker compose up -d postgres redis
pnpm --filter @ana-orthodox/api prisma:generate
```

Prisma CLI reads `DATABASE_URL` from the process environment. In Command Prompt, set it explicitly before migration; match any edited local credentials:

```bat
set DATABASE_URL=postgresql://ana_orthodox:ana_orthodox_secret@localhost:5432/ana_orthodox_dev?schema=public
pnpm --filter @ana-orthodox/api prisma:migrate:deploy
pnpm run build
pnpm --filter @ana-orthodox/api dev
```

API: http://localhost:3001/api/v1/health. OpenAPI: http://localhost:3001/api/docs. Example credentials are local development values, never production credentials. Production refuses missing DB configuration, short/placeholder signing secrets, non-HTTPS CORS origins and an unavailable database.

### Existing data: stop before migration or volume changes

The new baseline creates the schema from empty. Do not apply it blindly to a populated database. Back up and inspect migration history/schema drift first; baselining an existing schema requires a separate reviewed plan. Never use `migrate reset`, `db push --accept-data-loss` or `docker compose down -v` on valuable data.

PostgreSQL18 uses a versioned data folder under `/var/lib/postgresql`; the compose mount is corrected accordingly. An old volume may have a different layout or major version. Do not let compose initialize a second apparent empty database and mistake it for lost data. Review backups and migration first. No existing volume was modified here. Image behavior: https://hub.docker.com/_/postgres .

## Verification

```bat
pnpm run build
pnpm run type-check
pnpm run lint
pnpm run test
pnpm --filter @ana-orthodox/web exec playwright install chromium
pnpm --filter @ana-orthodox/web test:e2e
```

Build comes before tests because the API/shared Node suites run compiled files. API discovery is recursive, not a shell glob that skips nested tests. Browser tests use production port3000; close any old server first. CI performs these checks, then applies migrations to a fresh PostgreSQL18 test database and runs an auth smoke flow. It uploads browser evidence for7days. No paid infrastructure is created.

Local evidence on19 November2026: uncached build/types/lint and unit tests passed; API74, calendar26, shared UI18, validation8, frontend15 tests. Primary frontend147 Chromium cases passed across320/390/1280 widths, including21 light and21 dark/large-font route checks per width. Real PostgreSQL migration/auth smoke and hosted CI remain unverified until actually run. Chromium is not Safari/Firefox or physical-device certification.

## Boundaries

- UI completeness is not content completeness. Reading/audio/video/book screens retain unavailable/coming-soon behavior. No unverified religious text was imported.
- No login, synchronization or live backend calls from the promoted UI. Existing auth code is a foundation, not a security certification.
- No complete offline/PWA claim; no old service worker is activated by this change.
- No production data, secrets, payment, repository settings, merge or deployment is changed by these files.
- [Current status](docs/project/PROJECT_STATUS.md) is authoritative for this branch. Older phase reports are historical and may describe plans or claims not established by this review. Source/rights labels in older content documents still need independent proof.
