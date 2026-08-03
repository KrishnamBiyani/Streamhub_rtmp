#!/usr/bin/env bash
set -euo pipefail

echo "$GHCR_PULL_TOKEN" | docker login ghcr.io -u "$GHCR_PULL_USER" --password-stdin

docker compose pull
docker compose up -d
docker image prune -f
docker compose ps
