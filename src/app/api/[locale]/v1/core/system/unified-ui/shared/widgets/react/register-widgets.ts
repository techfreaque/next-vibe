/**
 * Register Widgets
 * Registers all available widget components with the widget registry
 */

"use client";

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { CodeOutputWidget } from "./CodeOutputWidget";
import { ContainerWidget } from "./ContainerWidget";
import { DataCardsWidget } from "./DataCardsWidget";
import { DataTableWidget } from "./DataTableWidget";
import { GroupedListWidget } from "./GroupedListWidget";
import { LinkCardWidget } from "./LinkCardWidget";
import { LinkListWidget } from "./LinkListWidget";
import { LinkWidget } from "./LinkWidget";
import { MarkdownWidget } from "./MarkdownWidget";
import { MetricCardWidget } from "./MetricCardWidget";
import { StatsGridWidget } from "./StatsGridWidget";
import { TextWidget } from "./TextWidget";
import { widgetRegistry } from "./WidgetRegistry";

/**
 * Register all widgets
 * Call this once at app initialization
 */
export function registerAllWidgets(): void {
  // Text widgets
  widgetRegistry.register(WidgetType.TEXT, TextWidget);
  widgetRegistry.register(WidgetType.MARKDOWN, MarkdownWidget);

  // Link widgets
  widgetRegistry.register(WidgetType.LINK, LinkWidget);
  widgetRegistry.register(WidgetType.LINK_CARD, LinkCardWidget);
  widgetRegistry.register(WidgetType.LINK_LIST, LinkListWidget);

  // Code widgets
  widgetRegistry.register(WidgetType.CODE_OUTPUT, CodeOutputWidget);

  // Data widgets
  widgetRegistry.register(WidgetType.DATA_TABLE, DataTableWidget);
  widgetRegistry.register(WidgetType.DATA_CARDS, DataCardsWidget);
  widgetRegistry.register(WidgetType.GROUPED_LIST, GroupedListWidget);

  // Metric widgets
  widgetRegistry.register(WidgetType.METRIC_CARD, MetricCardWidget);
  widgetRegistry.register(WidgetType.STATS_GRID, StatsGridWidget);

  // Layout widgets
  widgetRegistry.register(WidgetType.CONTAINER, ContainerWidget);

  // Editable widgets (for CRUD operations)
  // Note: These are registered separately as they require additional props
  // widgetRegistry.register(WidgetType.TEXT, EditableTextWidget);
}

/**
 * Auto-register widgets on module load
 */
if (typeof window !== "undefined") {
  registerAllWidgets();
}
