# MAXR — AI Customer Support Chatbot Platform

A production-ready AI customer support chatbot SaaS platform with RAG-powered knowledge retrieval, lead capture, admin takeover, and multi-provider AI support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack React Query |
| **Backend** | NestJS, TypeScript, REST API, WebSocket (Socket.IO) |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth, JWT, RBAC |
| **AI** | OpenAI (GPT-4o-mini), Groq (Llama 3), provider abstraction |
| **Vector Search** | Qdrant |
| **Infra** | Docker, Docker Compose, GitHub Actions, Vercel |

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local Qdrant + PostgreSQL)
- Supabase project (or local PostgreSQL)

### 1. Clone & Install

```bash
git clone https://github.com/arun-kumar-001/maxrchatbot.git
cd maxrchatbot

# Backend
cd backend && npm install
cp .env.example .env  # Fill in your API keys

# Frontend
cd ../frontend && npm install
cp .env.example .env
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL and Qdrant
docker compose up -d db qdrant
```

### 3. Run Backend

```bash
cd backend
npm run start:dev
```

The API will be available at `http://localhost:3001/api`. Swagger docs at `http://localhost:3001/api/docs`.

### 4. Run Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

```
maxrchatbot/
├── backend/
│   ├── src/
│   │   ├── modules/     # auth, chat, leads, services, knowledge, admin, analytics, health
│   │   ├── core/        # AI providers, Qdrant, Supabase, security
│   │   └── common/      # guards, decorators, filters, interceptors
│   ├── test/            # e2e tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # shadcn/ui + widget + admin components
│   │   ├── hooks/       # React Query + Socket.IO hooks
│   │   ├── store/       # Zustand stores
│   │   └── lib/         # API client, utilities
│   └── package.json
├── supabase/
│   └── migrations/      # Database schema
├── docker-compose.yml   # Local infrastructure
└── .github/             # CI/CD pipelines
```

## Available Scripts

### Backend

| Script | Purpose |
|--------|---------|
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:cov` | Run tests with coverage |

### Frontend

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run typecheck` | TypeScript check |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_KEY` | Yes | Supabase anon/public key |
| `JWT_SECRET` | Yes | JWT signing secret |
| `OPENAI_API_KEY` | One of | OpenAI API key |
| `GROQ_API_KEY` | One of | Groq API key |
| `AI_PROVIDER` | No | `openai` or `groq` (default: openai) |
| `QDRANT_URL` | No | Qdrant URL (default: localhost:6333) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | Yes | Backend WebSocket URL |

## API Endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/health` | No | Health check |
| `POST /api/auth/login` | No | User login |
| `POST /api/auth/register` | No | User registration |
| `POST /api/chat/message` | JWT | Send chat message |
| `GET /api/chat/history/:id` | JWT | Get conversation history |
| `POST /api/chat/escalate` | JWT | Escalate to human agent |
| `GET/POST /api/leads` | JWT* | Lead management |
| `GET /api/admin/dashboard` | JWT+Admin | Dashboard stats |
| `GET /api/admin/conversations` | JWT+Admin | All conversations |
| `POST /api/admin/takeover` | JWT+Admin | Admin takeover |
| `GET/POST /api/knowledge` | JWT+Admin* | Knowledge base |
| `GET /api/knowledge/search` | No | Semantic search |
| `POST /api/knowledge/reindex` | JWT+Admin | Reindex all articles |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel, Docker, and VPS deployment guides.
