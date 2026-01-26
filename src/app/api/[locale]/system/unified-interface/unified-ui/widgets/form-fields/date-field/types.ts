/**
 * Date Field Widget Types
 * Date picker field
 */

import type { z } from "zod";

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { DateWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
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

export type DateFieldValue<TSchema extends z.ZodTypeAny> = z.output<TSchema>;
