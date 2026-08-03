/**
 * Server System Environment Configuration
 */

import "server-only";

import { defineEnv } from "../../env/define-env";
import { z } from "zod";

export const {
  env: serverSystemEnv,
  schema: serverSystemEnvSchema,
  examples: serverSystemEnvExamples,
} = defineEnv({
  VIBE_DISABLE_PROXY: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    example: "false",
    comment:
      "Opt out of the built-in Bun HTTP+WebSocket proxy. When true: Next.js runs directly on the main port and the WebSocket sidecar runs on port+1000. Use this when you have your own reverse proxy (Caddy, nginx, etc.) that already forwards /ws to the sidecar port. Your reverse proxy must route /ws → port+1000 and everything else → main port.",
    commented: true,
    fieldType: "boolean",
  },
});
