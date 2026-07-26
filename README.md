# TaskMaster

TaskMaster is a high-performance, full-stack task assignment and project management ecosystem. Built on a premium, dark-themed responsive user interface and a robust, multi-service Spring Boot backend, it offers agile workspace workflows, automated containerization pipelines, and real-time operations tracking.

---

## 🏗️ System Architecture

TaskMaster is structured as a unified monorepo separating modular client-side layout spaces from decoupled backend microservices, fronted by a single API gateway.

```text
taskmaster/
├── backend/                # Multi-service Backend Workspace
│   ├── gateway/            # API Gateway — Feign-based request routing & auth (Port 8083)
│   ├── backend/            # Core Task, Project, & User/Auth Management (Port 8080)
│   ├── comment/            # Decoupled Comment & Thread Service (Port 8081)
│   └── reports/            # Activity & Audit Log Reporting Service (Port 8082)
├── frontend/                # Client Application Workspace (React + Vite)
│   ├── src/
│   │   ├── components/     # Global Layout components (Sidebar, DashboardLayout)
│   │   ├── pages/          # View layers (Login, Register, Dashboard Canvas)
│   │   ├── store/          # Centralized state engine (Zustand Global Auth)
│   │   └── lib/            # Shared networking client modules (Axios instance)
├── docker-compose.yaml     # Local Multi-Container Orchestration Configuration
└── README.md               # Project Documentation
```

---

## 🔀 Request Flow

All client traffic enters through a single **API Gateway**, which authenticates requests and routes them to the appropriate downstream microservice via declarative **Feign clients**.

```text
                        ┌────────────────┐
                        │  Vite frontend │
                        │ (React, Axios) │
                        └───────┬────────┘
                                │  cookie (JWT)
                                ▼
                        ┌────────────────┐
                        │   API gateway  │
                        │ JwtAuthFilter  │
                        │ Feign clients  │
                        └───────┬────────┘
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │comment-service│ │backend-service│ │report-service│
      │  port 8081    │ │  port 8080    │ │  port 8082   │
      │  comments     │ │ tasks / auth  │ │  audit logs  │
      └───────┬───────┘ └───────┬───────┘ └──────┬───────┘
              │                 │                │
              │                 ▼                │
              │         ┌───────────────┐        │
              │         │    redis      │        │
              │         │ cache check   │        │
              │         │  port 6379    │        │
              │         └───────┬───────┘        │
              │                 │                │
              ▼                 ▼                ▼
        ┌─────────────────────────────────────────────┐
        │           external PostgreSQL               │
        │        (shared across all services)         │
        └─────────────────────────────────────────────┘
```

---

## 🧩 Services

| Service | Port | Responsibility |
|---|---|---|
| **gateway** | 8083 | Single entry point for the frontend. Validates JWT cookies, forwards auth context to downstream services via Feign `RequestInterceptor`, and relays `Set-Cookie` headers back to the browser. |
| **backend** (core) | 8080 | Owns task, project, and user/auth domain logic, including login and JWT/cookie issuance. |
| **comment** | 8081 | Manages comments and threaded discussions tied to tasks. |
| **reports** | 8082 | Generates activity and audit logs (e.g. "Updated description to: X") for tasks. |
| **redis** | 6379 | Cache layer for `backend-service` — checked before falling through to PostgreSQL on reads. |
| **PostgreSQL** | 5432 (external) | Shared relational datastore across backend, comment, and reports services. |

---

## 🔐 Authentication Flow

1. The frontend submits login credentials to the gateway.
2. The gateway forwards the request to `backend-service`, which validates credentials and issues a JWT as an `HttpOnly` cookie.
3. The gateway captures the `Set-Cookie` header from the backend response and re-attaches it to its own response so the browser stores it.
4. On subsequent requests, the browser sends the cookie to the gateway; a Feign `RequestInterceptor` forwards that cookie header to whichever downstream service the gateway calls, so auth state is preserved across all microservices.

---

## 🚀 Running Locally

```bash
docker compose up --build
```

This builds and starts the gateway, backend, comment, and reports services alongside Redis. PostgreSQL is provisioned externally (see `.env` for `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

The frontend runs separately via Vite:

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Tech Stack

- **Backend:** Java 17, Spring Boot, Spring Cloud OpenFeign, Spring Security, Spring Data JPA
- **Auth:** JWT (`jjwt`), HttpOnly cookies
- **Database:** PostgreSQL (external), Redis (cache/session)
- **Frontend:** React, Vite, Zustand, Axios
- **Infra:** Docker, Docker Compose
