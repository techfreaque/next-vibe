/**
 * Drag Handle Widget Types
 */

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  BaseWidgetConfig,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

export interface DragHandleWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BaseWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.DRAG_HANDLE;
  icon?: IconKey;
  schema?: never;
}
