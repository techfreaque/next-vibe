"use client";

import type { JSX } from "react";

import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import {
  type WidgetRenderContext,
  type WidgetData,
} from "../../../shared/widgets/types";
import { CodeOutputWidget } from "../implementations/CodeOutputWidget";
import { CodeQualityListWidget } from "../implementations/CodeQualityListWidget";
import { ContainerWidget } from "../implementations/ContainerWidget";
import { DataCardsWidget } from "../implementations/DataCardsWidget";
import { DataListWidget } from "../implementations/DataListWidget";
import { DataTableWidget } from "../implementations/DataTableWidget";
import { EditableTextWidget } from "../implementations/EditableTextWidget";
import { FormFieldWidget } from "../implementations/FormFieldWidget";
import { GroupedListWidget } from "../implementations/GroupedListWidget";
import { LinkCardWidget } from "../implementations/LinkCardWidget";
import { LinkListWidget } from "../implementations/LinkListWidget";
import { LinkWidget } from "../implementations/LinkWidget";
import { MarkdownWidget } from "../implementations/MarkdownWidget";
import { MetricCardWidget } from "../implementations/MetricCardWidget";
import { SectionWidget } from "../implementations/SectionWidget";
import { StatsGridWidget } from "../implementations/StatsGridWidget";
import { TextWidget } from "../implementations/TextWidget";
import { TitleWidget } from "../implementations/TitleWidget";
import { WidgetErrorBoundary } from "../core/ErrorBoundary";

/**
 * Widget Renderer Props
 */
export interface WidgetRendererProps {
  /** Type of widget to render (TEXT, LINK_LIST, DATA_TABLE, etc.) */
  widgetType: WidgetType;
  /** Field name for form fields (e.g., "email", "password") */
  fieldName?: string;
  /** Data to render in the widget */
  data: WidgetData;
  /** Field metadata from endpoint definition */
  field: UnifiedField;
  /** Render context (locale, platform, permissions, etc.) */
  context: WidgetRenderContext;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
  /** Form instance (for form fields) */
  form?: unknown;
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
export function WidgetRenderer({
  widgetType,
  fieldName,
  data,
  field,
  context,
  className,
  style,
  form,
}: WidgetRendererProps): JSX.Element {
  const baseProps = {
    field,
    fieldName,
    value: data,
    context,
    className,
    style,
    form,
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
 * @param baseProps - Base props (field, value, context, className, style, form)
 * @returns Rendered widget component
 */
function renderWidget(
  widgetType: WidgetType,
  baseProps: {
    field: UnifiedField;
    value: WidgetData;
    context: WidgetRenderContext;
    className?: string;
    style?: React.CSSProperties;
    form?: unknown;
  },
): JSX.Element {
  switch (widgetType) {
    // Text widgets
    case WidgetType.TEXT:
      return <TextWidget {...baseProps} />;

    case WidgetType.MARKDOWN:
      return <MarkdownWidget {...baseProps} />;

    case WidgetType.MARKDOWN_EDITOR:
      return <EditableTextWidget {...baseProps} />;

    case WidgetType.TITLE:
      return <TitleWidget {...baseProps} />;

    // Form field widget (renders as editable form input in both request and response modes)
    case WidgetType.FORM_FIELD:
      return <FormFieldWidget {...baseProps} />;

    // Link widgets
    case WidgetType.LINK:
      return <LinkWidget {...baseProps} />;

    // Code widgets
    case WidgetType.CODE_OUTPUT:
      return <CodeOutputWidget {...baseProps} />;

    case WidgetType.CODE_QUALITY_LIST:
      return <CodeQualityListWidget {...baseProps} />;

    // Data display widgets
    case WidgetType.DATA_TABLE:
      return <DataTableWidget {...baseProps} />;

    case WidgetType.DATA_CARDS:
      return <DataCardsWidget {...baseProps} />;

    case WidgetType.DATA_LIST:
      return <DataListWidget {...baseProps} />;

    case WidgetType.GROUPED_LIST:
      return <GroupedListWidget {...baseProps} />;

    // Metric widgets
    case WidgetType.METRIC_CARD:
      return <MetricCardWidget {...baseProps} />;

    case WidgetType.STATS_GRID:
      return <StatsGridWidget {...baseProps} />;

    // Layout widgets
    case WidgetType.CONTAINER:
      return <ContainerWidget {...baseProps} />;

    case WidgetType.SECTION:
      return <SectionWidget {...baseProps} />;

    // Link display widgets
    case WidgetType.LINK_CARD:
      return <LinkCardWidget {...baseProps} />;

    case WidgetType.LINK_LIST:
      return <LinkListWidget {...baseProps} />;

    // Fallback to text widget
    default:
      return <TextWidget {...baseProps} />;
  }
}

WidgetRenderer.displayName = "WidgetRenderer";
