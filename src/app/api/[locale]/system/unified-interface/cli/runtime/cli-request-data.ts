/**
 * CLI request data schema and type.
 * Client-safe — no Node.js or CLI dependencies.
 */

import { z } from "zod";

/**
 * CLI request data — a recursive record for request/response examples.
 */
export interface CliRequestData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | string[]
    | number[]
    | boolean[]
    | CliRequestData
    | CliRequestData[]
    | CliRequestData[][];
}

/**
 * Recursive Zod schema for CLI request/response data.
 * Annotated with ZodType<CliRequestData> to break the self-reference cycle.
 */
export const cliRequestDataSchema: z.ZodType<CliRequestData> = z.lazy(() =>
  z.record(
    z.string(),
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.null(),
      z.undefined(),
      z.array(z.string()),
      z.array(z.number()),
      z.array(z.boolean()),
      cliRequestDataSchema,
      z.array(cliRequestDataSchema),
      z.array(z.array(cliRequestDataSchema)),
    ]),
  ),
);
