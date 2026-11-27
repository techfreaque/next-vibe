import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

import {
  API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE,
  API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS,
} from "./constants";

export const {
  env: apiKeysEnv,
  schema: apiKeysEnvSchema,
  examples: apiKeysEnvExamples,
} = defineEnv({
  API_KEY_BURST_LIMIT_PER_MINUTE: {
    schema: z.coerce
      .number()
      .int()
      .min(1)
      .default(API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE),
    example: String(API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE),
    commented: true,
    comment:
      "Per-key burst abuse guard (requests per minute). Paying users have no fixed low rate limit.",
  },
  API_KEY_MAX_CONCURRENT_STREAMS: {
    schema: z.coerce
      .number()
      .int()
      .min(1)
      .default(API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS),
    example: String(API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS),
    commented: true,
    comment:
      "Maximum simultaneous in-flight streaming requests per API key (abuse guard).",
  },
});
