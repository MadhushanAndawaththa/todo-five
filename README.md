<p align="center">
  <img src="frontend/public/favicon.svg" width="60" height="60" alt="TodoFive logo" />
</p>

<h1 align="center">TodoFive</h1>

<p align="center">
  A full-stack task management app that keeps you focused on what matters — your next five tasks.
</p>

<p align="center">
  <a href="https://github.com/MadhushanAndawaththa/todo-five/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#api-reference">API Reference</a> ·
  <a href="#running-tests">Running Tests</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

## Quick Start

> **Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and docker-compose

```bash
git clone https://github.com/MadhushanAndawaththa/todo-five.git
cd todo-five
docker-compose up --build
```

Open **http://localhost:3000** — that's it.

| Service | URL |
|---------|-----|
| **App** | http://localhost:3000 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **API docs (JSON)** | http://localhost:8080/api-docs |
| **Health check** | http://localhost:8080/actuator/health |

<details>
<summary>First build taking long?</summary>

The initial build downloads Maven and npm dependencies inside Docker. Subsequent builds use cached layers and complete in seconds.
</details>

<details>
<summary>Default credentials / environment variables</summary>

The following defaults are used out of the box. Override them by creating a `.env` file in the project root:

```env
DB_NAME=todoapp
DB_USER=todoapp
DB_PASSWORD=todoapp
```
</details>

---

## Features

| | Feature | Details |
|-|---------|---------|
| ✏️ | **Create tasks** | Title (60 char limit) + description |
| 📋 | **Focus view** | Always shows your 5 most recent incomplete tasks |
| ✅ | **Complete & replenish** | Mark done to hide — the next pending task slides in automatically |
| 🌗 | **Dark mode** | Follows OS preference · manual toggle · persists across sessions |
| 📱 | **Responsive** | Two-column desktop · stacked mobile |
| 🔔 | **Toast notifications** | Success/error feedback on every action |
| ✨ | **Smooth animations** | Slide-in · fade-out · hover elevation |
| 🔢 | **Smart counter** | "Showing 5 of 12" when more tasks exist |
| 👆 | **Click to expand** | Tap any task card to reveal the full description |

---

## Architecture

```mermaid
flowchart LR
    Browser(["🌐 Browser"])
    FE["React SPA\nNginx · :3000"]
    BE["Spring Boot REST API\nJava 21 · :8080"]
    DB[("PostgreSQL 16\n:5432")]

    Browser -->|HTTP| FE
    FE -- "/api/ reverse proxy" --> BE
    BE -->|JPA / Hibernate| DB
```

**Backend layer structure:**

```mermaid
flowchart LR
    C["Controller"] --> S["Service\n(interface + impl)"] --> R["Repository"] --> E["Entity"]
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21 · Spring Boot 3.2 · Spring Data JPA · Hibernate |
| **Frontend** | React 18 · TypeScript 5.4 · Vite 5 · TailwindCSS 3.4 |
| **Database** | PostgreSQL 16 (Alpine) |
| **Infra** | Docker multi-stage builds · Nginx 1.25 (reverse proxy) |
| **Testing** | JUnit 5 · Mockito · JaCoCo ≥80% · Vitest · RTL · Playwright |
| **Docs** | Springdoc OpenAPI · Swagger UI |

### Design Decisions

<details>
<summary>Why these choices?</summary>

| Decision | Rationale |
|----------|-----------|
| **PostgreSQL** over MySQL | Better partial index support; dominant in modern cloud stacks |
| **Composite DB index** `(completed, created_at DESC)` | Optimises the app's only query at any data scale |
| **`useTasks()` custom hook** | Separates data logic from presentation — React SRP |
| **Native `fetch()`** over axios | 3 API calls don't justify a library dependency |
| **H2 for test profile** | Backend tests run without Docker; evaluator runs `mvn test` independently |
| **Multi-stage Docker builds** | Minimal runtime images; build tools never ship to production |
| **Spring Actuator** | `/actuator/health` provides a real health probe for Docker orchestration |
| **JaCoCo ≥80%** | Test coverage is measured and enforced, not aspirational |
| **Dark mode** (system + toggle) | Demonstrates CSS variable strategy + localStorage persistence |
| **Optimistic updates + rollback** | Smooth UX with error resilience — state restores on API failure |

</details>

---

## API Reference

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/tasks` | `201` | Create a new task |
| `GET` | `/api/tasks` | `200` | List 5 most recent incomplete tasks |
| `PATCH` | `/api/tasks/{id}/complete` | `200` | Mark a task as completed |
| `GET` | `/api/tasks/count` | `200` | Count all incomplete tasks |

