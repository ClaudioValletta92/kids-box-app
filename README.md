# Kids Box App

A Next.js 15 application with App Router, TypeScript, and Tailwind CSS — fully containerized with Docker.

## Tech stack

- [Next.js 15](https://nextjs.org/) — App Router
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Docker](https://www.docker.com/) + Docker Compose

## Project structure

```
.
├── src/
│   └── app/
│       ├── globals.css       # Global styles (Tailwind entry point)
│       ├── layout.tsx        # Root layout
│       └── page.tsx          # Home page
├── public/                   # Static assets
├── Dockerfile                # Multi-stage: dev | builder | runner
├── docker-compose.yml        # Local development with hot reload
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.example              # Environment variable template
└── .gitignore
```

## Getting started

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 2. Environment setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (the defaults work for local development).

### 3. Run with Docker

```bash
docker compose up
```

The first run will build the image (this takes a minute). On subsequent runs it starts immediately.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Stop

```bash
docker compose down
```

## Development workflow

| Task | Command |
|---|---|
| Start (with Docker) | `docker compose up` |
| Start in background | `docker compose up -d` |
| Rebuild image | `docker compose up --build` |
| Stop containers | `docker compose down` |
| View logs | `docker compose logs -f app` |
| Run shell inside container | `docker compose exec app sh` |

Source files are mounted as a volume — changes are reflected immediately with hot reload. No rebuild needed during development.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app | `http://localhost:3000` |

Add new variables to `.env.example` (without real values) and to `.env.local` (with real values).

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep secrets server-side only.

## Production build (local test)

```bash
docker build --target runner -t kids-box-app:prod .
docker run -p 3000:3000 --env-file .env.local kids-box-app:prod
```
