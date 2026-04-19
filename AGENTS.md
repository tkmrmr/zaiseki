# Repository Guidelines

## Project Structure & Module Organization
`frontend/` holds the Vite + React + TypeScript app. Route pages for `/`, `/kiosk`, `/admin`, and the fallback screen live in `frontend/src/pages`, layout and screen-composition components live in `frontend/src/components/layout`, reusable UI primitives live in `frontend/src/components/ui`, and shared hooks, types, and helpers live in `frontend/src/lib`. Routing is defined in `frontend/src/App.tsx`, `frontend/src/main.tsx` bootstraps the React app, and global frontend styling and theme tokens live in `frontend/src/index.css`. `frontend/index.html` is the Vite HTML entrypoint, `frontend/vite.config.ts` defines the `/cgi-bin` proxy, `/zaiseki/` base path, and `@/` alias, and the TypeScript project references live in `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, and `frontend/tsconfig.node.json`. `frontend/public/.htaccess` contains the Apache rewrite rules for React Router, `frontend/public/favicon.svg` is the checked-in favicon, and frontend tool metadata is checked in via `frontend/components.json`, `frontend/biome.json`, and `frontend/eslint.config.js`. `frontend/src/App.css` is still tracked from the Vite scaffold but is currently not imported by the app.

`backend/cgi-bin/zaiseki/api/` contains the Flask app deployed through CGI. `index.cgi` is the CGI entrypoint, `backend/cgi-bin/zaiseki/api/.htaccess` rewrites routed requests into that entrypoint, and the Flask application factory lives in `backend/cgi-bin/zaiseki/api/app/__init__.py`. App-wide configuration and global error handling live in `backend/cgi-bin/zaiseki/api/app/config.py` and `backend/cgi-bin/zaiseki/api/app/error_handler.py`. HTTP endpoints live in `backend/cgi-bin/zaiseki/api/app/routes`: `admin.py` serves admin status and student assignment endpoints, `kiosk.py` handles seat status updates and optional BOCCO notifications, and `public.py` exposes the public seat-status feed. Shared request/response dataclasses live in `backend/cgi-bin/zaiseki/api/app/schemas.py`, reusable seat/student/status data access lives in `backend/cgi-bin/zaiseki/api/app/services`, and shared helpers for DB access, request parsing, validation, UTC conversion, and BOCCO integration live in `backend/cgi-bin/zaiseki/api/app/utils`. Backend static-analysis settings live in `backend/pyproject.toml`. Vendored third-party packages live in `backend/cgi-bin/zaiseki/api/vendor/dotenv` and `backend/cgi-bin/zaiseki/api/vendor/pymysql`; avoid editing them unless you are intentionally updating vendored code.

Repository-level setup and operational notes live in `README.md`. Database DDL lives in `database/schema.sql`, and the current schema diagram is checked in as `images/schema.svg`. Container and Apache runtime files are at the repo root: `Dockerfile`, `docker-compose.yml`, and `httpd.conf`.

## Build, Test, and Development Commands
Frontend commands run from `frontend/`:

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite dev server; `/cgi-bin` is proxied to `BASE_URL` or `http://localhost`.
- `npm run build`: type-check and create the production build. The app is built with `base: "/zaiseki/"`.
- `npm run lint`: run ESLint on the frontend source.
- `npm run preview`: serve the built frontend locally.

Repository-root commands:

- `docker compose up --build`: start MariaDB, Apache, and Adminer.
- `docker compose exec web ruff check /usr/local/apache2/cgi-bin/zaiseki/api`: run backend linting inside the Apache container.
- `docker compose exec web ty check /usr/local/apache2/cgi-bin/zaiseki/api`: run backend type checking inside the Apache container.

## Coding Style & Naming Conventions
Use 2-space indentation in TypeScript/TSX and 4 spaces in Python. Keep React components and page files in PascalCase, hooks in `useX` form, utility modules in camelCase, and Python modules in snake_case. Prefer the existing `@/` import alias for frontend source imports. TypeScript runs in `strict` mode, so keep types explicit when data crosses API boundaries. For frontend styling changes, prefer updating shared tokens and base rules in `frontend/src/index.css` before scattering one-off global styles; avoid adding new app styles to `frontend/src/App.css` unless you intentionally wire that stylesheet back into the app.

ESLint is configured in `frontend/eslint.config.js`, `frontend/biome.json` defines the checked-in formatting defaults and import organization for frontend files, and `backend/pyproject.toml` holds the backend Ruff and ty settings. `frontend/components.json` records the shadcn/ui alias setup used by the component generator. There is no Prettier config, so follow the surrounding file style and these checked-in tool configs. Avoid editing vendored code under `backend/cgi-bin/zaiseki/api/vendor/dotenv` and `backend/cgi-bin/zaiseki/api/vendor/pymysql` unless the task explicitly calls for a dependency update.

## Testing Guidelines
There is currently no automated test suite checked in. At minimum, run `npm run build` for frontend changes, `npm run lint` for frontend changes, `docker compose exec web ruff check /usr/local/apache2/cgi-bin/zaiseki/api` and `docker compose exec web ty check /usr/local/apache2/cgi-bin/zaiseki/api` for backend Flask/CGI changes, and manually verify the affected UI or API flow.

If you add tests, place frontend tests alongside the feature they cover and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Recent history mixes short Japanese commit subjects, simple `Update ...` messages, and occasional `feat:`, `fix:`, or `chore:` prefixes. Prefer concise, imperative subjects and add a conventional prefix when it helps clarify intent.

Pull requests should describe scope, list verification steps, link related issues, and include screenshots for UI changes. Call out Apache, Docker, database, or dependency changes explicitly.
