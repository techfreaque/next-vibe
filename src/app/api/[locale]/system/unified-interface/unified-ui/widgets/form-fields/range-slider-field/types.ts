/**
 * Range Slider Field Widget Types
 * Range selection field with draggable min/max handles
 */

import type { z } from "zod";

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

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
