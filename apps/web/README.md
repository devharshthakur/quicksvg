# quicksvg Web

SvelteKit frontend for uploading images, previewing vectorized SVGs, and copying them to the clipboard.

## What it does

- File picker for PNG, JPEG, and WebP images
- Sends image to the API as a multipart upload
- Renders the returned SVG inline (sanitized via DOMPurify)
- Copy SVG markup to clipboard with one click
- Light/dark mode toggle (follows system preference)

## Setup

```sh
cp apps/web/.env.example apps/web/.env
```

### Environment

| Variable       | Default                 | Description                                    |
| -------------- | ----------------------- | ---------------------------------------------- |
| `API_BASE_URL` | `http://localhost:8000` | Where the web app sends conversion requests    |
| `ORIGIN`       | `http://localhost:4173` | CSRF/origin allowlist for the SvelteKit server |
| `PORT`         | `4173`                  | Port the SvelteKit Node server listens on      |

## Run

| Command      | Mode              |
| ------------ | ----------------- |
| `pnpm dev`   | Dev server (Vite) |
| `pnpm build` | Production build  |
| `pnpm start` | Preview build     |

Dev server: http://localhost:5173

## Source structure

```
src/
├── app.html              # SvelteKit shell
├── app.d.ts              # App type declarations
├── lib/
│   ├── assets/           # Static assets
│   ├── components/       # UI components
│   ├── constants.ts      # Accepted types, size limits
│   ├── hooks/            # SvelteKit hooks
│   ├── index.ts          # Re-exports
│   └── utils.ts          # Utility functions
└── routes/
    ├── +layout.svelte    # Root layout (theme, shell)
    ├── +page.svelte      # Main upload page
    ├── layout.css        # Global styles
    └── page.remote.ts    # API client logic
```

## Tech

- [SvelteKit 5](https://svelte.dev/)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn-svelte](https://www.shadcn-svelte.com/) (Vega style)
- [DOMPurify](https://github.com/cure53/DOMPurify) — SVG sanitization
- [Lucide](https://lucide.dev/) — icons
- [mode-watcher](https://github.com/svecosystem/mode-watcher) — theme toggle
- `@sveltejs/adapter-node` — production Node server
