# ✅ Todo App

> A clean, modern full-stack task management application — built with **Java 21**, **React 18**, and **PostgreSQL 16**, containerised with **Docker**.

Built as part of the **MB Technologies** engineering assessment.

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Create tasks** with a title and description
- **View the 5 most recent** incomplete tasks at a glance
- **Mark tasks as done** — completed tasks are hidden; the next pending task automatically appears
- **Dark mode** — follows OS preference, with a manual sun/moon toggle that persists across sessions
- **Responsive layout** — two-column on desktop, stacked on mobile
- **Success toast notifications** on task creation
- **Smooth animations** — slide-in for new tasks, fade-out on completion, hover elevation on cards
- **Smart task counter** — shows "Showing 5 of 12" when more tasks exist beyond the visible window

---

## Tech Stack

| Layer | Technology |
|------------|-----------|
| **Database** | PostgreSQL 16 (Alpine) |
| **Backend** | Java 21 · Spring Boot 3.2 · Spring Data JPA · Hibernate |
| **Frontend** | React 18 · TypeScript · Vite 5 · TailwindCSS 3.4 |
| **Infra** | Docker · docker-compose · Nginx 1.25 (reverse proxy + SPA) |
| **Testing** | JUnit 5 · Mockito · JaCoCo (≥80%) · Vitest · React Testing Library · Playwright |
| **API Docs** | Springdoc OpenAPI · Swagger UI |

---

## Architecture

```
┌──────────────────┐     ┌──────────────────────────┐     ┌──────────────┐
│   React SPA      │────▶│  Spring Boot REST API     │────▶│  PostgreSQL  │
│   (Nginx:3000)   │     │  (Java 21 :8080)          │     │  (5432)      │
└──────────────────┘     └──────────────────────────┘     └──────────────┘
```

**Backend layers:** `Controller → Service (interface) → Repository → Entity`

**SOLID principles applied:**
- **SRP** — Each class owns one responsibility (HTTP mapping ↔ business logic ↔ data access)
- **DIP** — Controller depends on `TaskService` interface, not the implementation
- **OCP** — New behaviour (e.g., count endpoint) added without modifying existing code

---

## API Endpoints

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/tasks` | `201` | Create a new task |
| `GET` | `/api/tasks` | `200` | Fetch 5 most recent incomplete tasks |
| `PATCH` | `/api/tasks/{id}/complete` | `200` | Mark a task as completed |
| `GET` | `/api/tasks/count` | `200` | Total count of incomplete tasks |

Interactive API docs: **http://localhost:8080/swagger-ui.html**

---

## Quick Start

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and docker-compose.

```bash
git clone https://github.com/MadhushanAndawaththa/todo-five.git
cd todo-five
docker-compose up --build
```

Open **http://localhost:3000** in your browser.

> The first build downloads Maven and npm dependencies inside Docker (~2 min). Subsequent builds use cached layers and are much faster.

---

## Running Tests

### Backend — unit + integration (no Docker required)

```bash
cd backend
./mvnw test
```

Coverage report: `backend/target/site/jacoco/index.html`  
Enforced minimum: **80% line coverage** via JaCoCo.

### Frontend — component tests

```bash
cd frontend
npm install
npm test
```

### End-to-end — Playwright (requires running stack)

```bash
docker-compose up --build -d

cd e2e
npm install
npx playwright install chromium
npx playwright test
```

---

## Project Structure

```
todo-app/
├── backend/
│   ├── src/main/java/com/mbtech/todoapp/
│   │   ├── config/          CorsConfig
│   │   ├── controller/      TaskController (REST endpoints)
│   │   ├── dto/             CreateTaskRequest · TaskResponse (Java records)
│   │   ├── exception/       GlobalExceptionHandler · TaskNotFoundException
│   │   ├── model/           Task (JPA entity, composite index)
│   │   ├── repository/      TaskRepository (Spring Data JPA)
│   │   └── service/         TaskService (interface) · TaskServiceImpl
│   ├── src/test/            Unit tests (Mockito) · Integration tests (MockMvc + H2)
│   └── Dockerfile           Multi-stage Maven → JRE Alpine
│
├── frontend/
│   ├── src/
│   │   ├── components/      TaskForm · TaskCard · TaskList + co-located tests
│   │   ├── hooks/           useTasks (data) · useDarkMode (theme)
│   │   ├── services/        api.ts (fetch wrapper)
│   │   ├── utils/           timeAgo.ts
│   │   └── types/           Task.ts
│   ├── public/              favicon.svg
│   ├── nginx.conf           SPA fallback + /api reverse proxy
│   └── Dockerfile           Multi-stage Node → Nginx Alpine
│
├── e2e/
│   └── tests/               Playwright end-to-end tests
│
├── docker-compose.yml       PostgreSQL · Backend · Frontend
└── README.md
```

---

## Design Decisions

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

---

## License

This project is licensed under the [MIT License](LICENSE).
