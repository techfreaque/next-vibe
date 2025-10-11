import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import { validateData } from "./validation";

export function validateEnv<TSchema extends z.ZodType>(
  env: z.input<TSchema> | typeof process.env,
  envSchema: TSchema,
  logger: EndpointLogger,
): z.infer<TSchema> {
  const validationResult = validateData<TSchema>(
    env as z.input<TSchema>,
    envSchema,
    logger,
  );
  if (!validationResult.success) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      // eslint-disable-next-line i18next/no-literal-string
      `Environment validation error: ${validationResult.message} ${
        validationResult.messageParams
          ? JSON.stringify(validationResult.messageParams)
          : ""
      }`,
    );
  }
  return validationResult.data as TSchema;
}

export enum Environment {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}
