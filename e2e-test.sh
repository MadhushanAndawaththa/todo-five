#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Runs Playwright end-to-end tests using Docker only.
# Starts the full stack, runs tests, then cleans up.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
export MSYS_NO_PATHCONV=1

cleanup() {
  echo ""
  echo "▸ Stopping application stack..."
  docker-compose down --volumes --remove-orphans > /dev/null 2>&1 || true
}
trap cleanup EXIT

echo ""
echo "======================================================"
echo "  TodoFive — E2E Tests  (Docker only)"
echo "======================================================"

# ── Start the application stack ──────────────────────────────────────────────
echo ""
echo "▸ Building and starting the application stack..."
docker-compose up -d --build

echo "▸ Waiting for app at http://localhost:3000 ..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "  App is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ERROR: Timed out waiting for app to start." >&2
    docker-compose logs --tail=20
    exit 1
  fi
  sleep 2
done

# ── Run Playwright ───────────────────────────────────────────────────────────
echo ""
echo "▸ E2E Tests  (Playwright · Chromium)"
echo "--------------------------------------------------------------"
docker run --rm \
  --network todo-app_todo_network \
  -v "$(pwd)/e2e:/app" \
  -w /app \
  -e PLAYWRIGHT_BASE_URL=http://todo_frontend:80 \
  node:20-bookworm \
  sh -c "npm install --silent && npx playwright install chromium --with-deps && npx playwright test"

echo ""
echo "======================================================"
echo "  ✔  E2E tests passed"
echo "======================================================"
echo ""
