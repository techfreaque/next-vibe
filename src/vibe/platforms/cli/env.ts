import "server-only";

import { z } from "zod";

import {
  CountryLanguageValues,
  defaultLocale,
} from "../../core/i18n/core/config";
import { defineEnv } from "../../env/define-env";

export const {
  env: cliEnv,
  schema: cliEnvSchema,
  examples: cliEnvExamples,
} = defineEnv({
  VIBE_CLI_LOCALE: {
    schema: z.enum(CountryLanguageValues).optional().default(defaultLocale),
    example: defaultLocale,
    comment: "CLI locale setting",
    fieldType: "select",
    options: Object.values(CountryLanguageValues),
  },
});
