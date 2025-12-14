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
 * export const { env } = defineEnv({
 *   DATABASE_URL: { schema: z.string().url(), example: "postgres://localhost/db", comment: "DB" },
 *   API_KEY: { schema: z.string().min(10), example: "your-api-key" },
 * });
 */
export function defineEnv<T extends Fields>(fields: T): { env: InferEnv<T> } {
  const schemaShape = Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.schema]),
  );
  const schema = zod.object(schemaShape);

  const env = validateEnv(process.env, schema, envValidationLogger) as InferEnv<T>;

  return { env };
}
