import "server-only";

import { randomUUID } from "node:crypto";

import type { Redis } from "ioredis";
import { realtimeEnv } from "next-vibe/realtime/server/env";
import { z } from "zod";

import { consumeImportRateLimit } from "../repository";

const MAX_ATTEMPTS = 60;
const WINDOW_MS = 10 * 60 * 1000;

// Redis time and one atomic update give both HA app nodes the same window.
const consumeWindow = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
local window = tonumber(ARGV[1])
local key = KEYS[1]
redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
if redis.call('ZCARD', key) >= tonumber(ARGV[2]) then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  return math.max(1, math.ceil((tonumber(oldest[2]) + window - now) / 1000))
end
redis.call('ZADD', key, now, ARGV[3])
redis.call('PEXPIRE', key, window)
return 0
`;

let redisClient: Promise<Redis> | undefined;

export async function consumeCardImportRateLimit(
  userId: string,
): Promise<{ allowed: boolean; retryAfterSeconds: number } | null> {
  const key = `vibe:skill-card-import:user:${userId}`;
  if (realtimeEnv.WS_PUBSUB_TYPE !== "redis") {
    return consumeImportRateLimit(key, Date.now(), MAX_ATTEMPTS);
  }
  const url = realtimeEnv.REDIS_URL;
  if (!url) {
    return null;
  }
  redisClient ??= import("ioredis").then(
    ({ default: RedisClient }) =>
      new RedisClient(url, {
        commandTimeout: 2000,
        connectTimeout: 2000,
        maxRetriesPerRequest: 0,
      }),
  );
  const retryAfterSeconds = z
    .number()
    .int()
    .nonnegative()
    .safeParse(
      await (
        await redisClient
      ).eval(consumeWindow, 1, key, WINDOW_MS, MAX_ATTEMPTS, randomUUID()),
    );
  return retryAfterSeconds.success
    ? {
        allowed: retryAfterSeconds.data === 0,
        retryAfterSeconds: retryAfterSeconds.data,
      }
    : null;
}
