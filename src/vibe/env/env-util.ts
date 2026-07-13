import { validateData } from "next-vibe/core/core-utils/validation";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";
import { isRuntimeEnvPlaceholder } from "next-vibe/platforms/cli/runtime/runtime-env-placeholders";
import type { z } from "zod";

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

  // Docker prod build only (VIBE_BUILD_PLACEHOLDER_ENV=true - see environment.ts):
  // NEXT_PUBLIC_* values are runtime-patch sentinels at this point (e.g.
  // "__VIBE_RUNTIME_ENV_NEXT_PUBLIC_APP_URL__"), which fail format-constrained
  // schemas (.url(), .email()). Treat exactly those sentinel-valued keys as
  // unset so each schema's own .default()/.optional() produces a valid
  // stand-in - every other key (including real secrets/config actually
  // present) validates normally, unaffected. The sentinel gets baked into the
  // compiled bundle regardless (from the literal process.env.KEY reference
  // Next.js inlines at compile time, independent of this parsed object) and
  // patched with the real value at container start (runtime-env-patch.ts).
  const envForValidation =
    process.env["VIBE_BUILD_PLACEHOLDER_ENV"] === "true"
      ? Object.fromEntries(
          Object.entries(normalizedEnv).map(([k, v]) =>
            typeof v === "string" && isRuntimeEnvPlaceholder(v)
              ? [k, undefined]
              : [k, v],
          ),
        )
      : normalizedEnv;

  // When hints are provided, use Zod directly for structured error reporting
  if (hints) {
    const result = envSchema.safeParse(envForValidation);
    if (!result.success) {
      printEnvErrors(result.error, hints, logger);
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(
        "Environment variable validation failed. Check logs above.",
      );
    }
    return result.data as z.infer<TSchema>;
  }

  // Fallback for generated env files (no hints)
  const validationResult = validateData<TSchema>(
    envForValidation as z.input<TSchema>,
    envSchema,
    logger,
    locale,
    Platform.NEXT_API,
    "env-validation",
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
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error(
      "Environment variable validation failed. Check logs above.",
    );
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
