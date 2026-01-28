/**
 * DataList Widget Type Definitions
 */

import type { z } from "zod";

import type { UnifiedField } from "../../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type {
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../../../../shared/types/enums";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Common properties for both array and object data list configurations
 */
interface DataListWidgetCommonProps<
  TKey extends string,
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
> {
  type: WidgetType.DATA_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  optional?: boolean;
  renderMode?: "default" | "compact" | "detailed" | string;
  hierarchical?: boolean;
  groupBy?: string; // Field name from data object to group by
  sortBy?: string; // Field name from data object to sort by
  columns?: number; // Number of columns for list layout
  layoutType?: LayoutType; // Layout type for list display
  showSummary?: boolean; // Show summary information
  maxItems?: number; // Maximum items to display before pagination/truncation
  // Spacing config
  gap?: SpacingSize; // Main container gap
  simpleArrayGap?: SpacingSize; // Gap for simple value arrays
  viewSwitcherGap?: SpacingSize; // Gap in view switcher buttons
  viewSwitcherPadding?: SpacingSize; // Padding in view switcher container
  buttonPadding?: SpacingSize; // Padding for view switcher buttons
  tableHeadPadding?: SpacingSize; // Padding for table head cells
  tableCellPadding?: SpacingSize; // Padding for table body cells
  gridGap?: SpacingSize; // Gap between grid cards
  cardPadding?: SpacingSize; // Padding inside grid cards
  cardInnerGap?: SpacingSize; // Gap between fields in grid cards
  rowGap?: SpacingSize; // Gap between label and value in card rows
  buttonSpacing?: SpacingSize; // Margin for show more/less buttons
  // Text size config
  tableHeadSize?: "xs" | "sm" | "base" | "lg"; // Table head text size
  tableCellSize?: "xs" | "sm" | "base" | "lg"; // Table cell text size
  cardRowSize?: "xs" | "sm" | "base" | "lg"; // Card row text size
  buttonSize?: "xs" | "sm" | "base" | "lg"; // Show more/less button text size
  metadata?: {
    targetEndpoint: TTargetEndpoint;
    extractParams?: TTargetEndpoint extends CreateApiEndpointAny
      ? (source: Record<string, WidgetData>) => {
          urlPathParams?: Partial<
            TTargetEndpoint["types"]["UrlVariablesOutput"]
          >;
          data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
        }
      : undefined;
  };
}

/**
 * Extract the inferred output type from a UnifiedField's schema
 */
type ExtractFieldOutput<TField> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TField extends UnifiedField<string, infer TSchema, FieldUsageConfig, any>
    ? TSchema extends z.ZodTypeAny
      ? z.output<TSchema>
      : never
    : never;

/**
 * Extract the inferred output type from a record of UnifiedFields
 */
type ExtractChildrenOutput<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> = {
  [K in keyof TChildren]: ExtractFieldOutput<TChildren[K]>;
};

/**
 * Data List Widget Configuration - Array variant
 */
export interface DataListArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
  TSchemaType extends "array" | "array-optional",
>
  extends
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild>,
    Omit<DataListWidgetCommonProps<TKey, TTargetEndpoint>, "metadata"> {
  type: WidgetType.DATA_LIST;
  metadata?: {
    targetEndpoint: TTargetEndpoint;
    extractParams?: TTargetEndpoint extends CreateApiEndpointAny
      ? (source: ExtractFieldOutput<TChild>) => {
          urlPathParams?: Partial<
            TTargetEndpoint["types"]["UrlVariablesOutput"]
          >;
          data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
        }
      : undefined;
  };
}

/**
 * Data List Widget Configuration - Object variant
 */
export interface DataListObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
  TSchemaType extends "object" | "object-optional" | "widget-object",
>
  extends
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
    Omit<DataListWidgetCommonProps<TKey, TTargetEndpoint>, "metadata"> {
  type: WidgetType.DATA_LIST;
  metadata?: {
    targetEndpoint: TTargetEndpoint;
    extractParams?: TTargetEndpoint extends CreateApiEndpointAny
      ? (source: ExtractChildrenOutput<TKey, TUsage, TChildren>) => {
          urlPathParams?: Partial<
            TTargetEndpoint["types"]["UrlVariablesOutput"]
          >;
          data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
        }
      : undefined;
  };
}

/**
 * Data List Widget Configuration - Union of array and object variants
 *
 * Uses distribution to properly narrow union types:
 * - When TSchemaType is "array" | "array-optional", only ArrayConfig is valid
 * - When TSchemaType is "object" | "object-optional" | "widget-object", only ObjectConfig is valid
 * - TChildOrChildren must match the respective constraint
 */
export type DataListWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "object"
    | "object-optional"
    | "widget-object"
    | "array-optional",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
  TTargetEndpoint extends CreateApiEndpointAny | undefined = undefined,
> =
  | DataListArrayWidgetConfig<
      TKey,
      TUsage,
      TTargetEndpoint,
      TChildOrChildren,
      TSchemaType
    >
  | DataListObjectWidgetConfig<
      TKey,
      TUsage,
      TTargetEndpoint,
      TChildOrChildren,
      TSchemaType
    >;
