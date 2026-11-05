# Frontend architecture audit, target layout and migration plan

Scope: `frontend/` (Next.js 16 App Router, React 19, Mantine 9, TanStack Query 5, Zustand 5, Jest 30). About 4.3k lines in `src/`.
Status: **audit and plan only. No code has been changed.**

## 1. Current state

### 1.1 Structure

```text
src/
  api/apiClient.ts            generic fetch wrapper (only fetch call in the app)
  app/                        routes: auth/, (protected)/{page, folders, folders/[id], videos/[id]}
  app/utils.ts                getInitialVideos (server helper, unused)
  components/                 appShell/AppShell.tsx, ColorSchemeToggle, prompt-template.md
  config/constants.ts         API base URLs
  lib/auth.ts                 server-only getSession()
  providers/QueryProvider.tsx
  shared/api/keys.ts          query keys for ALL features (plus dead music-app keys)
  shared/utils.ts             empty file
  store/                      useToastStore, useVideoPlayerStore (global, but live outside features)
  types/global.types.ts       auth types only
  features/
    auth/     api, query, components, views, utils
    folders/  api, query, hooks, components
    videos/   api, query, store, components, views, utils, __tests__
```

Routes: `/auth`, `/`, `/folders`, `/folders/[id]`, `/videos/[id]`. `proxy.ts` redirects unauthenticated users to `/auth` using only cookie presence. `(protected)/layout.tsx` verifies the session server-side through `getSession()`.

### 1.2 Data flow

```text
Component -> query/useX hook (TanStack) -> features/x/api/*.ts -> api/apiClient.ts -> fetch(/api/*)  (rewritten to Go backend)
                          \-> zustand store (upload queue) -> api functions directly (bypasses the query layer)
Server: layout/page -> lib/auth.getSession -> apiClient (forwards cookies)
Uploads: uploadVideo.ts -> backend (init/part-urls/complete) + XMLHttpRequest PUT direct to storage
```

The `api -> query -> component` layering exists and is reasonably consistent. Problems are in the seams: auth/CSRF handling, error contract, invalidation, state ownership, and cross-feature coupling.

### 1.3 State

| Kind | Where | Notes |
| --- | --- | --- |
| Server state | TanStack Query, 5 min `staleTime`, global `refetchOnWindowFocus: false` | folders, contents, trash, videos, playback url, current user |
| Global client state | Zustand: `store/useToastStore`, `store/useVideoPlayerStore`, `features/videos/store/useUploadStore` | the upload store is queue + side-effects, not just state |
| Local UI state | `useState` heavily in `FolderView` (11 states) and `useFolderUpload` (10 states) | see problems |
| URL state | `useParams` + `useSearchParams` (`id`, `trash`) in `FolderView` | folder id is read from two sources |

### 1.4 API usage

One transport (`apiClient`), 4 API modules: `auth/api/auth.ts`, `folders/api/folders.ts`, `videos/api/videos.ts`, `videos/api/uploadVideo.ts` (+ `uploadParts.ts`, which is tested). All response types are handwritten interfaces cast with `as T`; there is no runtime validation.

## 2. Concrete problems

Severity: **H** = causes bugs or blocks the refactor, **M** = fragility or duplication, **L** = hygiene.

### API client and error handling

