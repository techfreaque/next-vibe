"use client";

import type { JSX } from "react";

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ResponseFieldMetadata } from "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/types";

import type { RenderableValue, WidgetRenderContext } from "../types";
import { CodeOutputWidget } from "./CodeOutputWidget";
import { ContainerWidget } from "./ContainerWidget";
import { LinkCardWidget } from "./LinkCardWidget";
import { LinkListWidget } from "./LinkListWidget";
import { LinkWidget } from "./LinkWidget";
import { MarkdownWidget } from "./MarkdownWidget";
import { MetricCardWidget } from "./MetricCardWidget";
import { StatsGridWidget } from "./StatsGridWidget";
import { TextWidget } from "./TextWidget";

/**
 * Widget Renderer Props
 */
export interface WidgetRendererProps {
  widgetType: WidgetType;
  data: RenderableValue;
  metadata: ResponseFieldMetadata;
  context: WidgetRenderContext;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Widget Renderer Component
 * Dynamically renders the appropriate widget based on type
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

    // Metric widgets
    case WidgetType.METRIC_CARD:
      return <MetricCardWidget {...baseProps} data={data} />;

    case WidgetType.STATS_GRID:
      return <StatsGridWidget {...baseProps} data={data} />;

    // Layout widgets
    case WidgetType.CONTAINER:
      return <ContainerWidget {...baseProps} data={data} />;

    // Custom widget types for search results
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
