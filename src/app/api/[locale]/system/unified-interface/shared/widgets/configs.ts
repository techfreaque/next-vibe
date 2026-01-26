/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type { z } from "zod";

import type {
  BaseWidgetConfig,
  FieldUsageConfig,
  SchemaTypes,
} from "../../unified-ui/widgets/_shared/types";
import type { AccordionWidgetConfig } from "../../unified-ui/widgets/containers/accordion/types";
import type { CodeOutputWidgetConfig } from "../../unified-ui/widgets/containers/code-output/types";
import type { CodeQualityFilesWidgetConfig } from "../../unified-ui/widgets/containers/code-quality-files/types";
import type { CodeQualityListWidgetConfig } from "../../unified-ui/widgets/containers/code-quality-list/types";
import type { CodeQualitySummaryWidgetConfig } from "../../unified-ui/widgets/containers/code-quality-summary/types";
import type { ContainerWidgetConfig } from "../../unified-ui/widgets/containers/container/types";
import type { CreditTransactionCardWidgetConfig } from "../../unified-ui/widgets/containers/credit-transaction-card/types";
import type { CreditTransactionListWidgetConfig } from "../../unified-ui/widgets/containers/credit-transaction-list/types";
import type { DataGridWidgetConfig } from "../../unified-ui/widgets/containers/data-grid/types";
import type { DataListWidgetConfig } from "../../unified-ui/widgets/containers/data-list/types";
import type { DataTableWidgetConfig } from "../../unified-ui/widgets/containers/data-table/types";
import type { GroupedListWidgetConfig } from "../../unified-ui/widgets/containers/grouped-list/types";
import type { LinkCardWidgetConfig } from "../../unified-ui/widgets/containers/link-card/types";
import type { MetricCardWidgetConfig } from "../../unified-ui/widgets/containers/metric-card/types";
import type { PaginationWidgetConfig } from "../../unified-ui/widgets/containers/pagination/types";
import type { SectionWidgetConfig } from "../../unified-ui/widgets/containers/section/types";
import type { SeparatorWidgetConfig } from "../../unified-ui/widgets/containers/separator/types";
import type { TabsWidgetConfig } from "../../unified-ui/widgets/containers/tabs/types";
import type { AlertWidgetConfig } from "../../unified-ui/widgets/display-only/alert/types";
import type { AvatarWidgetConfig } from "../../unified-ui/widgets/display-only/avatar/types";
import type { BadgeWidgetConfig } from "../../unified-ui/widgets/display-only/badge/types";
import type { ChartWidgetConfig } from "../../unified-ui/widgets/display-only/chart/types";
import type { DescriptionWidgetConfig } from "../../unified-ui/widgets/display-only/description/types";
import type { EmptyStateWidgetConfig } from "../../unified-ui/widgets/display-only/empty-state/types";
import type { ErrorWidgetConfig } from "../../unified-ui/widgets/display-only/error/types";
import type { IconWidgetConfig } from "../../unified-ui/widgets/display-only/icon/types";
import type { KeyValueWidgetConfig } from "../../unified-ui/widgets/display-only/key-value/types";
import type { LinkWidgetConfig } from "../../unified-ui/widgets/display-only/link/types";
import type { LoadingWidgetConfig } from "../../unified-ui/widgets/display-only/loading/types";
import type { MarkdownWidgetConfig } from "../../unified-ui/widgets/display-only/markdown/types";
import type { ModelDisplayWidgetConfig } from "../../unified-ui/widgets/display-only/model-display/types";
import type { PasswordStrengthWidgetConfig } from "../../unified-ui/widgets/display-only/password-strength/types";
import type { StatWidgetConfig } from "../../unified-ui/widgets/display-only/stat/types";
import type { TextWidgetConfig } from "../../unified-ui/widgets/display-only/text/types";
import type { TitleWidgetConfig } from "../../unified-ui/widgets/display-only/title/types";
import type { BooleanFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/boolean-field/types";
import type { ColorFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/color-field/types";
import type { CountrySelectFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/country-select-field/types";
import type { CurrencySelectFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/currency-select-field/types";
import type { DateFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/date-field/types";
import type { DateRangeFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/date-range-field/types";
import type { DateTimeFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/datetime-field/types";
import type { EmailFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/email-field/types";
import type { FileFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/file-field/types";
import type { FilterPillsFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/filter-pills-field/types";
import type { IconFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/icon-field/types";
import type { IntFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/int-field/types";
import type { JsonFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/json-field/types";
import type { LanguageSelectFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/language-select-field/types";
import type { MarkdownEditorWidgetConfig } from "../../unified-ui/widgets/form-fields/markdown-editor/types";
import type { MultiSelectFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/multiselect-field/types";
import type { NumberFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/number-field/types";
import type { PasswordFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/password-field/types";
import type { PhoneFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/phone-field/types";
import type { RangeSliderFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/range-slider-field/types";
import type { SelectFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/select-field/types";
import type { SliderFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/slider-field/types";
import type { TagsFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/tags-field/types";
import type { TextArrayFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/text-array-field/types";
import type { TextFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/text-field/types";
import type { TextareaFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/textarea-field/types";
import type { TimeFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/time-field/types";
import type { TimeRangeFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/time-range-field/types";
import type { TimezoneFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/timezone-field/types";
import type { UrlFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/url-field/types";
import type { UuidFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/uuid-field/types";
import type { ButtonWidgetConfig } from "../../unified-ui/widgets/interactive/button/types";
import type { FormAlertWidgetConfig } from "../../unified-ui/widgets/interactive/form-alert/types";
import type { NavigateButtonWidgetConfig } from "../../unified-ui/widgets/interactive/navigate-button/types";
import type { SubmitButtonWidgetConfig } from "../../unified-ui/widgets/interactive/submit-button/types";
import type {
  InferSchemaFromField,
  ObjectField,
  ObjectUnionField,
  UnifiedField,
} from "../types/endpoint";
import type { CreateApiEndpointAny } from "../types/endpoint-base";
import type { FieldUsage, LayoutType, WidgetType } from "../types/enums";
import type {
  EnumWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "./utils/schema-constraints";

// Union type for all form field widgets
// Each widget uses its own specific schema constraint
export type FormFieldWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
> =
  | TextFieldWidgetConfig<TKey, TSchema, TUsage>
  | EmailFieldWidgetConfig<TKey, TSchema, TUsage>
  | PasswordFieldWidgetConfig<TKey, TSchema, TUsage>
  | NumberFieldWidgetConfig<TKey, TSchema, TUsage>
  | BooleanFieldWidgetConfig<TKey, TSchema, TUsage>
  | SelectFieldWidgetConfig<TKey, TSchema, TUsage>
  | MultiSelectFieldWidgetConfig<TKey, TSchema, TUsage>
  | FilterPillsFieldWidgetConfig<TKey, TSchema, TUsage>
  | RangeSliderFieldWidgetConfig<TKey, TSchema, TUsage>
  | TextareaFieldWidgetConfig<TKey, TSchema, TUsage>
  | PhoneFieldWidgetConfig<TKey, TSchema, TUsage>
  | UrlFieldWidgetConfig<TKey, TSchema, TUsage>
  | IntFieldWidgetConfig<TKey, TSchema, TUsage>
  | DateFieldWidgetConfig<TKey, TSchema, TUsage>
  | DateTimeFieldWidgetConfig<TKey, TSchema, TUsage>
  | TimeFieldWidgetConfig<TKey, TSchema, TUsage>
  | FileFieldWidgetConfig<TKey, TSchema, TUsage>
  | UuidFieldWidgetConfig<TKey, TSchema, TUsage>
  | JsonFieldWidgetConfig<TKey, TSchema, TUsage>
  | DateRangeFieldWidgetConfig<TKey, TSchema, TUsage>
  | TimeRangeFieldWidgetConfig<TKey, TSchema, TUsage>
  | TimezoneFieldWidgetConfig<TKey, TSchema, TUsage>
  | CurrencySelectFieldWidgetConfig<TKey, TSchema, TUsage>
  | LanguageSelectFieldWidgetConfig<TKey, TSchema, TUsage>
  | CountrySelectFieldWidgetConfig<TKey, TSchema, TUsage>
  | ColorFieldWidgetConfig<TKey, TSchema, TUsage>
  | IconFieldWidgetConfig<TKey, TSchema, TUsage>
  | SliderFieldWidgetConfig<TKey, TSchema, TUsage>
  | TagsFieldWidgetConfig<TKey, TSchema, TUsage>
  | TextArrayFieldWidgetConfig<TKey, TSchema, TUsage>;

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
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> =
  | AlertWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | TitleWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | ChartWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | TextWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | DescriptionWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | IconWidgetConfig<TSchema, TUsage, TSchemaType>
  | BadgeWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | LinkWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | KeyValueWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | StatWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | MarkdownWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | CodeOutputWidgetConfig<TSchema, TUsage, TSchemaType>
  | StatusIndicatorWidgetConfig<TKey, TSchema, TUsage, TSchemaType>;

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