1. **H** [src/api/apiClient.ts](../frontend/src/api/apiClient.ts): a `401` returns `null as T` instead of throwing. Every return type silently becomes `T | null` while being typed `T`. Callers compensate ad hoc (`if (!session) throw` in `uploadVideo.ts`; `data === null` in `RequireAuth.tsx`; `urls?.[0]`). Any other 401 (e.g. a folder mutation after the session expires) resolves as success: the mutation `onSuccess` fires, and the UI shows "deleted" toasts.
2. **H** Errors are plain `Error(message)`. No `ApiError` with status/code, so callers cannot distinguish 401/403/409 (the folder `version` field implies optimistic-concurrency conflicts) from network failures.
3. **M** `apiClient` picks `POST` whenever `body` is set and then spreads `customConfig` over it; `Content-Type` is forced even for bodiless calls and `FormData`. A header comment says `src/lib/api-client.ts` (wrong path).
4. **M** `credentials: "include"` is repeated in about 20 call sites instead of being the default; `X-CSRF-Token` from `getCookie("csrf_token")` plus `Content-Type` is hand-copied in `folders.ts` (6x), `videos.ts` (5x, one helper `csrfJsonHeaders` is used 3x, the others inline), and `auth.ts` (1x). A missed copy is a silent CSRF failure. `getCookie` lives in `features/auth/utils.ts` and is imported by folders/videos (cross-feature import of internals).
5. **M** Two near-duplicate server session paths: `lib/auth.ts#getSession` and `app/utils.ts#getInitialVideos` (cookie forwarding done differently in each; the latter is unused).
6. **M** `config/constants.ts` exports `apiUrl` "for backwards compatibility", used by `getVideoThumbnailUrl`, which bypasses `apiClient` base-URL logic (SSR vs. browser).
7. **M** [src/features/folders/api/folders.ts](../frontend/src/features/folders/api/folders.ts) `getFolderContents` embeds a backend-shape normalizer (`item_type: "media"` to `type: "video"`, default `version`, synthesized `video`) inside the API call, untested. `LibraryItemResponse` (all-optional) vs `LibraryItem` shows the contract is unclear. `getTrashItems` returns `LibraryItem[]` without normalizing, so trash and contents can have different shapes.
8. **L** `types/global.types.ts`: `LoginApiResponse.user` has literal types (a real email and UUID hard-coded as types); `userProfileResponse.emailVerified: string`; naming is camelCase-lowercase. Auth types live in a global file, other types are inline in api files.

### Query layer and cache invalidation

9. **H** Query keys are defined in three styles in three places: `shared/api/keys.ts` (videos, auth, plus unused `playlist/search/history/liked` keys from another project), `folders/query/useFolders.ts#folderKeys`, and raw string literals `["videos"]`, `["folders"]`, `["folderContents"]`. `FolderView.tsx` invalidates `["folderContents"]`, which matches **no** query (real key prefix is `["folders","contents",id]`); it works only because `["folders"]` is also invalidated.
10. **H** Invalidation logic is duplicated and scattered: `useFolders.ts` (4 mutations), `FolderView.tsx#deleteVideoMutation`, `VideoItemCard.tsx#deleteMutation`, `GlobalUploadManager.tsx` effect, `useVideos.ts#useUploadVideo`. Folder mutations know about `["videos"]` and video mutations about folders, but only some do. No `useDeleteVideo` hook exists, so two components each define their own `useMutation(deleteVideo)` with different invalidation sets (`VideoItemCard` does not invalidate folders).
11. **M** Components call `useQueryClient`/`useMutation` directly (`FolderView.tsx`, `VideoItemCard.tsx`, `GlobalUploadManager.tsx`): business logic in UI.
12. **M** `useVideos` gates on `useGetCurrentUser()` from another feature and takes `initialData` while the server helper that feeds it is unused. `useGetCurrentUser` has `retry: false` but not `useFolders`/`useFolderContents`, so a failing 5xx retries 3x with backoff.
13. **M** `QueryProvider` has no `mutationCache`/`queryCache` `onError`; each caller toasts (or does not). Errors from queries are never reported (see `docs/LOGGING.md` expectations).

### Components versus logic

