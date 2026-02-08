import { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

// Common reusable schemas

export const dateSchema = z
  .union([z.string(), z.date(), z.coerce.number()])
  .transform((val): string | Date | number => {
    if (val instanceof Date) {
      return val;
    }
    return new Date(val);
  });

export type DateInputType = z.input<typeof dateRangeSchema>;

// Runtime: accepts any string (emoji, IconKey), Type: IconKey
export const iconSchema = z.string() as z.ZodType<IconKey>;
export const iconOptionalSchema = z.string().optional() as z.ZodType<
  IconKey | undefined
>;
export const iconNullishSchema = z
  .string()
  .nullable() as z.ZodType<IconKey | null>;

export type IconSchemaType = typeof iconSchema;
export type IconSchemaOptionalType = typeof iconOptionalSchema;
export type IconSchemaNullishType = typeof iconNullishSchema;

export const idSchema = z.object({
  id: z.uuid(),
});
export type IdType = z.infer<typeof idSchema>;

export const stringToIntSchema = (
  errorMessage: string,
): ReturnType<typeof z.coerce.number> => {
  return z.coerce.number().int({
    message: errorMessage,
  });
};

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type PaginationType = z.infer<typeof paginationSchema>;

export const searchSchema = z.object({
  search: z.string().nullable(),
});
export type SearchType = z.infer<typeof searchSchema>;

export const dateRangeSchema = z.object({
  startDate: dateSchema.nullable(),
  endDate: dateSchema.nullable(),
});
export type DateRangeType = z.infer<typeof dateRangeSchema>;

export const undefinedSchema = z.undefined();
export type UndefinedType = z.input<typeof undefinedSchema>;

export const booleanSchema = z.object({
  exists: z.boolean(),
});
export type BooleanType = z.input<typeof booleanSchema>;
