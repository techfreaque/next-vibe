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
import type { CodeOutputWidgetConfig } from "../../unified-ui/widgets/containers/code-output/types";
import type {
  ContainerUnionWidgetConfig,
  ContainerWidgetConfig,
} from "../../unified-ui/widgets/containers/container/types";
import type {
  CustomWidgetObjectConfig,
  CustomWidgetPrimitiveConfig,
} from "../../unified-ui/widgets/containers/custom/types";
import type { AlertWidgetConfig } from "../../unified-ui/widgets/display-only/alert/types";
import type { AvatarWidgetConfig } from "../../unified-ui/widgets/display-only/avatar/types";
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
    >;

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
  | DisplayOnlyWidgetConfig<TKey, TUsage, "widget">;
