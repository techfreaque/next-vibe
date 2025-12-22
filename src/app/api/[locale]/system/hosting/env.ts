/**
 * Hosting Platform Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const { env: hostingEnv } = defineEnv({
  // Vercel
  VERCEL: { schema: z.string().optional(), example: "1" },
  VERCEL_REGION: { schema: z.string().optional(), example: "iad1" },
  VERCEL_URL: { schema: z.string().optional(), example: "your-app.vercel.app" },

  // AWS Lambda
  AWS_LAMBDA_FUNCTION_NAME: {
    schema: z.string().optional(),
    example: "my-function",
  },

  // Netlify
  NETLIFY: { schema: z.string().optional(), example: "true" },
  NETLIFY_SITE_NAME: { schema: z.string().optional(), example: "my-site" },

  // Cloudflare Workers
  CLOUDFLARE_WORKERS: { schema: z.string().optional(), example: "true" },

  // Railway
  RAILWAY_ENVIRONMENT: { schema: z.string().optional(), example: "production" },
});
