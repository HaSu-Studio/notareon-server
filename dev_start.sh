#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  if [[ ! -f .env.example ]]; then
    echo "Нет .env и .env.example" >&2
    exit 1
  fi
  cp .env.example .env
  echo "Создан .env из .env.example"
fi

[[ -d node_modules ]] || npm install

echo "Postgres в Docker (только сервис postgres)…"
docker compose --env-file .env up postgres -d
sleep 2

echo "Nest start:dev (hot reload). Ctrl+C не гасит контейнер Postgres."
exec npm run start:dev
