import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: cliEnv,
  schema: cliEnvSchema,
  examples: cliEnvExamples,
} = defineEnv({
  VIBE_CLI_LOCALE: {
    schema: (z.string() as z.Schema<CountryLanguage>)
      .optional()
      .default(defaultLocale),
    example: defaultLocale,
    comment: "CLI locale setting",
    fieldType: "select",
    options: ["en-US", "en-GLOBAL", "de-DE", "de-GLOBAL", "pl-PL", "pl-GLOBAL"],
  },
});
