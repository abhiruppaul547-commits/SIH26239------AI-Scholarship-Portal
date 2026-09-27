#!/usr/bin/env bash
set -e

echo "=========================================="
echo " Launching SIH26239 Production Stack     "
echo "=========================================="

# Build and start all containers in detached mode
docker compose up -d --build

echo "Containers launched. Tailing Caddy logs for 10 seconds..."
# Tail Caddy logs with timeout
timeout 10 docker compose logs -f caddy || true

echo ""
echo "=========================================="
echo " Current Container Status:                "
echo "=========================================="
docker compose ps

echo ""
echo "Production deployment live at: https://sih2639-ps.duckdns.org"
