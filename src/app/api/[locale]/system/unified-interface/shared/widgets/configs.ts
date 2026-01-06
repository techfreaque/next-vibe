/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type { Route } from "next";
import type { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";

import type { FieldUsageConfig, InferSchemaFromField, ObjectField } from "../types/endpoint";
import type {
  FieldDataType,
  FieldUsage,
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../types/enums";

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
interface BaseFormFieldWidgetConfig<TKey extends string> extends BaseWidgetConfig {
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
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXT;
}

// Email input
export interface EmailFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.EMAIL;
}

// Password input
export interface PasswordFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.PASSWORD;
}

// Number input
export interface NumberFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.NUMBER;
}

// Boolean/Checkbox input
export interface BooleanFieldWidgetConfig<TKey extends string> extends Omit<
  BaseFormFieldWidgetConfig<TKey>,
  "placeholder"
> {
  fieldType: FieldDataType.BOOLEAN;
}

// Select dropdown
export interface SelectFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.SELECT;
  options: Array<{ label: NoInfer<TKey>; value: string | number }>;
}

// Multi-select
export interface MultiSelectFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.MULTISELECT;
  options: Array<{ label: NoInfer<TKey>; value: string | number }>;
}

// Filter pills (like select but displayed as pills)
export interface FilterPillsFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.FILTER_PILLS;
  options: Array<{
    label: NoInfer<TKey>;
    value: string | number;
    icon?: IconKey;
    description?: NoInfer<TKey>;
  }>;
}

// Range slider (min-max selection with visual slider)
export interface RangeSliderFieldWidgetConfig<
  TKey extends string,
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
}

// Textarea
export interface TextareaFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXTAREA;
}

// Phone input
export interface PhoneFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.PHONE;
}

// URL input
export interface UrlFieldWidgetConfig<TKey extends string> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.URL;
}

// Integer input
export interface IntFieldWidgetConfig<TKey extends string> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.INT;
}

// Date input
export interface DateFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.DATE;
}

// DateTime input
export interface DateTimeFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.DATETIME;
}

// Time input
export interface TimeFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TIME;
}

// File input
export interface FileFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.FILE;
}

// UUID input
export interface UuidFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.UUID;
}

// JSON input
export interface JsonFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.JSON;
}

// Date range input
export interface DateRangeFieldWidgetConfig<TKey extends string> extends Omit<
  BaseFormFieldWidgetConfig<TKey>,
  "placeholder"
> {
  fieldType: FieldDataType.DATE_RANGE;
}

// Time range input
export interface TimeRangeFieldWidgetConfig<TKey extends string> extends Omit<
  BaseFormFieldWidgetConfig<TKey>,
  "placeholder"
> {
  fieldType: FieldDataType.TIME_RANGE;
}

// Timezone select
export interface TimezoneFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TIMEZONE;
}

// Currency select
export interface CurrencySelectFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.CURRENCY_SELECT;
}

// Language select
export interface LanguageSelectFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.LANGUAGE_SELECT;
}

// Country select
export interface CountrySelectFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.COUNTRY_SELECT;
}

// Color picker
export interface ColorFieldWidgetConfig<TKey extends string> extends Omit<
  BaseFormFieldWidgetConfig<TKey>,
  "placeholder"
> {
  fieldType: FieldDataType.COLOR;
}

// Icon picker
export interface IconFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.ICON;
}

// Slider input
export interface SliderFieldWidgetConfig<TKey extends string> extends Omit<
  BaseFormFieldWidgetConfig<TKey>,
  "placeholder"
> {
  fieldType: FieldDataType.SLIDER;
}

// Tags input
export interface TagsFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TAGS;
}

// Text array input
export interface TextArrayFieldWidgetConfig<
  TKey extends string,
> extends BaseFormFieldWidgetConfig<TKey> {
  fieldType: FieldDataType.TEXT_ARRAY;
}

