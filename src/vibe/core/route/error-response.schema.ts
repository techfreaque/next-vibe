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
import type { VibeTranslationKey } from "../i18n/shared";
import { allowanceRefusalSchema, ErrorResponseTypes } from "./response.schema";

const errorKeys: ReadonlySet<string> = new Set(
  Object.values(ErrorResponseTypes).map(({ errorKey }) => errorKey),
);

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string() as z.ZodType<TranslatedKeyType>,
  publicRoleDenial: z.literal(true).optional(),
  allowance: allowanceRefusalSchema.optional(),
  errorType: z.object({
    errorKey: z.custom<VibeTranslationKey>(
      (value) => typeof value === "string" && errorKeys.has(value),
    ),
    errorCode: z.number(),
  }),
});
