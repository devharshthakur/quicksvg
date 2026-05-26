# quicksvg

> PNG/JPEG/WebP to SVG converter — fast, self-hosted, built with SvelteKit and FastAPI.

Upload a raster image and get back a clean SVG vector. Runs entirely on your own infrastructure via Docker Compose.

> See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown of the monorepo structure, data flow, and component roles.

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) = 25 (see `.node-version`)
- [pnpm](https://pnpm.io/) ≥ 11
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Python = 3.14

### 1. Install dependencies

```sh
pnpm install
cd apps/api && uv sync && cd ../..
```

### 2. Set environment variables

```sh
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env` and set `API_BASE_URL` to your FastAPI backend address (default: `http://localhost:8000`).

### 3. Run in development

```sh
pnpm dev
```

This starts both the SvelteKit dev server and the FastAPI dev server via Turborepo.

- Web: http://localhost:5173
- API: http://localhost:8000
- Health check: http://localhost:8000/health

---

## Start the project with docker

```sh
docker compose up --build
```

- Web: http://localhost:4173
- API: http://localhost:8000

The `compose.yaml` builds both services, wires the web app to the API via the internal Docker network, and configures persistent volumes for API data and logs.

---

## API

### `POST /api/convert`

Upload a raster image and receive an SVG.

**Request:** `multipart/form-data` with a `file` field.

| Detail          | Value                             |
| --------------- | --------------------------------- |
| Accepted types  | PNG, JPEG, WebP                   |
| Max file size   | 10 MB                             |
| Response        | `image/svg+xml` (SVG string)      |

**Example:**

```sh
curl -X POST http://localhost:8000/api/convert \
  -F "file=@image.png"
```

### `GET /health`

Returns `{"status": "ok"}`.

---

## Scripts

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `pnpm dev`           | Run both apps in development mode          |
| `pnpm build`         | Build both apps for production             |
| `pnpm start`         | Start production builds                    |
| `pnpm format`        | Format code (Prettier + Ruff)              |
| `pnpm lint`          | Lint code (ESLint + Ruff)                  |
| `pnpm typecheck`     | Type-check both apps                       |
| `pnpm check:outdated`| Check for outdated dependencies            |
| `pnpm clean`         | Clean `.turbo` caches and build artifacts  |

---

## Tech stack

| Layer        | Tooling                                                                |
| ------------ | ---------------------------------------------------------------------- |
| Frontend     | SvelteKit 5, TypeScript, Tailwind CSS v4, shadcn-svelte, Lucide        |
| Backend      | FastAPI, Python, vtracer                                               |
| Monorepo     | Turborepo, pnpm workspaces                                             |
| Lint/Format  | ESLint, Prettier, Ruff, Husky, lint-staged                             |
| Deployment   | Docker Compose, Node adapter, FastAPI with Uvicorn                     |

---

## License

MIT — see [LICENSE](./LICENSE).
