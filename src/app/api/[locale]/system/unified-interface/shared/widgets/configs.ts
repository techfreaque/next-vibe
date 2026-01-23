/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type { Route } from "next";
import type { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";

import type {
  CreateApiEndpointAny,
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  ObjectUnionField,
  UnifiedField,
} from "../types/endpoint";
import type {
  FieldDataType,
  FieldUsage,
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../types/enums";
import type { WidgetData } from "./types";
import type {
  ArrayWidgetSchema,
  BooleanWidgetSchema,
  DateWidgetSchema,
  EnumWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "./utils/schema-constraints";

/**
 * Layout configuration for containers and widgets
 */
export interface LayoutConfig {
  type: LayoutType;
  columns?: number;
  rows?: number;
  gap?: SpacingSize;
  padding?: SpacingSize;
  margin?: SpacingSize;
  spacing?: "compact" | "normal" | "relaxed"; // Added for consistent spacing control
  responsive?: {
    sm?: Partial<LayoutConfig>;
    md?: Partial<LayoutConfig>;
    lg?: Partial<LayoutConfig>;
    xl?: Partial<LayoutConfig>;
  };
}

/**
 * Common widget properties
 * TKey allows using either global TranslationKey or scoped translation keys
 */
interface BaseWidgetConfig {
  type: WidgetType;
  className?: string;
  order?: number;
  /** Hide this field from rendering */
  hidden?: boolean;
  /** Render inline with next sibling that also has inline: true */
  inline?: boolean;
}

/**
 * Prefill display configuration for form fields
 * When a field has a prefilled value from server/URL params, this controls how it's displayed
 */
export interface PrefillDisplayConfig<TKey extends string> {
  /** Display variant when field is prefilled */
  variant: "badge" | "highlight" | "card";
  /** Translation key for the label shown with prefilled value */
  labelKey?: NoInfer<TKey>;
  /** Icon to show with prefilled value */
  icon?: IconKey;
}

/**
 * Common properties for form field widgets
 * TKey allows using either global TranslationKey or scoped translation keys
 * TKey is inferred from label/description values, then validated against expected type
 */
interface BaseFormFieldWidgetConfig<
  out TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  placeholder?: NoInfer<TKey>;
  helpText?: NoInfer<TKey>;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
  /**
   * Make field readonly - displays value but cannot be edited
   * Use with prefillDisplay to show special styling for server-provided values
   */
  readonly?: boolean;
  /**
   * Configure how prefilled values are displayed when readonly
   * Only applies when field has a prefilled value
   */
  prefillDisplay?: PrefillDisplayConfig<TKey>;
}

// ============================================================================
// FORM WIDGETS
// ============================================================================

// Text input
export interface TextFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXT;
  schema: TSchema;
}

// Email input
export interface EmailFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.EMAIL;
  schema: TSchema;
}

// Password input
export interface PasswordFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.PASSWORD;
  schema: TSchema;
}

// Number input
export interface NumberFieldWidgetConfig<
  out TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.NUMBER;
  schema: TSchema;
}

// Boolean/Checkbox input
export interface BooleanFieldWidgetConfig<
  TKey extends string,
  TSchema extends BooleanWidgetSchema,
> extends Omit<BaseFormFieldWidgetConfig<TKey>, "placeholder"> {
  fieldType: FieldDataType.BOOLEAN;
  schema: TSchema;
}

// Select dropdown
export interface SelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends EnumWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.SELECT;
  options: Array<{ label: NoInfer<TKey>; value: string | number }>;
  schema: TSchema;
}

// Multi-select
export interface MultiSelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.MULTISELECT;
  options: Array<{ label: NoInfer<TKey>; value: string | number }>;
  schema: TSchema;
}

// Filter pills (like select but displayed as pills)
export interface FilterPillsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends EnumWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.FILTER_PILLS;
  options: Array<{
    label: NoInfer<TKey>;
    value: string | number;
    icon?: IconKey;
    description?: NoInfer<TKey>;
  }>;
  schema: TSchema;
}

// Range slider (min-max selection with visual slider)
export interface RangeSliderFieldWidgetConfig<
  out TKey extends string,
  TSchema extends z.ZodOptional<
    z.ZodObject<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      min: z.ZodOptional<z.ZodEnum<any>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      max: z.ZodOptional<z.ZodEnum<any>>;
    }>
  >,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.RANGE_SLIDER;
  options: Array<{
    label: NoInfer<TKey>;
    value: string | number;
    icon?: IconKey;
    description?: NoInfer<TKey>;
  }>;
  minLabel?: NoInfer<TKey>; // Optional label for min handle (defaults to "Min")
  maxLabel?: NoInfer<TKey>; // Optional label for max handle (defaults to "Max")
  minDefault?: string | number; // Optional default min value
  maxDefault?: string | number; // Optional default max value
  schema: TSchema;
}

// Textarea
export interface TextareaFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXTAREA;
  schema: TSchema;
}

// Phone input
export interface PhoneFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.PHONE;
  schema: TSchema;
}

// URL input
export interface UrlFieldWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.URL;
  schema: TSchema;
}

// Integer input
export interface IntFieldWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.INT;
  schema: TSchema;
}

// Date input
export interface DateFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.DATE;
  schema: TSchema;
}

// DateTime input
export interface DateTimeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.DATETIME;
  schema: TSchema;
}

// Time input
export interface TimeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TIME;
  schema: TSchema;
}

// File input
export interface FileFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.FILE;
  schema: TSchema;
}

// UUID input
export interface UuidFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.UUID;
  schema: TSchema;
}

// JSON input
export interface JsonFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.JSON;
  schema: TSchema;
}

// Date range input
export interface DateRangeFieldWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends Omit<BaseFormFieldWidgetConfig<TKey>, "placeholder"> {
  fieldType: FieldDataType.DATE_RANGE;
  schema: TSchema;
}

