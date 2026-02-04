"use client";

import React, { type JSX, Suspense } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { ReactWidgetProps } from "../../widgets/_shared/react-types";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "../../widgets/_shared/types";
import { useWidgetLocale } from "../../widgets/_shared/use-widget-context";
import ContainerWidget from "../../widgets/containers/container/react";
import SubmitButtonWidget from "../../widgets/interactive/submit-button/react";
import { WidgetErrorBoundary } from "./ErrorBoundary";

/**
 * Widget Renderer Component - Routes to appropriate widget with full type inference.
 * Receives DispatchField (UnifiedField + value) and switches on field.type.
 */
export function WidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
}: ReactWidgetProps<
  TEndpoint,
  DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>): JSX.Element {
  const locale = useWidgetLocale();

  return (
    <WidgetErrorBoundary locale={locale!}>
      {renderWidget({
        fieldName,
        field,
      })}
    </WidgetErrorBoundary>
  );
}

/**
 * Render helper - switches on field.type for discriminated union narrowing.
 * className is passed separately and widgets handle getClassName internally.
 */
function renderWidget<TEndpoint extends CreateApiEndpointAny>(
  props: ReactWidgetProps<
    TEndpoint,
    DispatchField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >,
): JSX.Element {
  // Switch statement ensures proper type checking for each widget
  // Use props directly (not props) to preserve narrowing
  switch (props.field.type) {
    case WidgetType.TEXT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react"),
        props,
        "widget-text",
      );
    case WidgetType.DESCRIPTION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/react"),
        props,
        "widget-description",
      );
    case WidgetType.METADATA:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/react"),
        props,
        "widget-metadata",
      );
    case WidgetType.KEY_VALUE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/react"),
        props,
        "widget-key-value",
      );
    case WidgetType.BADGE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react"),
        props,
        "widget-badge",
      );
    case WidgetType.ICON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react"),
        props,
        "widget-icon",
      );
    case WidgetType.DRAG_HANDLE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/drag-handle/react"),
        props,
        "widget-drag-handle",
      );
    case WidgetType.MARKDOWN:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/react"),
        props,
        "widget-markdown",
      );
    case WidgetType.MARKDOWN_EDITOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/markdown-editor/react"),
        props,
        "widget-markdown-editor",
      );
    case WidgetType.TITLE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/title/react"),
        props,
        "widget-title",
      );
    case WidgetType.LINK:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/react"),
        props,
        "widget-link",
      );
    case WidgetType.CODE_OUTPUT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/react"),
        props,
        "widget-code-output",
      );
    case WidgetType.CODE_QUALITY_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/react"),
        props,
        "widget-code-quality-list",
      );
    case WidgetType.CREDIT_TRANSACTION_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-card/react"),
        props,
        "widget-credit-transaction-card",
      );
    case WidgetType.CREDIT_TRANSACTION_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-list/react"),
        props,
        "widget-credit-transaction-list",
      );
    case WidgetType.PAGINATION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/react"),
        props,
        "widget-pagination",
      );

    case WidgetType.DATA_TABLE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-table/react"),
        props,
        "widget-data-table",
      );
    case WidgetType.DATA_CARDS:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/react"),
        props,
        "widget-data-cards",
      );
    case WidgetType.DATA_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-list/react"),
        props,
        "widget-data-list",
      );
    case WidgetType.GROUPED_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/grouped-list/react"),
        props,
        "widget-grouped-list",
      );
    case WidgetType.METRIC_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/metric-card/react"),
        props,
        "widget-metric-card",
      );
    case WidgetType.STAT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/stat/react"),
        props,
        "widget-stat",
      );
    case WidgetType.CHART:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/react"),
        props,
        "widget-chart",
      );
    case WidgetType.CONTAINER:
      return (
        <ContainerWidget
          {...(props as ReactWidgetProps<
            TEndpoint,
            Parameters<typeof ContainerWidget>[0]["field"]
          >)}
        />
      );
    case WidgetType.SECTION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/section/react"),
        props,
        "widget-section",
      );
    case WidgetType.SEPARATOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react"),
        props,
        "widget-separator",
      );
    case WidgetType.LINK_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/link-card/react"),
        props,
        "widget-link-card",
      );
    case WidgetType.BUTTON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/button/react"),
        props,
        "widget-button",
      );
    case WidgetType.NAVIGATE_BUTTON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react"),
        props,
        "widget-navigate-button",
      );
    case WidgetType.SUBMIT_BUTTON:
      return (
        <SubmitButtonWidget
          {...(props as ReactWidgetProps<
            TEndpoint,
            Parameters<typeof SubmitButtonWidget>[0]["field"]
          >)}
        />
      );
    case WidgetType.ALERT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react"),
        props,
        "widget-alert",
      );
    case WidgetType.FORM_ALERT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react"),
        props,
        "widget-form-alert",
      );
    case WidgetType.PASSWORD_STRENGTH:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/password-strength/react"),
        props,
        "widget-password-strength",
      );
    case WidgetType.STATUS_INDICATOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/status-indicator/react"),
        props,
        "widget-status-indicator",
      );
    case WidgetType.EMPTY_STATE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/empty-state/react"),
        props,
        "widget-empty-state",
      );
    case WidgetType.CODE_QUALITY_FILES:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/react"),
        props,
        "widget-code-quality-files",
      );
    case WidgetType.CODE_QUALITY_SUMMARY:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/react"),
        props,
        "widget-code-quality-summary",
      );
    case WidgetType.AVATAR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/avatar/react"),
        props,
        "widget-avatar",
      );
    case WidgetType.TABS:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/tabs/react"),
        props,
        "widget-tabs",
      );
    case WidgetType.ACCORDION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/accordion/react"),
        props,
        "widget-accordion",
      );
    case WidgetType.LOADING:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/loading/react"),
        props,
        "widget-loading",
      );

    case WidgetType.FORM_FIELD: {
      // TypeScript cannot narrow fieldType through the large FormFieldWidgetConfig union
      // Extract it and assert the type since we know all FORM_FIELD widgets have this property
      const fieldType = props.field.fieldType as FieldDataType;

      switch (fieldType) {
        case FieldDataType.BOOLEAN:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react"),
            props,
            "field-boolean",
          );
        case FieldDataType.COLOR:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/color-field/react"),
            props,
            "field-color",
          );
        case FieldDataType.COUNTRY_SELECT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/country-select-field/react"),
            props,
            "field-country-select",
          );
        case FieldDataType.CURRENCY_SELECT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/currency-select-field/react"),
            props,
            "field-currency-select",
          );
        case FieldDataType.DATE:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/react"),
            props,
            "field-date",
          );
        case FieldDataType.DATE_RANGE:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-range-field/react"),
            props,
            "field-date-range",
          );
        case FieldDataType.DATETIME:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/datetime-field/react"),
            props,
            "field-datetime",
          );
        case FieldDataType.EMAIL:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react"),
            props,
            "field-email",
          );
        case FieldDataType.FILE:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/file-field/react"),
            props,
            "field-file",
          );
        case FieldDataType.FILTER_PILLS:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/filter-pills-field/react"),
            props,
            "field-filter-pills",
          );
        case FieldDataType.ICON:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react"),
            props,
            "field-icon",
          );
        case FieldDataType.INT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/int-field/react"),
            props,
            "field-int",
          );
        case FieldDataType.JSON:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/json-field/react"),
            props,
            "field-json",
          );
        case FieldDataType.LANGUAGE_SELECT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/language-select-field/react"),
            props,
            "field-language-select",
          );
        case FieldDataType.MULTISELECT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react"),
            props,
            "field-multiselect",
          );
        case FieldDataType.NUMBER:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react"),
            props,
            "field-number",
          );
        case FieldDataType.PASSWORD:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react"),
            props,
            "field-password",
          );
        case FieldDataType.TEL:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/phone-field/react"),
            props,
            "field-tel",
          );
        case FieldDataType.RANGE_SLIDER:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/range-slider-field/react"),
            props,
            "field-range-slider",
          );
        case FieldDataType.MODEL_SELECTION:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/react"),
            props,
            "field-model-selection",
          );
        case FieldDataType.SELECT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react"),
            props,
            "field-select",
          );
        case FieldDataType.SLIDER:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/slider-field/react"),
            props,
            "field-slider",
          );
        case FieldDataType.TAGS:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/tags-field/react"),
            props,
            "field-tags",
          );
        case FieldDataType.TEXTAREA:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react"),
            props,
            "field-textarea",
          );
        case FieldDataType.TEXT_ARRAY:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-array-field/react"),
            props,
            "field-text-array",
          );
        case FieldDataType.TEXT:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react"),
            props,
            "field-text",
          );
        case FieldDataType.TIME:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-field/react"),
            props,
            "field-time",
          );
        case FieldDataType.TIME_RANGE:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-range-field/react"),
            props,
            "field-time-range",
          );
        case FieldDataType.TIMEZONE:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/timezone-field/react"),
            props,
            "field-timezone",
          );
        case FieldDataType.URL:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/react"),
            props,
            "field-url",
          );
        case FieldDataType.UUID:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/uuid-field/react"),
            props,
            "field-uuid",
          );

        default: {
          // oxlint-disable-next-line no-unused-vars
          const _exhaustiveCheck: never = fieldType;
          return <></>;
        }
      }
    }

    default: {
      // oxlint-disable-next-line no-unused-vars
      const _exhaustiveCheck: never = props.field;
      return <></>;
    }
  }
}

