---
description: Gradventure repo conventions
globs: "*.ts,*.tsx,*.astro,*.css,*.js,*.jsx,package.json"
alwaysApply: false
---

Default to the current repo toolchain.

- Use `npm install` for the root app and `npm --prefix docs install` for the Astro docs site.
- Use `npm run <script>` for root scripts.
- Use `tsx` for TypeScript utility scripts in `src/db/` and `scripts/analysis/`.
- Use Vite for the client app and Astro for `docs/`.
- Supabase is the active backend integration. Do not scaffold Bun server entrypoints or Prisma flows unless explicitly requested.

## Active scripts

- `npm run dev`: Vite client
- `npm run build`: root app build
- `npm run lint`: root TypeScript lint
- `npm run db:init`: schema + seed utilities via `tsx`
- `npm run analyze:game`: analysis script in `scripts/analysis/`

## Repo layout

- `src/`: app source and runtime
- `docs/`: Astro documentation site
- `scripts/archive/`: legacy one-off scripts kept only for reference
- `notes/archive/`: historical implementation notes and migration logs
