# Build from the monorepo root:
#   docker build -f apps/backend/Dockerfile -t wood-products-backend .

FROM node:22-alpine AS base
# python3/make/g++ are needed to compile the bcrypt native addon from
# source - Alpine's musl libc can't use bcrypt's prebuilt glibc binary.
RUN apk add --no-cache libc6-compat openssl python3 make g++
RUN corepack enable

# 1. Prune the monorepo down to what the backend actually needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2.3.3
COPY . .
RUN turbo prune backend --docker

# 2. Install dependencies and build
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
# prisma's postinstall hook (`prisma generate`) needs the schema present
# at install time, and bcrypt's postinstall needs to actually run - so
# install scripts stay enabled here (unlike a typical --ignore-scripts setup).
COPY --from=pruner /app/out/full/apps/backend/prisma ./apps/backend/prisma
RUN pnpm config set network-concurrency 4 && pnpm config set fetch-timeout 300000
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter backend run prisma:generate
RUN pnpm --filter backend run build

# 3. Minimal runtime image
FROM base AS runner
WORKDIR /app
RUN addgroup -S nodejs -g 1001 && adduser -S nestjs -u 1001 -G nodejs

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=installer /app/apps/backend/dist ./apps/backend/dist
COPY --from=installer /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=installer /app/apps/backend/prisma ./apps/backend/prisma

RUN mkdir -p /app/apps/backend/uploads && chown -R nestjs:nodejs /app/apps/backend/uploads /app/apps/backend/dist

USER nestjs
WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 3001

# prisma migrate deploy is idempotent, so running it on boot is a safe
# fallback even if the platform's pre-deploy hook (see render.yaml) is used.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