<details>
<summary>Request &amp; response examples</summary>

**POST `/api/tasks`**
```json
// Request
{ "title": "Buy groceries", "description": "Milk, eggs, and bread" }

// Response 201
{ "id": 1, "title": "Buy groceries", "description": "Milk, eggs, and bread", "completed": false, "createdAt": "2026-03-17T10:00:00" }
```

**GET `/api/tasks`**
```json
// Response 200 — array of up to 5 incomplete tasks, newest first
[
  { "id": 2, "title": "Walk the dog", "description": "30 minute walk", "completed": false, "createdAt": "2026-03-17T10:05:00" },
  { "id": 1, "title": "Buy groceries", "description": "Milk, eggs, and bread", "completed": false, "createdAt": "2026-03-17T10:00:00" }
]
```

**PATCH `/api/tasks/{id}/complete`**
```json
// Response 200
{ "id": 1, "title": "Buy groceries", "description": "Milk, eggs, and bread", "completed": true, "createdAt": "2026-03-17T10:00:00" }
```

**GET `/api/tasks/count`**
```json
// Response 200
{ "count": 7 }
```

**Validation errors — 400 Bad Request**
```json
{ "error": "Validation failed", "fields": { "title": "must not be blank" } }
```

**Not found — 404**
```json
{ "error": "Task not found with id: 999" }
```
</details>

> **Interactive docs:** http://localhost:8080/swagger-ui.html

---

## Project Structure

```
.
├── backend/
│   ├── src/main/java/com/mbtech/todoapp/
│   │   ├── config/           # CORS configuration
│   │   ├── controller/       # REST endpoints
│   │   ├── dto/              # Request/response records
│   │   ├── exception/        # Global error handling
│   │   ├── model/            # JPA entity (composite index)
│   │   ├── repository/       # Spring Data JPA
│   │   └── service/          # Business logic (interface + impl)
│   ├── src/test/             # Unit & integration tests
│   └── Dockerfile            # Multi-stage: Maven → JRE Alpine
│
├── frontend/
│   ├── src/
│   │   ├── components/       # TaskForm · TaskCard · TaskList · Toast
│   │   ├── hooks/            # useTasks · useDarkMode
│   │   ├── services/         # API fetch wrapper
│   │   └── types/            # TypeScript interfaces
│   ├── nginx.conf            # SPA fallback + /api proxy
│   └── Dockerfile            # Multi-stage: Node → Nginx Alpine
│
├── e2e/                      # Playwright end-to-end tests
├── test.sh                   # Run all unit/integration tests (Docker only)
├── e2e-test.sh               # Run E2E tests (Docker only)
├── docker-compose.yml        # Full stack orchestration
└── README.md
```

---

## Running Tests

> **Requires only Docker** — no Maven, Java, or Node installation needed.

### Unit + Integration tests

```bash
./test.sh
```

Runs **19 backend tests** (JUnit 5 + Spring Boot integration tests with H2 in-memory DB) and **14 frontend tests** (Vitest + React Testing Library) inside Docker containers.

### End-to-end tests

```bash
./e2e-test.sh
```

Builds the full stack, waits until the app is ready, runs **7 Playwright scenarios** in headless Chromium, then automatically cleans up all containers.

<details>
<summary>Run tests manually (requires Maven / Node on your machine)</summary>

**Backend**
```bash
cd backend && mvn test
```
Coverage report → `backend/target/site/jacoco/index.html` (enforced ≥80%)

**Frontend**
```bash
cd frontend && npm install && npm test
```

**E2E**
```bash
docker-compose up -d --build
cd e2e && npm install
npx playwright install chromium
npx playwright test && npx playwright show-report
```
</details>

---

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

[MIT](LICENSE) © 2026 Madhushan Andawaththa
