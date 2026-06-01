# quicksvg

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)](#)
[![Node](https://img.shields.io/badge/node-%3D%2025-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%E2%89%A511-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Python](https://img.shields.io/badge/python-3.14-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)](#quick-start-with-docker)

## Table of contents

- [About](#about)
- [Features](#features)
- [How it works](#how-it-works)
- [Quick start (Docker)](#quick-start-with-docker)
- [Manual development setup](#manual-development-setup)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Self-hosting & production](#self-hosting--production)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap & known limits](#roadmap--known-limits)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

Convert PNG, JPEG, and WebP images to clean SVG vectors. Self-hosted, fast, and powered by SvelteKit and FastAPI.

It's a small monorepo with two parts:

- A **SvelteKit** web app for the upload UI, preview, and SVG download.
- A **FastAPI** backend that does the actual vectorization with [vtracer](https://github.com/visioncortex/vtracer).

## Features

- **Multiple formats** — accepts PNG, JPEG, and WebP.
- **Up to 10 MB** per file.
- **In-browser preview** — the vectorized SVG is rendered inline as soon as it's ready.
- **Copy to clipboard** the SVG markup with one click.
- **Light & dark mode** that follows your system preference.
- **Sanitized output** — every SVG is cleaned before it touches the DOM.
- **Self-hosted by design** — no telemetry, no third-party uploads, no auth wall.
- **Single command to run** with Docker Compose.

## How it works

1. You pick or drop an image into the web UI.
2. The browser sends it to the API as a multipart upload.
3. The API hands the bytes to vtracer, which produces an SVG string.
4. The string is sent back to the browser, sanitized, and rendered inline.
5. You can copy the SVG markup to your clipboard and use it wherever you like.

The whole round trip usually takes a second or two for a typical icon-sized PNG, longer for big photographs. For best results, use images with clear shapes and high contrast — that's where vector tracing shines.

---

## Quick start (Docker)

You can also quickstart the project using docker. It builds and runs both services in production mode and wires them together on a private network.

```sh
docker compose up --build
```

Once it's up:

- Web UI: <http://localhost:4173>
- API: <http://localhost:8000>
- Health check: <http://localhost:8000/health>

To stop everything:

```sh
docker compose down
```

Persistent volumes (`api_data`, `api_logs`) survive container restarts, so anything the API writes to `/app/data` or `/app/logs` will stick around. Add `-v` to the `down` command if you want to wipe them.

---

## Manual development setup

If you want to hack on quicksvg, run both apps locally with hot reload.

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

The only required variable is `API_BASE_URL`, which points the web app at your local API. The default (`http://localhost:8000`) is fine for a dev setup on one machine.

### 3. Start both apps

```sh
pnpm dev
```

This uses Turborepo to run the SvelteKit dev server and the FastAPI dev server in parallel.

- Web: <http://localhost:5173>
- API: <http://localhost:8000>
- Health check: <http://localhost:8000/health>

---

## Configuration

quicksvg has very little configuration. The web app reads these at build time:

| Variable        | Default               | What it does                                                                 |
| --------------- | --------------------- | ---------------------------------------------------------------------------- |
| `API_BASE_URL`  | `http://localhost:8000` | Where the web app sends conversion requests. Set this to your API URL.     |
| `ORIGIN`        | `http://localhost:4173` | CSRF/origin allowlist for the SvelteKit server. Match your public URL.    |
| `PORT`          | `4173`                | Port the SvelteKit Node server listens on.                                   |

The API reads:

| Variable             | Default | What it does                                  |
| -------------------- | ------- | --------------------------------------------- |
| `PYTHONUNBUFFERED`   | `1`     | Forces stdout/stderr flushing for log capture. |

To customize in Docker, pass them through `environment:` in `compose.yaml` or via an `.env` file next to it.

---

## API reference

The API has a single conversion endpoint plus a health check.

### `POST /api/convert`

Accepts a raster image and returns an SVG.

**Request**

- `Content-Type: multipart/form-data`
- Field: `file` — the image to convert

**Constraints**

- Accepted types: `image/png`, `image/jpeg`, `image/webp`
- Max size: **10 MB**

**Response**

- `200 OK` with `Content-Type: image/svg+xml` and the SVG as the body
- `4xx` for validation errors (wrong type, missing file, oversize)
- `5xx` for conversion failures

**Example**

```sh
curl -X POST http://localhost:8000/api/convert \
  -F "file=@image.png"
```

### `GET /health`

Liveness probe. Returns `{"status": "ok"}`. Useful for container health checks and uptime monitors.

---

## Self-hosting & production

The `compose.yaml` is production-ready out of the box: both services restart automatically, persistent volumes are wired up, and the web build is served by the Node adapter.

A few things to consider before you expose it to the world:

- **Put it behind a reverse proxy** (Caddy, Nginx, Traefik) to handle TLS and hostnames. Make sure `ORIGIN` on the web service matches the public URL you serve.
- **Tighten the size limit** if you open it up — edit the validator in the API to suit your bandwidth and risk tolerance.
- **No authentication is built in.** quicksvg is designed for trusted environments. If you need auth, front it with a proxy that enforces it (e.g. Cloudflare Access, Authentik, oauth2-proxy).
- **Persistent volumes** (`api_data`, `api_logs`) keep data and logs across rebuilds. Back them up like you would any other Docker volume.

---

## Tech stack

| Layer         | Tools                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| Frontend      | SvelteKit 5, TypeScript, Tailwind CSS v4, shadcn-svelte, Lucide, mode-watcher  |
| Backend       | FastAPI, Python 3.14, vtracer                                                   |
| Sanitization  | DOMPurify                                                                      |
| Monorepo      | Turborepo, pnpm workspaces                                                     |
| Quality       | ESLint, Prettier, Ruff, Husky, lint-staged, svelte-check, TypeScript           |
| Deployment    | Docker Compose, `@sveltejs/adapter-node`, Uvicorn                              |

## Project structure

```
quicksvg/
├── apps/
│   ├── web/          # SvelteKit frontend
│   └── api/          # FastAPI backend
├── compose.yaml      # Docker Compose for full-stack deployment
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
├── ARCHITECTURE.md   # Deeper dive into components and data flow
└── README.md
```

## Contributing

Contributions are welcome. The short version:

1. Fork the repo and create a feature branch.
2. Run `pnpm install` and `cd apps/api && uv sync` to set up.
3. Use `pnpm dev` to run both apps with hot reload.
4. Before opening a PR, make sure the following all pass:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm format` (Prettier + Ruff)
5. Husky + lint-staged will run the formatters and linters on staged files when you commit.
6. Open a pull request with a clear description of the change and the motivation.

For a deeper look at how the pieces fit together, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Useful scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `pnpm dev`             | Run both apps in development mode          |
| `pnpm build`           | Build both apps for production             |
| `pnpm start`           | Start the production builds                |
| `pnpm format`          | Format code (Prettier + Ruff)              |
| `pnpm lint`            | Lint code (ESLint + Ruff)                  |
| `pnpm typecheck`       | Type-check both apps                       |
| `pnpm check:outdated`  | Check for outdated dependencies            |
| `pnpm clean`           | Clean `.turbo` caches and build artifacts  |

## Roadmap & known limits

- **10 MB upload cap.** Trivial to bump, but not the default.
- **No auth.** Intentional — quicksvg is built for trusted, self-hosted setups. Add a proxy in front if you need it.
- **Single endpoint.** The API does one thing. That's a feature.
- **Conversion quality depends on the input.** Vector tracing works best on flat, high-contrast images (logos, icons, line art). Photographic images will produce noisy, large SVGs — use a different tool for that.

## License

[MIT](./LICENSE) — Copyright (c) 2026 Harsh Thakur.

## Acknowledgements

quicksvg stands on the shoulders of some excellent open-source projects:

- [vtracer](https://github.com/visioncortex/vtracer) — the raster-to-SVG engine doing the actual work.
- [SvelteKit](https://svelte.dev/) and [Svelte 5](https://svelte.dev/) — the frontend framework.
- [FastAPI](https://fastapi.tiangolo.com/) — the backend framework.
- [shadcn-svelte](https://www.shadcn-svelte.com/) and [Tailwind CSS](https://tailwindcss.com/) — the UI.
- [DOMPurify](https://github.com/cure53/DOMPurify) — SVG sanitization.

Thanks to everyone maintaining these projects.
