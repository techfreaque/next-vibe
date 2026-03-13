/**
 * Signals Field Widget Types
 * Handles SIGNALS field type — array of SignalEvents.
 * Used as input/output handles on vibe-sense graph nodes.
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ArrayWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Signals field widget configuration.
 * Rendered as a port handle in the graph builder; not editable directly by the user.
 */
export interface SignalsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.SIGNALS;
}
