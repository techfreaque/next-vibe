/**
 * Icon Field Widget Types
 * Icon picker/selector field
 */

import type { IconSchemaType } from "@/app/api/[locale]/shared/types/common.schema";
import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface IconFieldWidgetConfig<
  out TKey extends string,
  TSchema extends IconSchemaType,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.ICON;
  size?: "sm" | "default" | "lg";
}