// Time range input
export interface TimeRangeFieldWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends Omit<BaseFormFieldWidgetConfig<TKey>, "placeholder"> {
  fieldType: FieldDataType.TIME_RANGE;
  schema: TSchema;
}

// Timezone select
export interface TimezoneFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TIMEZONE;
  schema: TSchema;
}

// Currency select
export interface CurrencySelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.CURRENCY_SELECT;
  schema: TSchema;
}

// Language select
export interface LanguageSelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.LANGUAGE_SELECT;
  schema: TSchema;
}

// Country select
export interface CountrySelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.COUNTRY_SELECT;
  schema: TSchema;
}

// Color picker
export interface ColorFieldWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends Omit<BaseFormFieldWidgetConfig<TKey>, "placeholder"> {
  fieldType: FieldDataType.COLOR;
  schema: TSchema;
}

// Icon picker
export interface IconFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.ICON;
  schema: TSchema;
}

// Slider input
export interface SliderFieldWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends Omit<BaseFormFieldWidgetConfig<TKey>, "placeholder"> {
  fieldType: FieldDataType.SLIDER;
  schema: TSchema;
}

// Tags input
export interface TagsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TAGS;
  schema: TSchema;
}

// Text array input
export interface TextArrayFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXT_ARRAY;
  schema: TSchema;
}

// Union type for all form field widgets
// Each widget uses its own specific schema constraint
export type FormFieldWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> =
  | TextFieldWidgetConfig<TKey, TSchema>
  | EmailFieldWidgetConfig<TKey, TSchema>
  | PasswordFieldWidgetConfig<TKey, TSchema>
  | NumberFieldWidgetConfig<TKey, TSchema>
  | BooleanFieldWidgetConfig<TKey, TSchema>
  | SelectFieldWidgetConfig<TKey, TSchema>
  | MultiSelectFieldWidgetConfig<TKey, TSchema>
  | FilterPillsFieldWidgetConfig<TKey, TSchema>
  | RangeSliderFieldWidgetConfig<TKey, TSchema>
  | TextareaFieldWidgetConfig<TKey, TSchema>
  | PhoneFieldWidgetConfig<TKey, TSchema>
  | UrlFieldWidgetConfig<TKey, TSchema>
  | IntFieldWidgetConfig<TKey, TSchema>
  | DateFieldWidgetConfig<TKey, TSchema>
  | DateTimeFieldWidgetConfig<TKey, TSchema>
  | TimeFieldWidgetConfig<TKey, TSchema>
  | FileFieldWidgetConfig<TKey, TSchema>
  | UuidFieldWidgetConfig<TKey, TSchema>
  | JsonFieldWidgetConfig<TKey, TSchema>
  | DateRangeFieldWidgetConfig<TKey, TSchema>
  | TimeRangeFieldWidgetConfig<TKey, TSchema>
  | TimezoneFieldWidgetConfig<TKey, TSchema>
  | CurrencySelectFieldWidgetConfig<TKey, TSchema>
  | LanguageSelectFieldWidgetConfig<TKey, TSchema>
  | CountrySelectFieldWidgetConfig<TKey, TSchema>
  | ColorFieldWidgetConfig<TKey, TSchema>
  | IconFieldWidgetConfig<TKey, TSchema>
  | SliderFieldWidgetConfig<TKey, TSchema>
  | TagsFieldWidgetConfig<TKey, TSchema>
  | TextArrayFieldWidgetConfig<TKey, TSchema>;

export interface FormGroupWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.FORM_GROUP;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
}

export interface FormSectionWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.FORM_SECTION;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

// ============================================================================
// DATA DISPLAY WIDGETS
// ============================================================================

export interface DataTableWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.DATA_TABLE;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  columns?: Array<{
    key: string; // Field name from the data object (e.g., "id", "name", "email")
    label: NoInfer<TKey>;
    sortable?: boolean;
    width?: string | number;
    align?: "left" | "center" | "right";
    format?:
      | "text"
      | "number"
      | "date"
      | "currency"
      | "percentage"
      | "boolean"
      | "badge";
    render?: string; // Custom render function ID
  }>;
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    position?: "top" | "bottom" | "both";
  };
  sorting?: {
    enabled?: boolean;
    defaultSort?: Array<{
      key: string;
      direction: "asc" | "desc";
    }>;
    multiSort?: boolean;
  };
  filtering?: {
    enabled?: boolean;
    global?: boolean;
    columns?: string[]; // Specific columns to enable filtering on
  };
  rowActions?: Array<{
    label: NoInfer<TKey>;
    icon?: IconKey;
    onClick?: string; // Action ID
  }>;
  selectable?: boolean; // Enable row selection
  hoverable?: boolean; // Highlight row on hover
  striped?: boolean; // Alternate row colors
  compact?: boolean; // Reduce row padding
}

export interface DataCardsWidgetConfig<
  TKey extends string,
  TItemData,
> extends BaseWidgetConfig {
  type: WidgetType.DATA_CARDS;
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
  layout?: LayoutConfig; // Layout configuration
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
    onCardClick?: CardClickMetadata<TItemData, CreateApiEndpointAny>;
  };
}

/**
 * Card click metadata configuration
 * Infers the urlPathParams return type from the targetEndpoint
 */
export interface CardClickMetadata<
  TItemData,
  TEndpoint extends CreateApiEndpointAny,
> {
  targetEndpoint: TEndpoint;
  extractParams: (item: TItemData) => {
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
  };
}

export interface DataListWidgetConfig<
  TKey extends string,
  out TTargetEndpoint extends CreateApiEndpointAny | null =
    CreateApiEndpointAny | null,
