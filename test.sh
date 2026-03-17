#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Runs backend + frontend unit/integration tests using Docker only.
# No Maven, Java, or Node installation required.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo ""
echo "======================================================"
echo "  TodoFive — Test Suite  (Docker only)"
echo "======================================================"

# ── Backend: Unit & Integration Tests ────────────────────────────────────────
echo ""
echo "▸ Backend  (Java 21 · JUnit 5 · Spring Boot Test)"
echo "--------------------------------------------------------------"
docker run --rm \
  -v "$(pwd)/backend:/app" \
  -v todo-maven-cache:/root/.m2 \
  -w /app \
  maven:3.9.6-eclipse-temurin-21-alpine \
  mvn test -B -q

echo ""
echo "✔ Backend tests passed"

# ── Frontend: Component Tests ────────────────────────────────────────────────
echo ""
echo "▸ Frontend  (Vitest · React Testing Library)"
echo "--------------------------------------------------------------"
docker run --rm \
  -v "$(pwd)/frontend:/app" \
  -w /app \
  node:20-alpine \
  sh -c "npm install --silent 2>/dev/null && npm test"

echo ""
echo "✔ Frontend tests passed"

echo ""
echo "======================================================"
echo "  ✔  All tests passed"
echo "======================================================"
echo ""
