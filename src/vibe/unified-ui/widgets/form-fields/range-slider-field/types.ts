/**
 * Range Slider Field Widget Types
 * Range selection field with draggable min/max handles
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { EnumWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { z } from "zod";

export interface RangeSliderFieldWidgetConfig<
  out TKey extends string,
  TSchema extends z.ZodOptional<
    z.ZodObject<{
      min: z.ZodOptional<EnumWidgetSchema>;
      max: z.ZodOptional<EnumWidgetSchema>;
    }>
  >,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.RANGE_SLIDER;
  options: Array<{
    label: TKey;
    value: string | number;
    icon?: IconKey;
    description?: TKey;
  }>;
  minLabel?: TKey;
  maxLabel?: TKey;
  minDefault?: string | number;
  maxDefault?: string | number;
}
