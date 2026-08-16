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

# Copy lockfile + manifests first so the install layer is only invalidated when
# dependencies actually change, not on every source edit.
COPY package.json bun.lock ./

ENV NODE_ENV=production

# Install dependencies
# No cache mount: sharing=locked deadlocks on stale flock from killed builds; sharing=shared still causes
# low-throughput stalls (DNS was the real culprit — see --network=host on buildx). Plain install without any
# cache mount completes ~50s. Docker layer cache handles the real cost: if package.json/bun.lock
# haven't changed, this layer is cached and never re-runs.
# --ignore-scripts: postinstall runs "node bootstrap-vibe-runtime.mjs setup" which requires source files
# that don't exist yet (COPY . . runs after install). The script would exit-1 before VIBE_SKIP_SETUP is checked.
RUN bun install --frozen-lockfile --ignore-scripts

# Copy rest of the source after install so source-only changes skip the install layer
COPY . .

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
    VIBE_BUILD_PLACEHOLDER_ENV=true bun src/vibe/platforms/cli/vibe-runtime.ts build --migrate=false --seed=false --db-setup=false --webpack=true && \
    test -f .next-prod/BUILD_ID || (echo "ERROR: .next-prod/BUILD_ID missing - Next.js build failed" && exit 1)


# Port 3000: HTTP + WebSocket (proxy mode, default).
# Port 4000: WebSocket sidecar (opt-in via VIBE_DISABLE_PROXY=true).
EXPOSE 3000 4000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application using vibe CLI (skipPre=true by default: migrations ran at build time)
CMD ["bun", "src/vibe/platforms/cli/vibe-runtime.ts", "start"]
