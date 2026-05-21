import { z } from "zod";

import type { CorvinaBodyObject, CorvinaBodyValue } from "./client";

const manifestValueSchema: z.ZodType<CorvinaBodyValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(manifestValueSchema),
    manifestObjectSchema,
  ]),
);

export const manifestObjectSchema: z.ZodType<CorvinaBodyObject> = z.lazy(() =>
  z.record(z.string(), manifestValueSchema),
);
