# quicksvg

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)](#)
[![Node](https://img.shields.io/badge/node-%3D%2025-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%E2%89%A511-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Python](https://img.shields.io/badge/python-3.14-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)](#docker)

Convert PNG, JPEG, and WebP images to clean SVG vectors. Self-hosted and fast.

A small monorepo with two parts:

- **apps/web/** — [SvelteKit](https://svelte.dev/) frontend for upload, preview, and download.
- **apps/api/** — [FastAPI](https://fastapi.tiangolo.com/) backend that does the actual vectorization with [vtracer](https://github.com/visioncortex/vtracer).

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data flow, component design, tech stack
- [apps/web/README.md](./apps/web/README.md) — frontend details
- [apps/api/README.md](./apps/api/README.md) — backend details

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) `= 25` (see `.node-version`)
- [pnpm](https://pnpm.io/) `≥ 11`
- [uv](https://docs.astral.sh/uv/) — Python package manager
- Python `= 3.14`

### Install

```sh
pnpm install
cd apps/api && uv sync && cd ../..
cp apps/web/.env.example apps/web/.env
```

The default `API_BASE_URL=http://localhost:8000` works out of the box for local dev.

### Run (dev)

```sh
pnpm dev
```

This runs both dev servers in parallel via Turborepo:

- Web: <http://localhost:5173>
- API: <http://localhost:8000>

## Docker

```sh
docker compose up --build
```

- Web UI: <http://localhost:4173>
- API: <http://localhost:8000>

Persistent volumes (`api_data`, `api_logs`) survive container restarts. Add `-v` to `docker compose down` to wipe them.

For production deployment notes (TLS, auth, volume backups), see [ARCHITECTURE.md → Deployment](./ARCHITECTURE.md#deployment).

## Useful scripts

| Command          | Description                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Run both apps in development mode         |
| `pnpm build`     | Build both apps for production            |
| `pnpm start`     | Start the production builds               |
| `pnpm format`    | Format code (Prettier + Ruff)             |
| `pnpm lint`      | Lint code (ESLint + Ruff)                 |
| `pnpm typecheck` | Type-check both apps                      |
| `pnpm clean`     | Clean `.turbo` caches and build artifacts |

## License

[MIT](./LICENSE) — Copyright (c) 2026 Harsh Thakur.
