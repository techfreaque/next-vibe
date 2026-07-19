/**
 * Realtime Environment
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: realtimeEnv,
  schema: realtimeEnvSchema,
  examples: realtimeEnvExamples,
} = defineEnv({
  WS_PUBSUB_TYPE: {
    schema: z.enum(["local", "redis"]).optional().default("local"),
    example: "local",
    comment:
      "WebSocket pub/sub adapter. 'local' for single-instance (default), 'redis' for multi-instance broadcasting.",
    commented: true,
    fieldType: "select",
    options: ["local", "redis"],
  },
  REDIS_URL: {
    schema: z.string().url().optional(),
    example: "redis://localhost:6379",
    comment:
      "Redis connection URL. Required when WS_PUBSUB_TYPE=redis for cross-instance WebSocket broadcasting.",
    commented: true,
    fieldType: "url",
  },
});
