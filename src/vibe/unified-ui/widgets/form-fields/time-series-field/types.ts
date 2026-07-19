/**
 * Time Series Field Widget Types
 * Handles TIME_SERIES field type - array of DataPoints.
 * Used as input/output handles on vibe-sense graph nodes.
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { ArrayWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

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
