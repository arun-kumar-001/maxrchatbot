# MAXR Bot Platform

Botpress-style conversational platform: **visual workflows**, **white webchat**, **RAG knowledge**, **human handoff**, and **Bot Studio** — built with **NestJS** + **Next.js**.

## Features (Botpress-like)

| Feature | Description |
|---------|-------------|
| **Workflows** | Visual editor: start, message, choice, AI (RAG), capture, handoff, end |
| **Webchat** | White-theme embeddable widget on the home page |
| **Knowledge** | Upload articles → Qdrant embeddings → used in AI nodes |
| **Conversations** | Inbox in Studio with live message history |
| **Analytics** | Conversation counts, escalations, leads |
| **Publish** | Save workflow → goes live for all new sessions |

## Quick start

### 1. Environment

```bash
copy backend\.env.example backend\.env
```

Set at minimum: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`, `QDRANT_URL`

```bash
# frontend
echo NEXT_PUBLIC_API_URL=http://localhost:3001 > frontend\.env.local
```

### 2. Database

Run Supabase migrations in `supabase/migrations/` (including `20240603000000_botpress_flows.sql`).

### 3. Run

```bash
# Terminal 1 — API (port 3001)
cd backend
npm run start:dev

# Terminal 2 — UI (port 3000)
cd frontend
npm run dev
```

- **Home + webchat:** http://localhost:3000  
- **Bot Studio:** http://localhost:3000/studio  
- **Workflow editor:** http://localhost:3000/studio/workflows  

## API overview

| Endpoint | Purpose |
|----------|---------|
| `POST /api/bot/session` | Start webchat session (runs flow) |
| `POST /api/bot/message` | User message → flow engine |
| `GET /api/bot/history/:id` | Message history |
| `GET /api/studio/flow` | Load published workflow |
| `PUT /api/studio/flow` | Publish workflow |
| `GET /api/studio/conversations` | Studio inbox |
| `POST /api/studio/knowledge` | Add RAG article |

## Architecture

```
Webchat (Next.js) → Bot API → Flow Engine → Supabase + Qdrant + OpenAI/Groq
Studio (Next.js)  → Studio API → Flow store + Knowledge + Analytics
```

Default workflow is bundled in `backend/src/flows/default-flow.json` and synced to Supabase `settings.published_flow` when you click **Publish** in Studio.