// Union type for all form field widgets
export type FormFieldWidgetConfig<TKey extends string> =
  | TextFieldWidgetConfig<TKey>
  | EmailFieldWidgetConfig<TKey>
  | PasswordFieldWidgetConfig<TKey>
  | NumberFieldWidgetConfig<TKey>
  | BooleanFieldWidgetConfig<TKey>
  | SelectFieldWidgetConfig<TKey>
  | MultiSelectFieldWidgetConfig<TKey>
  | FilterPillsFieldWidgetConfig<TKey>
  | RangeSliderFieldWidgetConfig<TKey>
  | TextareaFieldWidgetConfig<TKey>
  | PhoneFieldWidgetConfig<TKey>
  | UrlFieldWidgetConfig<TKey>
  | IntFieldWidgetConfig<TKey>
  | DateFieldWidgetConfig<TKey>
  | DateTimeFieldWidgetConfig<TKey>
  | TimeFieldWidgetConfig<TKey>
  | FileFieldWidgetConfig<TKey>
  | UuidFieldWidgetConfig<TKey>
  | JsonFieldWidgetConfig<TKey>
  | DateRangeFieldWidgetConfig<TKey>
  | TimeRangeFieldWidgetConfig<TKey>
  | TimezoneFieldWidgetConfig<TKey>
  | CurrencySelectFieldWidgetConfig<TKey>
  | LanguageSelectFieldWidgetConfig<TKey>
  | CountrySelectFieldWidgetConfig<TKey>
  | ColorFieldWidgetConfig<TKey>
  | IconFieldWidgetConfig<TKey>
  | SliderFieldWidgetConfig<TKey>
  | TagsFieldWidgetConfig<TKey>
  | TextArrayFieldWidgetConfig<TKey>;

export interface FormGroupWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.FORM_GROUP;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
}

export interface FormSectionWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.FORM_SECTION;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

// ============================================================================
// DATA DISPLAY WIDGETS
// ============================================================================

export interface DataTableWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.DATA_TABLE;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  columns?: Array<{
    key: string; // Field name from the data object (e.g., "id", "name", "email")
    label: NoInfer<TKey>;
    sortable?: boolean;
    width?: string | number;
    align?: "left" | "center" | "right";
  }>;
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
    showSizeChanger?: boolean;
  };
  sorting?: {
    enabled?: boolean;
    defaultSort?: Array<{
      key: string;
      direction: "asc" | "desc";
    }>;
  };
  filtering?: {
    enabled?: boolean;
    global?: boolean;
  };
}

export interface DataCardsWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.DATA_CARDS;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  // Card field mapping - these are field names from child objects to display in card layout
  cardTitle?: string; // Field name to use as card title (e.g., "name", "title")
  cardSubtitle?: string; // Field name to use as card subtitle (e.g., "email", "description")
  cardImage?: string; // Field name containing image URL (e.g., "avatarUrl", "imageUrl")
  cardContent?: string[]; // Array of field names to display in card body (e.g., ["description", "status"])
  cardMetadata?: string[]; // Array of field names to display as metadata (e.g., ["createdAt", "updatedAt"])
  cardTemplate?: string; // Template name for card rendering
  groupBy?: string; // Field to group cards by
  showSummary?: boolean; // Show summary for groups
  summaryTemplate?: string; // Template for summary rendering
  layout?: LayoutConfig; // Layout configuration
  itemConfig?: {
    template: string;
    size: string;
    spacing: string;
  };
}

export interface DataListWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.DATA_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  optional?: boolean;
  renderMode?: string;
  hierarchical?: boolean;
}

export interface DataGridWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.DATA_GRID;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface GroupedListWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.GROUPED_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "status", "category")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity", "createdAt", "name")
  columns?: number;
  hierarchical?: boolean;
  renderMode?: string;
}

export interface CodeQualityListWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "code")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity")
  showSummary?: boolean;
  columns?: number;
  layoutType?: LayoutType;
}

export interface CodeQualityFilesWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_FILES;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface CodeQualitySummaryWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_SUMMARY;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface MetadataCardWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.METADATA_CARD;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

// ============================================================================
// LAYOUT WIDGETS
// ============================================================================

/**
 * Helper to infer request/response schemas from children
 * Creates a minimal ObjectField-like structure for type inference
 */
interface InferSchemasFromChildren<
  TChildren,
  TUsage extends FieldUsageConfig,
  TTranslationKey extends string = string,
