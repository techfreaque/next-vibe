"use client";

import type { JSX } from "react";

import type { ResponseFieldMetadata } from "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/types";
import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import type { RenderableValue, WidgetRenderContext } from "../types";
import { CodeOutputWidget } from "./CodeOutputWidget";
import { ContainerWidget } from "./ContainerWidget";
import { DataTableWidget } from "./DataTableWidget";
import { GroupedListWidget } from "./GroupedListWidget";
import { LinkCardWidget } from "./LinkCardWidget";
import { LinkListWidget } from "./LinkListWidget";
import { LinkWidget } from "./LinkWidget";
import { MarkdownWidget } from "./MarkdownWidget";
import { MetricCardWidget } from "./MetricCardWidget";
import { StatsGridWidget } from "./StatsGridWidget";
import { TextWidget } from "./TextWidget";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";

/**
 * Widget Renderer Props
 */
export interface WidgetRendererProps {
  /** Type of widget to render (TEXT, LINK_LIST, DATA_TABLE, etc.) */
  widgetType: WidgetType;
  /** Data to render in the widget */
  data: RenderableValue;
  /** Field metadata from endpoint definition */
  metadata: ResponseFieldMetadata;
  /** Render context (locale, platform, permissions, etc.) */
  context: WidgetRenderContext;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Widget Renderer Component
 *
 * Dynamically renders the appropriate widget based on the widget type.
 * This is the core component of the unified-interface widget system.
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
export function WidgetRenderer<
  TData extends RenderableValue = RenderableValue,
>({
  widgetType,
  data,
  metadata,
  context,
  className,
  style,
}: WidgetRendererProps & { data: TData }): JSX.Element {
  const baseProps = { metadata, context, className, style };

  // Wrap widget in error boundary
  return (
    <WidgetErrorBoundary locale={context.locale}>
      {renderWidget(widgetType, data, baseProps)}
    </WidgetErrorBoundary>
  );
}

/**
 * Internal widget rendering logic
 * Maps widget types to their corresponding widget components
 *
 * @param widgetType - Type of widget to render
 * @param data - Data to pass to the widget
 * @param baseProps - Base props (metadata, context, className, style)
 * @returns Rendered widget component
 */
function renderWidget(
  widgetType: WidgetType,
  data: RenderableValue,
  baseProps: {
    metadata: ResponseFieldMetadata;
    context: WidgetRenderContext;
    className?: string;
    style?: React.CSSProperties;
  },
): JSX.Element {
  switch (widgetType) {
    // Text widgets
    case WidgetType.TEXT:
      return <TextWidget {...baseProps} data={data} />;

    case WidgetType.MARKDOWN:
      return <MarkdownWidget {...baseProps} data={data} />;

    // Link widgets
    case WidgetType.LINK:
      return <LinkWidget {...baseProps} data={data} />;

    // Code widgets
    case WidgetType.CODE_OUTPUT:
      return <CodeOutputWidget {...baseProps} data={data} />;

    // Data display widgets
    case WidgetType.DATA_TABLE:
      return <DataTableWidget {...baseProps} data={data} />;

    case WidgetType.GROUPED_LIST:
      return <GroupedListWidget {...baseProps} data={data} />;

    // Metric widgets
    case WidgetType.METRIC_CARD:
      return <MetricCardWidget {...baseProps} data={data} />;

    case WidgetType.STATS_GRID:
      return <StatsGridWidget {...baseProps} data={data} />;

    // Layout widgets
    case WidgetType.CONTAINER:
      return <ContainerWidget {...baseProps} data={data} />;

    // Link display widgets
    case WidgetType.LINK_CARD:
      return <LinkCardWidget {...baseProps} data={data} />;

    case WidgetType.LINK_LIST:
      return <LinkListWidget {...baseProps} data={data} />;

    // Fallback to text widget
    default:
      return <TextWidget {...baseProps} data={data} />;
  }
}

WidgetRenderer.displayName = "WidgetRenderer";
