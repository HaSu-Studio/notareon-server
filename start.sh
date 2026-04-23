#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  if [[ ! -f .env.example ]]; then
    echo "Нет .env и .env.example — нечего копировать." >&2
    exit 1
  fi
  cp .env.example .env
  echo "Создан .env из .env.example — поменяй пароли и секреты."
fi

echo "Postgres + API. Порты и креды — в .env (DB_*, API_PORT)."
exec docker compose --env-file .env up --build "$@"
