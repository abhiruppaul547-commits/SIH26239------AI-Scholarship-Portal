# SIH26239 AI Scholarship Portal - CI/CD & MVP Blueprint

Act as an expert DevOps and Full-Stack AI Coding Agent.
Goal: 100% automated deployment (Caddy SSL, DuckDNS, Docker, Next.js UI, Firebase).
CRITICAL RULE: Execute this plan strictly ONE PHASE AT A TIME. Stop and ask for confirmation before proceeding.

## Global Configuration

- Production URL: https://sih2639-ps.duckdns.org
- DuckDNS Token: 6a8aa58c-0cfe-4b1f-b7f1-db4108604d2f
- Firebase Project: ai-based-scholarship-portal

---

## Phase 1: Environment, OS Firewall & Caddy

1. Create `.env` in root with: `DUCKDNS_TOKEN=6a8aa58c-0cfe-4b1f-b7f1-db4108604d2f`. Add `.env` to `.gitignore`.
2. Create `scripts/setup-firewall.sh` to allow TCP ports 80 and 443 via iptables (`sudo iptables -I INPUT 6 -m state --state NEW -p tcp -m multiport --dports 80,443 -j ACCEPT || true`), then run it.
3. Create `Caddyfile`:
   sih2639-ps.duckdns.org {
   encode zstd gzip
   handle /api/core/_ { reverse_proxy core-backend:8080 }
   handle /api/ai/_ { reverse_proxy ai-service:8000 }
   handle { reverse_proxy frontend:3000 }
   }
4. Create `docker-compose.yml` with custom `app-network`.
   CRITICAL: ONLY expose `caddy` ports (80:80, 443:443). Do NOT expose frontend/backend ports to host.
   - `caddy` (caddy:alpine, mounts Caddyfile, caddy_data, caddy_config).
   - `duckdns-updater` (curlimages/curl:latest, loop every 300s: `curl -s "https://www.duckdns.org/update?domains=sih2639-ps&token=${DUCKDNS_TOKEN}&ip="`).
   - `frontend` (build: ./frontend).
   - `core-backend` (build: ./core-backend).
   - `ai-service` (build: ./ai-service, mem_limit: 8G).

---

## Phase 2: Microservice Scaffolding & Dockerfiles

1. AI Service: In `ai-service/`, create `requirements.txt` (fastapi, uvicorn) and `main.py` (`GET /api/ai/health`). Create Python 3.10-slim `Dockerfile`.
2. Core Backend: In `core-backend/`, run: `curl https://start.spring.io/starter.zip -d dependencies=web -d name=core-backend -d artifactId=core-backend -d baseDir=. -o spring-backend.zip && unzip -o spring-backend.zip && rm spring-backend.zip`. Add `GET /api/core/health` and a multi-stage Maven/Temurin 17 `Dockerfile`.
3. Frontend: In `frontend/next.config.js`, set `output: 'standalone'`. Create multi-stage `frontend/Dockerfile`. CRITICAL: In runner stage, copy `public` and `.next/static` to standalone dir.

---

## Phase 3: Firebase RTDB Setup (Frontend)

1. In `frontend/`, run `npm install firebase`.
2. Create `frontend/src/lib/firebase.ts` with these credentials:
   `apiKey: "AIzaSyCEFieEA9T8Ijg-U_mxdvchu4xnsrCHWOk"`
   `authDomain: "ai-based-scholarship-portal.firebaseapp.com"`
   `databaseURL: "https://ai-based-scholarship-portal-default-rtdb.asia-southeast1.firebasedatabase.app"`
   `projectId: "ai-based-scholarship-portal"`
   `storageBucket: "ai-based-scholarship-portal.firebasestorage.app"`
   `messagingSenderId: "335723314161"`
   `appId: "1:335723314161:web:5a8b2cd44dcfbef4e8e250"`
   Export `auth`, `googleProvider`, `db`.
3. Create `frontend/src/lib/databaseService.ts` with `saveApplication(userId, data)` and `getApplicationStatus(userId)`.

---

## Phase 4: UI & Context

1. Create `frontend/src/context/AuthContext.tsx` (`use client`, `onAuthStateChanged`). Wrap layout.
2. Create `frontend/src/app/login/page.tsx` (Tailwind UI, Google SSO, redirect to `/dashboard`).
3. Create `frontend/src/app/dashboard/page.tsx`. Protect with `useAuth`. Scholarship form submits via `saveApplication`. Fetch backend APIs via relative paths (`/api/core/health`).

---

## Phase 5: Professional README

1. Overhaul `README.md`.
2. Add dynamic Shields.io badges.
3. Add prominent "🚀 Live Demo" link to `https://sih2639-ps.duckdns.org`.
4. Embed Mermaid.js flowchart (User -> Caddy -> Microservices).
5. Add `docker compose up -d` instructions.

---

## Phase 6: Launch & Git Push

1. Create `scripts/launch.sh`: runs `docker compose up -d --build`, tails Caddy logs for 10s. Run it.
2. `git add .`, `git commit -m "feat: MVP automated launch"`, `git push origin main`.
