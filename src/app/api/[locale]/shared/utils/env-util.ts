import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { validateData } from "./validation";

interface EnvHint {
  example: string | false;
  comment?: string;
}

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
  locale: CountryLanguage,
  hints?: Record<string, EnvHint>,
): z.infer<TSchema> {
  // Treat empty strings as undefined so optional schemas work correctly
  // when Docker passes unset build args as empty strings
  const normalizedEnv = Object.fromEntries(
    Object.entries(env).map(([k, v]) => [k, v === "" ? undefined : v]),
  );

  // When hints are provided, use Zod directly for structured error reporting
  if (hints) {
    const result = envSchema.safeParse(normalizedEnv);
    if (!result.success) {
      printEnvErrors(result.error, hints, logger);
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Clean exit on env misconfiguration, no stack trace needed
      process.exit(1);
    }
    return result.data as z.infer<TSchema>;
  }

  // Fallback for generated env files (no hints)
  const validationResult = validateData<TSchema>(
    normalizedEnv as z.input<TSchema>,
    envSchema,
    logger,
    locale,
  );
  if (!validationResult.success) {
    const errors = validationResult.messageParams?.["error"] as
      | string
      | undefined;
    // eslint-disable-next-line i18next/no-literal-string
    const message = [
      "──────────────────────────────────────────────────────────",
      "  Environment variable validation failed",
      "──────────────────────────────────────────────────────────",
      ...(errors ? errors.split(", ").map((e) => `  ✗ ${e}`) : []),
      "",
      "  Check your .env file. See .env.example for reference.",
      "──────────────────────────────────────────────────────────",
    ].join("\n");
    logger.error(message);
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Clean exit on env misconfiguration, no stack trace needed
    process.exit(1);
  }
  return validationResult.data as z.infer<TSchema>;
}

/**
 * Print structured env validation errors with examples and defaults
 */
function printEnvErrors(
  zodError: z.ZodError,
  hints: Record<string, EnvHint>,
  logger: EndpointLogger,
): void {
  // eslint-disable-next-line i18next/no-literal-string
  const SEP = "──────────────────────────────────────────────────────────";
  const lines: string[] = [
    "",
    SEP,
    "  Environment variable validation failed",
    SEP,
    "",
  ];

  // Group errors by env key
  const errorsByKey = new Map<string, string[]>();
  for (const issue of zodError.issues) {
    const key = issue.path[0]?.toString() ?? "unknown";
    const existing = errorsByKey.get(key) ?? [];
    existing.push(issue.message);
    errorsByKey.set(key, existing);
  }

  // Sort keys alphabetically for consistent output
  const sortedKeys = [...errorsByKey.keys()].toSorted();

  for (const key of sortedKeys) {
    const messages = errorsByKey.get(key) ?? [];
    const hint = hints[key];

    // eslint-disable-next-line i18next/no-literal-string
    lines.push(`  ✗ ${key}`);
    for (const msg of messages) {
      // eslint-disable-next-line i18next/no-literal-string
      lines.push(`    Error: ${msg}`);
    }
    if (hint?.comment) {
      // eslint-disable-next-line i18next/no-literal-string
      lines.push(`    Info:  ${hint.comment}`);
    }
    if (hint?.example) {
      // eslint-disable-next-line i18next/no-literal-string
      lines.push(`    Fix:   Add to your .env file:`);
      // eslint-disable-next-line i18next/no-literal-string
      lines.push(`           ${key}="${hint.example}"`);
    }
    lines.push("");
  }

  // eslint-disable-next-line i18next/no-literal-string
  lines.push(
    `  ${sortedKeys.length} variable${sortedKeys.length === 1 ? "" : "s"} need${sortedKeys.length === 1 ? "s" : ""} attention.`,
  );
  // eslint-disable-next-line i18next/no-literal-string
  lines.push("  See .env.example for a complete reference.");
  lines.push(SEP);
  lines.push("");

  logger.error(lines.join("\n"));
}

export enum Environment {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}
