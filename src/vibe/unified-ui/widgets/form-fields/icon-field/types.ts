/**
 * Icon Field Widget Types
 * Icon picker/selector field
 */

import type {
  IconSchemaNullishType,
  IconSchemaOptionalType,
  IconSchemaType,
} from "../../../../core/definition/common.schema";
import type { FieldDataType } from "../../../../core/definition/enums";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface IconFieldWidgetConfig<
  out TKey extends string,
  TSchema extends
    | IconSchemaType
    | IconSchemaOptionalType
    | IconSchemaNullishType,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.ICON;
}
