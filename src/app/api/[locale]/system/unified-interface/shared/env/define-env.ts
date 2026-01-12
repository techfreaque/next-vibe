/**
 * Minimal Environment Definition
 */

import "server-only";

import { validateEnv } from "next-vibe/shared/utils/env-util";
import type { z } from "zod";
import { z as zod } from "zod";

import { envValidationLogger } from "./validation-logger";

interface FieldDef<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  example: string;
  comment?: string;
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

type InferUnionEnv<V extends Record<string, Fields>> = z.infer<BuildUnionSchemaFromVariants<V>>;

export interface EnvExample {
  key: string;
  example: string;
  comment?: string;
}

export function defineEnv<T extends Fields>(
  fields: T,
): {
  env: InferEnv<T>;
  schema: z.ZodObject<{ [K in keyof T]: T[K]["schema"] }>;
  examples: EnvExample[];
};
export function defineEnv<T extends string, V extends Record<string, Fields>>(input: {
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
    const unionInput = input as { discriminator: string; variants: Record<string, Fields> };
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

    // Validate using discriminated union
    const env = validateEnv(process.env, discriminatedUnionSchema, envValidationLogger);

    // Create a mergeable object schema by combining all fields from all variants
    const mergeableSchemaShape: Record<string, z.ZodTypeAny> = {};

    // Handle discriminator field specially - create enum of all variant keys
    const discriminatorValues = Object.keys(unionInput.variants);
    mergeableSchemaShape[unionInput.discriminator] = zod.enum(
      discriminatorValues as [string, ...string[]],
    );

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
          });
        }
      }
    }
    const examples = [...examplesMap.values()];

    return { env, schema: mergeableSchema, fields: unionInput, examples };
  }

  // Otherwise treat as simple fields object
  const fields = input as Fields;
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const examples: EnvExample[] = [];
  for (const [key, def] of Object.entries(fields)) {
    schemaShape[key] = def.schema;
    examples.push({
      key,
      example: def.example,
      comment: def.comment,
    });
  }
  const schema = zod.object(schemaShape);
  const env = validateEnv(process.env, schema, envValidationLogger);
  return { env, schema, examples };
}

/**
 * Define and validate client environment variables (alias for defineEnv)
 */
export const defineEnvClient = defineEnv;
