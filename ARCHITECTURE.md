# Architecture

## Project structure

```
quicksvg/
├── apps/
│   ├── web/          # SvelteKit frontend (TypeScript, Tailwind CSS, shadcn-svelte)
│   └── api/          # FastAPI backend (Python, vtracer)
├── compose.yaml      # Docker Compose for full-stack deployment
├── turbo.json        # Turborepo pipeline config
└── pnpm-workspace.yaml
```

## Tech stack

| Layer        | Tools                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| Frontend     | SvelteKit 5, TypeScript, Tailwind CSS v4, shadcn-svelte, Lucide, mode-watcher |
| Backend      | FastAPI, Python 3.14, vtracer                                                 |
| Sanitization | DOMPurify                                                                     |
| Monorepo     | Turborepo, pnpm workspaces                                                    |
| Quality      | ESLint, Prettier, Ruff, Husky, lint-staged, svelte-check, TypeScript          |
| Deployment   | Docker Compose, `@sveltejs/adapter-node`, Uvicorn                             |

## Frontend — `apps/web`

- **SvelteKit 5** with server-side form actions via the `$app/server` `command` helper
- **Tailwind CSS v4** + **shadcn-svelte** component library (Vega style)
- **mode-watcher** for light/dark theme toggle
- **DOMPurify** sanitizes SVG output to prevent XSS
- **Lucide** icons, Inter variable font
- Adapter: `@sveltejs/adapter-node` (production Node server)

## Backend — `apps/api`

- **FastAPI** with a single `/api/convert` POST endpoint
- **vtracer** (Python) converts raster images to SVG using Potrace-based vectorization
- Accepts PNG, JPEG, WebP — up to 10 MB
- UV-managed Python environment

## Data flow

```
User uploads image
       │
       ▼
  SvelteKit frontend
  ──────────────────
  • Reads file as Uint8Array
  • Sends multipart POST to API_BASE_URL/api/convert
       │
       ▼
  FastAPI backend
  ───────────────
  • Validates content type & file size
  • Calls vtracer.convert_raw_image_to_svg()
  • Returns SVG string
       │
       ▼
  SvelteKit frontend
  ──────────────────
  • DOMPurify sanitizes SVG
  • Renders inline SVG (sanitized)
  • User can copy SVG text to clipboard
```

## Deployment

Production runs through Docker Compose (`docker compose up --build`):

- Web UI listens on `:4173` (the `@sveltejs/adapter-node` Node server)
- API listens on `:8000` behind Uvicorn
- Persistent volumes: `api_data`, `api_logs` — survive container restarts

### Production notes

- Put behind a reverse proxy (Caddy, Nginx, Traefik) for TLS. Set `ORIGIN` on the web service to match your public URL.
- No auth is built in — front it with a proxy (Cloudflare Access, Authentik, oauth2-proxy) if you need it.
- Persistent volumes keep data and logs across rebuilds. Back them up like any other Docker volume.
