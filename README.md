# TaskMaster

TaskMaster is a full-stack, microservice-based task assignment and project management application. It features a React-based user interface and a decoupled, multi-service Spring Boot backend utilizing a centralized API gateway framework, secure JWT-based stateless authentication, and automated local containerization.

---

## 🏗️ System Architecture

The project is structured as a unified repository containing distinct workspaces for the client and backend service tiers:

```text
taskmaster/
├── backend/            # Multi-service Backend Workspace
│   ├── backend/        # Core Task & Project Management Service (Port 8080)
│   └── comment/        # Decoupled Comment & Thread Service (Port 8081)
├── frontend/           # Client Application Workspace (React + Vite)
├── docker-compose.yaml # Local Multi-Container Orchestration Configuration
└── README.md           # Project Documentation
