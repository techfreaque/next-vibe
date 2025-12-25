"use client";

import type { JSX } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type {
  ReactWidgetProps,
  WidgetData,
  WidgetRenderContext,
} from "../../../shared/widgets/types";
import { WidgetErrorBoundary } from "../core/ErrorBoundary";
import { AlertWidget } from "../implementations/AlertWidget";
import { BadgeWidget } from "../implementations/BadgeWidget";
import { ChartWidget } from "../implementations/ChartWidget";
import { CodeOutputWidget } from "../implementations/CodeOutputWidget";
import { CodeQualityListWidget } from "../implementations/CodeQualityListWidget";
import { ContainerWidget } from "../implementations/ContainerWidget";
import { CreditTransactionCardWidget } from "../implementations/CreditTransactionCardWidget";
import { CreditTransactionListWidget } from "../implementations/CreditTransactionListWidget";
import { DataCardsWidget } from "../implementations/DataCardsWidget";
import { DataListWidget } from "../implementations/DataListWidget";
import { DataTableWidget } from "../implementations/DataTableWidget";
import { EditableTextWidget } from "../implementations/EditableTextWidget";
import { FormAlertWidget } from "../implementations/FormAlertWidget";
import { FormFieldWidget } from "../implementations/FormFieldWidget";
import { GroupedListWidget } from "../implementations/GroupedListWidget";
import { LinkCardWidget } from "../implementations/LinkCardWidget";
import { LinkListWidget } from "../implementations/LinkListWidget";
import { LinkWidget } from "../implementations/LinkWidget";
import { MarkdownWidget } from "../implementations/MarkdownWidget";
import { MetricCardWidget } from "../implementations/MetricCardWidget";
import { PaginationWidget } from "../implementations/PaginationWidget";
import { PasswordStrengthWidget } from "../implementations/PasswordStrengthWidget";
import { SectionWidget } from "../implementations/SectionWidget";
import { StatsGridWidget } from "../implementations/StatsGridWidget";
import { StatWidget } from "../implementations/StatWidget";
import { SubmitButtonWidget } from "../implementations/SubmitButtonWidget";
import { TextWidget } from "../implementations/TextWidget";
import { TitleWidget } from "../implementations/TitleWidget";

/**
 * Widget Renderer Props
 */
export interface WidgetRendererProps<TKey extends string> {
  /** Type of widget to render (TEXT, LINK_LIST, DATA_TABLE, etc.) */
  widgetType: WidgetType;
  /** Field name for form fields (e.g., "email", "password") */
  fieldName?: string;
  /** Data to render in the widget */
  data: WidgetData;
  /** Field metadata from endpoint definition */
  field: UnifiedField<TKey>;
  /** Render context (locale, platform, permissions, etc.) */
  context: WidgetRenderContext;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
  /** Form instance (for form fields) */
  form?: UseFormReturn<FieldValues>;
  /** Callback to trigger when submit button is clicked (e.g., refetch for GET, submit for POST) */
  onSubmit?: () => void;
  /** Whether the form is currently submitting/loading */
  isSubmitting?: boolean;
}

/**
 * Widget Renderer Component
 *
 * Dynamically renders the appropriate widget based on the widget type.
 * This is the core component of the unified-interface widget system.
 *
 * **KEY CONCEPT**:
 * - Widgets render THE SAME WAY regardless of request/response mode
 * - Mode is ONLY used by EndpointRenderer to determine WHICH fields to show
 * - FormFieldWidget is always editable (no readonly mode)
 * - All widgets just render their data - they don't care about mode
 *
 * **Features**:
 * - Supports all widget types (TEXT, LINK_LIST, DATA_TABLE, MARKDOWN, etc.)
 * - Wrapped in error boundary for graceful error handling
 * - Falls back to TextWidget for unknown widget types
 * - Used by forms, CLI, AI tools, and tool display
 *
 * **Error Handling**:
 * - Widget render errors are caught by WidgetErrorBoundary
 * - Shows user-friendly error message with details
 * - Prevents entire page from crashing
 *
 * @param props - Widget renderer props
 * @returns Rendered widget wrapped in error boundary
 */
export function WidgetRenderer<TKey extends string>({
  widgetType,
  fieldName,
  data,
  field,
  context,
  className,
  style,
  form,
  onSubmit,
  isSubmitting,
}: WidgetRendererProps<TKey>): JSX.Element {
  const baseProps = {
    field,
    fieldName,
    value: data,
    context,
    className,
    style,
    form,
    onSubmit,
    isSubmitting,
  };

  // Wrap widget in error boundary
  return (
    <WidgetErrorBoundary locale={context.locale}>
      {renderWidget(widgetType, baseProps)}
    </WidgetErrorBoundary>
  );
}

/**
 * Internal widget rendering logic
 * Maps widget types to their corresponding widget components
 *
 * @param widgetType - Type of widget to render
 * @param baseProps - Base props (field, value, context, className, style, form, onSubmit, isSubmitting)
 * @returns Rendered widget component
 */
