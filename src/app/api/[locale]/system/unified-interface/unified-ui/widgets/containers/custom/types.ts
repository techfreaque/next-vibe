import type z from "zod";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  BasePrimitiveWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import type { BaseContainerLayoutProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/types";

/**
 * Custom widget config - allows custom React component renderer
 */
export interface CustomWidgetObjectConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
    BaseContainerLayoutProps<TKey> {
  type: WidgetType.CUSTOM_WIDGET;
  // oxlint-disable-next-line typescript/no-explicit-any
  render?: React.ComponentType<any>;
}

/**
 * Custom widget config - allows custom React component renderer
 */
export interface CustomWidgetPrimitiveConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
  TSchema extends z.ZodTypeAny,
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CUSTOM_WIDGET;
  // oxlint-disable-next-line typescript/no-explicit-any
  render?: React.ComponentType<any>;
}