> extends BaseWidgetConfig {
  type: WidgetType.DATA_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  optional?: boolean;
  renderMode?: "default" | "compact" | "detailed" | string;
  hierarchical?: boolean;
  groupBy?: string; // Field name from data object to group by
  sortBy?: string; // Field name from data object to sort by
  columns?: number; // Number of columns for list layout
  layout?: LayoutConfig; // Layout configuration for list display
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
  // Metadata for additional widget behavior
  metadata?: {
    onRowClick?: TTargetEndpoint extends CreateApiEndpointAny
      ? {
          extractParams: (item: Record<string, WidgetData>) => {
            urlPathParams?: Partial<
              TTargetEndpoint["types"]["UrlVariablesOutput"]
            >;
            data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
          };
          targetEndpoint: TTargetEndpoint;
        }
      : never;
  };
  // Text size config
  tableHeadSize?: "xs" | "sm" | "base" | "lg"; // Table head text size
  tableCellSize?: "xs" | "sm" | "base" | "lg"; // Table cell text size
  cardRowSize?: "xs" | "sm" | "base" | "lg"; // Card row text size
  buttonSize?: "xs" | "sm" | "base" | "lg"; // Show more/less button text size
}

export interface DataGridWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.DATA_GRID;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  columns?: number; // Number of columns in grid
  layout?: LayoutConfig; // Layout configuration for grid display
  gap?: SpacingSize; // Gap between grid items
  responsive?: boolean; // Enable responsive column adjustment
  minColumnWidth?: number | string; // Minimum column width (e.g., 200, "200px", "15rem")
}

export interface GroupedListWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.GROUPED_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "status", "category")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity", "createdAt", "name")
  columns?: number;
  hierarchical?: boolean;
  renderMode?: "default" | "compact" | "detailed" | string;
  maxItemsPerGroup?: number; // Maximum items to show per group before truncating
  showSummary?: boolean; // Show summary for each group
  // Spacing config
  gap?: SpacingSize; // Gap between groups
  headerPadding?: SpacingSize; // Padding for group header button
  headerGap?: SpacingSize; // Gap between group title and badge
  badgePadding?: SpacingSize; // Padding for item count badge
  summaryPadding?: SpacingSize; // Padding for summary section
  summaryGap?: SpacingSize; // Gap between summary items
  itemPadding?: SpacingSize; // Padding for each item
  itemGapX?: SpacingSize; // Horizontal gap in item grid
  itemGapY?: SpacingSize; // Vertical gap in item grid
  buttonPadding?: SpacingSize; // Padding for show more button
  // Text size config
  groupLabelSize?: "xs" | "sm" | "base" | "lg" | "xl"; // Group label text size
  badgeSize?: "xs" | "sm" | "base" | "lg"; // Badge text size
  iconSize?: "xs" | "sm" | "base" | "lg"; // Chevron icon size
  summarySize?: "xs" | "sm" | "base" | "lg"; // Summary text size
  itemSize?: "xs" | "sm" | "base" | "lg"; // Item text size
  buttonSize?: "xs" | "sm" | "base" | "lg"; // Show more button text size
  summaryTemplate?: string; // Template for group summary rendering
  layout?: LayoutConfig; // Layout configuration for group display
}

export interface CodeQualityListWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "code")
  sortBy?: "severity" | "file" | "line" | string; // Field name from data object to sort by
  showSummary?: boolean;
  columns?: number;
  layoutType?: LayoutType;
  maxItemsPerGroup?: number; // Maximum items to show per group before truncating (default: 100)
  layout?: LayoutConfig; // Layout configuration for issue display
}

export interface CodeQualityFilesWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_FILES;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface CodeQualitySummaryWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_SUMMARY;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface MetadataCardWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.METADATA_CARD;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface KeyValueWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.KEY_VALUE;
  label?: NoInfer<TKey>;
  columns?: number;
}

// ============================================================================
// LAYOUT WIDGETS
// ============================================================================

/**
 * Helper to infer request/response schemas from children
 * Creates a minimal ObjectField-like structure for type inference
 */
interface InferSchemasFromChildren<
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
  TUsage extends FieldUsageConfig,
  TTranslationKey extends string = string,
> {
  request: z.output<
    InferSchemaFromField<
      TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>
        ? ObjectField<
            TChildren,
            TUsage,
            TTranslationKey,
            ContainerWidgetConfig<TTranslationKey, TUsage, TChildren>
          >
        : TChildren extends UnifiedField<string, z.ZodTypeAny>
          ? TChildren
          : TChildren extends readonly [
                ObjectField<
                  Record<string, UnifiedField<string, z.ZodTypeAny>>,
                  FieldUsageConfig,
                  string
                >,
                ...ObjectField<
                  Record<string, UnifiedField<string, z.ZodTypeAny>>,
                  FieldUsageConfig,
                  string
                >[],
              ]
            ? ObjectUnionField<
                string,
                TTranslationKey,
                TChildren,
                TUsage,
                z.ZodTypeAny,
                ContainerWidgetConfig<TTranslationKey, TUsage, TChildren>
              >
            : never,
      FieldUsage.RequestData
    >
  >;
  response: z.output<
    InferSchemaFromField<
      TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>
        ? ObjectField<
            TChildren,
            TUsage,
            TTranslationKey,
            ContainerWidgetConfig<TTranslationKey, TUsage, TChildren>
          >
        : TChildren extends UnifiedField<string, z.ZodTypeAny>
          ? TChildren
          : TChildren extends readonly [
                ObjectField<
                  Record<string, UnifiedField<string, z.ZodTypeAny>>,
                  FieldUsageConfig,
                  string
                >,
                ...ObjectField<
                  Record<string, UnifiedField<string, z.ZodTypeAny>>,
                  FieldUsageConfig,
                  string
                >[],
              ]
            ? ObjectUnionField<
                string,
                TTranslationKey,
                TChildren,
                TUsage,
                z.ZodTypeAny,
                ContainerWidgetConfig<TTranslationKey, TUsage, TChildren>
              >
            : never,
      FieldUsage.ResponseData
    >
  >;
}

