/**
 * Typed Widget Configurations
 *
 * Static, fully typed configurations for each widget type.
 * This ensures type safety across CLI and React implementations.
 */

import type { z } from "zod";

import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../unified-ui/widgets/_shared/types";
import type { AccordionWidgetConfig } from "../../unified-ui/widgets/containers/accordion/types";
import type { CodeOutputWidgetConfig } from "../../unified-ui/widgets/containers/code-output/types";
import type {
  ContainerUnionWidgetConfig,
  ContainerWidgetConfig,
} from "../../unified-ui/widgets/containers/container/types";
import type { CreditTransactionCardWidgetConfig } from "../../unified-ui/widgets/containers/credit-transaction-card/types";
import type { CreditTransactionListWidgetConfig } from "../../unified-ui/widgets/containers/credit-transaction-list/types";
import type { DataCardsWidgetConfig } from "../../unified-ui/widgets/containers/data-cards/types";
import type { DataGridWidgetConfig } from "../../unified-ui/widgets/containers/data-grid/types";
import type { DataListWidgetConfig } from "../../unified-ui/widgets/containers/data-list/types";
import type { DataTableWidgetConfig } from "../../unified-ui/widgets/containers/data-table/types";
import type { GroupedListWidgetConfig } from "../../unified-ui/widgets/containers/grouped-list/types";
import type { LinkCardWidgetConfig } from "../../unified-ui/widgets/containers/link-card/types";
import type { MetricCardWidgetConfig } from "../../unified-ui/widgets/containers/metric-card/types";
import type { PaginationWidgetConfig } from "../../unified-ui/widgets/containers/pagination/types";
import type { SectionWidgetConfig } from "../../unified-ui/widgets/containers/section/types";
import type { TabsWidgetConfig } from "../../unified-ui/widgets/containers/tabs/types";
import type { AlertWidgetConfig } from "../../unified-ui/widgets/display-only/alert/types";
import type { BadgeWidgetConfig } from "../../unified-ui/widgets/display-only/badge/types";
import type { ChartWidgetConfig } from "../../unified-ui/widgets/display-only/chart/types";
import type { CodeQualityFilesWidgetConfig } from "../../unified-ui/widgets/display-only/code-quality-files/types";
import type { CodeQualityListWidgetConfig } from "../../unified-ui/widgets/display-only/code-quality-list/types";
import type { CodeQualitySummaryWidgetConfig } from "../../unified-ui/widgets/display-only/code-quality-summary/types";
import type { DescriptionWidgetConfig } from "../../unified-ui/widgets/display-only/description/types";
import type { EmptyStateWidgetConfig } from "../../unified-ui/widgets/display-only/empty-state/types";
import type { IconWidgetConfig } from "../../unified-ui/widgets/display-only/icon/types";
import type { KeyValueWidgetConfig } from "../../unified-ui/widgets/display-only/key-value/types";
import type { LinkWidgetConfig } from "../../unified-ui/widgets/display-only/link/types";
import type { LoadingWidgetConfig } from "../../unified-ui/widgets/display-only/loading/types";
import type { MarkdownWidgetConfig } from "../../unified-ui/widgets/display-only/markdown/types";
import type { MetadataWidgetConfig } from "../../unified-ui/widgets/display-only/metadata/types";
import type { ModelDisplayWidgetConfig } from "../../unified-ui/widgets/display-only/model-display/types";
import type { PasswordStrengthWidgetConfig } from "../../unified-ui/widgets/display-only/password-strength/types";
import type { SeparatorWidgetConfig } from "../../unified-ui/widgets/display-only/separator/types";
import type { StatWidgetConfig } from "../../unified-ui/widgets/display-only/stat/types";
import type { StatusIndicatorWidgetConfig } from "../../unified-ui/widgets/display-only/status-indicator/types";
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
import type { CreateApiEndpointAny } from "../types/endpoint-base";

// Union type for all form field widgets
// TSchema is passed through - each member enforces its own schema constraint
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
  | AccordionWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | SectionWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | TabsWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | DataCardsWidgetConfig<TKey, TUsage, TSchemaType, TChildren, null>
  | DataListWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | LinkCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | PaginationWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | MetricCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
  | CreditTransactionCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>;

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
  // oxlint-disable-next-line typescript/no-explicit-any
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> =
  | ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  | AccordionWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  | DataListWidgetConfig<TKey, TUsage, TSchemaType, TChild, undefined>
  | DataCardsWidgetConfig<TKey, TUsage, TSchemaType, TChild, null>
  | DataTableWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  | DataGridWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  | GroupedListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  | CreditTransactionListWidgetConfig<TKey, TUsage, TSchemaType, TChild>;

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
      CreateApiEndpointAny | undefined
    >
  | FormAlertWidgetConfig<TUsage, TSchemaType>
  | PasswordStrengthWidgetConfig<TUsage, TSchemaType, CreateApiEndpointAny>
  | TextWidgetConfig<TKey, never, TUsage, TSchemaType>
  | TitleWidgetConfig<TKey, never, TUsage, TSchemaType>
  | LoadingWidgetConfig<TKey, TUsage, TSchemaType>
  | EmptyStateWidgetConfig<TKey, TUsage, TSchemaType>
  | ModelDisplayWidgetConfig<TUsage, TSchemaType>
  | CodeOutputWidgetConfig<TKey, never, TUsage, TSchemaType>
  | BadgeWidgetConfig<TKey, never, TUsage, TSchemaType>
  | AlertWidgetConfig<TKey, never, TUsage, TSchemaType>
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
  | AlertWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | ChartWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | TextWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | DescriptionWidgetConfig<TSchema, TUsage, TSchemaType>
  | IconWidgetConfig<TSchema, TUsage, TSchemaType>
  | BadgeWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | LinkWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | KeyValueWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | StatWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | MarkdownWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | MetadataWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | MarkdownEditorWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | CodeOutputWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | StatusIndicatorWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | CodeQualitySummaryWidgetConfig<TSchema, TUsage, TSchemaType>
  | CodeQualityFilesWidgetConfig<TSchema, TUsage, TSchemaType>
  | TextWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | TitleWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
  | CodeQualityListWidgetConfig<TSchema, TUsage, TSchemaType>
  | TextWidgetConfig<TKey, TSchema, TUsage, TSchemaType>;

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
  TChildren extends AnyChildrenConstrain<TKey, TUsage>,
> =
  | FormFieldWidgetConfig<TKey, TSchema, TUsage>
  | ObjectWidgetConfig<
      TKey,
      TUsage,
      "object" | "object-optional" | "widget-object",
      TChildren
    >
  | ArrayWidgetConfig<TKey, TUsage, "array" | "array-optional", TChildren>
  | ObjectUnionWidgetConfig<TKey, TUsage, TChildren>
  | DisplayOnlyWidgetConfig<TKey, TUsage, "widget">
  | RequestResponseDisplayWidgetConfig<TKey, TSchema, TUsage, "primitive">
  | never;
