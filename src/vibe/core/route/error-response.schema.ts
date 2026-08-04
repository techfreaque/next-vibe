/**
 * Zod mirror of the error envelope, for re-validating an error that arrived as
 * data rather than being constructed in process.
 *
 * Split out of `response.schema.ts` because it is an optional concern: it only
 * earns its place where an error crosses a wire (`next-response.ts` parses one
 * off an HTTP response, `tasks/cron/history` stores one). Where `fail()` builds
 * the value and the same process renders it, there is nothing to re-validate.
 */

import { z } from "zod";

import type { TranslatedKeyType } from "../i18n/core/scoped-translation";

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string() as z.ZodType<TranslatedKeyType>,
  errorType: z.object({
    errorKey: z.string(),
    errorCode: z.coerce.number(),
  }),
});
