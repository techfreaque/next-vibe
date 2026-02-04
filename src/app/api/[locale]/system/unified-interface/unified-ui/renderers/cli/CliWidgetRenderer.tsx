/**
 * Ink Widget Renderer
 *
 * Routes to appropriate Ink widget components based on widget type.
 * Mirrors React WidgetRenderer architecture for consistency.
 * All widgets directly imported for CLI (no lazy loading).
 */

import type { JSX } from "react";
import type { Path } from "react-hook-form";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { InkWidgetRendererProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
// Container widgets
import { AccordionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/accordion/cli";
import { CodeOutputWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/cli";
import { ContainerWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/cli";
import { CreditTransactionCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-card/cli";
import { CreditTransactionListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-list/cli";
import { DataCardsWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/cli";
import { DataGridWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-grid/cli";
import { DataListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-list/cli";
import { DataTableWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-table/cli";
import { GroupedListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/grouped-list/cli";
import { LinkCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/link-card/cli";
import { MetricCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/metric-card/cli";
import { PaginationWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/cli";
import { SectionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/section/cli";
import { TabsWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/tabs/cli";
// Display-only widgets
import { AlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/cli";
import AvatarWidgetInk from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/avatar/cli";
import { BadgeWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/cli";
import { ChartWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/cli";
import { CodeQualityFilesWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/cli";
import { CodeQualityListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/cli";
import { CodeQualitySummaryWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/cli";
import { DescriptionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/cli";
import { EmptyStateWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/empty-state/cli";
import { IconWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/cli";
import { KeyValueWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/cli";
import { LinkWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/cli";
import { LoadingWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/loading/cli";
import { MarkdownWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/cli";
import { MetadataWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/cli";
import { PasswordStrengthWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/password-strength/cli";
import { SeparatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/cli";
import { StatWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/stat/cli";
import { StatusIndicatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/status-indicator/cli";
import { TextWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/cli";
import { TitleWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/title/cli";
// Form field widgets - all 31 field types
import { BooleanFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/cli";
import { ColorFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/color-field/cli";
import { CountrySelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/country-select-field/cli";
import { CurrencySelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/currency-select-field/cli";
import { DateFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/cli";
import { DateRangeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-range-field/cli";
import { DateTimeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/datetime-field/cli";
import { EmailFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/cli";
import { FileFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/file-field/cli";
import { FilterPillsFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/filter-pills-field/cli";
import { IconFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli";
import { IntFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/int-field/cli";
import { JsonFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/json-field/cli";
import { LanguageSelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/language-select-field/cli";
import { MarkdownEditorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/markdown-editor/cli";
import { ModelSelectionFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/cli";
import { MultiSelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/cli";
import { NumberFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/cli";
import { PasswordFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/cli";
import { PhoneFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/phone-field/cli";
import { RangeSliderFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/range-slider-field/cli";
import { SelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/cli";
import { SliderFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/slider-field/cli";
import { TagsFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/tags-field/cli";
import { TextArrayFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-array-field/cli";
import { TextFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/cli";
import { TextareaFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/cli";
import { TimeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-field/cli";
import { TimeRangeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-range-field/cli";
import { TimezoneFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/timezone-field/cli";
import { UrlFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/cli";
import { UuidFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/uuid-field/cli";
// Interactive widgets
import { ButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/button/cli";
import DragHandleWidgetInk from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/drag-handle/cli";
import { FormAlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/cli";
import { NavigateButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/cli";
import { SubmitButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/cli";

/**
 * Ink Widget Renderer Component - Routes to widgets with full type inference.
 * Receives DispatchField (UnifiedField + value) and switches on field.type.
 */
export function InkWidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
}: InkWidgetRendererProps<TEndpoint>): JSX.Element {
  return renderWidget({
    fieldName: fieldName as Path<TEndpoint["types"]["RequestOutput"]>,
    field,
  });
}

/**
 * Per-case cast: after switch narrowing on field.type, recover the precise
 * BaseWidgetFieldProps<SpecificConfig> for each widget. DispatchField uses
 * WidgetData for value; individual widgets expect schema-inferred value types.
 * Safe: switch discriminant guarantees the narrowed config matches the target widget.
 */
function asField<T>(
  field: DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >,
): T {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- dispatch boundary: conditional types don't resolve against generic union members
  return field as unknown as T;
}

/**
 * Props-level dispatch cast for union-InkWidgetProps widgets.
 * `{ field: A | B }` is not assignable to `{ field: A } | { field: B }` —
 * must cast the entire props object so React resolves the union variant.
 */
function asWidgetProps<TEndpoint extends CreateApiEndpointAny, T>(
  fieldName: Path<TEndpoint["types"]["RequestOutput"]>,
  field: DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >,
): T {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- union-props boundary: { field: A | B } not assignable to { field: A } | { field: B }
  return { fieldName, field } as unknown as T;
}

/**
 * Render helper - switches on field.type for discriminated union narrowing.
 * Each case receives the narrowed field type with value inferred from schema.
 */
function renderWidget<TEndpoint extends CreateApiEndpointAny>(props: {
  fieldName: Path<TEndpoint["types"]["RequestOutput"]>;
  field: DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >;
}): JSX.Element {
  const { fieldName, field } = props;

  switch (field.type) {
    // === CONTAINER WIDGETS ===
    case WidgetType.CONTAINER:
      return (
        <ContainerWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof ContainerWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.SECTION:
      return (
        <SectionWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof SectionWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.SEPARATOR:
      return (
        <SeparatorWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof SeparatorWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.CODE_OUTPUT:
      return (
        <CodeOutputWidgetInk
          {...asWidgetProps<
            TEndpoint,
            Parameters<typeof CodeOutputWidgetInk>[0]
          >(fieldName, field)}
        />
      );

    // === DATA DISPLAY WIDGETS ===
    case WidgetType.DATA_TABLE:
      return (
        <DataTableWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof DataTableWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.DATA_CARDS:
      return (
        <DataCardsWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof DataCardsWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.DATA_GRID:
      return (
        <DataGridWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof DataGridWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.DATA_LIST:
      return (
        <DataListWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof DataListWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.GROUPED_LIST:
      return (
        <GroupedListWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof GroupedListWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.CODE_QUALITY_LIST:
      return (
        <CodeQualityListWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof CodeQualityListWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.CODE_QUALITY_SUMMARY:
      return (
        <CodeQualitySummaryWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof CodeQualitySummaryWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.CODE_QUALITY_FILES:
      return (
        <CodeQualityFilesWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof CodeQualityFilesWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.CREDIT_TRANSACTION_CARD:
      return (
        <CreditTransactionCardWidgetInk
          {...asWidgetProps<
            TEndpoint,
            Parameters<typeof CreditTransactionCardWidgetInk>[0]
          >(fieldName, field)}
        />
      );
    case WidgetType.CREDIT_TRANSACTION_LIST:
      return (
        <CreditTransactionListWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof CreditTransactionListWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.PAGINATION:
      return (
        <PaginationWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof PaginationWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.KEY_VALUE:
      return (
        <KeyValueWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof KeyValueWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    // === DISPLAY-ONLY WIDGETS ===
    case WidgetType.TEXT:
      return (
        <TextWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof TextWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.TITLE:
      return (
        <TitleWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof TitleWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.DESCRIPTION:
      return (
        <DescriptionWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof DescriptionWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.METADATA:
      return (
        <MetadataWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof MetadataWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.BADGE:
      return (
        <BadgeWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof BadgeWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.ICON:
      return (
        <IconWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof IconWidgetInk>[0]["field"]>(field)}
        />
      );
    case WidgetType.MARKDOWN:
      return (
        <MarkdownWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof MarkdownWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.LINK:
      return (
        <LinkWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof LinkWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.LINK_CARD:
      return (
        <LinkCardWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof LinkCardWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.STAT:
      return (
        <StatWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof StatWidgetInk>[0]["field"]>(field)}
        />
      );
    case WidgetType.METRIC_CARD:
      return (
        <MetricCardWidgetInk
          {...asWidgetProps<
            TEndpoint,
            Parameters<typeof MetricCardWidgetInk>[0]
          >(fieldName, field)}
        />
      );
    case WidgetType.CHART:
      return (
        <ChartWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof ChartWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.STATUS_INDICATOR:
      return (
        <StatusIndicatorWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof StatusIndicatorWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.ALERT:
      return (
        <AlertWidgetInk
          {...asWidgetProps<TEndpoint, Parameters<typeof AlertWidgetInk>[0]>(
            fieldName,
            field,
          )}
        />
      );
    case WidgetType.PASSWORD_STRENGTH:
      return (
        <PasswordStrengthWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof PasswordStrengthWidgetInk>[0]["field"]
          >(field)}
        />
      );

    // === INTERACTIVE WIDGETS ===
    case WidgetType.BUTTON:
      return (
        <ButtonWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof ButtonWidgetInk>[0]["field"]>(field)}
        />
      );
    case WidgetType.NAVIGATE_BUTTON:
      return (
        <NavigateButtonWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof NavigateButtonWidgetInk>[0]["field"]
          >(field)}
        />
      );
    case WidgetType.SUBMIT_BUTTON:
      return (
        <SubmitButtonWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof SubmitButtonWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );
    case WidgetType.FORM_ALERT:
      return (
        <FormAlertWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof FormAlertWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    // === CONTENT WIDGETS (continued) ===
    case WidgetType.MARKDOWN_EDITOR:
      return (
        <MarkdownEditorWidgetInk
          fieldName={fieldName}
          field={asField<
            Parameters<typeof MarkdownEditorWidgetInk>[0]["field"]
          >(field)}
        />
      );

    case WidgetType.ACCORDION:
      return (
        <AccordionWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof AccordionWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    case WidgetType.TABS:
      return (
        <TabsWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof TabsWidgetInk>[0]["field"]>(field)}
        />
      );

    case WidgetType.LOADING:
      return (
        <LoadingWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof LoadingWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    case WidgetType.EMPTY_STATE:
      return (
        <EmptyStateWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof EmptyStateWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    case WidgetType.AVATAR:
      return (
        <AvatarWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof AvatarWidgetInk>[0]["field"]>(field)}
        />
      );

    case WidgetType.DRAG_HANDLE:
      return (
        <DragHandleWidgetInk
          fieldName={fieldName}
          field={asField<Parameters<typeof DragHandleWidgetInk>[0]["field"]>(
            field,
          )}
        />
      );

    // === FORM WIDGETS ===
    case WidgetType.FORM_FIELD: {
      switch (field.fieldType) {
        case FieldDataType.TEXT:
          return (
            <TextFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof TextFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.EMAIL:
          return (
            <EmailFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof EmailFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.TEL:
          return (
            <PhoneFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof PhoneFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.URL:
          return (
            <UrlFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof UrlFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.PASSWORD:
          return (
            <PasswordFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof PasswordFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.UUID:
          return (
            <UuidFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof UuidFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.TEXTAREA:
          return (
            <TextareaFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof TextareaFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        case FieldDataType.NUMBER:
          return (
            <NumberFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof NumberFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.INT:
          return (
            <IntFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof IntFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );

        case FieldDataType.BOOLEAN:
          return (
            <BooleanFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof BooleanFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        case FieldDataType.DATE:
          return (
            <DateFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof DateFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.DATETIME:
          return (
            <DateTimeFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof DateTimeFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.TIME:
          return (
            <TimeFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof TimeFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.DATE_RANGE:
          return (
            <DateRangeFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof DateRangeFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.TIME_RANGE:
          return (
            <TimeRangeFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof TimeRangeFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.TIMEZONE:
          return (
            <TimezoneFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof TimezoneFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        case FieldDataType.SELECT:
          return (
            <SelectFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof SelectFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.MULTISELECT:
          return (
            <MultiSelectFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof MultiSelectFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.CURRENCY_SELECT:
          return (
            <CurrencySelectFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof CurrencySelectFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.LANGUAGE_SELECT:
          return (
            <LanguageSelectFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof LanguageSelectFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.COUNTRY_SELECT:
          return (
            <CountrySelectFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof CountrySelectFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        case FieldDataType.FILE:
          return (
            <FileFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof FileFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.JSON:
          return (
            <JsonFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof JsonFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.COLOR:
          return (
            <ColorFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof ColorFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.ICON:
          return (
            <IconFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof IconFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );

        case FieldDataType.TAGS:
          return (
            <TagsFieldWidgetInk
              fieldName={fieldName}
              field={asField<Parameters<typeof TagsFieldWidgetInk>[0]["field"]>(
                field,
              )}
            />
          );
        case FieldDataType.TEXT_ARRAY:
          return (
            <TextArrayFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof TextArrayFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.FILTER_PILLS:
          return (
            <FilterPillsFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof FilterPillsFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        case FieldDataType.SLIDER:
          return (
            <SliderFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof SliderFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.RANGE_SLIDER:
          return (
            <RangeSliderFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof RangeSliderFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );
        case FieldDataType.MODEL_SELECTION:
          return (
            <ModelSelectionFieldWidgetInk
              fieldName={fieldName}
              field={asField<
                Parameters<typeof ModelSelectionFieldWidgetInk>[0]["field"]
              >(field)}
            />
          );

        default:
          const _exhaustiveCheck: never = field;
          return _exhaustiveCheck;
      }
    }

    default:
      // oxlint-disable-next-line no-unused-vars
      const _exhaustiveCheck: never = field;
      return <></>;
  }
}
