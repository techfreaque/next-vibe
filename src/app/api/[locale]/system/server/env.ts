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
  // Platform detection (optional - set by hosting providers)
  VERCEL: { schema: z.string().optional(), example: "1" },
  VERCEL_REGION: { schema: z.string().optional(), example: "iad1" },
  VERCEL_URL: { schema: z.string().optional(), example: "your-app.vercel.app" },
  AWS_LAMBDA_FUNCTION_NAME: {
    schema: z.string().optional(),
    example: "my-function",
  },
  AWS_REGION: { schema: z.string().optional(), example: "us-east-1" },
  NETLIFY: { schema: z.string().optional(), example: "true" },
  NETLIFY_SITE_NAME: { schema: z.string().optional(), example: "my-site" },
  CLOUDFLARE_WORKERS: { schema: z.string().optional(), example: "true" },
  RAILWAY_ENVIRONMENT: { schema: z.string().optional(), example: "production" },
});
