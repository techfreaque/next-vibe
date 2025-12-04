/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type { Route } from "next";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { FieldDataType, LayoutType, WidgetType, SpacingSize } from "../types/enums";

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
 */
interface BaseWidgetConfig {
  type: WidgetType;
  className?: string;
  order?: number;
}

// ============================================================================
// FORM WIDGETS
// ============================================================================

// Text input
export interface TextFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TEXT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Email input
export interface EmailFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.EMAIL;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Password input
export interface PasswordFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.PASSWORD;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Number input
export interface NumberFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.NUMBER;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Boolean/Checkbox input
export interface BooleanFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.BOOLEAN;
  label?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Select dropdown
export interface SelectFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.SELECT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ label: TranslationKey; value: string | number }>;
  columns?: number;
}

// Multi-select
export interface MultiSelectFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.MULTISELECT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ label: TranslationKey; value: string | number }>;
  columns?: number;
}

// Textarea
export interface TextareaFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TEXTAREA;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Phone input
export interface PhoneFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.PHONE;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// URL input
export interface UrlFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.URL;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Integer input
export interface IntFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.INT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Date input
export interface DateFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.DATE;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// DateTime input
export interface DateTimeFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.DATETIME;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Time input
export interface TimeFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TIME;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// File input
export interface FileFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.FILE;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// UUID input
export interface UuidFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.UUID;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// JSON input
export interface JsonFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.JSON;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Date range input
export interface DateRangeFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.DATE_RANGE;
  label?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Time range input
export interface TimeRangeFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TIME_RANGE;
  label?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Timezone select
export interface TimezoneFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TIMEZONE;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Currency select
export interface CurrencySelectFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.CURRENCY_SELECT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Language select
export interface LanguageSelectFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.LANGUAGE_SELECT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Country select
export interface CountrySelectFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.COUNTRY_SELECT;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Color picker
export interface ColorFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.COLOR;
  label?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Slider input
export interface SliderFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.SLIDER;
  label?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Tags input
export interface TagsFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TAGS;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Text array input
export interface TextArrayFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType.TEXT_ARRAY;
  label?: TranslationKey;
  description?: TranslationKey;
  placeholder?: TranslationKey;
  helpText?: TranslationKey;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
}

// Union type for all form field widgets
export type FormFieldWidgetConfig =
  | TextFieldWidgetConfig
  | EmailFieldWidgetConfig
  | PasswordFieldWidgetConfig
  | NumberFieldWidgetConfig
  | BooleanFieldWidgetConfig
  | SelectFieldWidgetConfig
  | MultiSelectFieldWidgetConfig
  | TextareaFieldWidgetConfig
  | PhoneFieldWidgetConfig
  | UrlFieldWidgetConfig
  | IntFieldWidgetConfig
  | DateFieldWidgetConfig
  | DateTimeFieldWidgetConfig
  | TimeFieldWidgetConfig
  | FileFieldWidgetConfig
  | UuidFieldWidgetConfig
  | JsonFieldWidgetConfig
  | DateRangeFieldWidgetConfig
  | TimeRangeFieldWidgetConfig
  | TimezoneFieldWidgetConfig
  | CurrencySelectFieldWidgetConfig
  | LanguageSelectFieldWidgetConfig
  | CountrySelectFieldWidgetConfig
  | ColorFieldWidgetConfig
  | SliderFieldWidgetConfig
  | TagsFieldWidgetConfig
  | TextArrayFieldWidgetConfig;

export interface FormGroupWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_GROUP;
  title?: TranslationKey;
  description?: TranslationKey;
  layoutType?: LayoutType;
}

export interface FormSectionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_SECTION;
  title?: TranslationKey;
  description?: TranslationKey;
}

// ============================================================================
// DATA DISPLAY WIDGETS
// ============================================================================

export interface DataTableWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_TABLE;
  title?: TranslationKey;
  description?: TranslationKey;
  columns?: Array<{
    key: string; // Field name from the data object (e.g., "id", "name", "email")
    label: TranslationKey;
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

export interface DataCardsWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_CARDS;
  title?: TranslationKey;
  description?: TranslationKey;
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

export interface DataListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_LIST;
  title?: TranslationKey;
  description?: TranslationKey;
  optional?: boolean;
  renderMode?: string;
  hierarchical?: boolean;
}

