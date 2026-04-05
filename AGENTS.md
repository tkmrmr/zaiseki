# Repository Guidelines

## Project Structure & Module Organization
`frontend/` holds the Vite + React + TypeScript app. Route pages live in `frontend/src/pages`, lab/layout components in `frontend/src/components/layout`, reusable UI primitives in `frontend/src/components/ui`, and hooks plus API helpers in `frontend/src/lib`. Static files live in `frontend/public`, including the Apache rewrite `.htaccess` used for React Router, and production builds are emitted to `frontend/dist`.

`backend/cgi-bin/zaiseki/api/` contains the Python CGI endpoints. Shared helpers live in `backend/cgi-bin/zaiseki/api/common`. Vendored third-party packages live in `backend/cgi-bin/zaiseki/api/dotenv` and `backend/cgi-bin/zaiseki/api/pymysql`; avoid editing them unless you are intentionally updating vendored code. The CGI runtime reads environment variables from `backend/cgi-bin/zaiseki/.env`, which is mounted from the repo-root `.env` in Docker. Access control for privileged CGI routes is configured with per-directory `.htaccess` files under `backend/cgi-bin/zaiseki/api/admin` and `backend/cgi-bin/zaiseki/api/kiosk`; the Basic Auth password file lives under `backend/cgi-bin/zaiseki/.auth/`.

Database DDL currently lives in `database/schema.sql`; there is no checked-in `database/data.sql` seed file. Container and Apache runtime files are at the repo root: `Dockerfile`, `docker-compose.yml`, and `httpd.conf`.

## Build, Test, and Development Commands
Frontend commands run from `frontend/`:

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite dev server; `/cgi-bin` is proxied to `BASE_URL` or `http://localhost`.
- `npm run build`: type-check and create a production build in `frontend/dist`. The app is built with `base: "/zaiseki/"`.
- `npm run lint`: run ESLint on the frontend source.
- `npm run preview`: serve the built frontend locally.

Repository-root commands:

- `docker compose up --build`: start MariaDB, Apache, and Adminer. `./frontend/dist` is mounted into Apache at `/usr/local/apache2/htdocs/zaiseki`, so build the frontend first when you want Apache to serve the latest UI.
- `python3 -m py_compile backend/cgi-bin/zaiseki/api/admin/*.py backend/cgi-bin/zaiseki/api/kiosk/*.py backend/cgi-bin/zaiseki/api/public/*.py backend/cgi-bin/zaiseki/api/common/*.py`: quick syntax check for backend CGI changes.

`database/schema.sql` is mounted into `/docker-entrypoint-initdb.d/` and runs only when the `db-data` volume is first initialized. If you need to reapply schema changes in Docker, recreate the database volume with `docker compose down -v` before starting the services again.

## Coding Style & Naming Conventions
Use 2-space indentation in TypeScript/TSX and 4 spaces in Python. Keep React components and page files in PascalCase, hooks in `useX` form, utility modules in camelCase, and Python modules in snake_case. Prefer the existing `@/` import alias for frontend source imports. TypeScript runs in `strict` mode, so keep types explicit when data crosses API boundaries.

ESLint is configured in `frontend/eslint.config.js`; there is no Prettier config, so follow the surrounding file style. Avoid editing generated or local-environment directories such as `frontend/dist`, `frontend/node_modules`, `backend/.env/` (local Python virtualenv), `backend/cgi-bin/zaiseki/.auth/`, and `__pycache__` unless the task explicitly requires it. Treat repo-root `.env` and `backend/cgi-bin/zaiseki/.env` as environment-specific configuration files and only edit them when the task explicitly calls for it.

## Testing Guidelines
There is currently no automated test suite checked in. At minimum, run `npm run build` for frontend changes, `npm run lint` for frontend changes, `python3 -m py_compile backend/cgi-bin/zaiseki/api/admin/*.py backend/cgi-bin/zaiseki/api/kiosk/*.py backend/cgi-bin/zaiseki/api/public/*.py backend/cgi-bin/zaiseki/api/common/*.py` for backend CGI changes, and manually verify the affected UI or API flow.

If you add tests, place frontend tests alongside the feature or under `frontend/src/__tests__/` and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Recent history mostly uses short Japanese commit subjects, with occasional `feat:`, `fix:`, or `chore:` prefixes. Prefer concise, imperative subjects and add a conventional prefix when it helps clarify intent.

Pull requests should describe scope, list verification steps, link related issues, and include screenshots for UI changes. Call out `.env`, Apache, Docker, or database changes explicitly.
