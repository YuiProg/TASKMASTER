# TaskMaster

TaskMaster is a high-performance, full-stack task assignment and project management ecosystem. Built on a premium, dark-themed responsive user interface and a robust, multi-service Spring Boot backend, it offers agile workspace workflows, automated containerization pipelines, and real-time operations tracking.

---

## 🏗️ System Architecture

The project is structured as a unified monorepo separating modular client-side layout spaces from decoupled microservices:

```text
taskmaster/
├── backend/            # Multi-service Backend Workspace
│   ├── backend/        # Core Task, Project, & Branch Management (Port 8080)
│   └── comment/        # Decoupled Comment & Thread Service (Port 8081)
├── frontend/           # Client Application Workspace (React + Vite)
│   ├── src/
│   │   ├── components/ # Global Layout components (Sidebar, DashboardLayout)
│   │   ├── pages/      # View layers (Login, Register, Dashboard Canvas)
│   │   ├── store/      # Centralized state engine (Zustand Global Auth)
│   │   └── lib/        # Shared networking client modules (Axios instance)
├── docker-compose.yaml # Local Multi-Container Orchestration Configuration
└── README.md           # Project Documentation