14. **H** [FolderView.tsx](../frontend/src/features/folders/components/FolderView.tsx) (457 lines): URL parsing, selection/cut state, rename/create/move/delete flows, trash vs. contents choice, sorting, DnD, toasts, mutations and cache invalidation in one component, 11 `useState`, render-phase state reset. Violates the "extract logic into hooks" rule in `frontend/AGENTS.md`.
15. **H** [useFolderUpload.ts](../frontend/src/features/folders/hooks/useFolderUpload.ts): carries dead state: `uploadProgress` (constant `useState(0)`), `uploadedVideo = null`, `uploadAbortRef` never assigned, `cancelUpload` is a no-op, `uploadVideoMutation` and `moveItemMut` are returned but upload really goes through the store; three redundant `File` states (`uploadFiles`, `uploadFile`, `selectedFile`). Misleading API for the next developer.
16. **M** `FloatingVideoPlayer.tsx` (253 lines), `VideoWatchView.tsx` (172) both implement playback-URL recovery separately (`usePlaybackUrl` + manual retry counters). `VideoWatchView` imports the `getVideo` API function directly instead of a query hook (no `useVideo`; verify usage).
17. **M** `LibraryItemTile.tsx`, `FolderBreadcrumbsHeader.tsx`, `AppShell.tsx` mix view and handlers. `AppShell.tsx` imports two features' components (`FloatingVideoPlayer`, `GlobalUploadManager`) and auth hooks: shared shell depends on feature internals.
18. **L** `Login.tsx` logs the email **and password** with `console.log` (lines 16-17). Security issue; remove regardless of the refactor.
19. **L** `generate.sh` is a scaffold script that overwrites `FloatingVideoPlayer.tsx` with a heredoc: running it silently reverts that component.

### State management

20. **H** [useUploadStore.ts](../frontend/src/features/videos/store/useUploadStore.ts) mixes state with orchestration: it calls `uploadVideo` and `moveLibraryItem` (API layer), runs `setTimeout` scheduling, stores a `File` and `AbortController` in state, and uses `onSuccessCallback` set from a React effect in `GlobalUploadManager` to invalidate the query cache. If the manager is unmounted or the callback is not registered, uploads complete without refreshing the library. The post-upload move failure is only `console.error` (the user is not told the video landed in the root). Task ids use `Math.random`.
21. **M** `store/useVideoPlayerStore.ts` imports the `Video` type from `features/videos/api/videos` (store layer depending on an api module of a feature); it holds a full `Video` snapshot, which goes stale after processing/rename.
22. **M** `store/` at top level holds one feature-specific store (video player) and one truly shared (toast), while `features/videos/store/` holds another: no rule for where stores live.
23. **M** Duplicate state: selected files (3 copies), folder id (`params.id` vs `?id=` query, decoded manually), `targetFolderID` vs `currentFolderID` (in `useFolderUpload` and again as `targetFolderId` + `moveItem` in `FolderView`).

### Boundaries and cross-feature imports

24. **H** There are no feature public APIs (no `index.ts`). Cross-feature internal imports (13 found by grep):
    - `folders` -> `videos/api/videos` (`FolderView`, `LibraryItemTile`), `videos/query/useVideos`, `videos/store/useUploadStore` (`useFolderUpload`)
    - `videos` -> `folders/query/useFolders` (`GlobalUploadManager`), `folders/api/folders` (`useUploadStore`), `auth/query/useAuth` (`useVideos`)
    - `folders`, `videos` -> `auth/utils` (`getCookie`)
    - `components/appShell` -> `videos/components/*`, `auth/query/useAuth`
    - `store/useVideoPlayerStore` -> `videos/api/videos`
    - `folders` <-> `videos` is a **circular dependency** (`folders -> videos/store -> folders/api`).
25. **M** `features/auth/views/AuthView.tsx` is a one-line re-export of `auth-view/AuthView.tsx`: two files with the same name. Inconsistent nesting (`components/login/Login.tsx` vs flat `components/FolderView.tsx`), and mixed naming (`require-auth`, `appShell`, `ColorSchemeToggle`).
26. **L** `shared/utils.ts` empty; `components/prompt-template.md` is documentation inside `src`.

### Dead or unused code (verify before deleting)

