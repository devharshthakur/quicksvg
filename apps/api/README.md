# quicksvg API

FastAPI backend that converts raster images (PNG, JPEG, WebP) to SVG vectors using [vtracer](https://github.com/visioncortex/vtracer).

## What it does

- Accepts multipart image uploads via `POST /api/convert`
- Validates content type (PNG, JPEG, WebP) and file size (≤ 10 MB)
- Converts to SVG via vtracer using `vtracer.convert_raw_image_to_svg()`
- Returns SVG as `image/svg+xml`
- Provides a liveness health check at `GET /health`

## Setup

```sh
cd apps/api
uv sync
```

### Environment

| Variable           | Default | Description                        |
| ------------------ | ------- | ---------------------------------- |
| `PYTHONUNBUFFERED` | `1`     | Forces stdout/stderr log flushing  |

## Run

| Command                            | Mode              |
| ---------------------------------- | ----------------- |
| `uv run fastapi dev src/main.py`   | Dev (hot reload)  |
| `uv run fastapi run src/main.py`   | Production        |

Dev server: http://localhost:8000

## Source structure

```
src/
├── main.py        # FastAPI app, CORS, health check
├── routes.py      # POST /api/convert endpoint
├── services.py    # vtracer conversion logic
└── constants.py   # Accepted types, file size limit
```

## API

### `POST /api/convert`

- Content-Type: `multipart/form-data`
- Field: `file` — the image to convert
- Accepted MIME types: `image/png`, `image/jpeg`, `image/webp`
- Max size: 10 MB
- Response: `200 OK` with `Content-Type: image/svg+xml`

```sh
curl -X POST http://localhost:8000/api/convert -F "file=@image.png"
```

### `GET /health`

Returns `{"status": "ok"}`. Useful for container health checks.

## Tech

- [FastAPI](https://fastapi.tiangolo.com/)
- Python 3.14
- [vtracer](https://github.com/visioncortex/vtracer)
- [uv](https://docs.astral.sh/uv/) — Python package management
- [Ruff](https://docs.astral.sh/ruff/) — linting and formatting
