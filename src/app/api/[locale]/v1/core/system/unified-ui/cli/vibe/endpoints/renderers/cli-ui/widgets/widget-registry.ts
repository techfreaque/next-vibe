/**
 * Widget Registry
 * Central registry for all widget renderers with automatic discovery
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { CodeOutputWidgetRenderer } from "./code-output-widget-renderer";
import { ContainerWidgetRenderer } from "./container-widget-renderer";
import { DataCardsWidgetRenderer } from "./data-cards-widget-renderer";
import { DataTableWidgetRenderer } from "./data-table-widget-renderer";
import { GroupedListWidgetRenderer } from "./grouped-list-widget-renderer";
import { MetricWidgetRenderer } from "./metric-widget-renderer";
import { StatsGridWidgetRenderer } from "./stats-grid-widget-renderer";
import { TextWidgetRenderer } from "./text-widget-renderer";
import type {
  ResponseFieldMetadata,
  WidgetRenderContext,
  WidgetRenderer,
} from "./types";

/**
 * Widget registry that manages all available widget renderers
 */
export class WidgetRegistry {
  private renderers: WidgetRenderer[] = [];
  private fallbackRenderer: WidgetRenderer;

  constructor() {
    this.registerDefaultRenderers();
    this.fallbackRenderer = new TextWidgetRenderer();
  }

  /**
   * Register default widget renderers
   */
  private registerDefaultRenderers(): void {
    this.register(new TextWidgetRenderer());
    this.register(new DataTableWidgetRenderer());
    this.register(new DataCardsWidgetRenderer());
    this.register(new GroupedListWidgetRenderer());
    this.register(new CodeOutputWidgetRenderer());
    this.register(new MetricWidgetRenderer());
    this.register(new StatsGridWidgetRenderer());
    this.register(new ContainerWidgetRenderer());
  }

  /**
   * Register a new widget renderer
   */
  register(renderer: WidgetRenderer): void {
    this.renderers.push(renderer);
  }

  /**
   * Find the appropriate renderer for a widget type
   */
  getRenderer(widgetType: WidgetType): WidgetRenderer {
    const renderer = this.renderers.find((r) => r.canRender(widgetType));
    return renderer || this.fallbackRenderer;
  }

  /**
   * Render a field using the appropriate widget renderer
   */
  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const renderer = this.getRenderer(field.widgetType);
    return renderer.render(field, context);
  }

  /**
   * Get all registered widget types
   */
  getSupportedWidgetTypes(): WidgetType[] {
    // TODO: Enhance to dynamically get all supported types from each renderer
    // For now, return the known types
    return [
      WidgetType.TEXT,
      WidgetType.DATA_TABLE,
      WidgetType.DATA_CARDS,
      WidgetType.GROUPED_LIST,
      WidgetType.METRIC_CARD,
      WidgetType.STATS_GRID,
    ];
  }
}

/**
 * Default widget registry instance
 */
export const defaultWidgetRegistry = new WidgetRegistry();
