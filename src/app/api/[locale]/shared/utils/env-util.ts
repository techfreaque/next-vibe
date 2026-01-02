import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { validateData } from "./validation";

export function validateEnv<TSchema extends z.ZodType>(
  env: {
    [key: string]:
      | string
      | undefined
      | boolean
      | number
      | { [key: string]: string | undefined | boolean | number };
  },
  envSchema: TSchema,
  logger: EndpointLogger,
): z.infer<TSchema> {
  const validationResult = validateData<TSchema>(env as z.input<TSchema>, envSchema, logger);
  if (!validationResult.success) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Environment validation must throw on startup to prevent invalid configuration
    throw new Error(
      // eslint-disable-next-line i18next/no-literal-string
      `Environment validation error: ${validationResult.message} ${JSON.stringify(
        validationResult,
      )}`,
    );
  }
  return validationResult.data as z.infer<TSchema>;
}

export enum Environment {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}
