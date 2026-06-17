/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "next-vibe-ui/unified/_shared/types";
import type { CodeOutputWidgetConfig } from "next-vibe-ui/unified/containers/code-output/types";
import type {
  ContainerUnionWidgetConfig,
  ContainerWidgetConfig,
} from "next-vibe-ui/unified/containers/container/types";
import type {
  CustomWidgetObjectConfig,
  CustomWidgetPrimitiveConfig,
} from "next-vibe-ui/unified/containers/custom/types";
import type { PaginationWidgetConfig } from "next-vibe-ui/unified/containers/pagination/types";
import type { AlertWidgetConfig } from "next-vibe-ui/unified/display-only/alert/types";
import type { AvatarWidgetConfig } from "next-vibe-ui/unified/display-only/avatar/types";
import type { BadgeWidgetConfig } from "next-vibe-ui/unified/display-only/badge/types";
import type { ChartWidgetConfig } from "next-vibe-ui/unified/display-only/chart/types";
import type { CodeQualityFilesWidgetConfig } from "next-vibe-ui/unified/display-only/code-quality-files/types";
import type { CodeQualityListWidgetConfig } from "next-vibe-ui/unified/display-only/code-quality-list/types";
import type { CodeQualitySummaryWidgetConfig } from "next-vibe-ui/unified/display-only/code-quality-summary/types";
import type { DescriptionWidgetConfig } from "next-vibe-ui/unified/display-only/description/types";
import type { EmptyStateWidgetConfig } from "next-vibe-ui/unified/display-only/empty-state/types";
import type { IconWidgetConfig } from "next-vibe-ui/unified/display-only/icon/types";
import type { KeyValueWidgetConfig } from "next-vibe-ui/unified/display-only/key-value/types";
import type { LinkWidgetConfig } from "next-vibe-ui/unified/display-only/link/types";
import type { LoadingWidgetConfig } from "next-vibe-ui/unified/display-only/loading/types";
import type { MarkdownWidgetConfig } from "next-vibe-ui/unified/display-only/markdown/types";
import type { MetadataWidgetConfig } from "next-vibe-ui/unified/display-only/metadata/types";
import type { SeparatorWidgetConfig } from "next-vibe-ui/unified/display-only/separator/types";
import type { StatWidgetConfig } from "next-vibe-ui/unified/display-only/stat/types";
import type { StatusIndicatorWidgetConfig } from "next-vibe-ui/unified/display-only/status-indicator/types";
import type { TextWidgetConfig } from "next-vibe-ui/unified/display-only/text/types";
import type { TitleWidgetConfig } from "next-vibe-ui/unified/display-only/title/types";
import type { BooleanFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/boolean-field/types";
import type { ColorFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/color-field/types";
import type { CountrySelectFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/country-select-field/types";
import type { CurrencySelectFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/currency-select-field/types";
import type { DateFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/date-field/types";
import type { DateRangeFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/date-range-field/types";
import type { DateTimeFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/datetime-field/types";
import type { EmailFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/email-field/types";
import type { EntityPickerFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/entity-picker-field/types";
import type { FileFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/file-field/types";
import type { FilterPillsFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/filter-pills-field/types";
import type { IconFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/icon-field/types";
import type { IntFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/int-field/types";
import type { JsonFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/json-field/types";
import type { LanguageSelectFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/language-select-field/types";
import type { MarkdownEditorWidgetConfig } from "next-vibe-ui/unified/form-fields/markdown-editor/types";
import type { MarkdownTextareaFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/markdown-textarea-field/types";
import type { MultiSelectFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/multiselect-field/types";
import type { NumberFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/number-field/types";
import type { PasswordFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/password-field/types";
import type { PhoneFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/phone-field/types";
import type { RangeSliderFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/range-slider-field/types";
import type { SelectFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/select-field/types";
import type { SignalsFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/signals-field/types";
import type { SliderFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/slider-field/types";
import type { TagsFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/tags-field/types";
import type { TextArrayFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/text-array-field/types";
import type { TextFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/text-field/types";
import type { TextareaFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/textarea-field/types";
import type { TimeFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/time-field/types";
import type { TimeRangeFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/time-range-field/types";
import type { TimeSeriesFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/time-series-field/types";
import type { TimezoneFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/timezone-field/types";
import type { UrlFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/url-field/types";
import type { UuidFieldWidgetConfig } from "next-vibe-ui/unified/form-fields/uuid-field/types";
import type { ButtonWidgetConfig } from "next-vibe-ui/unified/interactive/button/types";
import type { FormAlertWidgetConfig } from "next-vibe-ui/unified/interactive/form-alert/types";
import type { NavigateButtonWidgetConfig } from "next-vibe-ui/unified/interactive/navigate-button/types";
import type { SearchBarWidgetConfig } from "next-vibe-ui/unified/interactive/search-bar/types";
import type { SubmitButtonWidgetConfig } from "next-vibe-ui/unified/interactive/submit-button/types";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "../types/endpoint-base";

// Union type for all form field widgets
// TSchema is passed through - each member enforces its own schema constraint
export type FormFieldWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
> =
  | TextFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with TextFieldWidgetSchema
      TSchema,
      TUsage
    >
  | EmailFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | PasswordFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | NumberFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | BooleanFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | SelectFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | MultiSelectFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | FilterPillsFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | RangeSliderFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TextareaFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | MarkdownTextareaFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | PhoneFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | UrlFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | IntFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | DateFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | DateTimeFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TimeFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | FileFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | UuidFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | JsonFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | DateRangeFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TimeRangeFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TimezoneFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | CurrencySelectFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | LanguageSelectFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | CountrySelectFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | ColorFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | IconFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | SliderFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TagsFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TextArrayFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | TimeSeriesFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | SignalsFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | EntityPickerFieldWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch
      TSchema,
      TUsage
    >
  | SearchBarWidgetConfig<TKey, TSchema, TUsage>;

/**
 * Widget configs that support object-union (discriminated unions)
 * Currently only Container supports this
 */
export type ObjectUnionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends UnionObjectWidgetConfigConstrain<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> = ContainerUnionWidgetConfig<TKey, TUsage, TVariants>;

/**
 * Widget configs that work with object data (have children fields)
 * Used in objectField to ensure type safety
 */
export type ObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> =
  | ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | CustomWidgetObjectConfig<TKey, TUsage, TSchemaType, TChildren>;

/**
 * Widget configs that work with array data
 * Used in arrayField to ensure type safety
 * Note: Widgets with usage/children fields have them omitted because array field functions
 * provide usage and child as separate parameters. Widgets with schema fields have them omitted
 * because the field function infers the schema from the child parameter.
 */
export type ArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> = ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChild>;

export type DisplayOnlyWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> =
  | SeparatorWidgetConfig<TKey, TUsage, TSchemaType>
  | ButtonWidgetConfig<TKey, TUsage, TSchemaType>
  | SubmitButtonWidgetConfig<TKey, TUsage, TSchemaType>
  | NavigateButtonWidgetConfig<
      TKey,
      TUsage,
      TSchemaType,
      CreateApiEndpointAny | undefined,
      CreateApiEndpointAny | undefined
    >
  | CustomWidgetPrimitiveConfig<TUsage, TSchemaType, never>
  | FormAlertWidgetConfig<TUsage, TSchemaType>
  | TextWidgetConfig<TKey, never, TUsage, TSchemaType>
  | TitleWidgetConfig<TKey, never, TUsage, TSchemaType>
  | LoadingWidgetConfig<TKey, TUsage, TSchemaType>
  | EmptyStateWidgetConfig<TKey, TUsage, TSchemaType>
  | CodeOutputWidgetConfig<TKey, never, TUsage, TSchemaType>
  | BadgeWidgetConfig<TKey, never, TUsage, TSchemaType>
  | AlertWidgetConfig<TKey, never, TUsage, TSchemaType>
  | AvatarWidgetConfig<TKey, TUsage, TSchemaType, never>
  | IconWidgetConfig<never, TUsage, TSchemaType>
  | ChartWidgetConfig<TKey, never, TUsage, TSchemaType>
  | LinkWidgetConfig<TKey, never, TUsage, TSchemaType>
  | MarkdownWidgetConfig<TKey, never, TUsage, TSchemaType>
  | MetadataWidgetConfig<TKey, never, TUsage, TSchemaType>
  | StatWidgetConfig<TKey, never, TUsage, TSchemaType>;

export type RequestResponseDisplayWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> =
  | AlertWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with AlertWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | CustomWidgetPrimitiveConfig<TUsage, TSchemaType, TSchema>
  | ChartWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with ChartWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | TextWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with TextWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | TitleWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with TitleWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | DescriptionWidgetConfig<
      // @ts-expect-error - TSchema constraint mismatch with DescriptionWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | IconWidgetConfig<
      // @ts-expect-error - TSchema constraint mismatch with IconWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | AvatarWidgetConfig<
      TKey,
      TUsage,
      TSchemaType,
      // @ts-expect-error - TSchema constraint mismatch with AvatarWidgetSchema
      TSchema
    >
  | BadgeWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with BadgeWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | LinkWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with LinkWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | KeyValueWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with KeyValueWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | StatWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with StatWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | MarkdownWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with MarkdownWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | MetadataWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with MetadataWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | MarkdownEditorWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with MarkdownEditorWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | CodeOutputWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with CodeOutputWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | StatusIndicatorWidgetConfig<
      TKey,
      // @ts-expect-error - TSchema constraint mismatch with StatusIndicatorWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | CodeQualitySummaryWidgetConfig<
      // @ts-expect-error - TSchema constraint mismatch with CodeQualitySummaryWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | CodeQualityFilesWidgetConfig<
      // @ts-expect-error - TSchema constraint mismatch with CodeQualityFilesWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >
  | CodeQualityListWidgetConfig<
      // @ts-expect-error - TSchema constraint mismatch with CodeQualityListWidgetSchema
      TSchema,
      TUsage,
      TSchemaType
    >;

export type RequestResponseWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> =
  | RequestResponseDisplayWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | FormFieldWidgetConfig<TKey, TSchema, TUsage>;

export type UnifiedField<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TChildren extends AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>,
> =
  | RequestResponseWidgetConfig<TKey, TSchema, TUsage, "primitive">
  | ObjectWidgetConfig<
      TKey,
      TUsage,
      "object" | "object-optional" | "widget-object",
      // @ts-expect-error - TChildren is only valid for object widgets
      TChildren
    >
  | ArrayWidgetConfig<TKey, TUsage, "array" | "array-optional", TChildren>
  | ObjectUnionWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error - TChildren is only valid for object widgets
      TChildren
    >
  | DisplayOnlyWidgetConfig<TKey, TUsage, "widget">
  | PaginationWidgetConfig<TUsage>;
