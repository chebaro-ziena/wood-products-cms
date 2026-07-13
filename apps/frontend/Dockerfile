# Build from the monorepo root:
#   docker build -f apps/frontend/Dockerfile \
#     --build-arg NEXT_PUBLIC_API_URL=https://your-backend.onrender.com \
#     -t wood-products-frontend .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable

# 1. Prune the monorepo down to what the frontend actually needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2.3.3
COPY . .
RUN turbo prune frontend --docker

# 2. Install dependencies and build
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm config set network-concurrency 4 && pnpm config set fetch-timeout 300000
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# NEXT_PUBLIC_* values are baked into the client bundle at build time,
# so this must be supplied as a build arg (Render passes dashboard env
# vars through as build args automatically for Docker services).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter frontend run build

# 3. Minimal runtime image using Next's standalone output
FROM base AS runner
WORKDIR /app
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=installer /app/apps/frontend/public ./apps/frontend/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static

USER nextjs
WORKDIR /app/apps/frontend

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
