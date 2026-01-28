/**
 * Ink Widget Renderer
 *
 * Routes to appropriate Ink widget components based on widget type.
 * Mirrors React WidgetRenderer architecture for consistency.
 * All widgets directly imported for CLI (no lazy loading).
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  InkWidgetContext,
  InkWidgetRendererProps,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
// Container widgets
import { CodeOutputWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/cli";
import { ContainerWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/cli";
import { CreditTransactionCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-card/cli";
import { CreditTransactionListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-list/cli";
import { DataCardsWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/cli";
import { DataListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-list/cli";
import { DataTableWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-table/cli";
import { GroupedListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/grouped-list/cli";
import { LinkCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/link-card/cli";
import { MetricCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/metric-card/cli";
import { PaginationWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/cli";
import { SectionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/section/cli";
// Display-only widgets
import { AlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/cli";
import { BadgeWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/cli";
import { ChartWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/cli";
import { CodeQualityFilesWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/cli";
import { CodeQualityListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/cli";
import { CodeQualitySummaryWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/cli";
import { DescriptionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/cli";
import { IconWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/cli";
import { KeyValueWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/cli";
import { LinkWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/cli";
import { MarkdownWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/cli";
import { MetadataWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/cli";
import { ModelDisplayWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/model-display/cli";
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
import { FormAlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/cli";
import { NavigateButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/cli";
import { SubmitButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/cli";

/**
 * Ink Widget Renderer Component - Routes to widgets with full type inference
 * Receives fields without values and augments them internally
 */
export function InkWidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
  context,
}: InkWidgetRendererProps<
  TEndpoint,
  UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
>): JSX.Element {
  // field must have type property - it's required on all UnifiedField types
  if (!("type" in field)) {
    return (
      <Box>
        <Text color="red">Field missing type property</Text>
      </Box>
    );
  }
  return renderWidget(field.type, {
    fieldName,
    field,
    context,
  });
}

/**
 * Render helper - uses switch for type-safe widget selection with exhaustive check
 * All widgets directly imported - no lazy loading for CLI
 * Augments field with value property before passing to widgets
 */
function renderWidget<
  TEndpoint extends CreateApiEndpointAny,
  const TKey extends string,
  TSchema extends z.ZodTypeAny | never,