> {
  request: z.output<
    InferSchemaFromField<
      ObjectField<TChildren, TUsage, TTranslationKey, ContainerWidgetConfig<TTranslationKey>>,
      FieldUsage.RequestData
    >
  >;
  response: z.output<
    InferSchemaFromField<
      ObjectField<TChildren, TUsage, TTranslationKey, ContainerWidgetConfig<TTranslationKey>>,
      FieldUsage.Response
    >
  >;
}

/**
 * Base Container Widget Config - shared properties without getCount
 * Used as the base for both typed and untyped container configs
 */
interface ContainerWidgetConfigBase<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.CONTAINER;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
  layout?: LayoutConfig;
  columns?: number;
  /** Tailwind spacing value for gap between children (0, 1, 2, 3, 4, 6, 8) */
  gap?: "0" | "1" | "2" | "3" | "4" | "6" | "8";
  /** Tailwind spacing value for top padding (0, 2, 3, 4, 6, 8) */
  paddingTop?: "0" | "2" | "3" | "4" | "6" | "8";
  optional?: boolean;
  icon?: IconKey;
  border?: boolean;
  spacing?: "compact" | "normal" | "relaxed";
  /** Render without Card wrapper for inline layouts */
  noCard?: boolean;
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
    variant?: "default" | "primary" | "secondary" | "destructive" | "ghost" | "outline" | "link";
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
 * Container Widget Config - permissive version for use in WidgetConfig union
 * getCount accepts any data structure to allow proper inference in objectField
 */
export interface ContainerWidgetConfig<
  TKey extends string,
> extends ContainerWidgetConfigBase<TKey> {
  /**
   * Function to extract count from data for title display (e.g., "Leads (42)")
   * Type is permissive here - proper typing happens in objectField return type
   *
   * @example
   * ```typescript
   * getCount: (data) => data.response?.paginationInfo?.total
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCount?: (data: { request?: any; response?: any }) => number | undefined;
}

/**
 * Typed Container Widget Config with inferred request/response types
 * TChildren should be the record of child fields passed to objectField
 * TUsage should be the usage config passed to objectField
 * TKey allows using either global TranslationKey or scoped translation keys
 */
export interface TypedContainerWidgetConfig<
  TKey extends string,
  TChildren = Record<string, never>,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
> extends ContainerWidgetConfigBase<TKey> {
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

export interface SectionWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.SECTION;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
}

export interface TabsWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.TABS;
  title?: NoInfer<TKey>;
  tabs?: Array<{
    id: string;
    label: NoInfer<TKey>;
  }>;
}

export interface AccordionWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.ACCORDION;
  title?: NoInfer<TKey>;
}

// ============================================================================
// CONTENT WIDGETS
// ============================================================================

export interface TitleWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.TITLE;
  content: NoInfer<TKey>;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fieldType?: FieldDataType;
}

export interface TextWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.TEXT;
  content: NoInfer<TKey>;
  fieldType?: FieldDataType;
  label?: NoInfer<TKey>;
  variant?: "default" | "error" | "info" | "success" | "warning";
  multiline?: boolean;
  emphasis?: "bold" | "italic" | "underline";
  maxLength?: number;
  format?: "link" | "plain";
  href?: string;
  textAlign?: "left" | "center" | "right";
}

export interface BadgeWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.BADGE;
  text?: NoInfer<TKey>; // Static text - use when displaying a fixed label
  enumOptions?: Array<{ label: NoInfer<TKey>; value: string | number }>; // Dynamic enum mapping - use when displaying enum values
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export interface AvatarWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.AVATAR;
  src?: string; // Field name containing avatar URL (e.g., "avatarUrl", "imageUrl") or literal URL
  alt?: NoInfer<TKey>;
  fallback?: string; // Fallback text/initials to display if image fails (e.g., "JD", "?")
}

export interface MarkdownWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN;
  content?: NoInfer<TKey>; // Optional - only for hardcoded static content, not for field values
  columns?: number;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
}

export interface MarkdownEditorWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN_EDITOR;
  label?: NoInfer<TKey>;
  placeholder?: NoInfer<TKey>;
}

export interface LinkWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.LINK;
  href: Route | string; // URL path or route
  text?: NoInfer<TKey>; // Link text to display
  label?: NoInfer<TKey>; // Accessible label (aria-label) - use if text is not descriptive
  external?: boolean; // Opens in new tab if true
}

