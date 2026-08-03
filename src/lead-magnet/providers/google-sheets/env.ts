/**
 * Google Sheets Lead Magnet Provider Environment
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: googleSheetsEnv,
  schema: googleSheetsEnvSchema,
  examples: googleSheetsEnvExamples,
} = defineEnv({
  GOOGLE_SHEETS_CLIENT_ID: {
    schema: z.string().optional(),
    example: "your-client-id.apps.googleusercontent.com",
    comment: "OAuth client ID for the Google Sheets lead magnet provider.",
    commented: true,
  },
  GOOGLE_SHEETS_CLIENT_SECRET: {
    schema: z.string().optional(),
    example: "your-client-secret",
    comment: "OAuth client secret for the Google Sheets lead magnet provider.",
    commented: true,
    sensitive: true,
  },
  GOOGLE_SHEETS_REDIRECT_URI: {
    schema: z.string().url().optional(),
    example:
      "https://your-domain.com/api/en/lead-magnet/providers/google-sheets/oauth/callback",
    comment:
      "OAuth redirect URI override. Defaults to <baseUrl>/api/en/lead-magnet/providers/google-sheets/oauth/callback.",
    commented: true,
    fieldType: "url",
  },
});
