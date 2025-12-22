/**
 * Register Widgets
 * Registers all available widget components with the widget registry
 */

"use client";

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { ChartWidget } from "../implementations/ChartWidget";
import { CodeOutputWidget } from "../implementations/CodeOutputWidget";
import { CodeQualityListWidget } from "../implementations/CodeQualityListWidget";
import { ContainerWidget } from "../implementations/ContainerWidget";
import { DataCardsWidget } from "../implementations/DataCardsWidget";
import { DataListWidget } from "../implementations/DataListWidget";
import { DataTableWidget } from "../implementations/DataTableWidget";
import { EditableTextWidget } from "../implementations/EditableTextWidget";
import { FilterPillsWidget } from "../implementations/FilterPillsWidget";
import { GroupedListWidget } from "../implementations/GroupedListWidget";
import { LinkCardWidget } from "../implementations/LinkCardWidget";
import { LinkListWidget } from "../implementations/LinkListWidget";
import { LinkWidget } from "../implementations/LinkWidget";
import { MarkdownWidget } from "../implementations/MarkdownWidget";
import { MetricCardWidget } from "../implementations/MetricCardWidget";
import { SectionWidget } from "../implementations/SectionWidget";
import { StatsGridWidget } from "../implementations/StatsGridWidget";
import { StatWidget } from "../implementations/StatWidget";
import { TextWidget } from "../implementations/TextWidget";
import { TitleWidget } from "../implementations/TitleWidget";
import { widgetRegistry } from "./WidgetRegistry";

/**
 * Register all widgets
 * Call this once at app initialization
 */
export function registerAllWidgets(): void {
  // Text widgets
  widgetRegistry.register(WidgetType.TEXT, TextWidget);
  widgetRegistry.register(WidgetType.MARKDOWN, MarkdownWidget);
  widgetRegistry.register(WidgetType.TITLE, TitleWidget);

  // Link widgets
  widgetRegistry.register(WidgetType.LINK, LinkWidget);
  widgetRegistry.register(WidgetType.LINK_CARD, LinkCardWidget);
  widgetRegistry.register(WidgetType.LINK_LIST, LinkListWidget);

  // Code widgets
  widgetRegistry.register(WidgetType.CODE_OUTPUT, CodeOutputWidget);
  widgetRegistry.register(WidgetType.CODE_QUALITY_LIST, CodeQualityListWidget);

  // Data widgets
  widgetRegistry.register(WidgetType.DATA_TABLE, DataTableWidget);
  widgetRegistry.register(WidgetType.DATA_CARDS, DataCardsWidget);
  widgetRegistry.register(WidgetType.DATA_LIST, DataListWidget);
  widgetRegistry.register(WidgetType.GROUPED_LIST, GroupedListWidget);

  // Metric widgets
  widgetRegistry.register(WidgetType.STAT, StatWidget);
  widgetRegistry.register(WidgetType.METRIC_CARD, MetricCardWidget);
  widgetRegistry.register(WidgetType.STATS_GRID, StatsGridWidget);
  widgetRegistry.register(WidgetType.CHART, ChartWidget);

  // Layout widgets
  widgetRegistry.register(WidgetType.CONTAINER, ContainerWidget);
  widgetRegistry.register(WidgetType.SECTION, SectionWidget);

  // Form widgets
  widgetRegistry.register(WidgetType.FILTER_PILLS, FilterPillsWidget);

  // Editable widgets (for CRUD operations)
  widgetRegistry.register(WidgetType.MARKDOWN_EDITOR, EditableTextWidget);
}

/**
 * Auto-register widgets on module load
 */
if (typeof window !== "undefined") {
  registerAllWidgets();
}