export interface LinkCardWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.LINK_CARD;
  href: Route | string;
  title: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  external?: boolean;
}

export interface LinkListWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.LINK_LIST;
  title?: NoInfer<TKey>;
  links?: Array<{
    href: Route | string;
    text: NoInfer<TKey>;
    external?: boolean;
  }>;
  layoutType?: LayoutType;
  columns?: number;
}

// Data-driven card - renders object data as a card with link capability
export interface DataCardWidgetConfig<TKey extends string> extends BaseWidgetConfig {
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

export interface FilePathWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FILE_PATH;
  path: string; // Literal file path from data (e.g., "src/app/page.tsx")
}

export interface LineNumberWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINE_NUMBER;
  line: number; // Literal line number from data
}

export interface ColumnNumberWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.COLUMN_NUMBER;
  column: number; // Literal column number from data
}

export interface CodeRuleWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CODE_RULE;
  rule: string; // Literal rule ID/name from data (e.g., "no-unused-vars", "typescript/no-explicit-any")
}

export interface CodeOutputWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CODE_OUTPUT;
  code?: string; // Literal code snippet from data
  language?: string; // Programming language for syntax highlighting
  format?: "eslint" | "generic" | "json" | "table";
  outputFormat?: "eslint" | "generic" | "json" | "table";
  showSummary?: boolean;
  colorScheme?: "auto" | "light" | "dark";
  severityIcons?: Record<string, string>;
  groupBy?: string;
  summaryTemplate?: string;
}

export interface SeverityBadgeWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.SEVERITY_BADGE;
  severity: "error" | "warning" | "info"; // Literal severity level from data
}

export interface MessageTextWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.MESSAGE_TEXT;
  message: NoInfer<TKey>; // Message to display
}

export interface IssueCardWidgetConfig<TKey extends string> extends BaseWidgetConfig {
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
}

// ============================================================================
// INTERACTIVE WIDGETS
// ============================================================================

export interface ButtonWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.BUTTON;
  text: NoInfer<TKey>;
  icon?: IconKey;
  variant?: "default" | "primary" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: string; // Action ID
}

export interface ButtonGroupWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.BUTTON_GROUP;
  buttons?: Array<{
    text: NoInfer<TKey>;
    onClick?: string;
  }>;
}

export interface ActionBarWidgetConfig<TKey extends string> extends BaseWidgetConfig {
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

export interface ActionListWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.ACTION_LIST;
  actions?: Array<{
    text: NoInfer<TKey>;
    onClick?: string;
  }>;
}

// ============================================================================
// STATS WIDGETS
// ============================================================================

export interface MetricCardWidgetConfig<TKey extends string> extends BaseWidgetConfig {
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
}

/**
 * Stat Widget Config - Simple stat display from field definition
 * Takes a numeric value and displays with label from field.ui.label
 */
export interface StatWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.STAT;
  label?: NoInfer<TKey>;
  format?: "number" | "percentage" | "currency" | "compact";
  icon?: IconKey;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  size?: "sm" | "md" | "lg";
}

export interface StatsGridWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.STATS_GRID;
  title?: NoInfer<TKey>;
  stats?: Array<{
    label: NoInfer<TKey>;
    value: string | number;
  }>;
}

export interface ChartWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.CHART;
  title?: NoInfer<TKey>;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  chartType?: "line" | "bar" | "pie" | "area" | "donut";
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export interface ProgressWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.PROGRESS;
  value: number;
  max?: number;
  label?: NoInfer<TKey>;
}

// ============================================================================
// STATUS WIDGETS
// ============================================================================

export interface LoadingWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.LOADING;
  message?: NoInfer<TKey>;
}

export interface ErrorWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.ERROR;
  title: NoInfer<TKey>;
  message?: NoInfer<TKey>;
}

export interface EmptyStateWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.EMPTY_STATE;
  title: NoInfer<TKey>;
  message?: NoInfer<TKey>;
  action?: {
    text: NoInfer<TKey>;
    onClick?: string;
  };
}

export interface StatusIndicatorWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.STATUS_INDICATOR;
  status: "success" | "warning" | "error" | "info" | "pending";
  label?: NoInfer<TKey>;
}

