"use client";

import type { JSX } from "react";

import { WidgetType } from "../../../cli/vibe/endpoints/endpoint-types/core/enums";
import type { ResponseFieldMetadata } from "../../../cli/vibe/endpoints/renderers/cli-ui/widgets/types";
import type {
  CodeOutputWidgetData,
  ContainerWidgetData,
  LinkWidgetData,
  MarkdownWidgetData,
  MetricCardWidgetData,
  RenderableValue,
  StatsGridWidgetData,
  WidgetRenderContext,
} from "../types";
import { CodeOutputWidget } from "./CodeOutputWidget";
import { ContainerWidget } from "./ContainerWidget";
import { type LinkCardData, LinkCardWidget } from "./LinkCardWidget";
import { type LinkListData, LinkListWidget } from "./LinkListWidget";
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
export function WidgetRenderer({
  widgetType,
  data,
  metadata,
  context,
  className,
  style,
}: WidgetRendererProps): JSX.Element {
  const baseProps = { metadata, context, className, style };

  switch (widgetType) {
    // Text widgets
    case WidgetType.TEXT:
      return <TextWidget {...baseProps} data={data} />;

    case WidgetType.MARKDOWN:
      return (
        <MarkdownWidget {...baseProps} data={data as MarkdownWidgetData} />
      );

    // Link widgets
    case WidgetType.LINK:
      return <LinkWidget {...baseProps} data={data as LinkWidgetData} />;

    // Code widgets
    case WidgetType.CODE_OUTPUT:
      return (
        <CodeOutputWidget {...baseProps} data={data as CodeOutputWidgetData} />
      );

    // Metric widgets
    case WidgetType.METRIC_CARD:
      return (
        <MetricCardWidget {...baseProps} data={data as MetricCardWidgetData} />
      );

    case WidgetType.STATS_GRID:
      return (
        <StatsGridWidget {...baseProps} data={data as StatsGridWidgetData} />
      );

    // Layout widgets
    case WidgetType.CONTAINER:
      return (
        <ContainerWidget {...baseProps} data={data as ContainerWidgetData} />
      );

    // Custom widget types for search results
    case WidgetType.LINK_CARD:
      return <LinkCardWidget {...baseProps} data={data as LinkCardData} />;

    case WidgetType.LINK_LIST:
      return <LinkListWidget {...baseProps} data={data as LinkListData} />;

    // Fallback to text widget
    default:
      return <TextWidget {...baseProps} data={data} />;
  }
}

WidgetRenderer.displayName = "WidgetRenderer";
