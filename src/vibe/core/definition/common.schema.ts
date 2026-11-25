import { z } from "zod";

import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";

// Common reusable schemas

/** A direct string field stays text even when its value resembles JSON. */
export function isStringQueryField(
  schema: z.ZodType | undefined,
  field: string,
): boolean {
  return (
    schema instanceof z.ZodObject && schema.shape[field] instanceof z.ZodString
  );
}

export const dateSchema = z
  .union([z.string(), z.date(), z.coerce.number()])
  .transform((val): Date => {
    if (val instanceof Date) {
      return val;
    }
    // Tolerate a JSON-quoted ISO string ("\"2026-01-05T00:00:00.000Z\"") from
    // older clients that JSON.stringify'd Dates into GET query params.
    if (typeof val === "string" && val.length > 1 && val.startsWith('"')) {
      return new Date(val.replaceAll('"', ""));
    }
    return new Date(val);
  });

// Runtime: accepts any string (emoji, IconKey), Type: IconKey
export const iconSchema = z.string() as z.ZodType<IconKey>;
const iconOptionalSchema = z.string().optional() as z.ZodType<
  IconKey | undefined
>;
export const iconNullishSchema = z
  .string()
  .nullable() as z.ZodType<IconKey | null>;

export type IconSchemaType = typeof iconSchema;
export type IconSchemaOptionalType = typeof iconOptionalSchema;
export type IconSchemaNullishType = typeof iconNullishSchema;
export type IconSchemaGenericType = z.ZodType<IconKey>;

// Runtime: accepts any string, Type: TranslatedKeyType (already-translated value)
export const translatedValueSchema = z.string() as z.ZodType<TranslatedKeyType>;

export const undefinedSchema = z.undefined();
export type UndefinedType = z.input<typeof undefinedSchema>;