/**
 * Base Container Widget Config - shared properties without getCount
 * Used as the base for both typed and untyped container configs
 */
interface ContainerWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
> extends BaseWidgetConfig {
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
   * Type-safe function to extract count from data for title display (e.g., "Leads (42)")
   * Types are inferred from the field children and usage
   *
   * @param data - Object containing request and response data
   * @param data.request - Request data (typed from requestSchema)
   * @param data.response - Response data (typed from responseSchema)
   * @returns The count to display in the title, or undefined to not show a count
   *
   * @example
   * ```typescript
   * getCount: (data) => data.response?.paginationInfo?.total
   * ```
   */
  getCount?: (data: {
    request?: InferSchemasFromChildren<TChildren, TUsage>["request"];

    response?: InferSchemasFromChildren<TChildren, TUsage>["response"];
  }) => number | undefined;
}

export interface SeparatorWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.SEPARATOR;
  /** Spacing above separator */
  spacingTop?: SpacingSize;
  /** Spacing below separator */
  spacingBottom?: SpacingSize;
  /** Optional label to display on the separator */
  label?: NoInfer<TKey>;
}

export interface SectionWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.SECTION;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
  layout?: LayoutConfig; // Layout configuration for section content
  columns?: number; // Number of columns for section layout
  spacing?: "compact" | "normal" | "relaxed"; // Spacing within section
  collapsible?: boolean; // Allow section to be collapsed
  defaultCollapsed?: boolean; // Start collapsed (requires collapsible: true)
  /** Empty state text size */
  emptyTextSize?: "xs" | "sm" | "base";
  /** Header padding for collapsible sections */
  headerPadding?: SpacingSize;
  /** Chevron icon size */
  chevronIconSize?: "xs" | "sm" | "base" | "lg";
  /** Chevron button size */
  chevronButtonSize?: "xs" | "sm" | "base" | "lg";
}

export interface TabsWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.TABS;
  title?: NoInfer<TKey>;
  tabs?: Array<{
    id: string;
    label: NoInfer<TKey>;
    icon?: IconKey;
    disabled?: boolean;
    badge?: string | number; // Badge content for tab
  }>;
  defaultTab?: string; // ID of tab to show by default
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Gap between icon and label in trigger */
  triggerGap?: SpacingSize;
  /** Icon size in trigger */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Top margin for content */
  contentMargin?: SpacingSize;
  /** Content text size */
  contentTextSize?: "xs" | "sm" | "base" | "lg";
  /** Pre padding for JSON content */
  prePadding?: SpacingSize;
  /** Pre border radius */
  preBorderRadius?: "none" | "sm" | "base" | "lg" | "xl";
  variant?: "default" | "outline" | "pills";
  orientation?: "horizontal" | "vertical";
  keepMounted?: boolean; // Keep inactive tabs mounted in DOM
}

export interface AccordionWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.ACCORDION;
  title?: NoInfer<TKey>;
  items?: Array<{
    id: string;
    title: NoInfer<TKey>;
    icon?: IconKey;
    disabled?: boolean;
  }>;
  defaultOpen?: string[]; // IDs of items to open by default
  allowMultiple?: boolean; // Allow multiple items to be open simultaneously
  collapsible?: boolean; // Allow all items to be collapsed
  variant?: "default" | "bordered" | "separated";
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Empty state text size */
  emptyTextSize?: "xs" | "sm" | "base";
  /** Gap between icon and title */
  titleGap?: SpacingSize;
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Content text size */
  contentTextSize?: "xs" | "sm" | "base" | "lg";
  /** Item padding for separated variant */
  itemPadding?: SpacingSize;
  /** Content padding */
  contentPadding?: SpacingSize;
}

// ============================================================================
// CONTENT WIDGETS
// ============================================================================

export interface TitleWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.TITLE;
  content?: NoInfer<TKey>;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fieldType?: FieldDataType;
  textAlign?: "left" | "center" | "right";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  gap?: SpacingSize;
  subtitleGap?: SpacingSize;
  schema: TSchema;
}

export interface TextWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> extends BaseWidgetConfig {
  type: WidgetType.TEXT;
  content?: NoInfer<TKey>;
  columns?: number;
  fieldType?: FieldDataType;
  label?: NoInfer<TKey>;
  variant?: "default" | "error" | "info" | "success" | "warning" | "muted";
  multiline?: boolean;
  emphasis?: "bold" | "italic" | "underline";
  maxLength?: number;
  format?: "link" | "plain";
  href?: string;
  textAlign?: "left" | "center" | "right";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  gap?: SpacingSize;
  padding?: SpacingSize;
  schema: TSchema;
}

export interface BadgeWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> extends BaseWidgetConfig {
  type: WidgetType.BADGE;
  text?: NoInfer<TKey>; // Static text - use when displaying a fixed label
  enumOptions?: Array<{ label: NoInfer<TKey>; value: string | number }>; // Dynamic enum mapping - use when displaying enum values
  variant?: "default" | "success" | "warning" | "error" | "info";
  schema: TSchema;
}

export interface IconWidgetConfig<
  TSchema extends z.ZodType<IconKey>,
> extends BaseWidgetConfig {
  type: WidgetType.ICON;
  /** Container size */
  containerSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Border radius */
  borderRadius?: "none" | "sm" | "base" | "lg" | "xl" | "2xl" | "full";
  /** Disable hover effect */
  noHover?: boolean;
  /** Icon horizontal alignment within container (start = left, center = centered, end = right) */
  justifyContent?: "start" | "center" | "end";
  schema: TSchema;
}

export interface AvatarWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.AVATAR;
  src?: string; // Field name containing avatar URL (e.g., "avatarUrl", "imageUrl") or literal URL
  alt?: NoInfer<TKey>;
  fallback?: string; // Fallback text/initials to display if image fails (e.g., "JD", "?")
  /** Avatar size */
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Fallback text size */
  fallbackSize?: "xs" | "sm" | "base" | "lg";
}

