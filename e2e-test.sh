#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Runs Playwright end-to-end tests using Docker only.
# Starts the full stack, runs tests, then cleans up.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
export MSYS_NO_PATHCONV=1

# Detect Compose command: prefer v2 plugin, fall back to standalone v1
if docker compose version > /dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose > /dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "ERROR: Neither 'docker compose' nor 'docker-compose' found." >&2
  exit 1
fi

cleanup() {
  echo ""
  echo "▸ Stopping application stack..."
  "${COMPOSE[@]}" down --volumes --remove-orphans > /dev/null 2>&1 || true
}
trap cleanup EXIT

echo ""
echo "======================================================"
echo "  TodoFive — E2E Tests  (Docker only)"
echo "======================================================"

# ── Start the application stack ──────────────────────────────────────────────
echo ""
echo "▸ Building and starting the application stack..."
"${COMPOSE[@]}" up -d --build

echo "▸ Waiting for app at http://localhost:3000 ..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "  App is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ERROR: Timed out waiting for app to start." >&2
    "${COMPOSE[@]}" logs --tail=20
    exit 1
  fi
  sleep 2
done

# ── Run Playwright ───────────────────────────────────────────────────────────
echo ""
echo "▸ E2E Tests  (Playwright · Chromium)"
echo "--------------------------------------------------------------"

# On Linux (--network host): browser reaches localhost:3000 directly — same
# origin as the app, no CORS preflight involved.
# On macOS/Windows Docker Desktop (host.docker.internal): CORS config allows
# http://host.docker.internal:3000 explicitly in CorsConfig.java.
if [ "$(uname)" = "Linux" ]; then
  NETWORK_ARGS=(--network host)
  BASE_URL="http://localhost:3000"
else
  NETWORK_ARGS=(--add-host=host.docker.internal:host-gateway)
  BASE_URL="http://host.docker.internal:3000"
fi

docker run --rm \
  "${NETWORK_ARGS[@]}" \
  -v "$(pwd)/e2e:/app" \
  -w /app \
  -e PLAYWRIGHT_BASE_URL="$BASE_URL" \
  node:20-bookworm \
  sh -c "npm install --silent && npx playwright install chromium --with-deps && npx playwright test"

echo ""
echo "======================================================"
echo "  ✔  E2E tests passed"
echo "======================================================"
echo ""
