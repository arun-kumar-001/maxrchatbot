# MAXR Deployment Guide

This guide covers the deployment of the MAXR AI customer support chatbot platform.

## Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Supabase account (for production database and auth)
- OpenAI and/or Groq API keys

## Local Development

1. Clone the repository.
2. Copy the `.env.example` files:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Update the `.env` files with your local settings.
4. Spin up the infrastructure:
   ```bash
   docker-compose up --build
   ```
5. The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Production Deployment

### Option 1: VPS with Docker Compose

1. Set up a VPS (e.g., DigitalOcean, AWS EC2).
2. Install Docker and Docker Compose.
3. Clone the repo to the VPS.
4. Configure production environment variables.
5. Run `docker-compose -f docker-compose.prod.yml up -d` (if you have a production-specific compose file, otherwise use the standard one with production overrides).

### Option 2: Vercel + Supabase

1. **Frontend**: Create a Vercel project and set the root directory to `frontend`.
2. **Build settings**:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `.next`
3. **Environment variables**: Configure the following in the Vercel dashboard for each environment:
   - `NEXT_PUBLIC_API_URL` — production backend URL
   - `NEXT_PUBLIC_WS_URL` — production websocket URL
4. **Backend**: Deploy the NestJS app separately to Render, Railway, a VPS, or another server.
5. **Database & Auth**: Use Supabase for PostgreSQL and Authentication.
6. **Vector DB**: Use Qdrant Cloud or self-host Qdrant.

> Note: The frontend and backend are deployed separately. The frontend reads the backend URL from `NEXT_PUBLIC_API_URL`.

## CI/CD with GitHub Actions

The project includes GitHub Actions workflows for:
- **CI**: Runs linting and builds on every pull request to `main`.
- **Deploy**: Automatically builds Docker images and pushes to DockerHub, then triggers a deployment on the VPS via SSH.

## Monitoring and Health Checks

- Backend health check: `GET /api/health` (to be implemented)
- Docker health checks are configured in `docker-compose.yml` for PostgreSQL.
- NGINX is configured as a reverse proxy with WebSocket support.
