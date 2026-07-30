# TaskMaster

TaskMaster is a high-performance, full-stack task assignment and project management ecosystem. Built on a premium, dark-themed responsive user interface and a robust, multi-service Spring Boot backend, it offers agile workspace workflows, automated containerization pipelines, scheduled batch operations, and real-time activity tracking.

---

## 🏗️ System Architecture

TaskMaster is structured as a unified monorepo separating modular client-side layout spaces from decoupled backend microservices and automated background workers, fronted by a single API gateway.

taskmaster/
├── backend/                # Multi-service Backend Workspace
│   ├── gateway/            # API Gateway — Feign-based request routing & auth (Port 8083)
│   ├── backend/            # Core Task, Project, & User/Auth Management (Port 8080)
│   ├── comment/            # Decoupled Comment & Thread Service (Port 8081)
│   ├── reports/            # Activity & Audit Log Reporting Service (Port 8082)
│   └── scheduler/          # Cron Batch Engine — Triggers daily maintenance calls (Port 8084)
├── frontend/               # Client Application Workspace (React + Vite)
│   ├── src/
│   │   ├── components/     # Global Layout components (Sidebar, DashboardLayout)
│   │   ├── pages/          # View layers (Login, Register, Dashboard Canvas)
│   │   ├── store/          # Centralized state engine (Zustand Global Auth)
│   │   └── lib/            # Shared networking client modules (Axios instance)
├── docker-compose.yaml     # Local Multi-Container Orchestration Configuration
└── README.md               # Project Documentation

---

## 🔀 Request Flow & Background Jobs

All client traffic enters through a single API Gateway, which authenticates requests and routes them to the appropriate downstream microservice via declarative Feign clients. In the background, an asynchronous Scheduler Engine triggers daily maintenance routines across all three backend microservices.

                    +--------------------------+
                    |      Vite Frontend       |
                    |      (React, Axios)      |
                    +------------+-------------+
                                 | cookie (JWT)
                                 v
                    +--------------------------+
                    |       API Gateway        |
                    |      JwtAuthFilter       |
                    |      Feign Clients       |
                    +------------+-------------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
+-----------------+     +-----------------+     +-----------------+
| Comment Service |     | Backend Service |     | Report Service  |
|    Port 8081    |     |    Port 8080    |     |    Port 8082    |
|   (Comments)    |     |  (Tasks / Auth) |     |  (Audit Logs)   |
+----+-------+----+     +--+----+----+--+-+     +----+-------+----+
     ^       |             |    |    ^  |            ^       |
     |       |             |    |    |  v            |       |
     |       |   Batch     |    |  +-------+         |       |
     |       |  Trigger    |    |  | Redis |         |       |
     |       |   Calls     |    |  | Cache |         |       |
     |       | (Daily 8AM) |    |  +-------+         |       |
     |       |             |    |                    |       |
     |       |             |    | (Cache Miss:       |       |
     |       |             |    |  DB Fallback)      |       |
+----+-------+-------------+----+--------------------+-------+----+
|                         Scheduler                               |
|                         Port 8084                               |
+-----------------------------------------------------------------+
     |                         |                             |
     |                         v (Direct DB Reads / Writes)  |
     v               +-------------------+                   v
     +------------->|External PostgreSQL|<-------------------+
                     | (Shared Datastore)|
                     +-------------------+

---

## 🧩 Services

| Service | Port | Responsibility |
|---|---|---|
| gateway | 8083 | Single entry point for the frontend. Validates JWT cookies, forwards auth context to downstream services via Feign RequestInterceptor, and relays Set-Cookie headers back to the browser. |
| backend (core) | 8080 | Owns task, project, and user/auth domain logic. Checks Redis on read operations; on a cache miss, queries PostgreSQL directly and populates Redis. |
| comment | 8081 | Manages comments and threaded discussions tied to tasks. Performs scheduled maintenance triggered by scheduler. |
| reports | 8082 | Generates activity and audit logs for tasks. Performs scheduled cleanup/sync triggered by scheduler. |
| scheduler | 8084 | Lightweight cron worker that triggers API calls across comment, backend, and report services daily at 8:00 AM. |
| redis | 6379 | Cache layer strictly for backend-service — checked on reads and evicted on task updates. |
| PostgreSQL | 5432 (external) | Shared relational datastore across backend, comment, and reports services. |

---

## ⏰ Scheduled Tasks & Archiving

TaskMaster uses a dedicated Scheduler service to initiate daily batch cleanup jobs across all services:

* Cron Schedule: 0 0 8 * * ? (Runs automatically every day at 8:00 AM)
* Automated Service Calls: Sends automated trigger requests to `comment-service`, `backend-service`, and `report-service` to run their respective maintenance pipelines.
* Database Execution: `backend-service` executes UPDATE Task t SET t.del = 1 WHERE t.status = 'CLOSED' AND t.del = 0 to soft-delete all closed tasks.
* Cache Invalidation: `backend-service` triggers Redis cache eviction (evictTaskEntriesCache()) directly after soft-deleting closed tasks to ensure fresh read state across all clients.

---

## 🔐 Authentication Flow

1. The frontend submits login credentials to the gateway.
2. The gateway forwards the request to backend-service, which validates credentials and issues a JWT as an HttpOnly cookie.
3. The gateway captures the Set-Cookie header from the backend response and re-attaches it to its own response so the browser stores it.
4. On subsequent requests, the browser sends the cookie to the gateway; a Feign RequestInterceptor forwards that cookie header to whichever downstream service the gateway calls, so auth state is preserved across all microservices.

---

## 🚀 Running Locally

docker compose up --build

This builds and starts the gateway, backend, comment, reports, and scheduler services alongside Redis. PostgreSQL is provisioned externally (see .env for DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD).

The frontend runs separately via Vite:

cd frontend
npm install
npm run dev

---

## 📦 Tech Stack

- Backend: Java 17, Spring Boot (@Scheduled), Spring Cloud OpenFeign, Spring Security, Spring Data JPA
- Auth: JWT (jjwt), HttpOnly cookies
- Database: PostgreSQL (external), Redis (cache/session for backend-service)
- Frontend: React, Vite, Zustand, Axios
- Infra: Docker, Docker Compose
