/* eslint-disable node/no-process-env */
import {
  envClient as vibeEnvClient,
  envClientSchema as portalEnvClientSchema,
  envValidationLogger,
} from "next-vibe/client/env-client";
import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

export const envClientSchema = portalEnvClientSchema.extend({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPPORT_EMAIL_DE: z.email(),
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: z.email(),
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: z.email(),
});

export type EnvFrontend = z.infer<typeof envClientSchema>;
export type EnvFrontendInput = z.input<typeof envClientSchema>;

// Export validated environment for use throughout the application
export const envClient: EnvFrontend = validateEnv(
  {
    // Use raw environment variables for validation
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TEST_SERVER_URL: process.env.NEXT_PUBLIC_TEST_SERVER_URL,
    NEXT_PUBLIC_DEBUG_PRODUCTION: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    platform: vibeEnvClient.platform,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPPORT_EMAIL_DE: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_DE,
    NEXT_PUBLIC_SUPPORT_EMAIL_PL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_PL,
    NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL:
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL,
  } as EnvFrontendInput,
  envClientSchema,
  envValidationLogger,
);
