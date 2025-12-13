/**
 * Widget Registry
 * Central registry for all widget renderers with automatic discovery
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";

import { AccordionWidgetRenderer } from "../implementations/accordion";
import { AvatarWidgetRenderer } from "../implementations/avatar";
import { BadgeWidgetRenderer } from "../implementations/badge";
import { CodeOutputWidgetRenderer } from "../implementations/code-output";
import { CodeQualityListWidgetRenderer } from "../implementations/code-quality-list";
import { ContainerWidgetRenderer } from "../implementations/container";
import { DataCardWidgetRenderer } from "../implementations/data-card";
import { DataCardsWidgetRenderer } from "../implementations/data-cards";
import { DataListWidgetRenderer } from "../implementations/data-list";
import { DataTableWidgetRenderer } from "../implementations/data-table";
import { EditableTextWidgetRenderer } from "../implementations/editable-text";
import { EmptyStateWidgetRenderer } from "../implementations/empty-state";
import { ErrorWidgetRenderer } from "../implementations/errors";
import { GroupedListWidgetRenderer } from "../implementations/grouped-list";
import { LinkWidgetRenderer } from "../implementations/link";
import { LinkCardWidgetRenderer } from "../implementations/link-card";
import { LinkListWidgetRenderer } from "../implementations/link-list";
import { LoadingWidgetRenderer } from "../implementations/loading";
import { MarkdownWidgetRenderer } from "../implementations/markdown";
import { MetricWidgetRenderer } from "../implementations/metric";
import { SectionWidgetRenderer } from "../implementations/section";
import { StatsGridWidgetRenderer } from "../implementations/stats-grid";
import { TabsWidgetRenderer } from "../implementations/tabs";
import { TextWidgetRenderer } from "../implementations/text";
import { TitleWidgetRenderer } from "../implementations/title";
import type { CLIWidgetPropsUnion, WidgetRenderContext, WidgetRenderer } from "./types";

/**
 * Widget registry that manages all available widget renderers.
 * Uses type assertions for storage since each renderer has a specific generic type.
 */
export class WidgetRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderers: WidgetRenderer<any>[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fallbackRenderer: WidgetRenderer<any>;

  constructor() {
    this.registerDefaultRenderers();
    this.fallbackRenderer = new TextWidgetRenderer();
  }

  /**
   * Register default widget renderers
   */
  private registerDefaultRenderers(): void {
    this.register(new TitleWidgetRenderer());
    this.register(new TextWidgetRenderer());
    this.register(new SectionWidgetRenderer());
    this.register(new DataTableWidgetRenderer());
    this.register(new DataCardWidgetRenderer());
    this.register(new DataCardsWidgetRenderer());
    this.register(new DataListWidgetRenderer());
    this.register(new GroupedListWidgetRenderer());
    this.register(new CodeQualityListWidgetRenderer());
    this.register(new CodeOutputWidgetRenderer());
    this.register(new MetricWidgetRenderer());
    this.register(new StatsGridWidgetRenderer());
    this.register(new ContainerWidgetRenderer());
    this.register(new LinkWidgetRenderer());
    this.register(new LinkCardWidgetRenderer());
    this.register(new LinkListWidgetRenderer());
    this.register(new MarkdownWidgetRenderer());
    this.register(new EditableTextWidgetRenderer());
    this.register(new BadgeWidgetRenderer());
    this.register(new AvatarWidgetRenderer());
    this.register(new EmptyStateWidgetRenderer());
    this.register(new ErrorWidgetRenderer());
    this.register(new LoadingWidgetRenderer());
    this.register(new TabsWidgetRenderer());
    this.register(new AccordionWidgetRenderer());
  }

  /**
   * Register a new widget renderer
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(renderer: WidgetRenderer<any>): void {
    this.renderers.push(renderer);
  }

  /**
   * Find the appropriate renderer for a widget type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRenderer(widgetType: WidgetType): WidgetRenderer<any> {
    const renderer = this.renderers.find((r) => r.widgetType === widgetType);
    return renderer || this.fallbackRenderer;
  }

  /**
   * Render a field using the appropriate widget renderer
   */
  render(input: WidgetInput, context: WidgetRenderContext): string {
    const renderer = this.getRenderer(input.field.ui.type);
    // Type assertion needed because registry handles all widget types dynamically
    // The renderer's widgetType ensures props are handled correctly
    const props = {
      widgetType: input.field.ui.type,
      field: input.field,
      value: input.value,
      context,
    } as CLIWidgetPropsUnion;
    return renderer.render(props);
  }

  /**
   * Get all registered widget types
   */
  getSupportedWidgetTypes(): WidgetType[] {
    // TODO: Enhance to dynamically get all supported types from each renderer
    // For now, return the known types
    return [
      WidgetType.TEXT,
      WidgetType.TITLE,
      WidgetType.SECTION,
      WidgetType.DATA_TABLE,
      WidgetType.DATA_CARD,
      WidgetType.DATA_CARDS,
      WidgetType.DATA_LIST,
      WidgetType.GROUPED_LIST,
      WidgetType.CODE_QUALITY_LIST,
      WidgetType.CODE_OUTPUT,
      WidgetType.METRIC_CARD,
      WidgetType.STATS_GRID,
      WidgetType.CONTAINER,
      WidgetType.LINK,
      WidgetType.LINK_CARD,
      WidgetType.LINK_LIST,
      WidgetType.MARKDOWN,
      WidgetType.MARKDOWN_EDITOR,
      WidgetType.BADGE,
      WidgetType.AVATAR,
      WidgetType.EMPTY_STATE,
      WidgetType.ERROR,
      WidgetType.LOADING,
      WidgetType.TABS,
      WidgetType.ACCORDION,
    ];
  }
}

/**
 * Default widget registry instance
 */
export const defaultWidgetRegistry = new WidgetRegistry();
