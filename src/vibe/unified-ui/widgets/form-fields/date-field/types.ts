/**
 * Date Field Widget Types
 * Date picker field
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { DateWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface DateFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.DATE;
  minDate?: Date;
  maxDate?: Date;
}
