/**
 * Canonical value type for endpoint payloads (request + response shapes).
 *
 * WidgetData accepts any JS value that can flow through an endpoint:
 * primitives, Date, undefined, nested objects and arrays.
 * No functions — those are stripped at serialization boundaries.
 * Field schemas in the endpoint definition handle specific coercions (e.g. string → Date).
 *
 * Type is declared before the schema to satisfy TypeScript's forward-reference
 * requirement for recursive Zod schemas (z.infer cannot resolve its own cycle).
 */

import { z } from "zod";

export type WidgetData =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | WidgetData[]
  | { [key: string]: WidgetData };

export const WidgetDataSchema: z.ZodType<WidgetData> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
    z.date(),
    z.array(WidgetDataSchema),
    z.record(z.string(), WidgetDataSchema),
  ]),
);
