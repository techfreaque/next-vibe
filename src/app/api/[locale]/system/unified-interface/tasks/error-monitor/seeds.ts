/**
 * Error Monitor Seeds
 * Dev: inserts clearly marked sample errors for testing the error monitoring UI.
 * Prod: deduplicates existing error_logs by fingerprint (merge + count).
 */

import { sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { errorLogs, type NewErrorLog } from "./db";

/** Compute fingerprint matching error-persist.ts logic */
function computeFingerprint(errorType: string | null, message: string): string {
  const key = `${errorType ?? "unknown"}:${message.slice(0, 100)}`;
  return Bun.hash(key).toString(36);
}

/**
 * Sample errors for dev seeding — clearly marked as "[SEED]"
 */
const SAMPLE_ERRORS: Array<{
  source: "backend" | "task" | "chat";
  level: "error" | "warn";
  message: string;
  errorType: string | null;
  endpoint: string | null;
  stackTrace: string | null;
  count: number;
}> = [
  {
    source: "backend",
    level: "error",
    message: "[SEED] Database connection timeout during query execution",
    errorType: "INTERNAL_ERROR",
    endpoint: "/api/en/agent/chat/threads",
    stackTrace:
      "Error: Connection terminated due to timeout\n    at PostgresClient.query (pg-pool.ts:42)\n    at ThreadRepository.list (repository.ts:88)",
    count: 15,
  },
  {
    source: "backend",
    level: "error",
    message: "[SEED] Rate limit exceeded for AI model provider",
    errorType: "RATE_LIMIT",
    endpoint: "/api/en/agent/chat/send",
    stackTrace:
      "Error: 429 Too Many Requests\n    at AIProvider.complete (provider.ts:120)\n    at ChatHandler.send (route.ts:55)",
    count: 42,
  },
  {
    source: "backend",
    level: "warn",
    message: "[SEED] Slow query detected: chat threads list took 3200ms",
    errorType: "PERFORMANCE_WARNING",
    endpoint: "/api/en/agent/chat/threads",
    stackTrace: null,
    count: 8,
  },
  {
    source: "task",
    level: "error",
    message: "[SEED] Cron task failed: email digest generation timed out",
    errorType: "TASK_TIMEOUT",
    endpoint: null,
    stackTrace:
      "Error: Task exceeded 300000ms timeout\n    at TaskRunner.execute (task-runner.ts:95)\n    at CronScheduler.run (scheduler.ts:42)",
    count: 3,
  },
  {
    source: "backend",
    level: "error",
    message: "[SEED] Validation failed: invalid model ID in chat request",
    errorType: "VALIDATION_FAILED",
    endpoint: "/api/en/agent/chat/send",
    stackTrace:
      'Error: Invalid model: "nonexistent-model-v1"\n    at validateModel (validation.ts:22)\n    at ChatHandler.send (route.ts:30)',
    count: 25,
  },
  {
    source: "chat",
    level: "error",
    message: "[SEED] AI model returned empty response after 30s",
    errorType: "MODEL_ERROR",
    endpoint: null,
    stackTrace:
      "Error: Empty response from model\n    at StreamHandler.finalize (stream.ts:88)\n    at ChatSession.process (session.ts:112)",
    count: 7,
  },
  {
    source: "backend",
    level: "warn",
    message: "[SEED] Deprecated API endpoint called: /api/v1/legacy/users",
    errorType: "DEPRECATION_WARNING",
    endpoint: "/api/v1/legacy/users",
    stackTrace: null,
    count: 50,
  },
  {
    source: "backend",
    level: "error",
    message: "[SEED] File upload exceeded maximum size limit (10MB)",
    errorType: "PAYLOAD_TOO_LARGE",
    endpoint: "/api/en/user/profile/avatar",
    stackTrace:
      "Error: Request entity too large\n    at UploadHandler.validate (upload.ts:33)\n    at ProfileRoute.updateAvatar (route.ts:67)",
    count: 5,
  },
  {
    source: "task",
    level: "warn",
    message: "[SEED] Cleanup task skipped: another instance already running",
    errorType: "TASK_CONFLICT",
    endpoint: null,
    stackTrace: null,
    count: 2,
  },
  {
    source: "backend",
    level: "error",
    message: "[SEED] Authentication token expired during long-running request",
    errorType: "AUTH_EXPIRED",
    endpoint: "/api/en/agent/chat/send",
    stackTrace:
      "Error: JWT expired at 2026-03-12T10:30:00Z\n    at AuthMiddleware.verify (middleware.ts:45)\n    at requestHandler (handler.ts:12)",
    count: 12,
  },
];

export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding sample error logs (dev)...");

  // Check if we already have seeded errors
  const [existing] = await db
    .select({ count: sql<number>`count(*)::integer` })
    .from(errorLogs)
    .where(sql`${errorLogs.message} LIKE '[SEED]%'`);

  if (existing && existing.count > 0) {
    logger.debug(
      `Skipping — ${existing.count.toString()} seeded error logs already exist`,
    );
    return;
  }

  const now = new Date();
  const rows: NewErrorLog[] = [];

  for (const sample of SAMPLE_ERRORS) {
    const fingerprint = computeFingerprint(sample.errorType, sample.message);

    // Create one representative row with the full occurrence count
    rows.push({
      source: sample.source,
      level: sample.level,
      message: sample.message,
      endpoint: sample.endpoint,
      errorType: sample.errorType,
      errorCode: null,
      stackTrace: sample.stackTrace,
      metadata: {},
      fingerprint,
      occurrences: sample.count,
      resolved: false,
      createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 3600_000),
    });
  }

  // Insert in a single batch
  await db.insert(errorLogs).values(rows);

  logger.debug(
    `Seeded ${rows.length.toString()} error log entries (${SAMPLE_ERRORS.reduce((s, e) => s + e.count, 0).toString()} total occurrences)`,
  );
}

export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding minimal error logs (test)...");

  const [existing] = await db
    .select({ count: sql<number>`count(*)::integer` })
    .from(errorLogs)
    .where(sql`${errorLogs.message} LIKE '[SEED]%'`);

  if (existing && existing.count > 0) {
    return;
  }

  // Just 2 minimal entries for testing
  const fp1 = computeFingerprint("INTERNAL_ERROR", "[SEED] Test error 1");
  const fp2 = computeFingerprint("VALIDATION_FAILED", "[SEED] Test error 2");

  await db.insert(errorLogs).values([
    {
      source: "backend",
      level: "error",
      message: "[SEED] Test error 1",
      errorType: "INTERNAL_ERROR",
      errorCode: null,
      endpoint: null,
      stackTrace: null,
      metadata: {},
      fingerprint: fp1,
      occurrences: 1,
      resolved: false,
    },
    {
      source: "backend",
      level: "warn",
      message: "[SEED] Test error 2",
      errorType: "VALIDATION_FAILED",
      errorCode: null,
      endpoint: null,
      stackTrace: null,
      metadata: {},
      fingerprint: fp2,
      occurrences: 1,
      resolved: false,
    },
  ]);
}

/** No prod seed needed — dedup handled by migration + upsert on write */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("No prod seed needed — dedup handled by migration + upsert");
}

// Low priority — other seeds should run first
export const priority = 5;
