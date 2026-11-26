/**
 * Buffered hourly visit counter for verified crawlers.
 *
 * Verified crawlers bypass guest lead creation, so their page views are tallied
 * in hourly (bucket_hour, bot_family) buckets in `crawler_visits`. Writes are
 * coalesced in memory and flushed asynchronously so middleware adds zero DB
 * latency on the crawler request path.
 */

import "server-only";

import { clearTimeout, setTimeout } from "node:timers";

import { sql } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { BotFamily } from "../analytics/enum";
import { crawlerVisits } from "./db";

type BotFamilyValue = (typeof BotFamily)[keyof typeof BotFamily];

interface BufferedBucket {
  bucketHour: Date;
  botFamily: BotFamilyValue;
  count: number;
}

interface CrawlerVisitBufferState {
  pending: Map<string, BufferedBucket>;
  timer: ReturnType<typeof setTimeout> | null;
  flushing: Promise<void> | null;
}

declare global {
  var __vibeCrawlerVisitBuffer: CrawlerVisitBufferState | undefined;
}

const FLUSH_INTERVAL_MS = 5_000;
const FLUSH_BATCH_THRESHOLD = 50;

function unrefTimer(timer: number | { unref?: () => void }): void {
  if (typeof timer !== "number") {
    timer.unref?.();
  }
}

function bufferState(): CrawlerVisitBufferState {
  globalThis.__vibeCrawlerVisitBuffer ??= {
    pending: new Map(),
    timer: null,
    flushing: null,
  };
  return globalThis.__vibeCrawlerVisitBuffer;
}

/** Truncate a timestamp to its UTC hour start. */
export function truncateToUtcHour(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      0,
      0,
      0,
    ),
  );
}

/** Record one verified crawler document view (non-blocking, buffered). */
export function recordVerifiedCrawlerVisit(
  botFamily: BotFamilyValue,
  logger: EndpointLogger,
  at: Date = new Date(),
): void {
  const state = bufferState();
  const bucketHour = truncateToUtcHour(at);
  const key = `${bucketHour.toISOString()}|${botFamily}`;
  const existing = state.pending.get(key);
  if (existing) {
    existing.count += 1;
  } else {
    state.pending.set(key, { bucketHour, botFamily, count: 1 });
  }

  if (state.pending.size >= FLUSH_BATCH_THRESHOLD) {
    void flushCrawlerVisits(logger);
    return;
  }

  if (state.timer === null) {
    state.timer = setTimeout(() => {
      state.timer = null;
      void flushCrawlerVisits(logger);
    }, FLUSH_INTERVAL_MS);
    unrefTimer(state.timer);
  }
}

/** Flush all buffered crawler visit increments into `crawler_visits`. */
export async function flushCrawlerVisits(
  logger?: EndpointLogger,
): Promise<void> {
  const state = bufferState();
  if (state.timer !== null) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  if (state.flushing) {
    await state.flushing;
  }
  if (state.pending.size === 0) {
    return;
  }

  const batch = [...state.pending.values()];
  state.pending.clear();

  const run = (async (): Promise<void> => {
    try {
      await db
        .insert(crawlerVisits)
        .values(
          batch.map((entry) => ({
            bucketHour: entry.bucketHour,
            botFamily: entry.botFamily,
            visitCount: entry.count,
          })),
        )
        .onConflictDoUpdate({
          target: [crawlerVisits.bucketHour, crawlerVisits.botFamily],
          set: {
            visitCount: sql`${crawlerVisits.visitCount} + excluded.visit_count`,
          },
        });
    } catch (error) {
      logger?.warn("Failed to flush verified crawler visits", {
        ...parseError(error),
        buckets: batch.length,
      });
    }
  })().finally(() => {
    if (state.flushing === run) {
      state.flushing = null;
    }
  });

  state.flushing = run;
  await run;
}

/** Clear buffered crawler visits without writing (for unit tests). */
export function resetCrawlerVisitBuffer(): void {
  const state = bufferState();
  if (state.timer !== null) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  state.pending.clear();
}