export interface AlertWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ALERT;
  variant?: "default" | "destructive" | "success" | "warning";
}

export interface FormAlertWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_ALERT;
}

export interface SubmitButtonWidgetConfig<TKey extends string> extends BaseWidgetConfig {
  type: WidgetType.SUBMIT_BUTTON;
  text?: NoInfer<TKey>;
  loadingText?: NoInfer<TKey>;
  icon?: IconKey;
  variant?: "default" | "primary" | "secondary" | "destructive" | "ghost" | "outline" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Password strength indicator
export interface PasswordStrengthWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PASSWORD_STRENGTH;
  /** Field name to watch for password value (defaults to "password") */
  watchField?: string;
}

// ============================================================================
// CUSTOM WIDGETS
// ============================================================================

export interface CustomWidgetConfig<
  TProps extends Record<string, string | number | boolean | null | undefined> = Record<
    string,
    never
  >,
> extends BaseWidgetConfig {
  type: WidgetType.CUSTOM;
  componentId: string;
  props?: TProps;
}

// ============================================================================
// UNION TYPE FOR ALL WIDGET CONFIGS
// ============================================================================

export type WidgetConfig<TKey extends string> =
  // Form widgets
  | FormFieldWidgetConfig<TKey>
  | FormGroupWidgetConfig<TKey>
  | FormSectionWidgetConfig<TKey>
  // Data display widgets
  | DataTableWidgetConfig<TKey>
  | DataCardWidgetConfig<TKey>
  | DataCardsWidgetConfig<TKey>
  | DataListWidgetConfig<TKey>
  | DataGridWidgetConfig<TKey>
  | GroupedListWidgetConfig<TKey>
  | CodeQualityListWidgetConfig<TKey>
  | CodeQualityFilesWidgetConfig<TKey>
  | CodeQualitySummaryWidgetConfig<TKey>
  | MetadataCardWidgetConfig<TKey>
  // Layout widgets
  | ContainerWidgetConfig<TKey>
  | SectionWidgetConfig<TKey>
  | TabsWidgetConfig<TKey>
  | AccordionWidgetConfig<TKey>
  // Content widgets
  | TitleWidgetConfig<TKey>
  | TextWidgetConfig<TKey>
  | BadgeWidgetConfig<TKey>
  | AvatarWidgetConfig<TKey>
  | MarkdownWidgetConfig<TKey>
  | MarkdownEditorWidgetConfig<TKey>
  | LinkWidgetConfig<TKey>
  | LinkCardWidgetConfig<TKey>
  | LinkListWidgetConfig<TKey>
  // Specialized content widgets
  | FilePathWidgetConfig
  | LineNumberWidgetConfig
  | ColumnNumberWidgetConfig
  | CodeRuleWidgetConfig
  | CodeOutputWidgetConfig
  | SeverityBadgeWidgetConfig
  | MessageTextWidgetConfig<TKey>
  | IssueCardWidgetConfig<TKey>
  | CreditTransactionCardWidgetConfig
  | CreditTransactionListWidgetConfig
  | PaginationWidgetConfig
  // Interactive widgets
  | ButtonWidgetConfig<TKey>
  | ButtonGroupWidgetConfig<TKey>
  | ActionBarWidgetConfig<TKey>
  | PaginationInfoWidgetConfig
  | ActionListWidgetConfig<TKey>
  // Stats widgets
  | StatWidgetConfig<TKey>
  | MetricCardWidgetConfig<TKey>
  | StatsGridWidgetConfig<TKey>
  | ChartWidgetConfig<TKey>
  | ProgressWidgetConfig<TKey>
  // Status widgets
  | LoadingWidgetConfig<TKey>
  | ErrorWidgetConfig<TKey>
  | EmptyStateWidgetConfig<TKey>
  | StatusIndicatorWidgetConfig<TKey>
  | AlertWidgetConfig
  | FormAlertWidgetConfig
  | SubmitButtonWidgetConfig<TKey>
  | PasswordStrengthWidgetConfig;

/**
 * Extract widget config type from WidgetType enum
 */
export type ExtractWidgetConfig<T extends WidgetType, TKey extends string> = Extract<
  WidgetConfig<TKey>,
  { type: T }
>;
