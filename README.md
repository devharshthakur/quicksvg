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

## Tech stack

| Layer        | Tools                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| Frontend     | SvelteKit 5, TypeScript, Tailwind CSS v4, shadcn-svelte, Lucide, mode-watcher |
| Backend      | FastAPI, Python 3.14, vtracer                                                 |
| Sanitization | DOMPurify                                                                     |
| Monorepo     | Turborepo, pnpm workspaces                                                    |
| Quality      | ESLint, Prettier, Ruff, Husky, lint-staged, svelte-check, TypeScript          |
| Deployment   | Docker Compose, `@sveltejs/adapter-node`, Uvicorn                             |

## Project structure

```
quicksvg/
├── apps/
│   ├── web/          # SvelteKit frontend
│   └── api/          # FastAPI backend
├── compose.yaml      # Docker Compose for full-stack deployment
├── turbo.json        # Turborepo pipeline config
├── ARCHITECTURE.md   # Data flow and component design
└── pnpm-workspace.yaml
```

For details on each app, see their respective READMEs:

- [apps/web/README.md](./apps/web/README.md)
- [apps/api/README.md](./apps/api/README.md)

## Manual development setup

### Prerequisites

- [Node.js](https://nodejs.org/) `= 25` (see `.node-version`)
- [pnpm](https://pnpm.io/) `≥ 11`
- [uv](https://docs.astral.sh/uv/) — Python package manager
- Python `= 3.14`

### 1. Install dependencies

```sh
pnpm install
cd apps/api && uv sync && cd ../..
```

### 2. Configure the web app

```sh
cp apps/web/.env.example apps/web/.env
```

The default `API_BASE_URL=http://localhost:8000` works out of the box for local dev.

### 3. Start both apps

```sh
pnpm dev
```

This runs both dev servers in parallel via Turborepo:

- Web: <http://localhost:5173>
- API: <http://localhost:8000>
- Health: <http://localhost:8000/health>

## Docker

```sh
docker compose up --build
```

- Web UI: <http://localhost:4173>
- API: <http://localhost:8000>
- Health: <http://localhost:8000/health>

Persistent volumes (`api_data`, `api_logs`) survive container restarts. Add `-v` to `docker compose down` to wipe them.

### Production notes

- Put behind a reverse proxy (Caddy, Nginx, Traefik) for TLS. Set `ORIGIN` on the web service to match your public URL.
- No auth is built in — front it with a proxy (Cloudflare Access, Authentik, oauth2-proxy) if you need it.
- Persistent volumes keep data and logs across rebuilds. Back them up like any other Docker volume.

## Contributing

1. Fork the repo and create a feature branch.
2. `pnpm install && cd apps/api && uv sync`
3. `pnpm dev` for hot reload on both apps.
4. Before opening a PR: `pnpm lint`, `pnpm typecheck`, `pnpm format`.
5. Husky runs linters and formatters on staged files when you commit.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deeper look at how the pieces fit together.

### Useful scripts

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
