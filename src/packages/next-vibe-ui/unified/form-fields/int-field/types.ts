/**
 * Int Field Widget Types
 * Handles INT field type (integer numbers)
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { NumberWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Int field widget configuration
 */
export interface IntFieldWidgetConfig<
  out TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.INT;
  min?: number;
  max?: number;
  step?: number;
}
