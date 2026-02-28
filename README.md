# Full-Stack Portfolio — Production-Grade Monorepo

Enterprise-style developer portfolio with React 18, NestJS, PostgreSQL, Docker, GitHub Actions CI/CD, and AWS (Terraform).

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Running Frontend & Backend](#running-frontend--backend)
- [Running Tests](#running-tests)
- [CI/CD Workflow](#cicd-workflow)
- [AWS Deployment](#aws-deployment)
- [Terraform Usage](#terraform-usage)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  CloudFront CDN → S3 (static)  │  ALB → ECS Fargate (API)               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ RDS PostgreSQL│           │ ElastiCache   │           │ S3 Assets    │
└───────────────┘           │ Redis         │           └───────────────┘
                            └───────────────┘
```

**Monorepo layout:**

```
root/
├── frontend/       → React 18, TypeScript, Tailwind, Framer Motion, Vite
├── backend/        → NestJS, Prisma, PostgreSQL, JWT, Swagger, Redis, BullMQ
├── infra/          → Terraform (VPC, ECS, RDS, ALB, ECR, S3, CloudFront)
├── docker/         → Dockerfiles + docker-compose for local dev
├── .github/        → GitHub Actions (PR checks, deploy to ECS)
└── docs/           → Architecture, API, deployment documentation
```

**Website features:**

- **Hero** — Animated intro, role headline, CTAs, smooth scroll.
- **About** — Timeline, experience counters, professional summary.
- **Skills** — Filterable skill grid, animated cards, tech badges.
- **Demo 1: SaaS Admin Dashboard** — Auth, RBAC, analytics, CRUD panels, audit logs, pagination/search (UI + API).
- **Demo 2: Job Portal** — Employer/candidate workflows, job posting, resume upload, application tracking, admin panel.
- **Demo 3: Booking & Payment** — Real-time booking, Stripe-ready flow, calendar sync, revenue analytics.

---

## Prerequisites

- **Node.js** 20+
- **pnpm** or **npm** 9+
- **Docker** & **Docker Compose** (for local DB, Redis, and full stack)
- **PostgreSQL** 15+ (if running DB natively)
- **Redis** 7+ (for caching and queues)
- **AWS CLI** v2 (for deployment)
- **Terraform** 1.5+ (for infra)

---

## Local Development Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd portfolio-fullstack
npm install
```

### 2. Environment files

Copy example env and fill values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (optional; defaults point to local API)
cp frontend/.env.example frontend/.env
```

See [Environment Variables](#environment-variables) below.

### 3. Database and Redis

**Option A — Docker (recommended)**

```bash
npm run docker:up
# Starts: PostgreSQL, Redis (see docker/docker-compose.yml)
```

**Option B — Local PostgreSQL & Redis**

Ensure PostgreSQL and Redis are running; set `DATABASE_URL` and `REDIS_URL` in `backend/.env`.

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start apps

**Terminal 1 — Backend**

```bash
npm run dev:backend
# NestJS at http://localhost:3000
# Swagger at http://localhost:3000/api/docs
```

**Terminal 2 — Frontend**

```bash
npm run dev:frontend
# Vite at http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API port | `3000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/portfolio` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | long random string |
| `JWT_REFRESH_SECRET` | Refresh token secret | long random string |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `RATE_LIMIT_TTL` | Rate limit window (s) | `60` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for API | `http://localhost:3000` or `` for same-origin proxy |

### Infrastructure / CI

- AWS credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- GitHub secrets: see [docs/cicd.md](docs/cicd.md)

---

## Docker Setup

### Local development (PostgreSQL + Redis only)

```bash
npm run docker:up
```

Services:

- PostgreSQL: `localhost:5432` (user `postgres`, DB `portfolio`)
- Redis: `localhost:6379`

### Full stack with Docker Compose

```bash
cd docker
docker-compose -f docker-compose.full.yml up -d
```

Builds and runs frontend (nginx), backend (Node), plus DB and Redis. See [docker/README.md](docker/README.md) and [docs/docker.md](docs/docker.md).

### Image build (production)

```bash
docker build -t portfolio-frontend -f docker/frontend.Dockerfile frontend/
docker build -t portfolio-backend -f docker/backend.Dockerfile backend/
```

---

## Running Frontend & Backend

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Vite dev server (HMR) |
| `npm run dev:backend` | NestJS in watch mode |
| `npm run build:frontend` | Production build to `frontend/dist` |
| `npm run build:backend` | NestJS build to `backend/dist` |
| `npm run db:studio` | Open Prisma Studio for DB |

API base URL is controlled by `VITE_API_URL`. In dev, use proxy in `vite.config.ts` or set `VITE_API_URL=http://localhost:3000`.

---

## Running Tests

```bash
# Frontend (Vitest)
npm run test:frontend

# Backend (Jest)
npm run test:backend

# Lint all
npm run lint
```

---

## CI/CD Workflow

- **Pull requests**: Lint, unit tests, and build for both frontend and backend. See [.github/workflows/pr.yml](.github/workflows/pr.yml).
- **Push to `main`**: Build Docker images, push to ECR, run Terraform plan/apply, deploy to ECS with rolling update. See [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and [docs/cicd.md](docs/cicd.md).

Required GitHub secrets:

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- `ECR_REGISTRY` (optional; can be derived)
- `TF_STATE_BUCKET`, `TF_STATE_KEY`, `TF_STATE_REGION` (if using S3 backend for Terraform)

---

## AWS Deployment

1. **Configure AWS CLI** and ensure credentials have permissions for ECS, ECR, RDS, S3, CloudFront, IAM, etc.
2. **Terraform**:
   ```bash
   cd infra
   terraform init
   terraform plan -var-file=environments/production.tfvars
   terraform apply -var-file=environments/production.tfvars
   ```
3. **CI/CD**: Pushing to `main` triggers build and deploy. Ensure GitHub secrets are set.
4. **Manual deploy**: Build images, push to ECR, update ECS service (see [docs/deployment.md](docs/deployment.md)).

Detailed steps, rollback, and blue/green strategy are in [docs/deployment.md](docs/deployment.md) and [docs/terraform.md](docs/terraform.md).

---

## Terraform Usage

- **Initialize**: `cd infra && terraform init`
- **Plan**: `terraform plan -var-file=environments/production.tfvars`
- **Apply**: `terraform apply -var-file=environments/production.tfvars`
- **Destroy**: `terraform destroy -var-file=environments/production.tfvars`

State is configured for S3 + DynamoDB (optional). See [docs/terraform.md](docs/terraform.md) for modules (VPC, ECS, RDS, S3, CloudFront, IAM, etc.) and cost/security notes.

---

## Troubleshooting

### Database connection refused (P1001 / "Can't reach database server")

- **Start PostgreSQL:** From repo root run `docker compose -f docker/docker-compose.yml up -d` (requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) to be running). This starts Postgres and Redis on `localhost:5432` and `6379`.
- **Without Docker:** Use a free cloud PostgreSQL (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com)), create a database, then set `DATABASE_URL` in `backend/.env` to the provided connection string. Run `npx prisma migrate deploy` and `npm run prisma:seed` in `backend/`.
- Check `DATABASE_URL` in `backend/.env` (host, port, user, password, DB name).

### Redis connection refused

- Start Redis: `docker run -d -p 6379:6379 redis:7-alpine` or use `npm run docker:up`.

### CORS errors in browser

- Set `CORS_ORIGIN` in backend to your frontend origin (e.g. `http://localhost:5173`).
- In production, set to your CloudFront or domain origin.

### Prisma migrations fail

- Ensure DB is empty or compatible. For a fresh DB: `npx prisma migrate reset` (destructive).
- Check `schema.prisma` and fix any drift.

### ECS deployment fails in CI

- Check ECR push permissions and image names in workflow.
- Verify ECS task definition and service (CPU/memory, subnets, security groups).
- See CloudWatch logs for the ECS service.

### Terraform apply fails

- Run `terraform plan` and fix any resource conflicts or missing variables.
- Ensure AWS credentials and region are correct; check IAM permissions for Terraform.

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE_FLOW_AND_DEPLOYMENT.md](docs/ARCHITECTURE_FLOW_AND_DEPLOYMENT.md) | Code flow (backend, frontend, infra), diagrams, hosting & CI/CD overview |
| [docs/FULL_DEPLOYMENT_GUIDE.md](docs/FULL_DEPLOYMENT_GUIDE.md) | **Full guide: Git to live – each step for adding to Git and full deployment** |
| [docs/architecture.md](docs/architecture.md) | System design, diagrams, scalability |
| [docs/frontend.md](docs/frontend.md) | React architecture, components, SEO, performance |
| [docs/backend.md](docs/backend.md) | NestJS structure, API design, auth, queues |
| [docs/database.md](docs/database.md) | PostgreSQL and Prisma schema design |
| [docs/docker.md](docs/docker.md) | Docker architecture and optimization |
| [docs/cicd.md](docs/cicd.md) | GitHub Actions pipelines and rollback |
| [docs/terraform.md](docs/terraform.md) | AWS infrastructure and Terraform |
| [docs/deployment.md](docs/deployment.md) | Full production deployment guide |

---

## License

Private / Portfolio use.
