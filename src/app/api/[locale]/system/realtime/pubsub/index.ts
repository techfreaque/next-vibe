/**
 * Pub/Sub Adapter Factory
 *
 * Singleton factory for the WebSocket pub/sub adapter.
 * Reads WS_PUBSUB_TYPE env var to select the adapter:
 * - "local" (default): in-process broadcasting, no external dependencies
 * - "redis": Redis PUBLISH/SUBSCRIBE for multi-instance deployments
 */

import { env } from "@/config/env";

import { LocalPubSubAdapter } from "./local-adapter";
import { RedisPubSubAdapter } from "./redis-adapter";
import type { PubSubAdapter } from "./types";

let instance: PubSubAdapter | null = null;

/**
 * Fallback adapter used when Redis is requested but REDIS_URL is missing.
 * Logs an error and falls back to local broadcasting so the server doesn't crash.
 */
const fallbackToLocal = (): PubSubAdapter => {
  // eslint-disable-next-line no-console
  console.error(
    "[PubSub] REDIS_URL is required when WS_PUBSUB_TYPE=redis. Falling back to local adapter.",
  );
  return new LocalPubSubAdapter();
};

/**
 * Get or create the pub/sub adapter instance (singleton).
 */
export function getPubSubAdapter(): PubSubAdapter {
  if (instance) {
    return instance;
  }

  if (env.WS_PUBSUB_TYPE === "redis") {
    instance = env.REDIS_URL
      ? new RedisPubSubAdapter(env.REDIS_URL)
      : fallbackToLocal();
  } else {
    instance = new LocalPubSubAdapter();
  }

  return instance;
}
