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
import AlertWidget from "../../widgets/display-only/alert/react";
import BadgeWidget from "../../widgets/display-only/badge/react";
import IconWidget from "../../widgets/display-only/icon/react";
import SeparatorWidget from "../../widgets/display-only/separator/react";
import TextWidget from "../../widgets/display-only/text/react";
import TitleWidget from "../../widgets/display-only/title/react";
import BooleanFieldWidget from "../../widgets/form-fields/boolean-field/react";
import IconFieldWidget from "../../widgets/form-fields/icon-field/react";
import SelectFieldWidget from "../../widgets/form-fields/select-field/react";
import TextFieldWidget from "../../widgets/form-fields/text-field/react";
import TextareaFieldWidget from "../../widgets/form-fields/textarea-field/react";
import UuidFieldWidget from "../../widgets/form-fields/uuid-field/react";
import ButtonWidget from "../../widgets/interactive/button/react";
import FormAlertWidget from "../../widgets/interactive/form-alert/react";
import NavigateButtonWidget from "../../widgets/interactive/navigate-button/react";
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
  FieldUsageConfig,
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
    FieldUsageConfig,
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
      return <TextWidget {...props} />;
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
      return <BadgeWidget {...props} />;
    case WidgetType.ICON:
      return <IconWidget {...props} />;
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
      return <TitleWidget {...props} />;
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
    case WidgetType.PAGINATION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/react"),
        props,
        "widget-pagination",
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
    case WidgetType.CUSTOM_WIDGET: {
      // Get render function from field
      const customField = props.field as typeof props.field & {
        render?: React.ComponentType<
          ReactWidgetProps<TEndpoint, FieldUsageConfig, typeof props.field>
        >;
      };
      const CustomRender = customField.render;

      if (!CustomRender) {
        return <></>;
      }

      // Pass the entire props (fieldName + field) to custom render
      return <CustomRender {...props} />;
    }
    case WidgetType.CONTAINER:
      return (
        <ContainerWidget
          {...(props as ReactWidgetProps<
            TEndpoint,
            FieldUsageConfig,
            Parameters<typeof ContainerWidget>[0]["field"]
          >)}
        />
      );
    case WidgetType.SEPARATOR:
      return <SeparatorWidget {...props} />;
    case WidgetType.BUTTON:
      return <ButtonWidget {...props} />;
    case WidgetType.NAVIGATE_BUTTON:
      return <NavigateButtonWidget {...props} />;
    case WidgetType.SUBMIT_BUTTON:
      return <SubmitButtonWidget {...props} />;
    case WidgetType.ALERT:
      return <AlertWidget {...props} />;
    case WidgetType.FORM_ALERT:
      return <FormAlertWidget {...props} />;
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
          return <BooleanFieldWidget {...props} />;
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
          return <IconFieldWidget {...props} />;
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

        case FieldDataType.SELECT:
          return <SelectFieldWidget {...props} />;
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
          return <TextareaFieldWidget {...props} />;
        case FieldDataType.TEXT_ARRAY:
          return createWidget(
            () =>
              import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-array-field/react"),
            props,
            "field-text-array",
          );
        case FieldDataType.TEXT:
          return <TextFieldWidget {...props} />;
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
          return <UuidFieldWidget {...props} />;

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
      FieldUsageConfig,
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
        FieldUsageConfig,
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
    FieldUsageConfig,
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
    FieldUsageConfig,
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