export interface DataGridWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_GRID;
  title?: TranslationKey;
  description?: TranslationKey;
}

export interface GroupedListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.GROUPED_LIST;
  title?: TranslationKey;
  description?: TranslationKey;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "status", "category")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity", "createdAt", "name")
  columns?: number;
  hierarchical?: boolean;
  renderMode?: string;
}

export interface CodeQualityListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CODE_QUALITY_LIST;
  title?: TranslationKey;
  description?: TranslationKey;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "code")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity")
  showSummary?: boolean;
  columns?: number;
  layoutType?: LayoutType;
}

export interface MetadataCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.METADATA_CARD;
  title?: TranslationKey;
  description?: TranslationKey;
}

// ============================================================================
// LAYOUT WIDGETS
// ============================================================================

export interface ContainerWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CONTAINER;
  title?: TranslationKey;
  description?: TranslationKey;
  layoutType?: LayoutType;
  layout?: LayoutConfig;
  columns?: number;
  optional?: boolean;
  icon?: string;
  border?: boolean;
  spacing?: "compact" | "normal" | "relaxed";
}

export interface SectionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.SECTION;
  title?: TranslationKey;
  description?: TranslationKey;
  layoutType?: LayoutType;
}

export interface TabsWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.TABS;
  title?: TranslationKey;
  tabs?: Array<{
    id: string;
    label: TranslationKey;
  }>;
}

export interface AccordionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ACCORDION;
  title?: TranslationKey;
}

// ============================================================================
// CONTENT WIDGETS
// ============================================================================

export interface TitleWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.TITLE;
  content: TranslationKey;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fieldType?: FieldDataType;
}

export interface TextWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.TEXT;
  content: TranslationKey;
  fieldType?: FieldDataType;
  label?: TranslationKey;
  variant?: "default" | "error" | "info" | "success" | "warning";
  multiline?: boolean;
  emphasis?: "bold" | "italic" | "underline";
  maxLength?: number;
}

export interface BadgeWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BADGE;
  text?: TranslationKey; // Static text - use when displaying a fixed label
  enumOptions?: Array<{ label: TranslationKey; value: string | number }>; // Dynamic enum mapping - use when displaying enum values
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export interface AvatarWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.AVATAR;
  src?: string; // Field name containing avatar URL (e.g., "avatarUrl", "imageUrl") or literal URL
  alt?: TranslationKey;
  fallback?: string; // Fallback text/initials to display if image fails (e.g., "JD", "?")
}

export interface MarkdownWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN;
  content: TranslationKey;
}

export interface MarkdownEditorWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN_EDITOR;
  label?: TranslationKey;
  placeholder?: TranslationKey;
}

export interface LinkWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK;
  href: Route | string; // URL path or route
  text?: TranslationKey; // Link text to display
  label?: TranslationKey; // Accessible label (aria-label) - use if text is not descriptive
  external?: boolean; // Opens in new tab if true
}

export interface LinkCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK_CARD;
  href: Route | string;
  title: TranslationKey;
  description?: TranslationKey;
  external?: boolean;
}

export interface LinkListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK_LIST;
  title?: TranslationKey;
  links?: Array<{
    href: Route | string;
    text: TranslationKey;
    external?: boolean;
  }>;
  layoutType?: LayoutType;
  columns?: number;
}

// Data-driven card - renders object data as a card with link capability
export interface DataCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_CARD;
  title?: TranslationKey;
  description?: TranslationKey;
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

export interface MessageTextWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.MESSAGE_TEXT;
  message: TranslationKey; // Message to display
}

export interface IssueCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ISSUE_CARD;
  title: TranslationKey;
  description?: TranslationKey;
}

// ============================================================================
// INTERACTIVE WIDGETS
// ============================================================================

export interface ButtonWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BUTTON;
  text: TranslationKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  onClick?: string; // Action ID
}

export interface ButtonGroupWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BUTTON_GROUP;
  buttons?: Array<{
    text: TranslationKey;
    onClick?: string;
  }>;
}

