#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Stopping services..."
docker compose down

echo "Done."
