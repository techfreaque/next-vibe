# syntax=docker/dockerfile:1

# Base stage with Bun
FROM oven/bun:1.3.0-alpine AS base
WORKDIR /app

# Builder stage - combine deps and build for workspace support
FROM base AS builder
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (skip prepare scripts that may fail in Docker)
RUN bun install --frozen-lockfile --ignore-scripts

# Build using vibe directly
RUN bun src/app/api/[locale]/v1/core/system/unified-interface/cli/vibe/vibe.ts build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["bun", "run", "start"]
