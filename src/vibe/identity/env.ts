import "server-only";

import { z } from "zod";

import { defineEnv } from "../env/define-env";

export const {
  env: identityEnv,
  schema: identityEnvSchema,
  examples: identityEnvExamples,
} = defineEnv({
  JWT_SECRET_KEY: {
    schema: z.string().min(32),
    example: "REPLACE_WITH_openssl_rand_hex_32_output",
    comment:
      "JWT signing secret - MUST be at least 64 random characters in production. Generate with: openssl rand -hex 32",
    sensitive: true,
    onboardingRequired: true,
    onboardingStep: 3,
    onboardingGroup: "security",
    autoGenerate: "hex64" as const,
  },
  VIBE_SECRET_KEY: {
    schema: z.string().min(64).optional(),
    example: false,
    comment:
      "Explicit AES-256 encryption key (hex, 64 chars) for sensitive env values at rest. If not set, derived from JWT_SECRET_KEY. Use this in Docker/CI for a fully independent key.",
    sensitive: true,
    commented: true,
  },
  VIBE_ADMIN_USER_EMAIL: {
    schema: z.email().optional().default("admin@please.change.me"),
    example: "admin@please.change.me",
    comment:
      "Root admin email. Used for CLI auth, API tool access, and all admin endpoints. Change via the app syncs to DB.",
    commented: false,
    onboardingRequired: true,
    onboardingStep: 1,
    onboardingGroup: "admin",
    fieldType: "email",
  },
  VIBE_ADMIN_USER_PASSWORD: {
    schema: z.string().min(8).optional().default("change-me-now"),
    example: "your-admin-password",
    comment:
      "Root admin password. Protects all exposed tools/endpoints. Use a strong password in production! Change via the app syncs to DB.",
    commented: false,
    sensitive: true,
    onboardingRequired: true,
    onboardingStep: 1,
    onboardingGroup: "admin",
  },
});
