/**
 * Container Widget Type Definitions
 */

import type { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type {
  ObjectField,
  UnifiedField,
} from "../../../../shared/types/endpoint";
import type { LayoutType, WidgetType } from "../../../../shared/types/enums";
import type {
  InferSchemasFromChildren,
  ObjectWidgetConfig,
} from "../../../../shared/widgets/configs";
import type { LayoutConfig } from "../../../../shared/widgets/layout-config";
import type {
  BaseObjectUnionWidgetConfig,
  BaseObjectWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";
import type { SpacingSize } from "../../display-only/title/types";

/**
 * Container widget requires an object schema
 */
export type ContainerWidgetSchema = z.ZodObject<z.ZodRawShape>;

/**
 * Base container properties shared between regular and union variants
 */
interface BaseContainerProps<
  TKey extends string,
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string,
          ObjectWidgetConfig<
            string,
            FieldUsageConfig,
            "object",
            Record<string, UnifiedField<string, z.ZodTypeAny>>
          >
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string,
          ObjectWidgetConfig<
            string,
            FieldUsageConfig,
            "object",
            Record<string, UnifiedField<string, z.ZodTypeAny>>
          >
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
  TUsage extends FieldUsageConfig,
> {
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
  /**
   * Type-safe function to extract count from request/response data
   * Used to display counts in title (e.g., "Leads (42)")
   */
  getCount?: (data: {
    request?: InferSchemasFromChildren<TChildren, TUsage>["request"];
    response?: InferSchemasFromChildren<TChildren, TUsage>["response"];
  }) => number | undefined;
}

/**
 * Container with regular object children
 */
export type ContainerObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | UnifiedField<string, z.ZodTypeAny>,
> = BaseObjectWidgetConfig<TUsage, TSchemaType, TChildren> &
  BaseContainerProps<TKey, TChildren, TUsage>;

/**
 * Container with discriminated union
 */
export type ContainerUnionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends readonly [
    ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string,
      ObjectWidgetConfig<
        string,
        FieldUsageConfig,
        "object",
        Record<string, UnifiedField<string, z.ZodTypeAny>>
      >
    >,
    ...ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string,
      ObjectWidgetConfig<
        string,
        FieldUsageConfig,
        "object",
        Record<string, UnifiedField<string, z.ZodTypeAny>>
      >
    >[],
  ],
> = BaseObjectUnionWidgetConfig<TUsage, "object-union", TVariants> &
  BaseContainerProps<TKey, TVariants, TUsage>;

/**
 * Container Widget Configuration (union of object and union variants)
 */
export type ContainerWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "object"
    | "object-optional"
    | "object-union"
    | "widget-object",
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string,
          ObjectWidgetConfig<
            string,
            FieldUsageConfig,
            "object",
            Record<string, UnifiedField<string, z.ZodTypeAny>>
          >
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string,
          ObjectWidgetConfig<
            string,
            FieldUsageConfig,
            "object",
            Record<string, UnifiedField<string, z.ZodTypeAny>>
          >
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
> =
  | ContainerObjectWidgetConfig<
      TKey,
      TUsage,
      TSchemaType & ("object" | "object-optional" | "widget-object"),
      TChildren &
        (
          | Record<string, UnifiedField<string, z.ZodTypeAny>>
          | UnifiedField<string, z.ZodTypeAny>
        )
    >
  | ContainerUnionWidgetConfig<
      TKey,
      TUsage,
      TChildren &
        readonly [
          ObjectField<
            Record<string, UnifiedField<string, z.ZodTypeAny>>,
            FieldUsageConfig,
            string,
            ObjectWidgetConfig<
              string,
              FieldUsageConfig,
              "object",
              Record<string, UnifiedField<string, z.ZodTypeAny>>
            >
          >,
          ...ObjectField<
            Record<string, UnifiedField<string, z.ZodTypeAny>>,
            FieldUsageConfig,
            string,
            ObjectWidgetConfig<
              string,
              FieldUsageConfig,
              "object",
              Record<string, UnifiedField<string, z.ZodTypeAny>>
            >
          >[],
        ]
    >;