>(
  widgetType: WidgetType,
  props: {
    fieldName: string;
    field: UnifiedField<TKey, TSchema, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    context: InkWidgetContext<TEndpoint>;
  },
): JSX.Element {
  // Direct widget rendering with exhaustive type checking - no Suspense for CLI
  const propsWithValue = {
    fieldName: props.fieldName,
    field: props.field,
    context: props.context,
  };

  switch (widgetType) {
    // === CONTAINER WIDGETS ===
    case WidgetType.CONTAINER:
      return <ContainerWidgetInk {...propsWithValue} />;
    case WidgetType.SECTION:
      return <SectionWidgetInk {...propsWithValue} />;
    case WidgetType.SEPARATOR:
      return <SeparatorWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_OUTPUT:
      return <CodeOutputWidgetInk {...propsWithValue} />;

    // === DATA DISPLAY WIDGETS ===
    case WidgetType.DATA_TABLE:
      return <DataTableWidgetInk {...propsWithValue} />;
    case WidgetType.DATA_CARDS:
      return <DataCardsWidgetInk {...propsWithValue} />;
    case WidgetType.DATA_LIST:
      return <DataListWidgetInk {...propsWithValue} />;
    case WidgetType.GROUPED_LIST:
      return <GroupedListWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_LIST:
      return <CodeQualityListWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_SUMMARY:
      return <CodeQualitySummaryWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_FILES:
      return <CodeQualityFilesWidgetInk {...propsWithValue} />;
    case WidgetType.CREDIT_TRANSACTION_CARD:
      return <CreditTransactionCardWidgetInk {...propsWithValue} />;
    case WidgetType.CREDIT_TRANSACTION_LIST:
      return <CreditTransactionListWidgetInk {...propsWithValue} />;
    case WidgetType.PAGINATION:
      return <PaginationWidgetInk {...propsWithValue} />;
    case WidgetType.KEY_VALUE:
      return <KeyValueWidgetInk {...propsWithValue} />;

    // === DISPLAY-ONLY WIDGETS ===
    case WidgetType.TEXT:
      return <TextWidgetInk {...propsWithValue} />;
    case WidgetType.TITLE:
      return <TitleWidgetInk {...propsWithValue} />;
    case WidgetType.DESCRIPTION:
      return <DescriptionWidgetInk {...propsWithValue} />;
    case WidgetType.METADATA:
      return <MetadataWidgetInk {...propsWithValue} />;
    case WidgetType.BADGE:
      return <BadgeWidgetInk {...propsWithValue} />;
    case WidgetType.ICON:
      return <IconWidgetInk {...propsWithValue} />;
    case WidgetType.MARKDOWN:
      return <MarkdownWidgetInk {...propsWithValue} />;
    case WidgetType.LINK:
      return <LinkWidgetInk {...propsWithValue} />;
    case WidgetType.LINK_CARD:
      return <LinkCardWidgetInk {...propsWithValue} />;
    case WidgetType.MODEL_DISPLAY:
      return <ModelDisplayWidgetInk {...propsWithValue} />;
    case WidgetType.STAT:
      return <StatWidgetInk {...propsWithValue} />;
    case WidgetType.METRIC_CARD:
      return <MetricCardWidgetInk {...propsWithValue} />;
    case WidgetType.CHART:
      return <ChartWidgetInk {...propsWithValue} />;
    case WidgetType.STATUS_INDICATOR:
      return <StatusIndicatorWidgetInk {...propsWithValue} />;
    case WidgetType.ALERT:
      return <AlertWidgetInk {...propsWithValue} />;
    case WidgetType.PASSWORD_STRENGTH:
      return <PasswordStrengthWidgetInk {...propsWithValue} />;

    // === INTERACTIVE WIDGETS ===
    case WidgetType.BUTTON:
      return <ButtonWidgetInk {...propsWithValue} />;
    case WidgetType.NAVIGATE_BUTTON:
      return <NavigateButtonWidgetInk {...propsWithValue} />;
    case WidgetType.SUBMIT_BUTTON:
      return <SubmitButtonWidgetInk {...propsWithValue} />;
    case WidgetType.FORM_ALERT:
      return <FormAlertWidgetInk {...propsWithValue} />;

    // === FORM WIDGETS ===
    case WidgetType.FORM_FIELD: {
      // Dispatch to specific field widget based on fieldType
      const fieldType: FieldDataType = propsWithValue.field.fieldType;

      switch (fieldType) {
        // Basic text input fields
        case FieldDataType.TEXT:
          return <TextFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.EMAIL:
          return <EmailFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TEL:
          return <PhoneFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.URL:
          return <UrlFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.PASSWORD:
          return <PasswordFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.UUID:
          return <UuidFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TEXTAREA:
          return <TextareaFieldWidgetInk {...propsWithValue} />;

        // Numeric input fields
        case FieldDataType.NUMBER:
          return <NumberFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.INT:
          return <IntFieldWidgetInk {...propsWithValue} />;

        // Boolean input
        case FieldDataType.BOOLEAN:
          return <BooleanFieldWidgetInk {...propsWithValue} />;

        // Date and time fields
        case FieldDataType.DATE:
          return <DateFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.DATETIME:
          return <DateTimeFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TIME:
          return <TimeFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.DATE_RANGE:
          return <DateRangeFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TIME_RANGE:
          return <TimeRangeFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TIMEZONE:
          return <TimezoneFieldWidgetInk {...propsWithValue} />;

        // Selection fields
        case FieldDataType.SELECT:
          return <SelectFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.MULTISELECT:
          return <MultiSelectFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.CURRENCY_SELECT:
          return <CurrencySelectFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.LANGUAGE_SELECT:
          return <LanguageSelectFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.COUNTRY_SELECT:
          return <CountrySelectFieldWidgetInk {...propsWithValue} />;

        // Special input fields
        case FieldDataType.FILE:
          return <FileFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.JSON:
          return <JsonFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.COLOR:
          return <ColorFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.ICON:
          return <IconFieldWidgetInk {...propsWithValue} />;

        // Array and list fields
        case FieldDataType.TAGS:
          return <TagsFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.TEXT_ARRAY:
          return <TextArrayFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.FILTER_PILLS:
          return <FilterPillsFieldWidgetInk {...propsWithValue} />;

        // Range and slider fields
        case FieldDataType.SLIDER:
          return <SliderFieldWidgetInk {...propsWithValue} />;
        case FieldDataType.RANGE_SLIDER:
          return <RangeSliderFieldWidgetInk {...propsWithValue} />;

        // Complex data types (not form inputs, display only)
        case FieldDataType.ARRAY:
        case FieldDataType.OBJECT:
          return (
            <Box>
              <Text dimColor>
                Form field type &quot;{String(fieldType)}&quot; is for display
                only, not input
              </Text>
            </Box>
          );

        // Display-only types (these should use display widgets, not form fields)
        case FieldDataType.BADGE:
        case FieldDataType.AVATAR:
        case FieldDataType.LINK:
        case FieldDataType.CURRENCY:
        case FieldDataType.PERCENTAGE:
        case FieldDataType.STATUS:
        case FieldDataType.PROGRESS:
        case FieldDataType.RATING:
        case FieldDataType.IMAGE:
        case FieldDataType.CODE:
        case FieldDataType.MARKDOWN:
          return (
            <Box>
              <Text dimColor>
                Field type &quot;{String(fieldType)}&quot; should use display
                widgets, not form fields
              </Text>
            </Box>
          );

        default: {
          // Exhaustive check
          const _exhaustiveCheck: never = fieldType;
          return (
            <Box>
              <Text color="red">
                Unknown field type: {String(_exhaustiveCheck)}
              </Text>
            </Box>
          );
        }
      }
    }

    // === CONTENT WIDGETS (continued) ===
    case WidgetType.MARKDOWN_EDITOR:
      return <MarkdownEditorWidgetInk {...propsWithValue} />;

    // === NOT YET IMPLEMENTED (fallback to text) ===
    case WidgetType.FORM_GROUP:
    case WidgetType.FORM_SECTION:
    case WidgetType.DATA_CARD:
    case WidgetType.DATA_GRID:
    case WidgetType.METADATA_CARD:
    case WidgetType.ACCORDION:
    case WidgetType.TABS:
    case WidgetType.AVATAR:
    case WidgetType.FILE_PATH:
    case WidgetType.LINE_NUMBER:
    case WidgetType.COLUMN_NUMBER:
    case WidgetType.CODE_RULE:
    case WidgetType.SEVERITY_BADGE:
    case WidgetType.MESSAGE_TEXT:
    case WidgetType.ISSUE_CARD:
    case WidgetType.BUTTON_GROUP:
    case WidgetType.PROGRESS:
    case WidgetType.LOADING:
    case WidgetType.ERROR:
    case WidgetType.EMPTY_STATE:
    case WidgetType.CUSTOM:
      return (
        <Box>
          <Text dimColor>
            Widget type &quot;{widgetType}&quot; not yet implemented in CLI
          </Text>
        </Box>
      );

    default: {
      // Exhaustive check - TypeScript will error if we miss a WidgetType
      const _exhaustiveCheck: never = widgetType;
      return (
        <Box>
          <Text color="red">
            Unknown widget type: {String(_exhaustiveCheck)}
          </Text>
        </Box>
      );
    }
  }
}
