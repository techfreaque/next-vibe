import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

const mode = z.enum(["off", "shadow", "enforce"]).default("off");

export const {
  env: protectionEnv,
  schema: protectionEnvSchema,
  examples: protectionEnvExamples,
} = defineEnv({
  FREE_CRAWLER_MODE: {
    schema: mode,
    example: "off",
    commented: true,
    comment: "Skip anonymous crawler lead creation. off, shadow or enforce.",
  },
  FREE_CLUSTER_MODE: {
    schema: mode,
    example: "off",
    commented: true,
    comment:
      "Share a spending allowance across matching leads. off, shadow or enforce.",
  },
  FREE_MODEL_MODE: {
    schema: mode,
    example: "off",
    commented: true,
    comment:
      "Require purchased credits for models outside the free list. off, shadow or enforce.",
  },
  FREE_CLUSTER_CREDITS: {
    schema: z.coerce.number().finite().nonnegative().default(20),
    example: "20",
    commented: true,
    comment: "Free credits per cluster and window.",
  },
  FREE_CLUSTER_WINDOW_HOURS: {
    schema: z.coerce.number().int().min(1).max(744).default(24),
    example: "24",
    commented: true,
    comment: "Fixed spending windows in hours, aligned to the Unix epoch.",
  },
  FREE_CLUSTER_RULES: {
    schema: z.enum(["prefix", "fingerprint", "both"]).default("both"),
    example: "both",
    commented: true,
    comment:
      "Match IPv4 /24 or IPv6 /48, user-agent fingerprint, or both limits independently.",
  },
  FREE_MODEL_ALLOWLIST: {
    schema: z.string().default("glm-5.3-flash-uncensored,glm-5.3-flash"),
    example: "glm-5.3-flash-uncensored,glm-5.3-flash",
    commented: true,
    comment: "Comma-separated model registry IDs eligible for free credits.",
  },
});