function renderWidget<TKey extends string>(
  widgetType: WidgetType,
  baseProps: {
    field: UnifiedField<TKey>;
    fieldName?: string;
    value: WidgetData;
    context: WidgetRenderContext;
    className?: string;
    style?: React.CSSProperties;
    form?: UseFormReturn<FieldValues>;
    onSubmit?: () => void;
    isSubmitting?: boolean;
  },
): JSX.Element {
  switch (widgetType) {
    // Text widgets
    case WidgetType.TEXT:
      return (
        <TextWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.TEXT, TKey>)}
        />
      );

    case WidgetType.BADGE:
      return (
        <BadgeWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.BADGE, TKey>)}
        />
      );

    case WidgetType.MARKDOWN:
      return (
        <MarkdownWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.MARKDOWN, TKey>)}
        />
      );

    case WidgetType.MARKDOWN_EDITOR:
      return (
        <EditableTextWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.MARKDOWN_EDITOR,
            TKey
          >)}
        />
      );

    case WidgetType.TITLE:
      return (
        <TitleWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.TITLE, TKey>)}
        />
      );

    // Form field widget (renders as editable form input in both request and response modes)
    case WidgetType.FORM_FIELD:
      return (
        <FormFieldWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.FORM_FIELD,
            TKey
          >)}
        />
      );

    // Link widgets
    case WidgetType.LINK:
      return (
        <LinkWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.LINK, TKey>)}
        />
      );

    // Code widgets
    case WidgetType.CODE_OUTPUT:
      return (
        <CodeOutputWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.CODE_OUTPUT,
            TKey
          >)}
        />
      );

    case WidgetType.CODE_QUALITY_LIST:
      return (
        <CodeQualityListWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.CODE_QUALITY_LIST,
            TKey
          >)}
        />
      );

    case WidgetType.CREDIT_TRANSACTION_CARD:
      return (
        <CreditTransactionCardWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.CREDIT_TRANSACTION_CARD,
            TKey
          >)}
        />
      );

    case WidgetType.CREDIT_TRANSACTION_LIST:
      return (
        <CreditTransactionListWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.CREDIT_TRANSACTION_LIST,
            TKey
          >)}
        />
      );

    case WidgetType.PAGINATION:
      return (
        <PaginationWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.PAGINATION,
            TKey
          >)}
        />
      );

    // Data display widgets
    case WidgetType.DATA_TABLE:
      return (
        <DataTableWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.DATA_TABLE,
            TKey
          >)}
        />
      );

    case WidgetType.DATA_CARDS:
      return (
        <DataCardsWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.DATA_CARDS,
            TKey
          >)}
        />
      );

    case WidgetType.DATA_LIST:
      return (
        <DataListWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.DATA_LIST,
            TKey
          >)}
        />
      );

    case WidgetType.GROUPED_LIST:
      return (
        <GroupedListWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.GROUPED_LIST,
            TKey
          >)}
        />
      );

    // Metric widgets
    case WidgetType.METRIC_CARD:
      return (
        <MetricCardWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.METRIC_CARD,
            TKey
          >)}
        />
      );

    case WidgetType.STAT:
      return (
        <StatWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.STAT, TKey>)}
        />
      );

    case WidgetType.STATS_GRID:
      return (
        <StatsGridWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.STATS_GRID,
            TKey
          >)}
        />
      );

    // Chart widgets
    case WidgetType.CHART:
      return (
        <ChartWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.CHART, TKey>)}
        />
      );

    // Layout widgets
    case WidgetType.CONTAINER:
      return (
        <ContainerWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.CONTAINER,
            TKey
          >)}
        />
      );

    case WidgetType.SECTION:
      return (
        <SectionWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.SECTION, TKey>)}
        />
      );

    // Link display widgets
    case WidgetType.LINK_CARD:
      return (
        <LinkCardWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.LINK_CARD,
            TKey
          >)}
        />
      );

    case WidgetType.LINK_LIST:
      return (
        <LinkListWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.LINK_LIST,
            TKey
          >)}
        />
      );

    // Interactive widgets
    case WidgetType.SUBMIT_BUTTON:
      return (
        <SubmitButtonWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.SUBMIT_BUTTON,
            TKey
          >)}
        />
      );

    // Status widgets
    case WidgetType.ALERT:
      return (
        <AlertWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.ALERT, TKey>)}
        />
      );

    case WidgetType.FORM_ALERT:
      return (
        <FormAlertWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.FORM_ALERT,
            TKey
          >)}
        />
      );

    // Form feedback widgets
    case WidgetType.PASSWORD_STRENGTH:
      return (
        <PasswordStrengthWidget
          {...(baseProps as ReactWidgetProps<
            typeof WidgetType.PASSWORD_STRENGTH,
            TKey
          >)}
        />
      );

    // Fallback to text widget
    default:
      return (
        <TextWidget
          {...(baseProps as ReactWidgetProps<typeof WidgetType.TEXT, TKey>)}
        />
      );
  }
}

WidgetRenderer.displayName = "WidgetRenderer";
