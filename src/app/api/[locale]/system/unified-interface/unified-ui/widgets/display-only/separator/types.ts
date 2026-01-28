/**
 * Separator Widget Types
 * Renders a horizontal line divider to separate content sections
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Separator Widget Configuration
 * Displays a horizontal line with optional spacing and label
 */
export interface SeparatorWidgetConfig<
  out TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.SEPARATOR;

  /** Spacing above separator */
  spacingTop?: SpacingSize;

  /** Spacing below separator */
  spacingBottom?: SpacingSize;

  /** Optional label to display on the separator */
  label?: TKey;
}
