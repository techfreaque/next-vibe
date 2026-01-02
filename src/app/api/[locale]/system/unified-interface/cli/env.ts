/**
 * CLI Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

export const { env: cliEnv } = defineEnv({
  VIBE_CLI_USER_EMAIL: {
    schema: z.string().email().optional(),
    example: "admin@example.com",
    comment: "CLI user email",
  },
  VIBE_CLI_LOCALE: {
    schema: (z.string() as z.Schema<CountryLanguage>).optional().default(defaultLocale),
    example: "en-GLOBAL",
    comment: "CLI locale setting",
  },
});
