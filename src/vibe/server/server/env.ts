/**
 * Server System Environment Configuration
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
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

  // Platform detection (optional - set by hosting providers, not user-configured)
  VERCEL: { schema: z.string().optional(), example: false },
  VERCEL_REGION: { schema: z.string().optional(), example: false },
  VERCEL_URL: { schema: z.string().optional(), example: false },
  AWS_LAMBDA_FUNCTION_NAME: {
    schema: z.string().optional(),
    example: false,
  },
  AWS_REGION: { schema: z.string().optional(), example: false },
  NETLIFY: { schema: z.string().optional(), example: false },
  NETLIFY_SITE_NAME: { schema: z.string().optional(), example: false },
  CLOUDFLARE_WORKERS: { schema: z.string().optional(), example: false },
  RAILWAY_ENVIRONMENT: { schema: z.string().optional(), example: false },
});
