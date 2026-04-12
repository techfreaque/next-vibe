"use client";

import React, { Suspense, type JSX } from "react";
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
import { resolvedCache } from "./widget-preloader";

/**
 * Widget Renderer Component - Routes to appropriate widget with full type inference.
 * Receives DispatchField (UnifiedField + value) and switches on field.type.
 */
export function WidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
  inlineButtonInfo,
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
        inlineButtonInfo,
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
    case WidgetType.TEXT: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const TextW = TextWidget as React.ComponentType<any>;
      return (
        <TextW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.DESCRIPTION:
      return createWidget("description", props);
    case WidgetType.METADATA:
      return createWidget("metadata", props);
    case WidgetType.KEY_VALUE:
      return createWidget("key-value", props);
    case WidgetType.BADGE: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const BadgeW = BadgeWidget as React.ComponentType<any>;
      return (
        <BadgeW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.ICON: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const IconW = IconWidget as React.ComponentType<any>;
      return (
        <IconW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.MARKDOWN:
      return createWidget("markdown", props);
    case WidgetType.MARKDOWN_EDITOR:
      return createWidget("markdown-editor", props);
    case WidgetType.TITLE: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const TitleW = TitleWidget as React.ComponentType<any>;
      return (
        <TitleW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.LINK:
      return createWidget("link", props);
    case WidgetType.CODE_OUTPUT:
      return createWidget("code-output", props);
    case WidgetType.CODE_QUALITY_LIST:
      return createWidget("code-quality-list", props);
    case WidgetType.PAGINATION:
      return createWidget("pagination", props);
    case WidgetType.STAT:
      return createWidget("stat", props);
    case WidgetType.CHART:
      return createWidget("chart", props);
    case WidgetType.CUSTOM_WIDGET: {
      // Get render function from field
      const customField = props.field as typeof props.field & {
        // oxlint-disable-next-line typescript/no-explicit-any
        render?: React.ComponentType<any>;
      };
      const CustomRender = customField.render;

      if (!CustomRender) {
        return <></>;
      }

      // Custom widgets may be React.lazy - wrap in Suspense scoped to this widget only.
      return (
        <Suspense fallback={null}>
          <CustomRender
            fieldName={props.fieldName}
            field={props.field}
            inlineButtonInfo={props.inlineButtonInfo}
          />
        </Suspense>
      );
    }
    case WidgetType.CONTAINER: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const ContainerW = ContainerWidget as React.ComponentType<any>;
      return (
        <ContainerW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.SEPARATOR: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const SeparatorW = SeparatorWidget as React.ComponentType<any>;
      return (
        <SeparatorW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.BUTTON: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const ButtonW = ButtonWidget as React.ComponentType<any>;
      return (
        <ButtonW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.NAVIGATE_BUTTON: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const NavigateButtonW = NavigateButtonWidget as React.ComponentType<any>;
      return (
        <NavigateButtonW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.SUBMIT_BUTTON: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const SubmitButtonW = SubmitButtonWidget as React.ComponentType<any>;
      return (
        <SubmitButtonW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.ALERT: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const AlertW = AlertWidget as React.ComponentType<any>;
      return (
        <AlertW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.FORM_ALERT: {
      // Dispatch-boundary cast: switch discriminant guarantees type safety.
      // oxlint-disable-next-line typescript/no-explicit-any
      const FormAlertW = FormAlertWidget as React.ComponentType<any>;
      return (
        <FormAlertW
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      );
    }
    case WidgetType.STATUS_INDICATOR:
      return createWidget("status-indicator", props);
    case WidgetType.EMPTY_STATE:
      return createWidget("empty-state", props);
    case WidgetType.CODE_QUALITY_FILES:
      return createWidget("code-quality-files", props);
    case WidgetType.CODE_QUALITY_SUMMARY:
      return createWidget("code-quality-summary", props);
    case WidgetType.AVATAR:
      return createWidget("avatar", props);
    case WidgetType.LOADING:
      return createWidget("loading", props);

    case WidgetType.FORM_FIELD: {
      // TypeScript cannot narrow fieldType through the large FormFieldWidgetConfig union
      // Extract it and assert the type since we know all FORM_FIELD widgets have this property
      const fieldType = props.field.fieldType as FieldDataType;

      switch (fieldType) {
        case FieldDataType.BOOLEAN: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const BooleanW = BooleanFieldWidget as React.ComponentType<any>;
          return (
            <BooleanW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }
        case FieldDataType.COLOR:
          return createWidget("color", props);
        case FieldDataType.COUNTRY_SELECT:
          return createWidget("country-select", props);
        case FieldDataType.CURRENCY_SELECT:
          return createWidget("currency-select", props);
        case FieldDataType.DATE:
          return createWidget("date", props);
        case FieldDataType.DATE_RANGE:
          return createWidget("date-range", props);
        case FieldDataType.DATETIME:
          return createWidget("datetime", props);
        case FieldDataType.EMAIL:
          return createWidget("email", props);
        case FieldDataType.FILE:
          return createWidget("file", props);
        case FieldDataType.FILTER_PILLS:
          return createWidget("filter-pills", props);
        case FieldDataType.ICON: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const IconFieldW = IconFieldWidget as React.ComponentType<any>;
          return (
            <IconFieldW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }
        case FieldDataType.INT:
          return createWidget("int", props);
        case FieldDataType.JSON:
          return createWidget("json", props);
        case FieldDataType.LANGUAGE_SELECT:
          return createWidget("language-select", props);
        case FieldDataType.MULTISELECT:
          return createWidget("multiselect", props);
        case FieldDataType.NUMBER:
          return createWidget("number", props);
        case FieldDataType.PASSWORD:
          return createWidget("password", props);
        case FieldDataType.TEL:
          return createWidget("tel", props);
        case FieldDataType.RANGE_SLIDER:
          return createWidget("range-slider", props);

        case FieldDataType.SELECT: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const SelectW = SelectFieldWidget as React.ComponentType<any>;
          return (
            <SelectW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }
        case FieldDataType.SLIDER:
          return createWidget("slider", props);
        case FieldDataType.TAGS:
          return createWidget("tags", props);
        case FieldDataType.MARKDOWN_TEXTAREA:
          return createWidget("markdown-textarea", props);

        case FieldDataType.TEXTAREA: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const TextareaW = TextareaFieldWidget as React.ComponentType<any>;
          return (
            <TextareaW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }
        case FieldDataType.TEXT_ARRAY:
          return createWidget("text-array", props);
        case FieldDataType.TEXT: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const TextFieldW = TextFieldWidget as React.ComponentType<any>;
          return (
            <TextFieldW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }
        case FieldDataType.TIME:
          return createWidget("time", props);
        case FieldDataType.TIME_RANGE:
          return createWidget("time-range", props);
        case FieldDataType.TIMEZONE:
          return createWidget("timezone", props);
        case FieldDataType.URL:
          return createWidget("url", props);
        case FieldDataType.UUID: {
          // Dispatch-boundary cast: switch discriminant guarantees type safety.
          // oxlint-disable-next-line typescript/no-explicit-any
          const UuidW = UuidFieldWidget as React.ComponentType<any>;
          return (
            <UuidW
              fieldName={props.fieldName}
              field={props.field}
              inlineButtonInfo={props.inlineButtonInfo}
            />
          );
        }

        default:
          return <></>;
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
 * Render a widget from the eager-import cache (lives in widget-preloader.ts,
 * outside "use client" so Vite does not strip it).
 * Renders synchronously if the chunk is resolved - no Suspense, no SSR
 * streaming boundary, no flash.
 */
function createWidget<TEndpoint extends CreateApiEndpointAny>(
  key: string,
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
): JSX.Element {
  // resolvedCache is imported from widget-preloader (no "use client" - not stripped)
  const Widget = resolvedCache.get(key);
  if (!Widget) {
    return <></>;
  }
  return (
    <Widget
      fieldName={props.fieldName}
      field={props.field}
      inlineButtonInfo={props.inlineButtonInfo}
    />
  );
}

WidgetRenderer.displayName = "WidgetRenderer";