27. Appear to have no importers: `VideosList.tsx`, `VideoCard.tsx`, `VideoItemCard.tsx` (only used by `VideosList`), `VideoStatsGrid.tsx`, `VideoViewToggle.tsx`, `UploadVideoForm.tsx`, `useVideos`, `listVideos`, `updateVideo`, `app/utils.ts#getInitialVideos`, unused `shared/api/keys.ts` entries, `useFolders` (used only for breadcrumbs). Deleting them removes a parallel, divergent delete flow (#10).

### Testing

28. Only one unit test file (`videos/__tests__/uploadParts.test.ts`). Untested: `apiClient` (401 semantics), `getFolderContents` normalizer, the upload queue store, folder key/invalidation behavior, `proxy.ts`, `useFolderKeyboardShortcuts`. `test-utils/render.tsx` exists to wrap components. No API mocking tool; tests would need `fetch` mocks.

### Verification gap

29. `package.json#test` runs `typegen`, format, lint, typecheck and jest, while the repo's `verify` runs `build` + `lint` + `format:check` + `test`: lint/format run twice. Not harmful, but slow; leave alone.

## 3. Target architecture

### 3.1 Principles

- **Layers (dependency direction, downward only):** `ui` -> `hooks` -> `services` -> `api` -> `core/http`. `stores` are used by hooks (and read by ui via selectors), never import `api`.
- **Features own their code; `shared/` owns primitives.** A feature may import another feature **only through its `index.ts`**. Shared code never imports from features.
- **Apps' `app/` routes stay thin**: compose a feature `view`, do server-side session checks.
- Keep Mantine-only UI rule from `frontend/AGENTS.md`.

### 3.2 Folder structure

```text
src/
  app/                          routes only (unchanged URLs); import feature views via public index
  core/                         app-wide infrastructure, no domain knowledge
    http/
      httpClient.ts             typed fetch wrapper (replaces api/apiClient.ts)
      ApiError.ts               status, code, message, isUnauthorized, isConflict
      csrf.ts                   getCsrfToken() (moves getCookie here)
      serverFetch.ts            server-only: cookie forwarding helper used by getSession
    config/env.ts               (was config/constants.ts)
    query/
      queryClient.ts            factory with defaults + global error reporting
      QueryProvider.tsx
      invalidation.ts           invalidateLibrary(queryClient): the single place that knows folders+videos
    observability/              error reporting helper wrapping Sentry per docs/LOGGING.md
  shared/
    ui/                         Mantine-based primitives (ConfirmModal, EmptyState, LoadingState, ErrorState, ...)
    hooks/                      useSelection, useDisclosureWithPayload, useKeyboardShortcut
    utils/                      formatters, file name helpers (stripExtension)
    stores/toastStore.ts        truly app-wide stores only
    types/                      Brand/utility types
  features/
    auth/
      api/authApi.ts            raw endpoints, returns DTO types
      model/types.ts            User, Credentials (domain types)
      model/mappers.ts          DTO -> domain (+ zod schemas if adopted)
      hooks/                    useCurrentUser, useLogin, useRegister, useLogout, authKeys
      ui/                       Login, Register, RequireAuth, AuthView
      server/getSession.ts      server-only
      index.ts                  public surface
    folders/
      api/foldersApi.ts, libraryApi.ts
      model/types.ts, mappers.ts (normalizeLibraryItem), keys.ts
      services/libraryActions.ts  pure logic: sort items, breadcrumbs, selection/cut rules
      hooks/                    useLibraryItems, useFolderMutations, useLibraryNavigation (URL), useLibrarySelection, useLibraryActions, useFolderShortcuts
      ui/                       FolderView (thin), LibraryItemTile, Breadcrumbs, modals
      index.ts
    videos/
      api/videosApi.ts, uploadApi.ts, uploadParts.ts
      model/types.ts, keys.ts
      services/uploadPipeline.ts  (uploadVideo + XHR part uploader; no stores, no React)
      stores/uploadQueueStore.ts  pure state + actions (enqueue/progress/status)
      hooks/                    useVideo, usePlaybackUrl, useDeleteVideo, useUploadQueue (runs scheduler, invalidates), useVideoPlayer
      ui/                       VideoWatchView, FloatingVideoPlayer, UploadManager
      index.ts
  layouts/AppShell/             imports features only via index.ts (player, upload manager, auth)
```

### 3.3 Conventions

1. **Types at boundaries:** `api/*` returns DTO types (backend snake_case); `model/mappers.ts` converts to domain types; hooks/ui only see domain types. Start by moving existing interfaces to `model/types.ts` unchanged; add mappers only where the shape is already being normalized (`LibraryItem`).
2. **`httpClient` contract:** never returns `null`; throws `ApiError` on non-2xx (incl. 401); `204` returns `undefined` typed as `void`; default `credentials: "include"`; for non-GET methods automatically attaches `X-CSRF-Token` (opt-out flag); JSON content type only when a `json` body is passed. `getCurrentUser` (and `getSession`) are the only callers that translate 401 to "no user".
3. **Query keys:** one `keys.ts` per feature, hierarchical factory (`folderKeys.all/lists/contents/trash`, `videoKeys.all/detail/playbackUrl`). No string-literal keys outside `keys.ts`.
4. **Invalidation:** mutations call `invalidateLibrary(queryClient)` (folders + videos together) from `core/query/invalidation.ts`; mutations own it inside their hook, never in components.
5. **Errors:** `QueryProvider` registers `mutationCache.onError` -> toast + report to Sentry/logging; per-mutation `onError` only for special cases. 401 from any request triggers a single session-expired path (invalidate `authKeys.me`, which sends `RequireAuth` to `/auth`).
6. **Components:** no `useQueryClient`, `useMutation`, API imports, or `console` in `ui/`. UI receives data and callbacks from one feature hook (`useFolderView()`), and files stay under about 150 lines.
7. **Stores:** state + synchronous actions only. Side effects (network, timers) live in a hook/service that subscribes to the store. Stores keep ids rather than server snapshots (the player store keeps `videoId`; the video is read through `useVideo`).
8. **Public API rule:** import lint (`eslint no-restricted-imports` patterns `@/features/*/*`) enforces `@/features/<name>` only. Intra-feature imports use relative paths.
9. **Naming:** folders `kebab-case` for non-component dirs; component files `PascalCase.tsx`; hooks `useX.ts`; one export per file where practical.

### 3.4 New dependencies

- **None required** to meet the goals: TanStack Query, Zustand, Mantine, Jest/RTL are already present.
- **Optional, recommended later (phase 7): `zod`**: runtime validation at the `api -> model` boundary (backend response is already normalized by hand in one place and loosely typed elsewhere). Justification: typed boundaries without hand-written guards; small. Alternative with zero deps: handwritten mappers + type guards. Decide before phase 7.
- **Optional dev dependency: `msw`** for API-level tests of hooks. Alternative: mock `fetch` via `jest.spyOn(global, "fetch")`, sufficient initially. Not recommended unless test volume grows.
- Not recommended: a generated OpenAPI client unless the Go backend publishes a spec (none in the repo).

## 4. Incremental migration plan

Each phase is independently shippable, ends with `yarn verify` green (frontend) and `yarn test-server` from root (per repo rules), and changes no route or visible behavior unless stated.

| # | Phase | Changes | Risk |
| --- | --- | --- | --- |
| 0 | **Safety net + quick hygiene** | Remove the `console.log` of credentials in `Login.tsx`. Add tests for `apiClient` current behavior (incl. 401 to `null`), `getFolderContents` normalizer, `useUploadStore` (queue concurrency, cancel, success), `proxy.ts`. Delete or quarantine `generate.sh`. | Low |
| 1 | **Delete dead code** | Remove files from #27 after a grep/`tsc` check (`VideosList`, `VideoCard`, `VideoItemCard`, `VideoStatsGrid`, `VideoViewToggle`, `UploadVideoForm`, `useVideos`, `listVideos`, `getInitialVideos`, unused keys). Confirm with product that no feature flag or planned route uses them. | Low |
| 2 | **Shared primitives without moving features** | Add `core/http/csrf.ts`, move `getCookie`; add `ApiError`; add `shared/utils` (`stripExtension`, formatters); replace the 3 `replace(/\.[^/.]+$/, "")` copies. | Low |
| 3 | **HTTP client hardening** *(risky)* | New `httpClient` with defaults (`credentials`, CSRF on mutating methods, `ApiError`). Keep `apiClient` as a thin deprecated adapter so callers migrate file by file. Introduce `getCurrentUser`/`getSession` as the only 401-to-null sites, then change the default 401 behavior to throw once every caller handles it. Add global 401 handling in `QueryProvider`. | **High**: changes semantics of every request; session-expiry UX must be checked manually (expired cookie while on `/folders`, upload while expired) |
| 4 | **Query layer consolidation** | Per-feature `keys.ts`; remove `shared/api/keys.ts`; create `invalidateLibrary`; add `useDeleteVideo`, `useVideo`; replace inline `useMutation`/`useQueryClient` in `FolderView`, `GlobalUploadManager`. Fix the `["folderContents"]` literal. Add `retry` policy defaults. | Medium: cache invalidation regressions are silent; cover with hook tests |
| 5 | **Stores and the upload pipeline** *(risky)* | Split `useUploadStore` into `services/uploadPipeline` (pure async) + store (state only) + `useUploadQueue` hook (scheduler, move-to-folder, invalidation, surfaces move failure via toast). Remove `onSuccessCallback`. Use `crypto.randomUUID()` for ids. Player store keeps `videoId`. Move toast store to `shared/stores`. | **High**: concurrency, abort, progress; keep the existing `uploadParts` tests and add queue tests first (phase 0) |
| 6 | **Feature boundaries** | Add `index.ts` public surfaces; move code into `api/model/hooks/ui/services` folders (move-only commits, no logic changes, one feature at a time: auth, then videos, then folders). Break the `folders <-> videos` cycle: `videos` exposes `getVideoThumbnailUrl`/`useUploadQueue`; `folders` exposes `invalidateLibrary` via `core`. Add `no-restricted-imports` lint rule (warn first, then error). Replace `AppShell` feature imports with composition (`layouts/AppShell` receives slots, or imports only public indexes). | Medium: wide import churn (mechanical); do per feature with `tsc` |
| 7 | **Decompose big components** | Split `FolderView` into `useFolderView` (navigation, selection, actions) + presentational pieces; remove `useFolderUpload` dead state (collapse to one `File[]` state); unify playback URL recovery in a `usePlaybackRecovery` hook shared by `FloatingVideoPlayer` and `VideoWatchView`. | Medium: keyboard shortcuts, cut/paste, DnD, render-phase selection reset |
| 8 | **Typed boundaries (optional)** | Add mappers for `LibraryItem`, `Video`, `User`; optionally `zod` schemas; fix `global.types.ts`. | Low-Medium |

### Risk register

- **401 semantics (phase 3):** the middleware (`proxy.ts`) only checks cookie presence, so an expired cookie reaches the page and relies on `RequireAuth`/`getSession`. Changing `null` returns to thrown errors alters `RequireAuth`'s `data === null` branch and the `useVideos` enabled-gate. Migrate behind the adapter.
- **Upload queue (phase 5):** abort + XHR, retries and the "delete video on failure" side-effect must keep working; the move-into-folder step after upload is best-effort today and should stay non-fatal.
- **Cache keys (phase 4):** renaming keys can leave stale data without any error; keep the `["folders"]`/`["videos"]` prefixes stable.
- **SSR/CSR base URL (phase 3):** `apiClient` branches on `window`; `getVideoThumbnailUrl` uses a different constant. Keep thumbnail URLs identical.
- **Render-phase state reset in `FolderView`** (phase 7): replace carefully (e.g., key the selection hook by folder id).
- **Mechanical moves (phase 6):** run `next typegen` and `tsc`; no logic edits in the same commit so diffs stay reviewable.

### Definition of done per phase

`yarn test-server` (root), `yarn verify` in `frontend/`, manual smoke: login/logout, open folders and trash, create/rename/move/delete folder, upload (single, multiple, cancel), play a video in the floating player and on `/videos/[id]`.

## 5. Open questions

1. Is the backend going to expose an OpenAPI spec? If yes, generate types for `api/` instead of hand-written DTOs.
2. Confirm the dead components in section 2 #27 are not planned for use (a videos grid page?).
3. Should a mid-session 401 redirect to `/auth?next=...` automatically (proposed) or only show an error?
4. Approve `zod` (phase 8) or prefer handwritten mappers.
