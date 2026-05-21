/**
 * Corvina Module Environment Configuration
 *
 * API key credentials for the Corvina platform REST API.
 * Set CORVINA_API_KEY in .env.local — never commit real credentials.
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const {
  env: corvinaEnv,
  schema: corvinaEnvSchema,
  examples: corvinaEnvExamples,
} = defineEnv({
  CORVINA_API_BASE_URL: {
    schema: z.string().url().default("https://app.corvina-de.io/svc/core"),
    example: "https://app.corvina-de.io/svc/core",
    comment:
      "Corvina API base URL including service prefix. Default is the /svc/core service.",
    commented: true,
  },
  CORVINA_API_KEY: {
    schema: z.string().min(1).optional(),
    example: "your-corvina-api-key",
    comment:
      "Corvina API key sent as X-Api-Key header. Generate in the Corvina dev portal.",
    commented: true,
    sensitive: true,
  },
});