/**
 * Global cache for lazy-loaded widget components.
 * Ensures that once a widget module is loaded, it stays in memory
 * and is not re-imported on every render.
 */
const lazyComponentCache = new Map<
  string,
  React.ComponentType<
    ReactWidgetProps<
      CreateApiEndpointAny,
      DispatchField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
      >
    >
  >
>();

/**
 * Get or create a lazy-loaded widget component.
 * Uses a cache to prevent re-importing modules on every render.
 */
function getLazyWidget(
  importFn: () => Promise<{
    default: React.ComponentType<
      ReactWidgetProps<
        CreateApiEndpointAny,
        DispatchField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
        >
      >
    >;
  }>,
  cacheKey: string,
): React.ComponentType<
  ReactWidgetProps<
    CreateApiEndpointAny,
    DispatchField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >
> {
  if (!lazyComponentCache.has(cacheKey)) {
    lazyComponentCache.set(cacheKey, React.lazy(importFn));
  }
  return lazyComponentCache.get(cacheKey)!;
}

/**
 * Dispatch-boundary cast for lazy-loaded widgets.
 * After switch narrowing, TS can't prove the narrowed config matches the target widget's
 * expected props because conditional types don't resolve against generic union members.
 * Safe: switch discriminant guarantees the narrowed config matches the target widget.
 */
function createWidget<TEndpoint extends CreateApiEndpointAny>(
  // oxlint-disable-next-line typescript/no-explicit-any
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  props: ReactWidgetProps<
    TEndpoint,
    DispatchField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >,
  cacheKey: string,
): JSX.Element {
  const LazyWidget = getLazyWidget(importFn, cacheKey);

  return (
    <Suspense>
      <LazyWidget fieldName={props.fieldName} field={props.field} />
    </Suspense>
  );
}

WidgetRenderer.displayName = "WidgetRenderer";