export interface DescriptionWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.DESCRIPTION;
  /** optional hardcoded content instead of field value */
  content?: NoInfer<TKey>;
  /** Text size */
  textSize?: "xs" | "sm" | "base" | "lg";
  /** Top spacing */
  spacing?: SpacingSize;
  /** Number of lines before truncation */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";
  schema: TSchema;
}

export interface MarkdownWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN;
  content?: NoInfer<TKey>; // Optional - only for hardcoded static content, not for field values
  columns?: number;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  schema: TSchema;
}

export interface MarkdownEditorWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN_EDITOR;
  label?: NoInfer<TKey>;
  placeholder?: NoInfer<TKey>;
  /** Container gap */
  gap?: SpacingSize;
  /** Input height */
  inputHeight?: "xs" | "sm" | "base" | "lg";
  /** Button size */
  buttonSize?: "xs" | "sm" | "base" | "lg";
  /** Icon size for action buttons */
  actionIconSize?: "xs" | "sm" | "base" | "lg";
  /** Icon size for edit button */
  editIconSize?: "xs" | "sm" | "base";
}

export interface LinkWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.LINK;
  href?: Route | string; // URL path or route
  text?: NoInfer<TKey>; // Link text to display
  label?: NoInfer<TKey>; // Accessible label (aria-label) - use if text is not descriptive
  external?: boolean; // Opens in new tab if true
  size?: "xs" | "sm" | "base" | "lg"; // Text size
  gap?: SpacingSize; // Gap between text and icon
  iconSize?: "xs" | "sm" | "base" | "lg"; // External link icon size
  schema: TSchema;
}

export interface LinkCardWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.LINK_CARD;
  href: Route | string;
  title: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  external?: boolean;
  padding?: SpacingSize; // Card padding
  titleGap?: SpacingSize; // Gap between title and icon
  metaGap?: SpacingSize; // Gap between metadata items
  titleSize?: "xs" | "sm" | "base" | "lg"; // Title text size
  metaSize?: "xs" | "sm" | "base" | "lg"; // Metadata text size
  descriptionSize?: "xs" | "sm" | "base" | "lg"; // Description text size
  iconSize?: "xs" | "sm" | "base" | "lg"; // External link icon size
  thumbnailSize?: "sm" | "base" | "lg"; // Thumbnail size
  spacing?: SpacingSize; // Vertical spacing between sections
}

export interface LinkListWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.LINK_LIST;
  title?: NoInfer<TKey>;
  links?: Array<{
    href: Route | string;
    text: NoInfer<TKey>;
    external?: boolean;
  }>;
  layoutType?: LayoutType;
  columns?: number;
  /** Container gap */
  containerGap?: SpacingSize;
  /** Header gap */
  headerGap?: SpacingSize;
  /** Grid gap */
  gridGap?: SpacingSize;
  /** Title text size */
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Description text size */
  descriptionSize?: "xs" | "sm" | "base" | "lg";
}

// Data-driven card - renders object data as a card with link capability
export interface DataCardWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.DATA_CARD;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  linkable?: boolean; // If true, looks for href/url field in children
  layoutType?: LayoutType;
  columns?: number;
  optional?: boolean;
}

// ============================================================================
// SPECIALIZED CONTENT WIDGETS
// ============================================================================
// NOTE: These widgets are for code quality/linting output display.
// They use literal values from data rather than translation keys.
// These are NOT fully data-driven and are specialized for specific use cases.

export interface FilePathWidgetConfig<
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.FILE_PATH;
  path: string; // Literal file path from data (e.g., "src/app/page.tsx")
  schema: TSchema;
}

export interface LineNumberWidgetConfig<
  TSchema extends NumberWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.LINE_NUMBER;
  line: number; // Literal line number from data
  schema: TSchema;
}

export interface ColumnNumberWidgetConfig<
  TSchema extends NumberWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.COLUMN_NUMBER;
  column: number; // Literal column number from data
  schema: TSchema;
}

export interface CodeRuleWidgetConfig<
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.CODE_RULE;
  rule: string; // Literal rule ID/name from data (e.g., "no-unused-vars", "typescript/no-explicit-any")
  schema: TSchema;
}

export interface CodeOutputWidgetConfig<
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.CODE_OUTPUT;
  code?: string; // Literal code snippet from data
  language?: string; // Programming language for syntax highlighting
  format?: "eslint" | "generic" | "json" | "table";
  outputFormat?: "eslint" | "generic" | "json" | "table";
  showSummary?: boolean;
  colorScheme?: "auto" | "light" | "dark";
  severityIcons?: Record<string, string>;
  groupBy?: string; // Field name to group output by
  sortBy?: string; // Field name to sort output by
  summaryTemplate?: string; // Template for summary rendering
  maxLines?: number; // Maximum lines to display
  showLineNumbers?: boolean; // Show line numbers in code output
  highlightLines?: number[]; // Line numbers to highlight
  wrapLines?: boolean; // Enable line wrapping
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Header padding */
  headerPadding?: SpacingSize;
  /** Language label size */
  languageLabelSize?: "xs" | "sm" | "base";
  /** Code block padding */
  codePadding?: SpacingSize;
  /** Code text size */
  codeTextSize?: "xs" | "sm" | "base" | "lg";
  /** Line number width */
  lineNumberWidth?: "sm" | "base" | "lg";
  /** Line number spacing */
  lineNumberSpacing?: SpacingSize;
  /** Border radius */
  borderRadius?: "none" | "sm" | "base" | "lg" | "xl";
  schema: TSchema;
}

export interface SeverityBadgeWidgetConfig<
  TSchema extends EnumWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.SEVERITY_BADGE;
  severity: "error" | "warning" | "info"; // Literal severity level from data
  schema: TSchema;
}

