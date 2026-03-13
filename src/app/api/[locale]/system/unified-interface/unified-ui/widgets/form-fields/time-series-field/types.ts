/**
 * Time Series Field Widget Types
 * Handles TIME_SERIES field type — array of DataPoints.
 * Used as input/output handles on vibe-sense graph nodes.
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ArrayWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Time series field widget configuration.
 * Rendered as a port handle in the graph builder; not editable directly by the user.
 */
export interface TimeSeriesFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TIME_SERIES;
}
