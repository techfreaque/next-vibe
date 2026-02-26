/**
 * Server System Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const {
  env: serverSystemEnv,
  schema: serverSystemEnvSchema,
  examples: serverSystemEnvExamples,
} = defineEnv({
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
