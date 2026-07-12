# syntax=docker/dockerfile:1

# Base stage with Bun
FROM oven/bun:1.3.3-alpine AS base
WORKDIR /app

# Install Node.js for Next.js build compatibility
RUN apk add --no-cache nodejs python3 make g++

# BEGIN_GENERATED_ENV_ARGS
# Intentionally empty - see updateDockerfile in generator.ts for why.
# END_GENERATED_ENV_ARGS

ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

ENV NODE_ENV=production

# Install dependencies
# Bun download cache avoids re-fetching tarballs; bun install with warm cache ~10-20s vs cold ~2min
# node_modules not cache-mounted: at 1.9GB/183k files, cp-in+cp-out costs ~3min, more than install itself
RUN --mount=type=cache,target=/root/.bun/install/cache,id=next-vibe-bun-cache,sharing=locked \
    bun install --frozen-lockfile

# Build
# --webpack: use webpack instead of Turbopack (~7.5 GB vs ~12 GB peak memory)
# /app/.next-prod/cache mounted directly - Next.js webpack/RSC incremental cache persisted across builds
# DB unreachable at build time (docker network only); migrations run via docker compose run in install-docker.sh
# VIBE_BUILD_PLACEHOLDER_ENV: set only on this command's shell env (not a persisted
# image ENV) - bakes runtime-patch sentinels into every NEXT_PUBLIC_* value instead of
# real ones. Real public config + the secrets behind NEXT_PUBLIC_AGENT_* never need to
# reach the build; the container patches the compiled bundle with real values at start.
# See runtime-env-placeholders.ts / server/server/start/runtime-env-patch.ts.
RUN --mount=type=cache,target=/app/.next-prod/cache,id=next-vibe-next-cache-v2,sharing=locked \
    VIBE_BUILD_PLACEHOLDER_ENV=true bun src/app/api/[locale]/system/platforms/cli/vibe-runtime.ts build --migrate=false --seed=false --db-setup=false --webpack=true && \
    test -f .next-prod/BUILD_ID || (echo "ERROR: .next-prod/BUILD_ID missing - Next.js build failed" && exit 1)


# Port 3000: HTTP + WebSocket (proxy mode, default).
# Port 4000: WebSocket sidecar (opt-in via VIBE_DISABLE_PROXY=true).
EXPOSE 3000 4000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application using vibe CLI (skipPre=true by default: migrations ran at build time)
CMD ["bun", "src/app/api/[locale]/system/platforms/cli/vibe-runtime.ts", "start"]
