# Local demo features and backend integration boundaries

Status: local working tree on top of review head 98c7f65. Nothing here is pushed or deployed.

## What is real, what is a demo

| Area | State |
| --- | --- |
| Audio player | Real `<audio>` playback of a generated demo WAV (`src/shared/lib/synth.ts`). Seek, speed, repeat, sleep timer, favorite, `.wav` download. Catalog items are labelled "عينة تجريبية". |
| Video watch | Real `<video>` on `public/demo/demo-video.mp4` (8s generated gradient). Duration is read from the file. Position stored as a fraction. Skeleton while metadata loads, error state if the file fails. |
| Books, studies, kids, games | Local state (favorites, bookmarks, notes, progress, scores). Content is neutral demo text. No religious text was invented. |
| Quiz | 15 questions, sources in `quiz-sources.md`. |
| Reminders | Foreground only. Needs notification permission, never prompts on its own, handles denied. No background delivery. |
| Church detail | Maps directions link plus user-entered address, phone and mass times. |
| Auth (sign in, register, forgot) | Full UI states against a DEMO adapter. No credential is stored or sent, no session is opened. |
| Account sync | Exercisable simulation (`SyncDemo`): success, slow, failure with retry. |

## Integration boundary

- Auth: `src/shared/api/authPort.ts` defines `AuthPort` (signIn, register, requestPasswordReset) and the error codes the UI already renders: invalid_credentials, email_taken, network, rate_limited. Replace `authPort` with a real adapter. A real session/token layer, redirect after sign in, email verification and password reset landing page are NOT built yet and need the API contract.
- Content (audio, video, books, studies, kids): `src/data/catalog.ts` is the replaceable source. Real media would need URLs, duration and licensing per item.
- Local stored values all use the `ana.` prefix via `src/shared/lib/useStored.ts`; backup export and "clear local data" cover them.

## Known gaps

- Church detail pixels were not captured because the church list is empty by default (user adds churches).
- "كلمات متقاطعة" is a real crossword grid (Coptic month names, 7 entries, generated and checked by script). "ألغاز الكلمات" is a separate clue-list puzzle.
- Prayer card caption for Prime was changed to "حوالي ٦ صباحاً" to match sources.
- No offline library, push, or physical-device PWA certification.

## Auth contract status (derived from apps/api, 19 Nov 2026)

Exists in the backend: POST /auth/register (email, password, fullName), POST /auth/login, POST /auth/refresh, POST /auth/logout, POST /auth/logout-all, GET /auth/me, GET /auth/sessions, DELETE /auth/sessions/:id, profile update.
Not in the backend yet, so the shapes in `authPort.ts` are provisional: email verification, password reset request, password reset with token. Token expiry is modelled as `token_expired`.

Demo routes (all labelled as simulation, no session, no password stored):
`/account/login` (supports `?expired=1` banner and a same-origin `?next=` path), `/account/register`, `/account/forgot`, `/account/verify-email?token=`, `/account/reset?token=`, `/account/sessions`. Use `token=expired` to see the expired-link state.
Unresolved until the API contract exists: token storage and refresh, cookie vs bearer handling, redirect after real sign in, 401 handling in the API client, verification and reset endpoints, rate-limit response shape.
