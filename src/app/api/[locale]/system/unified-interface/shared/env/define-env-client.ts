/**
 * Client Environment Definition
 * Enforces explicit process.env references for Next.js bundler
 */

import type { z } from "zod";
import { z as zod } from "zod";

interface FieldDef<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  value: z.input<T>; // Must pass explicit process.env.VAR_NAME
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
}

type Fields = Record<string, FieldDef>;

type InferEnv<T extends Fields> = {
  [K in keyof T]: z.infer<T[K]["schema"]>;
};

export interface EnvExample {
  key: string;
  example: string | false;
  comment?: string;
  commented?: boolean;
  sensitive?: boolean;
  category?: string;
  onboardingRequired?: boolean;
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
    commented: def.commented,
    sensitive: def.sensitive,
    category: def.category,
    onboardingRequired: def.onboardingRequired,
  }));

  return { envClient, schema, examples };
}
