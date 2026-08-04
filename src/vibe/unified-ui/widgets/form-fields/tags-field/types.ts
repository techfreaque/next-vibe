/**
 * Tags Field Widget Types
 * Array of tags input with suggestions
 */

import type { z } from "zod";

import type { FieldDataType } from "../../../../core/definition/enums";
import type { ArrayWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Schemas a tags field accepts.
 *
 * Beyond a plain array, a tags field may back a value that also accepts a SINGLE
 * item on input — `vibe check src/foo` sends a bare string where
 * `vibe check a b` sends a list. Such a field is a union, not a ZodArray, so it
 * cannot satisfy ArrayWidgetSchema no matter how it is transformed (a coerced
 * schema becomes a ZodPipe).
 *
 * Widening is scoped to this widget rather than ArrayWidgetSchema because it is
 * only sound where the reader normalises: the widget always renders and writes
 * an array, so a lone string exists on the way IN and nowhere else.
 */
export type TagsWidgetSchema =
  | ArrayWidgetSchema
  | z.ZodType<string | string[]>
  | z.ZodType<string | string[] | null>
  | z.ZodType<string | string[] | undefined>
  | z.ZodType<string | string[] | null | undefined>;

export interface TagsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends TagsWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TAGS;
  suggestions?: Array<{
    value: string;
    label: NoInfer<TKey>;
    category?: string;
  }>;
  maxTags?: number;
  allowCustom?: boolean;
}
