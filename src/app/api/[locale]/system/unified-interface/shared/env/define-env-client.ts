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
): { envClient: InferEnv<T> } {
  const schemaShape = Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.schema]),
  );
  const schema = zod.object(schemaShape);

  const values = Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.value]),
  );

  const envClient = schema.parse(values) as InferEnv<T>;

  return { envClient };
}
