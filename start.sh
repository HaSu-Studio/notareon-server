#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Postgres + API (Nest). Swagger: http://localhost:${API_PORT:-3000}/api"
echo "Run the UI from the frontend repo: cheat-sheet-er ./start.sh"
exec docker compose up --build "$@"
