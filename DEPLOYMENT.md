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

1. **Frontend**: Connect your repository to Vercel. Next.js 15 is supported out of the box. Configure the environment variables in the Vercel dashboard.
2. **Backend**: Deploy the NestJS app to a platform like Render, Railway, or a VPS.
3. **Database & Auth**: Use Supabase for PostgreSQL and Authentication.
4. **Vector DB**: Use Qdrant Cloud or self-host Qdrant.

## CI/CD with GitHub Actions

The project includes GitHub Actions workflows for:
- **CI**: Runs linting and builds on every pull request to `main`.
- **Deploy**: Automatically builds Docker images and pushes to DockerHub, then triggers a deployment on the VPS via SSH.

## Monitoring and Health Checks

- Backend health check: `GET /api/health` (to be implemented)
- Docker health checks are configured in `docker-compose.yml` for PostgreSQL.
- NGINX is configured as a reverse proxy with WebSocket support.
