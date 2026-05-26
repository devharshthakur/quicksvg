#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Building images..."
docker compose build

echo ""
echo "==> Starting services..."
docker compose up -d

echo ""
echo "  API:  http://localhost:8000"
echo "  Web:  http://localhost:4173"
echo "  Logs: docker compose logs -f"
