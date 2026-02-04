/**
 * DataCards Widget Type Definitions
 */

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type {
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../../../../shared/types/enums";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import type { ReactWidgetContext } from "../../_shared/react-types";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  InferChildOutput,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Card click metadata configuration - Navigation variant
 * Infers the urlPathParams return type from the targetEndpoint
 */
export interface CardClickNavigationMetadata<
  TItemData,
  TEndpoint extends CreateApiEndpointAny,
> {
  targetEndpoint: TEndpoint;
  extractParams: (item: TItemData) => {
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
  };
}

/**
 * Card click metadata configuration - Callback variant
 * Allows custom click handler function
 * Context (including logger, locale, etc.) is passed from widget context
 */
export interface CardClickCallbackMetadata<TItemData> {
  onClick: (
    item: TItemData,
    context: ReactWidgetContext<CreateApiEndpointAny>,
  ) => void | Promise<void>;
  isClickable?: (item: TItemData) => boolean;
}

/**
 * Union type for card click metadata - supports both navigation and callback
 */
export type CardClickMetadata<
  TItemData,
  TEndpoint extends CreateApiEndpointAny,
> =
  | CardClickNavigationMetadata<TItemData, TEndpoint>
  | CardClickCallbackMetadata<TItemData>;

/**
 * Base Data Cards Widget Configuration (shared properties)
 */
interface BaseDataCardsConfig<
  TKey extends string,
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<FieldUsageConfig>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<FieldUsageConfig>>,
> {
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  // Card field mapping - these are field names from child objects to display in card layout
  cardTitle?: string; // Field name to use as card title (e.g., "name", "title")
  cardSubtitle?: string; // Field name to use as card subtitle (e.g., "email", "description")
  cardImage?: string; // Field name containing image URL (e.g., "avatarUrl", "imageUrl")
  cardContent?: string[]; // Array of field names to display in card body (e.g., ["description", "status"])
  cardMetadata?: string[]; // Array of field names to display as metadata (e.g., ["createdAt", "updatedAt"])
  cardTemplate?: "default" | "eslint-issue" | "code-issue" | string; // Template name for card rendering
  groupBy?: string; // Field to group cards by
  showSummary?: boolean; // Show summary for groups
  summaryTemplate?: string; // Template for summary rendering
  layoutType?: LayoutType; // Layout type for cards grid

  maxItems?: number; // Maximum number of items to show initially (rest hidden behind "Show N more" button)
  itemConfig?: {
    template: "default" | "compact" | "detailed" | string;
    size: "small" | "medium" | "large" | string;
    spacing: "compact" | "normal" | "relaxed" | string;
  };
  // Spacing config
  gap?: SpacingSize; // Gap between cards in grid
  cardPadding?: SpacingSize; // Padding inside each card
  groupGap?: SpacingSize; // Gap between groups
  groupInnerGap?: SpacingSize; // Gap between group header and cards
  groupHeaderGap?: SpacingSize; // Gap in group header
  groupHeaderPadding?: SpacingSize; // Padding in group header
  cardGap?: SpacingSize; // Gap between cards in a group
  // Text size config
  groupTitleSize?: "xs" | "sm" | "base" | "lg"; // Group title text size
  badgeSize?: "xs" | "sm" | "base" | "lg"; // Badge text size
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"; // Title text size
  descriptionSize?: "xs" | "sm" | "base" | "lg"; // Description text size
  // Badge padding
  badgePadding?: SpacingSize; // Badge padding
  // Border radius
  cardBorderRadius?: "none" | "sm" | "base" | "lg" | "xl" | "2xl" | "full"; // Card border radius
  badgeBorderRadius?: "none" | "sm" | "base" | "lg" | "xl" | "2xl" | "full"; // Badge border radius
  // Metadata for card interactions
  metadata?: {
    onCardClick?: CardClickMetadata<
      InferChildOutput<TChildOrChildren>,
      CreateApiEndpointAny
    >;
    /** Enable drag and drop reordering */
    enableDragDrop?: boolean;
    /** Callback when items are reordered via drag and drop */
    onReorder?: (
      items: InferChildOutput<TChildOrChildren>[],
      context: ReactWidgetContext<CreateApiEndpointAny>,
    ) => void | Promise<void>;
  };
  // Dynamic className callback for each card
  // Receives item data and parent value for context
  getClassName?: (item: WidgetData, parentValue?: WidgetData) => string;
}

/**
 * Data Cards Array Widget Configuration
 */
export interface DataCardsArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>
  extends
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild>,
    BaseDataCardsConfig<TKey, TChild> {
  type: WidgetType.DATA_CARDS;
}

/**
 * Data Cards Object Widget Configuration
 */
export interface DataCardsObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
    BaseDataCardsConfig<TKey, TChildren> {
  type: WidgetType.DATA_CARDS;
}

/**
 * Data Cards Widget Configuration (union of array and object)
 *
 * Uses distribution to properly narrow union types:
 * - When TSchemaType is "array" | "array-optional", only ArrayConfig is valid
 * - When TSchemaType is "object" | "object-optional" | "widget-object", only ObjectConfig is valid
 * - TChildOrChildren must match the respective constraint
 */
export type DataCardsWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "array-optional"
    | "object"
    | "object-optional"
    | "widget-object",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> =
  // Each union member only resolves when TSchemaType/TChildOrChildren match the variant constraint.
  // Inference at definition sites requires the full union — narrowing happens via hasChild/hasChildren guards at render time.
  | DataCardsArrayWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; array variant resolves only when "array"|"array-optional" is passed
      TSchemaType,
      TChildOrChildren
    >
  | DataCardsObjectWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; object variant resolves only when "object"|"object-optional" is passed
      TSchemaType,
      TChildOrChildren
    >;