export interface MessageTextWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.MESSAGE_TEXT;
  message?: NoInfer<TKey>; // optional hardcoded message to display
  schema: TSchema;
}

export interface IssueCardWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.ISSUE_CARD;
  title: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface CreditTransactionCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CREDIT_TRANSACTION_CARD;
  leftFields?: string[]; // Fields to show on left side
  rightFields?: string[]; // Fields to show on right side
}

export interface CreditTransactionListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CREDIT_TRANSACTION_LIST;
}

export interface PaginationWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PAGINATION;
  /** Top border */
  showBorder?: boolean;
  /** Container padding */
  padding?: SpacingSize;
  /** Container margin */
  margin?: SpacingSize;
  /** Gap between info and controls */
  controlsGap?: SpacingSize;
  /** Gap between elements */
  elementGap?: SpacingSize;
  /** Text size */
  textSize?: "xs" | "sm" | "base";
  /** Select width */
  selectWidth?: "sm" | "base" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
}

export interface ModelDisplayWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.MODEL_DISPLAY;
  columns?: number;
}

// ============================================================================
// INTERACTIVE WIDGETS
// ============================================================================

export interface ButtonWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.BUTTON;
  text: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: string; // Action ID
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing to the right of icon */
  iconSpacing?: SpacingSize;
}

export interface NavigateButtonWidgetConfig<
  out TTargetEndpoint extends CreateApiEndpointAny | null =
    CreateApiEndpointAny,
  out TGetEndpoint extends CreateApiEndpointAny | undefined = undefined,
  TKey extends string = string,
> extends BaseWidgetConfig {
  type: WidgetType.NAVIGATE_BUTTON;
  label?: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  metadata?: {
    targetEndpoint: TTargetEndpoint;
    extractParams?: TTargetEndpoint extends CreateApiEndpointAny
      ? (source: Record<string, WidgetData>) => {
          urlPathParams?: Partial<
            TTargetEndpoint["types"]["UrlVariablesOutput"]
          >;
          data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
        }
      : never;
    prefillFromGet?: boolean;
    getEndpoint?: TGetEndpoint;
    renderInModal?: boolean;
    popNavigationOnSuccess?: number;
  };
  iconSize?: "xs" | "sm" | "base" | "lg";
  iconSpacing?: SpacingSize;
}

export interface ButtonGroupWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.BUTTON_GROUP;
  buttons?: Array<{
    text: NoInfer<TKey>;
    onClick?: string;
  }>;
}

export interface ActionBarWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.ACTION_BAR;
  actions?: Array<{
    text: NoInfer<TKey>;
    onClick?: string;
  }>;
}

export interface PaginationInfoWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PAGINATION_INFO;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ActionListWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.ACTION_LIST;
  actions?: Array<{
    text: NoInfer<TKey>;
    onClick?: string;
  }>;
}

// ============================================================================
// STATS WIDGETS
// ============================================================================

export interface MetricCardWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.METRIC_CARD;
  title: NoInfer<TKey>;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percentage" | "bytes";
  icon?: IconKey;
  unit?: string;
  precision?: number;
  threshold?: {
    warning?: number;
    error?: number;
  };
  // Spacing config
  headerGap?: SpacingSize; // Gap in card header
  headerPadding?: SpacingSize; // Padding bottom for header
  valueGap?: SpacingSize; // Gap between value and trend
  unitSpacing?: SpacingSize; // Margin for unit
  trendGap?: SpacingSize; // Gap in trend indicator
  // Text size config
  titleSize?: "xs" | "sm" | "base" | "lg"; // Title text size
  iconSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"; // Icon size
  valueSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"; // Value text size
  unitSize?: "xs" | "sm" | "base" | "lg"; // Unit text size
  trendSize?: "xs" | "sm" | "base" | "lg"; // Trend text size
  trendIconSize?: "xs" | "sm" | "base" | "lg"; // Trend icon size
  schema: TSchema;
}

/**
 * Stat Widget Config - Simple stat display from field definition
 * Takes a numeric value and displays with label from field.ui.label
 */
export interface StatWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.STAT;
  label?: NoInfer<TKey>;
  format?: "number" | "percentage" | "currency" | "compact";
  icon?: IconKey;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  size?: "sm" | "md" | "lg";
  /** Card padding */
  padding?: SpacingSize;
  /** Value text size */
  valueSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  /** Label text size */
  labelSize?: "xs" | "sm" | "base" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after icon */
  iconSpacing?: SpacingSize;
  /** Trend indicator size */
  trendSize?: "xs" | "sm" | "base";
  /** Trend icon size */
  trendIconSize?: "xs" | "sm" | "base";
  /** Gap in trend indicator */
  trendGap?: SpacingSize;
  /** Spacing after trend */
  trendSpacing?: SpacingSize;
  /** Spacing after value (before label) */
  labelSpacing?: SpacingSize;
  schema: TSchema;
}

export interface StatsGridWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.STATS_GRID;
  title?: NoInfer<TKey>;
  stats?: Array<{
    label: NoInfer<TKey>;
    value: string | number;
    format?: "number" | "percentage" | "currency" | "compact" | "bytes";
    icon?: IconKey;
    variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  }>;
  columns?: number; // Number of stats per row (default: 3)
  // Spacing config
  gap?: SpacingSize; // Gap between stat cards
  padding?: SpacingSize; // Padding for empty state
  layout?: LayoutConfig; // Layout configuration for stats grid
  spacing?: "compact" | "normal" | "relaxed"; // Spacing between stats
}

