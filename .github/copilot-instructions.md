## Project Snapshot

- **Framework & Runtime:** Next.js 16 (App Router) with TypeScript and Tailwind CSS v4.
- **UI patterns:** shadcn/ui primitives + Radix components live in `components/ui/`.
- **App structure:** top-level route groups under `app/` for roles: `admin`, `manager`, `dashboard`, `auth`.
- **Local data layer:** offline/local dev uses `lib/local-storage/db.ts` (exported `LocalDB`) — a single-file IndexedDB/localStorage shim used everywhere for demo data.
- **DB migrations:** SQL scripts for Supabase are in `scripts/` (run in order: `001_...` → `004_...`).

## How To Run (developer flow)

- **Prereqs:** Node.js 18+ (project tested against Node 18+). Use the repo root.
- **Install:** `npm install` (or `pnpm install` if you prefer pnpm).
- **Dev server:** `npm run dev` (runs `next dev`).
- **Build / Start:** `npm run build` then `npm start`.
- **Lint:** `npm run lint` (ESLint configured across the codebase).

Notes: `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`. Treat those as intentional for the preview environment — do not remove without adjusting many type issues.

## Big-picture architecture (what to know)

- The project uses the Next.js App Router. Route files and layout/segment nesting are under `app/` (server components by default). Add `"use client"` at the top of files that must run in the browser.
- Shared UI primitives and design system live under `components/ui/`. Role-specific and feature components live under `components/admin/`, `components/manager/`, and `components/investor/`.
- Global providers are mounted in `app/layout.tsx` (see `AuthProvider` import) and theme handling uses `components/theme-provider.tsx` with `next-themes`.
- Authentication & session handling for local/demo mode is implemented in `lib/auth-context.tsx` and uses `lib/local-storage/db.ts` (calls like `LocalDB.loginUser`, `LocalDB.getCurrentUser`). For production Supabase integration, replace `LocalDB` calls with Supabase client logic and respect the SQL scripts in `scripts/`.

## Data flow & integration points

- Local dev: `lib/local-storage/db.ts` initializes sample funds, NAV history, performance and provides CRUD-like API (`LocalDB`) used by client components.
- Supabase migration scripts live in `scripts/` (schema → RLS → triggers → seed). The README references Supabase; however, the codebase's runtime by default uses the local DB shim (so both exist: infra scripts vs. local demo implementation).
- Auth redirect behavior is centralized in `lib/auth-context.tsx` — role-based redirects send users to `/admin`, `/manager`, or `/dashboard` after login.

## Codebase conventions and patterns

- Folder semantics: keep route logic in `app/*`; UI-only components in `components/` (group by role or `ui` primitives).
- Client vs Server: files are server components by default under the App Router. When adding hooks/state/event handlers, add `"use client"` at the top of the file. Search for existing `"use client"` usage as examples (`lib/auth-context.tsx`, some components in `components/`).
- Paths: TypeScript path alias `@/*` maps to `./*` (see `tsconfig.json`). Use `@/` when importing app-level modules.
- Styling: Tailwind classes and CVA/`class-variance-authority` patterns are used for composed components. Prefer reusing `components/ui/*` primitives instead of duplicating class strings.
- UI composition: shadcn patterns — small, composable primitives + variant props. Look at `components/ui/button.tsx`, `components/ui/card.tsx` for examples.

## Specific files to inspect when changing behavior

- Authentication flow: `lib/auth-context.tsx` and `lib/local-storage/db.ts` (LocalDB API).
- Global providers / fonts / analytics: `app/layout.tsx`.
- Theme wrapper: `components/theme-provider.tsx`.
- Routes / pages: any role-specific page in `app/admin/`, `app/manager/`, `app/dashboard/`.
- Database migration & seeds: `scripts/001_create_database_schema.sql` → `002_row_level_security.sql` → `003_functions_and_triggers.sql` → `004_seed_sample_data.sql`.

## Small, actionable editing examples

- Change auth redirect target: edit `lib/auth-context.tsx` — see `login` implementation where `router.push(...)` is called based on `user.role`.
- Initialize demo DB manually (local): call `initializeDatabase()` (already invoked in `AuthProvider` on mount). For unit testing, import `initializeDatabase` from `lib/local-storage/db.ts`.
- Add a global provider: edit `app/layout.tsx` and wrap `<AuthProvider>` or add additional providers alongside it.

## Searches that help an AI agent quickly find context

- `LocalDB` — local data API (file: `lib/local-storage/db.ts`).
- `initializeDatabase` — demo data seed function.
- `use client` — identifies client components to avoid accidentally making server-only changes.
- `AuthProvider` / `useAuth` — authentication/context entry points.

## When to prefer local DB vs Supabase

- Local DB (`lib/local-storage/db.ts`) is the runtime for the preview/demo environment — useful for UI/UX changes without infra.
- Supabase is represented by SQL scripts in `scripts/` and described in `README.md`. If making production-grade backend changes, run and test the SQL scripts against a Supabase/Postgres instance and replace `LocalDB` usages with Supabase client calls.

## Guardrails for PRs and edits

- Do not remove `typescript.ignoreBuildErrors` without addressing type errors across many files.
- Keep `images.unoptimized` in mind if adding remote Image optimization — tests/dev may rely on this config.
- Preserve the `app/` route layout and top-level route segments when renaming pages (breaking changes to routes will affect many imports and links).

---
If anything here is unclear or you'd like more detail on a specific area (auth flow, swapping LocalDB for Supabase, or component patterns), tell me which part to expand and I'll iterate.
