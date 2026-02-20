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
  // Treat empty strings as undefined so optional schemas work correctly
  // when Docker passes unset build args as empty strings
  const normalizedEnv = Object.fromEntries(
    Object.entries(env).map(([k, v]) => [k, v === "" ? undefined : v]),
  );

  const validationResult = validateData<TSchema>(
    normalizedEnv as z.input<TSchema>,
    envSchema,
    logger,
  );
  if (!validationResult.success) {
    const errors = validationResult.messageParams?.["error"] as
      | string
      | undefined;
    // eslint-disable-next-line i18next/no-literal-string
    const message = [
      "──────────────────────────────────────────",
      "  Environment variable validation failed",
      "──────────────────────────────────────────",
      ...(errors ? errors.split(", ").map((e) => `  ✗ ${e}`) : []),
      "",
      "  Check your .env file or docker build args.",
      "──────────────────────────────────────────",
    ].join("\n");
    // eslint-disable-next-line no-console -- intentional: env errors must be visible even without a logger
    logger.error(message);
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Clean exit on env misconfiguration, no stack trace needed
    process.exit(1);
  }
  return validationResult.data as z.infer<TSchema>;
}

export enum Environment {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}