export interface ChartWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> extends BaseWidgetConfig {
  type: WidgetType.CHART;
  title?: NoInfer<TKey>;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  chartType?: "line" | "bar" | "pie" | "area" | "donut" | "scatter" | "radar";
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  colors?: string[]; // Custom color palette for chart
  stacked?: boolean; // Stack bar/area charts
  curved?: boolean; // Use curved lines for line/area charts
  showDataLabels?: boolean; // Show values on data points
  legendPosition?: "top" | "bottom" | "left" | "right";
  responsive?: boolean; // Enable responsive sizing
  /** Title text size */
  titleTextSize?: "xs" | "sm" | "base" | "lg";
  /** Description text size */
  descriptionTextSize?: "xs" | "sm" | "base";
  /** Empty state text size */
  emptyTextSize?: "xs" | "sm" | "base";
  /** Legend container gap */
  legendGap?: SpacingSize;
  /** Gap between legend items */
  legendItemGap?: SpacingSize;
  /** Legend text size */
  legendTextSize?: "xs" | "sm" | "base";
  /** Legend margin top */
  legendMarginTop?: SpacingSize;
  schema: TSchema;
}

export interface ProgressWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.PROGRESS;
  value: number;
  max?: number;
  label?: NoInfer<TKey>;
  schema: TSchema;
}

// ============================================================================
// STATUS WIDGETS
// ============================================================================

export interface LoadingWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.LOADING;
  message?: NoInfer<TKey>;
  /** Container padding */
  padding?: SpacingSize;
  /** Gap between spinner and message */
  gap?: SpacingSize;
  /** Message text size */
  messageSize?: "xs" | "sm" | "base" | "lg";
  /** Spinner icon size */
  spinnerSize?: "xs" | "sm" | "base" | "lg";
  /** Progress bar height */
  progressHeight?: "xs" | "sm" | "base";
  /** Spacing within progress container */
  progressSpacing?: SpacingSize;
  /** Percentage text size */
  percentageSize?: "xs" | "sm" | "base";
}

export interface ErrorWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.ERROR;
  title: NoInfer<TKey>;
  message?: NoInfer<TKey>;
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after description */
  descriptionSpacing?: SpacingSize;
  /** Error code text size */
  codeSize?: "xs" | "sm" | "base";
  /** Spacing between sections */
  sectionSpacing?: SpacingSize;
  /** Stack trace text size */
  stackSize?: "xs" | "sm" | "base";
  /** Stack trace padding */
  stackPadding?: SpacingSize;
}

export interface EmptyStateWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.EMPTY_STATE;
  title: NoInfer<TKey>;
  message?: NoInfer<TKey>;
  action?: {
    text: NoInfer<TKey>;
    onClick?: string;
  };
  /** Container padding */
  padding?: SpacingSize;
  /** Icon container size */
  iconContainerSize?: "sm" | "md" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after icon */
  iconSpacing?: SpacingSize;
  /** Title text size */
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Spacing after title */
  titleSpacing?: SpacingSize;
  /** Description text size */
  descriptionSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after description */
  descriptionSpacing?: SpacingSize;
}

export interface StatusIndicatorWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema | EnumWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.STATUS_INDICATOR;
  status: "success" | "warning" | "error" | "info" | "pending";
  label?: NoInfer<TKey>;
  schema: TSchema;
}

export interface AlertWidgetConfig<
  TSchema extends StringWidgetSchema,
> extends BaseWidgetConfig {
  type: WidgetType.ALERT;
  variant?: "default" | "destructive" | "success" | "warning";
  schema: TSchema;
}

export interface FormAlertWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_ALERT;
}

export interface SubmitButtonWidgetConfig<
  TKey extends string,
> extends BaseWidgetConfig {
  type: WidgetType.SUBMIT_BUTTON;
  text?: NoInfer<TKey>;
  loadingText?: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing to the right of icon */
  iconSpacing?: SpacingSize;
}

// Password strength indicator
export interface PasswordStrengthWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PASSWORD_STRENGTH;
  /** Field name to watch for password value (defaults to "password") */
  watchField?: string;
  /** Container gap */
  containerGap?: SpacingSize;
  /** Label text size */
  labelTextSize?: "xs" | "sm" | "base";
  /** Bar height */
  barHeight?: "xs" | "sm" | "base" | "lg";
  /** Suggestion text size */
  suggestionTextSize?: "xs" | "sm" | "base";
  /** Suggestion margin top */
  suggestionMarginTop?: SpacingSize;
  /** Background color for weak password */
  weakBgColor?: string;
  /** Background color for fair password */
  fairBgColor?: string;
  /** Background color for good password */
  goodBgColor?: string;
  /** Background color for strong password */
  strongBgColor?: string;
  /** Text color for weak password */
  weakTextColor?: string;
  /** Text color for fair password */
  fairTextColor?: string;
  /** Text color for good password */
  goodTextColor?: string;
  /** Text color for strong password */
  strongTextColor?: string;
}

// ============================================================================
// CUSTOM WIDGETS
// ============================================================================

export interface CustomWidgetConfig<
  TProps extends Record<string, string | number | boolean | null | undefined> =
    Record<string, never>,
> extends BaseWidgetConfig {
  type: WidgetType.CUSTOM;
  componentId: string;
  props?: TProps;
}

// ============================================================================
// UNION TYPE FOR ALL WIDGET CONFIGS
// ============================================================================

/**
 * Widget configs that work with object data (have children fields)
 * Used in objectField to ensure type safety
 */
export type ObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
> =
  | ContainerWidgetConfig<TKey, TUsage, TChildren>
  | SectionWidgetConfig<TKey>
  | TabsWidgetConfig<TKey>
  | AccordionWidgetConfig<TKey>
  | FormGroupWidgetConfig<TKey>
  | FormSectionWidgetConfig<TKey>
  | DataCardWidgetConfig<TKey>
  | MetadataCardWidgetConfig<TKey>
  | KeyValueWidgetConfig<TKey>
  | CodeQualitySummaryWidgetConfig<TKey>
  | CodeQualityListWidgetConfig<TKey>
  | DataListWidgetConfig<TKey>
  | StatsGridWidgetConfig<TKey>
  | IssueCardWidgetConfig<TKey>
  | PaginationWidgetConfig
  | ModelDisplayWidgetConfig
  | PaginationInfoWidgetConfig
  | CreditTransactionCardWidgetConfig;

