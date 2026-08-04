import "server-only";

import { z } from "zod";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { defaultLocale } from "../../core/i18n/core/config";
import { defineEnv } from "../../env/define-env";

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
