# Repository Guidelines

## Project Structure & Module Organization
`frontend/` holds the Vite + React + TypeScript app. Route pages live in `frontend/src/pages`, layout components in `frontend/src/components/layout`, reusable UI primitives in `frontend/src/components/ui`, and shared hooks, types, and helpers in `frontend/src/lib`. Routing is defined in `frontend/src/App.tsx`, and `frontend/public/.htaccess` contains the Apache rewrite rules for React Router.

`backend/cgi-bin/zaiseki/api/` contains the Python CGI endpoints, split into `admin`, `kiosk`, `public`, and shared helpers in `common`. Vendored third-party packages live in `backend/cgi-bin/zaiseki/api/dotenv` and `backend/cgi-bin/zaiseki/api/pymysql`; avoid editing them unless you are intentionally updating vendored code.

Database DDL lives in `database/schema.sql`, and the current schema diagram is checked in as `images/schema.svg`. Container and Apache runtime files are at the repo root: `Dockerfile`, `docker-compose.yml`, and `httpd.conf`.

## Build, Test, and Development Commands
Frontend commands run from `frontend/`:

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite dev server; `/cgi-bin` is proxied to `BASE_URL` or `http://localhost`.
- `npm run build`: type-check and create the production build. The app is built with `base: "/zaiseki/"`.
- `npm run lint`: run ESLint on the frontend source.
- `npm run preview`: serve the built frontend locally.

Repository-root commands:

- `docker compose up --build`: start MariaDB, Apache, and Adminer.
- `python3 -m py_compile backend/cgi-bin/zaiseki/api/admin/*.py backend/cgi-bin/zaiseki/api/kiosk/*.py backend/cgi-bin/zaiseki/api/public/*.py backend/cgi-bin/zaiseki/api/common/*.py`: quick syntax check for backend CGI changes.

## Coding Style & Naming Conventions
Use 2-space indentation in TypeScript/TSX and 4 spaces in Python. Keep React components and page files in PascalCase, hooks in `useX` form, utility modules in camelCase, and Python modules in snake_case. Prefer the existing `@/` import alias for frontend source imports. TypeScript runs in `strict` mode, so keep types explicit when data crosses API boundaries.

ESLint is configured in `frontend/eslint.config.js`; there is no Prettier config, so follow the surrounding file style. Avoid editing vendored code under `backend/cgi-bin/zaiseki/api/dotenv` and `backend/cgi-bin/zaiseki/api/pymysql` unless the task explicitly calls for a dependency update.

## Testing Guidelines
There is currently no automated test suite checked in. At minimum, run `npm run build` for frontend changes, `npm run lint` for frontend changes, `python3 -m py_compile backend/cgi-bin/zaiseki/api/admin/*.py backend/cgi-bin/zaiseki/api/kiosk/*.py backend/cgi-bin/zaiseki/api/public/*.py backend/cgi-bin/zaiseki/api/common/*.py` for backend CGI changes, and manually verify the affected UI or API flow.

If you add tests, place frontend tests alongside the feature or under `frontend/src/__tests__/` and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Recent history mostly uses short Japanese commit subjects, with occasional `feat:`, `fix:`, or `chore:` prefixes. Prefer concise, imperative subjects and add a conventional prefix when it helps clarify intent.

Pull requests should describe scope, list verification steps, link related issues, and include screenshots for UI changes. Call out Apache, Docker, database, or dependency changes explicitly.
