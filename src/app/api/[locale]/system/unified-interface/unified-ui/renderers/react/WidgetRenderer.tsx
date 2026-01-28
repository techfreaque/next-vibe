"use client";

import { cn } from "next-vibe/shared/utils";
import React, { type JSX, Suspense } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type {
  ReactWidgetContext,
  ReactWidgetProps,
} from "../../widgets/_shared/react-types";
import type { FieldUsageConfig } from "../../widgets/_shared/types";
import { WidgetErrorBoundary } from "./ErrorBoundary";

/**
 * Widget Renderer Props - extends ReactWidgetProps with rendering options
 */
export type WidgetRendererProps<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    never
  >,
> = ReactWidgetProps<TEndpoint, TWidgetConfig> & {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Widget Renderer Component - Routes to appropriate widget with full type inference
 */
export function WidgetRenderer<
  TEndpoint extends CreateApiEndpointAny,
  const TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    never
  >,
>({
  fieldName,
  field,
  context,
  className,
  style,
}: WidgetRendererProps<TEndpoint, TWidgetConfig>): JSX.Element {
  const mergedClassName = cn(field.className, className);

  return (
    <WidgetErrorBoundary locale={context.locale}>
      {renderWidget(field.type, {
        fieldName,
        field,
        context,
        className: mergedClassName,
        style,
      })}
    </WidgetErrorBoundary>
  );
}

/**
 * Render helper - preserves schema type for full type inference with switch-based routing
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
    context: ReactWidgetContext<TEndpoint>;
    className?: string;
    style?: React.CSSProperties;
  },
): JSX.Element {
  // Switch statement ensures proper type checking for each widget
  switch (widgetType) {
    case WidgetType.TEXT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react"),
        props,
      );
    case WidgetType.DESCRIPTION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/react"),
        props,
      );
    case WidgetType.METADATA:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/react"),
        props,
      );
    case WidgetType.KEY_VALUE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/react"),
        props,
      );
    case WidgetType.BADGE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react"),
        props,
      );
    case WidgetType.ICON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react"),
        props,
      );
    case WidgetType.MARKDOWN:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/react"),
        props,
      );
    case WidgetType.MARKDOWN_EDITOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/markdown-editor/react"),
        props,
      );
    case WidgetType.TITLE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/title/react"),
        props,
      );
    case WidgetType.FORM_FIELD:
      // TODO: import all form fields
      throw "TODO ERROR IMPLEMENT NOW";
    case WidgetType.LINK:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/react"),
        props,
      );
    case WidgetType.CODE_OUTPUT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/react"),
        props,
      );
    case WidgetType.CODE_QUALITY_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/react"),
        props,
      );
    case WidgetType.CREDIT_TRANSACTION_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-card/react"),
        props,
      );
    case WidgetType.CREDIT_TRANSACTION_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/credit-transaction-list/react"),
        props,
      );
    case WidgetType.PAGINATION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/react"),
        props,
      );
    case WidgetType.MODEL_DISPLAY:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/model-display/react"),
        props,
      );
    case WidgetType.DATA_TABLE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-table/react"),
        props,
      );
    case WidgetType.DATA_CARDS:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/react"),
        props,
      );
    case WidgetType.DATA_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-list/react"),
        props,
      );
    case WidgetType.GROUPED_LIST:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/grouped-list/react"),
        props,
      );
    case WidgetType.METRIC_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/metric-card/react"),
        props,
      );
    case WidgetType.STAT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/stat/react"),
        props,
      );
    case WidgetType.CHART:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/react"),
        props,
      );
    case WidgetType.CONTAINER:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/react"),
        props,
      );
    case WidgetType.SECTION:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/section/react"),
        props,
      );
    case WidgetType.SEPARATOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react"),
        props,
      );
    case WidgetType.LINK_CARD:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/link-card/react"),
        props,
      );
    case WidgetType.BUTTON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/button/react"),
        props,
      );
    case WidgetType.NAVIGATE_BUTTON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react"),
        props,
      );
    case WidgetType.SUBMIT_BUTTON:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react"),
        props,
      );
    case WidgetType.ALERT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react"),
        props,
      );
    case WidgetType.FORM_ALERT:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react"),
        props,
      );
    case WidgetType.PASSWORD_STRENGTH:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/password-strength/react"),
        props,
      );
    case WidgetType.STATUS_INDICATOR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/status-indicator/react"),
        props,
      );
    case WidgetType.EMPTY_STATE:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/empty-state/react"),
        props,
      );
    case WidgetType.CODE_QUALITY_FILES:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/react"),
        props,
      );
    case WidgetType.CODE_QUALITY_SUMMARY:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/react"),
        props,
      );
    case WidgetType.AVATAR:
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/avatar/react"),
        props,
      );

    // === NOT YET IMPLEMENTED (fallback to text) ===
    case WidgetType.FORM_GROUP:
    case WidgetType.FORM_SECTION:
    case WidgetType.DATA_CARD:
    case WidgetType.DATA_GRID:
    case WidgetType.METADATA_CARD:
    case WidgetType.ACCORDION:
    case WidgetType.TABS:
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
    case WidgetType.CUSTOM:
      // Fallback to TEXT widget for unimplemented widgets
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react"),
        props,
      );

    default: {
      // Exhaustive check - TypeScript will error if we miss a WidgetType
      // oxlint-disable-next-line no-unused-vars
      const _exhaustiveCheck: never = widgetType;
      return createWidget(
        () =>
          import("@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react"),
        props,
      );
    }
  }
}

/**
 * Widget component type - fully typed based on schema
 */
type WidgetComponent<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    z.ZodTypeAny
  >,
> = React.ComponentType<WidgetRendererProps<TEndpoint, TWidgetConfig>>;

/**
 * Helper to create widget with dynamic import - maintains full type inference
 * NO type assertions - import function is properly typed
 */
function createWidget<
  TEndpoint extends CreateApiEndpointAny,
  const TKey extends string,
  TSchema extends z.ZodTypeAny | never,
>(
  importFn: () => Promise<{
    default: WidgetComponent<
      TEndpoint,
      UnifiedField<TKey, TSchema, FieldUsageConfig, z.ZodTypeAny>
    >;
  }>,
  props: {
    fieldName: string;
    field: UnifiedField<TKey, TSchema, FieldUsageConfig, z.ZodTypeAny>;
    context: ReactWidgetContext<TEndpoint>;
    className?: string;
    style?: React.CSSProperties;
  },
): JSX.Element {
  const LazyWidget = React.lazy(importFn);

  return (
    <Suspense>
      <LazyWidget
        fieldName={props.fieldName}
        field={props.field}
        context={props.context}
        className={props.className}
        style={props.style}
      />
    </Suspense>
  );
}

WidgetRenderer.displayName = "WidgetRenderer";