/**
 * Widget configs that work with array data
 * Used in arrayField to ensure type safety
 */
export type ArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
> =
  | ContainerWidgetConfig<TKey, TUsage, TChildren>
  | DataTableWidgetConfig<TKey>
  | DataListWidgetConfig<TKey>
  | DataGridWidgetConfig<TKey>
  | GroupedListWidgetConfig<TKey>
  | CodeQualityFilesWidgetConfig<TKey>
  | CreditTransactionListWidgetConfig
  | LinkListWidgetConfig<TKey>
  // oxlint-disable-next-line no-explicit-any
  | DataCardsWidgetConfig<TKey, any>;

export type DisplayOnlyWidgetConfig<TKey extends string> =
  | SeparatorWidgetConfig<TKey>
  | ButtonWidgetConfig<TKey>
  | SubmitButtonWidgetConfig<TKey>
  | NavigateButtonWidgetConfig<
      CreateApiEndpointAny | null,
      CreateApiEndpointAny | undefined,
      TKey
    >
  | FormAlertWidgetConfig
  | ModelDisplayWidgetConfig
  | PasswordStrengthWidgetConfig
  | Omit<TitleWidgetConfig<TKey, StringWidgetSchema>, "schema">
  | Omit<TextWidgetConfig<TKey, StringWidgetSchema>, "schema">;

export type RequestResponseDisplayWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> =
  | AlertWidgetConfig<TSchema>
  | TitleWidgetConfig<TKey, TSchema>
  | ChartWidgetConfig<TKey, TSchema>
  | TextWidgetConfig<TKey, TSchema>
  | IconWidgetConfig<TSchema>
  | BadgeWidgetConfig<TKey, TSchema>
  | LinkWidgetConfig<TKey, TSchema>
  | StatWidgetConfig<TKey, TSchema>
  | MarkdownWidgetConfig<TKey, TSchema>
  | CodeOutputWidgetConfig<TSchema>
  | StatusIndicatorWidgetConfig<TKey, TSchema>;

export type ResponseWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
> =
  | RequestResponseDisplayWidgetConfig<TKey, TSchema>
  | FormFieldWidgetConfig<TKey, TSchema>;

export type WidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TChildren extends
    | Record<string, UnifiedField<string, z.ZodTypeAny>>
    | readonly [
        ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >,
        ...ObjectField<
          Record<string, UnifiedField<string, z.ZodTypeAny>>,
          FieldUsageConfig,
          string
        >[],
      ]
    | UnifiedField<string, z.ZodTypeAny>,
> =
  | FormFieldWidgetConfig<TKey, TSchema>
  | ObjectWidgetConfig<TKey, TUsage, TChildren>
  | ArrayWidgetConfig<TKey, TUsage, TChildren>
  | DisplayOnlyWidgetConfig<TKey>
  | RequestResponseDisplayWidgetConfig<TKey, TSchema>
  | AvatarWidgetConfig<TKey>
  | DescriptionWidgetConfig<TKey, TSchema>
  | MarkdownWidgetConfig<TKey, TSchema>
  | MarkdownEditorWidgetConfig<TKey>
  | LinkWidgetConfig<TKey, TSchema>
  | LinkCardWidgetConfig<TKey>
  | LinkListWidgetConfig<TKey>
  // Specialized content widgets
  | FilePathWidgetConfig<TKey, TSchema>
  | LineNumberWidgetConfig<TKey, TSchema>
  | ColumnNumberWidgetConfig<TKey, TSchema>
  | CodeRuleWidgetConfig<TKey, TSchema>
  | CodeOutputWidgetConfig<TKey, TSchema>
  | SeverityBadgeWidgetConfig<TKey, TSchema>
  | MessageTextWidgetConfig<TKey, TSchema>
  | IssueCardWidgetConfig<TKey>
  | CreditTransactionCardWidgetConfig<TKey>
  | CreditTransactionListWidgetConfig<TKey>
  | PaginationWidgetConfig<TKey>
  | ModelDisplayWidgetConfig<TKey>
  // Interactive widgets
  | ButtonWidgetConfig<TKey>
  | NavigateButtonWidgetConfig<
      CreateApiEndpointAny | null,
      CreateApiEndpointAny | undefined,
      TKey
    >
  | ButtonGroupWidgetConfig<TKey>
  | ActionBarWidgetConfig<TKey>
  | PaginationInfoWidgetConfig<TKey>
  | ActionListWidgetConfig<TKey>
  // Stats widgets
  | StatWidgetConfig<TKey, TSchema>
  | MetricCardWidgetConfig<TKey, TSchema>
  | StatsGridWidgetConfig<TKey>
  | ChartWidgetConfig<TKey>
  | ProgressWidgetConfig<TKey, TSchema>
  // Status widgets
  | LoadingWidgetConfig<TKey>
  | ErrorWidgetConfig<TKey>
  | EmptyStateWidgetConfig<TKey>
  | StatusIndicatorWidgetConfig<TKey, TSchema>
  | AlertWidgetConfig<TKey, TSchema>
  | FormAlertWidgetConfig<TKey, TSchema>
  | SubmitButtonWidgetConfig<TKey>
  | PasswordStrengthWidgetConfig<TKey, TSchema>;

/**
 * Extract widget config type from WidgetType enum
 */
export type ExtractWidgetConfig<
  T extends WidgetType,
  TKey extends string,
> = Extract<
  WidgetConfig<
    TKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    Record<string, UnifiedField<string, z.ZodTypeAny>>
  >,
  { type: T }
>;
