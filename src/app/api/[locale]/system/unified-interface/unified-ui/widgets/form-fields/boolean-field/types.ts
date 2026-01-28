/**
 * Boolean Field Widget Types
 * Handles BOOLEAN field type (checkbox/switch)
 */

import type { z } from "zod";

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { BooleanWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface BooleanFieldWidgetConfig<
  out TKey extends string,
  TSchema extends BooleanWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.BOOLEAN;
  checkboxLabel?: TKey;
  switchLabel?: TKey;
  variant?: "checkbox" | "switch";
}

export type BooleanFieldValue<TSchema extends z.ZodTypeAny> = z.output<TSchema>;
