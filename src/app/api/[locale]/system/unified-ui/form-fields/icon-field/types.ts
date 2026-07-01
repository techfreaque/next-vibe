/**
 * Icon Field Widget Types
 * Icon picker/selector field
 */

import type {
  IconSchemaNullishType,
  IconSchemaOptionalType,
  IconSchemaType,
} from "next-vibe/core/definition/common.schema";
import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

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
