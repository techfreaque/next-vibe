/**
 * Number Field Widget Types
 * Handles NUMBER and INT field types
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { NumberWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface NumberFieldWidgetConfig<
  out TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.NUMBER | FieldDataType.INT;
  min?: number;
  max?: number;
  step?: number;
}
