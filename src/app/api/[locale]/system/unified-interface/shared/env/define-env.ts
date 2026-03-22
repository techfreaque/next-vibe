/**
 * Minimal Environment Definition
 */

import "server-only";

import { randomBytes } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { validateEnv } from "next-vibe/shared/utils/env-util";
import type { z } from "zod";
import { z as zod } from "zod";

import { decryptEnvObject, loadOrCreateKey } from "./env-crypto";

/** Built-in generators for autoGenerate field */
function runAutoGenerate(type: "hex32" | "hex64"): string {
  return randomBytes(type === "hex64" ? 32 : 16).toString("hex");
}

/**
 * Persist a generated env var to .env so it's stable across restarts.
 * Appends `KEY=value` if the key is not already present in the file.
 */
function persistGeneratedEnvVar(key: string, value: string): void {
  try {
    // Find .env by walking up from cwd
    let dir = process.cwd();
    let envPath: string | null = null;
    while (true) {
      const candidate = join(dir, ".env");
      if (existsSync(candidate)) {
        envPath = candidate;
        break;
      }
      const parent = join(dir, "..");
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
    if (!envPath) {
      return;
    }

    const contents = readFileSync(envPath, "utf-8");
    const lines = contents.split("\n");
    // Replace placeholder line in-place if found
    const placeholderIdx = lines.findIndex((line) => {
      const trimmed = line.trimStart();
      if (!trimmed.startsWith(`${key}=`) && !trimmed.startsWith(`${key} =`)) {
        return false;
      }
      const val = trimmed
        .split("=")
        .slice(1)
        .join("=")
        .replace(/^["']|["']$/g, "");
      return isPlaceholder(val);
    });
    if (placeholderIdx !== -1) {
      lines[placeholderIdx] = `${key}="${value}"`;
      writeFileSync(envPath, lines.join("\n"), "utf-8");
    } else {
      // Append if key is entirely absent
      const alreadySet = lines.some((line) => {
        const trimmed = line.trimStart();
        return trimmed.startsWith(`${key}=`) || trimmed.startsWith(`${key} =`);
      });
      if (!alreadySet) {
        const newline =
          contents.length > 0 && !contents.endsWith("\n") ? "\n" : "";
        appendFileSync(envPath, `${newline}${key}="${value}"\n`, "utf-8");
      }
    }
  } catch {
    // Ignore — generation still worked, just won't persist
  }
}

/**
 * Apply generate/autoGenerate for a single field if the value is missing.
 * Sets process.env and persists to .env.
 */
function isPlaceholder(value: string | undefined): boolean {
  if (value === undefined || value === "") {
    return true;
  }
  return value.startsWith("REPLACE_WITH_") || value.startsWith("your-");
}

/**
 * Apply generate/autoGenerate for a single field if the value is missing or a placeholder.
 * Sets process.env and persists to .env.
 */
function applyGenerate(
  key: string,
  generate: (() => string) | undefined,
  autoGenerate: "hex32" | "hex64" | undefined,
  rawEnv: Record<string, string | undefined>,
): void {
  if (!isPlaceholder(rawEnv[key])) {
    return;
  }
  if (!generate && !autoGenerate) {
    return;
  }

  const value = generate ? generate() : runAutoGenerate(autoGenerate!);
  process.env[key] = value;
  rawEnv[key] = value;
  persistGeneratedEnvVar(key, value);
}

/**
 * Lazily decrypted process.env — computed once, reused across all defineEnv calls.
 * Decrypts vibe:enc:* values using the project key file.
 */
let _decryptedEnv: NodeJS.ProcessEnv | undefined;
function getDecryptedEnv(): NodeJS.ProcessEnv {
  if (!_decryptedEnv) {
    _decryptedEnv = decryptEnvObject(
      process.env as Record<string, string | undefined>,
      loadOrCreateKey(),
    ) as NodeJS.ProcessEnv;
  }
  return _decryptedEnv;
}

import { defaultLocale } from "@/i18n/core/config";

import { envValidationLogger } from "./validation-logger";

export type EnvFieldType =
  | "text"
  | "boolean"
  | "number"
  | "select"
  | "url"
  | "email";

interface FieldDef<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  example: string | false;
  comment?: string;
  /** When true, the key is commented out in .env.example (still present but inactive) */
  commented?: boolean;
  /** When true, the value is masked in admin settings views. Falls back to name-pattern heuristic if not set. */
  sensitive?: boolean;
  /** Grouping within a module (e.g. "auth", "database"). Used by the settings UI. */
  category?: string;
  /** When true, the onboarding flow highlights this field as must-configure. */
  onboardingRequired?: boolean;
  /** UI field type hint for the settings widget. Defaults to "text". */
  fieldType?: EnvFieldType;
  /** Available choices for "select" field type. */
  options?: readonly string[];
  /** Which step of the setup wizard this field appears on (1-based). */
  onboardingStep?: number;
  /** Human-readable group label for wizard step grouping (e.g. "admin", "database", "security", "ai"). */
  onboardingGroup?: string;
  /** When set, the settings UI shows a "Generate" button that fills the field with a random value of this type. */
  autoGenerate?: "hex32" | "hex64";
  /**
   * Called when the env var is missing/empty to produce a stable default.
   * The generated value is written to process.env and appended to .env for persistence.
   * If omitted, `autoGenerate` is used as a built-in generator instead.
   */
  generate?: () => string;
}

type Fields = Record<string, FieldDef>;

type InferEnv<T extends Fields> = {
  [K in keyof T]: z.infer<T[K]["schema"]>;
};

/**
 * Define and validate environment variables
 *
 * @example
 * // With fields object (includes examples and comments)
 * export const { env } = defineEnv({
 *   DATABASE_URL: { schema: z.string().url(), example: "postgres://localhost/db", comment: "DB" },
 *   API_KEY: { schema: z.string().min(10), example: "your-api-key" },
 * });
 *
 * @example
 * // With discriminated union fields
 * export const { env } = defineEnv({
 *   discriminator: "STORAGE_TYPE",
 *   variants: {
 *     s3: { ...s3Fields },
 *     filesystem: { ...filesystemFields }
 *   }
 * });
 */
type BuildUnionSchemaFromVariants<V extends Record<string, Fields>> = {
  [K in keyof V]: z.ZodObject<{ [F in keyof V[K]]: V[K][F]["schema"] }>;
}[keyof V];

type InferUnionEnv<V extends Record<string, Fields>> = z.infer<
  BuildUnionSchemaFromVariants<V>
>;

export interface EnvExample {
  key: string;
  example: string | false;
  comment?: string;
  commented?: boolean;
  sensitive?: boolean;
  category?: string;
  onboardingRequired?: boolean;
  fieldType?: EnvFieldType;
  options?: readonly string[];
  onboardingStep?: number;
  onboardingGroup?: string;
  autoGenerate?: "hex32" | "hex64";
}

export function defineEnv<T extends Fields>(
  fields: T,
): {
  env: InferEnv<T>;
  schema: z.ZodObject<{ [K in keyof T]: T[K]["schema"] }>;
  examples: EnvExample[];
};
export function defineEnv<
  T extends string,
  V extends Record<string, Fields>,
>(input: {
  discriminator: T;
  variants: V;
}): {
  env: InferUnionEnv<V>;
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  fields: { discriminator: T; variants: V };
  examples: EnvExample[];
};
export function defineEnv(
  input: Fields | { discriminator: string; variants: Record<string, Fields> },
):
  | {
      env: Record<string, z.infer<z.ZodTypeAny>>;
      schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
      examples: EnvExample[];
    }
  | {
      env: Record<string, z.infer<z.ZodTypeAny>>;
      schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
      fields: { discriminator: string; variants: Record<string, Fields> };
      examples: EnvExample[];
    } {
  // Check if input is a union fields definition
  if ("discriminator" in input && "variants" in input) {
    const unionInput = input as {
      discriminator: string;
      variants: Record<string, Fields>;
    };
    const schemas = Object.values(unionInput.variants).map((variantFields) => {
      const schemaShape: Record<string, z.ZodTypeAny> = {};
      for (const [key, def] of Object.entries(variantFields)) {
        schemaShape[key] = def.schema;
      }
      return zod.object(schemaShape);
    });

    // Create discriminated union for validation
    const discriminatedUnionSchema = zod.discriminatedUnion(
      unionInput.discriminator as never,
      schemas as never,
    );

    // Build hints for validation error messages
    const unionHints: Record<
      string,
      { example: string | false; comment?: string }
    > = {};
    for (const variantFields of Object.values(unionInput.variants)) {
      for (const [key, def] of Object.entries(variantFields)) {
        if (!unionHints[key]) {
          unionHints[key] = { example: def.example, comment: def.comment };
        }
      }
    }

    // Apply generate/autoGenerate for all variant fields before validation
    const discriminatorValues = Object.keys(unionInput.variants);
    const rawEnv = getDecryptedEnv();
    for (const variantFields of Object.values(unionInput.variants)) {
      for (const [key, def] of Object.entries(variantFields)) {
        applyGenerate(
          key,
          def.generate,
          def.autoGenerate,
          rawEnv as Record<string, string | undefined>,
        );
      }
    }

    // Inject default discriminator value if missing so the union can match a variant
    const envWithDiscriminatorDefault =
      rawEnv[unionInput.discriminator] === undefined
        ? { ...rawEnv, [unionInput.discriminator]: discriminatorValues[0] }
        : rawEnv;

    // Validate using discriminated union
    const env = validateEnv(
      envWithDiscriminatorDefault,
      discriminatedUnionSchema,
      envValidationLogger,
      defaultLocale,
      unionHints,
    );

    // Create a mergeable object schema by combining all fields from all variants
    const mergeableSchemaShape: Record<string, z.ZodTypeAny> = {};

    // Handle discriminator field specially - create enum of all variant keys
    mergeableSchemaShape[unionInput.discriminator] = zod
      .enum(discriminatorValues as [string, ...string[]])
      .default(discriminatorValues[0] as string);

    // Collect all other fields from all variants
    for (const variantFields of Object.values(unionInput.variants)) {
      for (const [key, def] of Object.entries(variantFields)) {
        if (key !== unionInput.discriminator && !mergeableSchemaShape[key]) {
          mergeableSchemaShape[key] = def.schema;
        }
      }
    }

    const mergeableSchema = zod.object(mergeableSchemaShape);

    // Build examples from all variants (collect unique keys)
    const examplesMap = new Map<string, EnvExample>();
    for (const variantFields of Object.values(unionInput.variants)) {
      for (const [key, def] of Object.entries(variantFields)) {
        if (!examplesMap.has(key)) {
          examplesMap.set(key, {
            key,
            example: def.example,
            comment: def.comment,
            commented: def.commented,
            sensitive: def.sensitive,
            category: def.category,
            onboardingRequired: def.onboardingRequired,
            fieldType: def.fieldType,
            options: def.options,
            onboardingStep: def.onboardingStep,
            onboardingGroup: def.onboardingGroup,
            autoGenerate: def.autoGenerate,
          });
        }
      }
    }
    const examples = [...examplesMap.values()];

    return { env, schema: mergeableSchema, fields: unionInput, examples };
  }

  // Otherwise treat as simple fields object
  const fields = input as Fields;

  // Apply generate/autoGenerate for missing fields before validation
  const rawEnvForFields = getDecryptedEnv();
  for (const [key, def] of Object.entries(fields)) {
    applyGenerate(
      key,
      def.generate,
      def.autoGenerate,
      rawEnvForFields as Record<string, string | undefined>,
    );
  }

  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const examples: EnvExample[] = [];
  for (const [key, def] of Object.entries(fields)) {
    schemaShape[key] = def.schema;
    examples.push({
      key,
      example: def.example,
      comment: def.comment,
      commented: def.commented,
      sensitive: def.sensitive,
      category: def.category,
      onboardingRequired: def.onboardingRequired,
      fieldType: def.fieldType,
      options: def.options,
      onboardingStep: def.onboardingStep,
      onboardingGroup: def.onboardingGroup,
      autoGenerate: def.autoGenerate,
    });
  }
  const schema = zod.object(schemaShape);
  const hints: Record<string, { example: string | false; comment?: string }> =
    {};
  for (const [key, def] of Object.entries(fields)) {
    hints[key] = { example: def.example, comment: def.comment };
  }
  const env = validateEnv(
    rawEnvForFields,
    schema,
    envValidationLogger,
    defaultLocale,
    hints,
  );
  return { env, schema, examples };
}

/**
 * Define and validate client environment variables (alias for defineEnv)
 */
export const defineEnvClient = defineEnv;
