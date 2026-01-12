/**
 * Client Environment Definition
 * Enforces explicit process.env references for Next.js bundler
 */

import type { z } from "zod";
import { z as zod } from "zod";

interface FieldDef<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  value: z.input<T>; // Must pass explicit process.env.VAR_NAME
  example: string;
  comment?: string;
}

type Fields = Record<string, FieldDef>;

type InferEnv<T extends Fields> = {
  [K in keyof T]: z.infer<T[K]["schema"]>;
};

export interface EnvExample {
  key: string;
  example: string;
  comment?: string;
}

/**
 * Define client environment with explicit process.env references
 *
 * @example
 * export const { env } = defineEnvClient({
 *   NEXT_PUBLIC_APP_URL: {
 *     schema: z.string().url(),
 *     value: process.env.NEXT_PUBLIC_APP_URL,  // Required for bundler
 *     example: "http://localhost:3000"
 *   },
 * });
 */
export function defineEnvClient<T extends Fields>(
  fields: T,
): {
  envClient: InferEnv<T>;
  schema: z.ZodObject<{ [K in keyof T]: T[K]["schema"] }>;
  examples: EnvExample[];
} {
  const schemaShape = Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.schema]),
  );
  const schema = zod.object(schemaShape) as z.ZodObject<{
    [K in keyof T]: T[K]["schema"];
  }>;

  const values = Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.value]),
  );

  const envClient = schema.parse(values) as InferEnv<T>;

  const examples: EnvExample[] = Object.entries(fields).map(([key, def]) => ({
    key,
    example: def.example,
    comment: def.comment,
  }));

  return { envClient, schema, examples };
}
