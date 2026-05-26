# Architecture

```
quicksvg/
├── apps/
│   ├── web/          # SvelteKit frontend (TypeScript, Tailwind CSS, shadcn-svelte)
│   └── api/          # FastAPI backend (Python, vtracer)
├── compose.yaml      # Docker Compose for full-stack deployment
├── turbo.json        # Turborepo pipeline config
└── pnpm-workspace.yaml
```

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

## Directory layout

```
apps/
├── web/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── CopySvgButton.svelte   # Copy-to-clipboard
│   │   │   │   └── ModeToggle.svelte      # Light/dark toggle
│   │   │   ├── constants.ts               # MIME types, file restrictions
│   │   │   ├── utils.ts                   # cn() helper, type utilities
│   │   │   └── index.ts
│   │   └── routes/
│   │       ├── +layout.svelte             # Root layout, theme toggle
│   │       ├── +page.svelte               # Main upload/convert page
│   │       └── page.remote.ts             # Server command → API call
│   └── ...
└── api/
    └── src/
        ├── main.py                        # FastAPI app, CORS, health
        ├── routes.py                      # POST /api/convert
        ├── services.py                    # vtracer conversion logic
        └── constants.py                   # Size & type limits
```

## Deployment

See [Docker deployment](./README.md#docker-deployment) in README.
