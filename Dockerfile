# =============================================================================
# Stage 1: Install dependencies
# =============================================================================
FROM node:23-alpine AS deps
WORKDIR /app

# Install libc6-compat for Alpine compatibility with some native modules
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm install -g npm@11 && npm ci

# =============================================================================
# Stage 2: Development (used by docker-compose for local dev with hot reload)
# =============================================================================
FROM node:23-alpine AS dev
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

# Copy pre-installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Source files are mounted as a volume in docker-compose (see docker-compose.yml)
EXPOSE 3000

CMD ["npm", "run", "dev"]

# =============================================================================
# Stage 3: Build the production bundle
# =============================================================================
FROM node:23-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# =============================================================================
# Stage 4: Production runner — minimal image with standalone output
# =============================================================================
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output bundles server.js and required node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
