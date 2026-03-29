# Repository Guidelines

## Project Structure & Module Organization
`frontend/` contains the Vite + React + TypeScript UI. Main app code lives in `frontend/src`, shared UI in `frontend/src/components`, pages in `frontend/src/pages`, utilities and hooks in `frontend/src/lib`, and static assets in `frontend/public` and `frontend/src/assets`. `backend/cgi-bin/` contains Python CGI endpoints plus shared helpers under `backend/cgi-bin/common`. Database schema and seed data live in `database/schema.sql` and `database/data.sql`. Container and Apache runtime files are at the repo root: `Dockerfile`, `docker-compose.yml`, and `httpd.conf`.

## Build, Test, and Development Commands
Frontend commands run from `frontend/`:

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite dev server with `/cgi-bin` proxied to `http://localhost`.
- `npm run build`: type-check and create a production build in `frontend/dist`.
- `npm run lint`: run ESLint on all TypeScript and TSX files.
- `npm run preview`: serve the built frontend locally.

For the full stack, run `docker compose up --build` from the repository root to start MariaDB, Apache, and Adminer.

## Coding Style & Naming Conventions
Use 2-space indentation in TypeScript/TSX and 4 spaces in Python. Keep React components and page files in PascalCase (`LabPageLayout.tsx`, `Kiosk.tsx`), hooks in `useX` form, utility modules in camelCase, and Python modules in snake_case. Prefer the existing `@/` import alias for frontend source imports. TypeScript is `strict`; keep types explicit when data crosses API boundaries. ESLint is configured in `frontend/eslint.config.js`; there is no Prettier config, so follow the surrounding file style.

## Testing Guidelines
There is currently no automated test suite checked in. At minimum, run `npm run lint`, `npm run build`, and manually verify the affected UI flow. If you add tests, place frontend tests alongside the feature or under `frontend/src/__tests__/` and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Recent history uses short, imperative messages, often with `feat:` or `fix:` prefixes. Prefer concise subjects such as `feat: add kiosk route` or `fix: handle empty seat state`. Pull requests should describe scope, list verification steps, link related issues, and include screenshots for UI changes. Call out database or environment-variable changes explicitly.
