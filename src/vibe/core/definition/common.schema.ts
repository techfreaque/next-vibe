import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";
import { z } from "zod";

// Common reusable schemas

export const dateSchema = z
  .union([z.string(), z.date(), z.coerce.number()])
  .transform((val): Date => {
    if (val instanceof Date) {
      return val;
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