export interface ActionBarWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ACTION_BAR;
  actions?: Array<{
    text: TranslationKey;
    onClick?: string;
  }>;
}

export interface PaginationInfoWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PAGINATION_INFO;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ActionListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ACTION_LIST;
  actions?: Array<{
    text: TranslationKey;
    onClick?: string;
  }>;
}

// ============================================================================
// STATS WIDGETS
// ============================================================================

export interface MetricCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.METRIC_CARD;
  title: TranslationKey;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percentage" | "bytes";
  icon?: string;
  unit?: string;
  precision?: number;
  threshold?: {
    warning?: number;
    error?: number;
  };
}

export interface StatsGridWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.STATS_GRID;
  title?: TranslationKey;
  stats?: Array<{
    label: TranslationKey;
    value: string | number;
  }>;
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CHART;
  title?: TranslationKey;
  chartType?: "line" | "bar" | "pie" | "area";
}

export interface ProgressWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.PROGRESS;
  value: number;
  max?: number;
  label?: TranslationKey;
}

// ============================================================================
// STATUS WIDGETS
// ============================================================================

export interface LoadingWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LOADING;
  message?: TranslationKey;
}

export interface ErrorWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ERROR;
  title: TranslationKey;
  message?: TranslationKey;
}

export interface EmptyStateWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.EMPTY_STATE;
  title: TranslationKey;
  message?: TranslationKey;
  action?: {
    text: TranslationKey;
    onClick?: string;
  };
}

export interface StatusIndicatorWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.STATUS_INDICATOR;
  status: "success" | "warning" | "error" | "info" | "pending";
  label?: TranslationKey;
}

// ============================================================================
// CUSTOM WIDGETS
// ============================================================================

export interface CustomWidgetConfig<TProps extends Record<string, string | number | boolean | null | undefined> = Record<string, never>> extends BaseWidgetConfig {
  type: WidgetType.CUSTOM;
  componentId: string;
  props?: TProps;
}

// ============================================================================
// UNION TYPE FOR ALL WIDGET CONFIGS
// ============================================================================

export type WidgetConfig =
  // Form widgets
  | FormFieldWidgetConfig
  | FormGroupWidgetConfig
  | FormSectionWidgetConfig
  // Data display widgets
  | DataTableWidgetConfig
  | DataCardWidgetConfig
  | DataCardsWidgetConfig
  | DataListWidgetConfig
  | DataGridWidgetConfig
  | GroupedListWidgetConfig
  | CodeQualityListWidgetConfig
  | MetadataCardWidgetConfig
  // Layout widgets
  | ContainerWidgetConfig
  | SectionWidgetConfig
  | TabsWidgetConfig
  | AccordionWidgetConfig
  // Content widgets
  | TitleWidgetConfig
  | TextWidgetConfig
  | BadgeWidgetConfig
  | AvatarWidgetConfig
  | MarkdownWidgetConfig
  | MarkdownEditorWidgetConfig
  | LinkWidgetConfig
  | LinkCardWidgetConfig
  | LinkListWidgetConfig
  // Specialized content widgets
  | FilePathWidgetConfig
  | LineNumberWidgetConfig
  | ColumnNumberWidgetConfig
  | CodeRuleWidgetConfig
  | CodeOutputWidgetConfig
  | SeverityBadgeWidgetConfig
  | MessageTextWidgetConfig
  | IssueCardWidgetConfig
  // Interactive widgets
  | ButtonWidgetConfig
  | ButtonGroupWidgetConfig
  | ActionBarWidgetConfig
  | PaginationInfoWidgetConfig
  | ActionListWidgetConfig
  // Stats widgets
  | MetricCardWidgetConfig
  | StatsGridWidgetConfig
  | ChartWidgetConfig
  | ProgressWidgetConfig
  // Status widgets
  | LoadingWidgetConfig
  | ErrorWidgetConfig
  | EmptyStateWidgetConfig
  | StatusIndicatorWidgetConfig
  // Custom widgets
  | CustomWidgetConfig;

/**
 * Extract widget config type from WidgetType enum
 */
export type ExtractWidgetConfig<T extends WidgetType> = Extract<
  WidgetConfig,
  { type: T }
>;
