import type { z } from "zod";

import { validateData } from "../core/core-utils/validation";
import { defaultLocale } from "../core/i18n/core/config";
import type { EndpointLogger } from "../logger/types";
import { isRuntimeEnvPlaceholder } from "../platforms/cli/runtime/runtime-env-placeholders";
import { Platform } from "../platforms/platforms";

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
      // oxlint-disable-next-line restricted/restricted-syntax
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
    Platform.NEXT_API,
    "env-validation",
    // Boot-time check: the process is validating its own environment before any
    // request exists, so there is no user locale to inherit.
    defaultLocale,
  );
  if (!validationResult.success) {
    // validateData now returns display-ready text on `message` (there is no
    // separate params channel), so the detail is already formatted - indent its
    // lines to sit inside the banner instead of re-splitting a params string.
    const errors = validationResult.message;
    // eslint-disable-next-line i18next/no-literal-string
    const message = [
      "──────────────────────────────────────────────────────────",
      "  Environment variable validation failed",
      "──────────────────────────────────────────────────────────",
      ...(errors ? errors.split("\n").map((e) => `  ✗ ${e}`) : []),
      "",
      "  Check your .env file. See .env.example for reference.",
      "──────────────────────────────────────────────────────────",
    ].join("\n");
    logger.error(message);
    // oxlint-disable-next-line restricted/restricted-syntax
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

export enum VibeMode {
  /** Personal local agent instance — you + your AI. No auth wall, no payments, no SaaS features. */
  AGENT = "agent",
  /** Cloud SaaS deployment (unbottled.ai). Multi-user, auth, payments, subscriptions. Receives sync, never pushes back. */
  CLOUD = "cloud",
  /** Atlas dev instance — coding/testing. Neither agent nor cloud. Default when no mode set. */
  DEV = "dev",
}

export const VibeModeValues = Object.values(VibeMode) as [
  VibeMode,
  ...VibeMode[],
];
