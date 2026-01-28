/**
 * Container Widget Type Definitions
 */

import type { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { InferSchemaFromField } from "../../../../shared/types/endpoint";
import type {
  FieldUsage,
  LayoutType,
  WidgetType,
} from "../../../../shared/types/enums";
import type { LayoutConfig } from "../../../../shared/widgets/layout-config";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectUnionWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";
import type { SpacingSize } from "../../display-only/title/types";

/**
 * Base container properties shared between regular and union variants
 */
interface BaseContainerProps<TKey extends string> {
  type: WidgetType.CONTAINER;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
  layout?: LayoutConfig;
  columns?: number;
  /** Tailwind spacing value for gap between children (0, 1, 2, 3, 4, 6, 8) */
  gap?: "0" | "1" | "2" | "3" | "4" | "6" | "8";
  /** Alignment for flex/inline layouts (start = top-aligned, center = vertically centered, end = bottom-aligned) */
  alignItems?: "start" | "center" | "end";
  /** Tailwind spacing value for top padding (0, 2, 3, 4, 6, 8) */
  paddingTop?: "0" | "2" | "3" | "4" | "6" | "8";
  /** Tailwind spacing value for bottom padding (0, 2, 3, 4, 6, 8) */
  paddingBottom?: "0" | "2" | "3" | "4" | "6" | "8";
  optional?: boolean;
  icon?: IconKey;
  border?: boolean;
  /** Add bottom border */
  borderBottom?: boolean;
  spacing?: "compact" | "normal" | "relaxed";
  /** Render without Card wrapper for inline layouts */
  noCard?: boolean;
  /** Title text alignment */
  titleAlign?: "left" | "center" | "right";
  /** Title text size */
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Description text size */
  descriptionSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Gap between buttons in auto-submit button container */
  buttonGap?: SpacingSize;
  /** Icon size for submit button icons */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after icon in buttons */
  iconSpacing?: SpacingSize;
  /** Padding for card content */
  contentPadding?: SpacingSize;
  /** Gap between header elements */
  headerGap?: SpacingSize;
  /**
   * Submit/Refresh button configuration for the container
   * Rendered in the header next to the title when position is "header"
   *
   * @example
   * ```typescript
   * submitButton: {
   *   text: "app.common.actions.refresh",
   *   loadingText: "app.common.actions.refreshing",
   *   position: "header",
   *   icon: "refresh-cw",
   *   variant: "ghost",
   *   size: "sm",
   * }
   * ```
   */
  submitButton?: {
    /** Submit button text translation key */
    text?: NoInfer<TKey>;
    /** Submit button loading text translation key */
    loadingText?: NoInfer<TKey>;
    /** Submit button position - 'bottom' (default) or 'header' */
    position?: "bottom" | "header";
    /** Icon identifier (e.g., "refresh-cw", "save", "send") */
    icon?: IconKey;
    /** Button variant */
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "destructive"
      | "ghost"
      | "outline"
      | "link";
    /** Button size */
    size?: "default" | "sm" | "lg" | "icon";
  };
  /**
   * Show auto FormAlert at top of container when there are request fields
   * Displays error/success messages from context.response
   * Set to false to disable (e.g., for login/signup pages with custom alert position)
   * @default true
   */
  showFormAlert?: boolean;
  /**
   * Show auto submit button at bottom of container when there are request fields
   * Only shown when no explicit submitButton config is provided
   * Set to false to disable (e.g., for login/signup pages with custom submit button)
   * @default true
   */
  showSubmitButton?: boolean;
}

/**
 * Container with array child
 */
export interface ContainerArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>
  extends
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild>,
    BaseContainerProps<TKey> {
  type: WidgetType.CONTAINER;
  /**
   * Type-safe function to extract count from container data
   * Used to display counts in title (e.g., "Leads (42)")
   * Receives the full output object inferred from children
   */
  getCount?: TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >
    ? (
        data: NoInfer<
          z.output<InferSchemaFromField<TChild, FieldUsage.ResponseData>>
        >,
      ) => number | undefined
    : never;
}

/**
 * Container with regular object children
 */
export interface ContainerObjectWidgetConfig<
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
    BaseContainerProps<TKey> {
  type: WidgetType.CONTAINER;
}

/**
 * Container with discriminated union
 */
export interface ContainerUnionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends UnionObjectWidgetConfigConstrain<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseObjectUnionWidgetConfig<TKey, TUsage, "object-union", TVariants>,
    BaseContainerProps<TKey> {
  type: WidgetType.CONTAINER;
}

/**
 * Container Widget Configuration (union of object, array, and union variants)
 *
 * Uses distribution to properly narrow union types:
 * - When TSchemaType is "array" | "array-optional", only ArrayConfig is valid
 * - When TSchemaType is "object" | "object-optional" | "widget-object", only ObjectConfig is valid
 * - When TSchemaType is "object-union", only UnionConfig is valid
 * - TChildren must match the respective constraint
 */
export type ContainerWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "object"
    | "object-optional"
    | "object-union"
    | "array"
    | "array-optional"
    | "widget-object",
  TChildren extends
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> =
  | ContainerArrayWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | ContainerUnionWidgetConfig<TKey, TUsage, TChildren>
  | ContainerObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>;
