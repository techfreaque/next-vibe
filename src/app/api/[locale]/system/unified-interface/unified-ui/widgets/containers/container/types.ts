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
import type { WidgetData } from "../../../../shared/widgets/widget-data";
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
import type { CustomWidgetObjectConfig } from "../custom/types";

/**
 * Container layout and styling properties (without type discriminant)
 * Used for custom widgets that need container-like layout but have their own type
 */
export interface BaseContainerLayoutProps<TKey extends string> {
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
  columns?: number;
  rows?: number;
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
  /** Additional className for the inner children container div (merged with layoutClass) */
  innerClassName?: string;
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
  /**
   * Dynamic className callback - receives field value and parent value
   * Returns additional className to merge with static className
   */
  getClassName?: (value: WidgetData, parentValue?: WidgetData) => string;
}

/**
 * Base container properties shared between regular and union variants
 */
interface BaseContainerProps<
  TKey extends string,
> extends BaseContainerLayoutProps<TKey> {
  type: WidgetType.CONTAINER;
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
  /**
   * Type-safe function to extract count from container data
   * Used to display counts in title (e.g., "Leads (42)")
   * Receives the full output object inferred from children
   */
  getCount?: (
    data: NoInfer<
      z.output<
        InferSchemaFromField<
          ContainerObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
          FieldUsage.ResponseData
        >
      >
    >,
  ) => number | undefined;
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
  /**
   * Type-safe function to extract count from container data
   * Used to display counts in title (e.g., "Leads (42)")
   * Receives the full output object inferred from variants
   */
  getCount?: (
    data: NoInfer<
      z.output<
        InferSchemaFromField<
          BaseObjectUnionWidgetConfig<TKey, TUsage, "object-union", TVariants>,
          FieldUsage.ResponseData
        >
      >
    >,
  ) => number | undefined;
}

/**
 * Union type of all Container widget configurations
 * - For arrays: Use ContainerArrayWidgetConfig with "array" | "array-optional"
 * - For objects: Use ContainerObjectWidgetConfig with "object" | "object-optional" | "widget-object"
 * - For unions: Use ContainerUnionWidgetConfig with "object-union"
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
  // Each union member only resolves when TSchemaType/TChildren match the variant constraint.
  // Inference at definition sites requires the full union — narrowing happens via hasChild/hasChildren guards at render time.
  | ContainerArrayWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; array variant resolves only when "array"|"array-optional" is passed
      TSchemaType,
      TChildren
    >
  | ContainerUnionWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TChildren is the full union; union variant resolves only when UnionObjectWidgetConfigConstrain is passed
      TChildren
    >
  | ContainerObjectWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; object variant resolves only when "object"|"object-optional"|"widget-object" is passed
      TSchemaType,
      TChildren
    >
  | CustomWidgetObjectConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; object variant resolves only when "object"|"object-optional"|"widget-object" is passed
      TSchemaType,
      TChildren
    >;
