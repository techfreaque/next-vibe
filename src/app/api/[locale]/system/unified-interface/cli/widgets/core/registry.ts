/**
 * Widget Registry
 * Central registry for CLI widget renderers using switch-based dispatch
 * Matches React's WidgetRenderer pattern
 */

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  WidgetData,
  WidgetInput,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";

import { AccordionWidgetRenderer } from "../implementations/accordion";
import { AvatarWidgetRenderer } from "../implementations/avatar";
import { BadgeWidgetRenderer } from "../implementations/badge";
import { CodeOutputWidgetRenderer } from "../implementations/code-output";
import { CodeQualityFilesWidgetRenderer } from "../implementations/code-quality-files";
import { CodeQualityListWidgetRenderer } from "../implementations/code-quality-list";
import { CodeQualitySummaryWidgetRenderer } from "../implementations/code-quality-summary";
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
import type {
  AnyWidgetRenderer,
  CLIWidgetProps,
  WidgetRenderContext,
} from "./types";

// Singleton instances for each renderer
const textRenderer = new TextWidgetRenderer();
const titleRenderer = new TitleWidgetRenderer();
const sectionRenderer = new SectionWidgetRenderer();
const containerRenderer = new ContainerWidgetRenderer();
const dataTableRenderer = new DataTableWidgetRenderer();
const dataCardRenderer = new DataCardWidgetRenderer();
const dataCardsRenderer = new DataCardsWidgetRenderer();
const dataListRenderer = new DataListWidgetRenderer();
const groupedListRenderer = new GroupedListWidgetRenderer();
const codeQualityListRenderer = new CodeQualityListWidgetRenderer();
const codeQualitySummaryRenderer = new CodeQualitySummaryWidgetRenderer();
const codeQualityFilesRenderer = new CodeQualityFilesWidgetRenderer();
const codeOutputRenderer = new CodeOutputWidgetRenderer();
const metricRenderer = new MetricWidgetRenderer();
const statsGridRenderer = new StatsGridWidgetRenderer();
const linkRenderer = new LinkWidgetRenderer();
const linkCardRenderer = new LinkCardWidgetRenderer();
const linkListRenderer = new LinkListWidgetRenderer();
const markdownRenderer = new MarkdownWidgetRenderer();
const editableTextRenderer = new EditableTextWidgetRenderer();
const badgeRenderer = new BadgeWidgetRenderer();
const avatarRenderer = new AvatarWidgetRenderer();
const emptyStateRenderer = new EmptyStateWidgetRenderer();
const errorRenderer = new ErrorWidgetRenderer();
const loadingRenderer = new LoadingWidgetRenderer();
const tabsRenderer = new TabsWidgetRenderer();
const accordionRenderer = new AccordionWidgetRenderer();

/**
 * Render a widget using switch-based dispatch
 * Matches React's renderWidget pattern
 */
function renderWidget<const TKey extends string>(
  widgetType: WidgetType,
  baseProps: {
    field: UnifiedField<TKey>;
    value: WidgetData;
    context: WidgetRenderContext;
  },
): string {
  switch (widgetType) {
    case WidgetType.TEXT:
      return textRenderer.render({ ...baseProps, widgetType } as CLIWidgetProps<
        typeof WidgetType.TEXT,
        TKey
      >);

    case WidgetType.TITLE:
      return titleRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.TITLE, TKey>);

    case WidgetType.SECTION:
      return sectionRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.SECTION, TKey>);

    case WidgetType.CONTAINER:
      return containerRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.CONTAINER, TKey>);

    case WidgetType.DATA_TABLE:
      return dataTableRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.DATA_TABLE, TKey>);

    case WidgetType.DATA_CARD:
      return dataCardRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.DATA_CARD, TKey>);

    case WidgetType.DATA_CARDS:
      return dataCardsRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.DATA_CARDS, TKey>);

    case WidgetType.DATA_LIST:
      return dataListRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.DATA_LIST, TKey>);

    case WidgetType.GROUPED_LIST:
      return groupedListRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.GROUPED_LIST, TKey>);

    case WidgetType.CODE_QUALITY_LIST:
      return codeQualityListRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.CODE_QUALITY_LIST, TKey>);

    case WidgetType.CODE_QUALITY_SUMMARY:
      return codeQualitySummaryRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.CODE_QUALITY_SUMMARY, TKey>);

    case WidgetType.CODE_QUALITY_FILES:
      return codeQualityFilesRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.CODE_QUALITY_FILES, TKey>);

    case WidgetType.CODE_OUTPUT:
      return codeOutputRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.CODE_OUTPUT, TKey>);

    case WidgetType.METRIC_CARD:
      return metricRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.METRIC_CARD, TKey>);

    case WidgetType.STATS_GRID:
      return statsGridRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.STATS_GRID, TKey>);

    case WidgetType.LINK:
      return linkRenderer.render({ ...baseProps, widgetType } as CLIWidgetProps<
        typeof WidgetType.LINK,
        TKey
      >);

    case WidgetType.LINK_CARD:
      return linkCardRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.LINK_CARD, TKey>);

    case WidgetType.LINK_LIST:
      return linkListRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.LINK_LIST, TKey>);

    case WidgetType.MARKDOWN:
      return markdownRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.MARKDOWN, TKey>);

    case WidgetType.MARKDOWN_EDITOR:
      return editableTextRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.MARKDOWN_EDITOR, TKey>);

    case WidgetType.BADGE:
      return badgeRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.BADGE, TKey>);

    case WidgetType.AVATAR:
      return avatarRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.AVATAR, TKey>);

    case WidgetType.EMPTY_STATE:
      return emptyStateRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.EMPTY_STATE, TKey>);

    case WidgetType.ERROR:
      return errorRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.ERROR, TKey>);

    case WidgetType.LOADING:
      return loadingRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.LOADING, TKey>);

    case WidgetType.TABS:
      return tabsRenderer.render({ ...baseProps, widgetType } as CLIWidgetProps<
        typeof WidgetType.TABS,
        TKey
      >);

    case WidgetType.ACCORDION:
      return accordionRenderer.render({
        ...baseProps,
        widgetType,
      } as CLIWidgetProps<typeof WidgetType.ACCORDION, TKey>);

    // Fallback to text widget
    default:
      return textRenderer.render({
        ...baseProps,
        widgetType: WidgetType.TEXT,
      } as CLIWidgetProps<typeof WidgetType.TEXT, TKey>);
  }
}

/**
 * Widget Registry class for compatibility with existing code
 */
export class WidgetRegistry {
  /**
   * Render a field using the appropriate widget renderer
   */
  render<const TKey extends string>(
    input: WidgetInput<TKey>,
    context: WidgetRenderContext,
  ): string {
    return renderWidget(input.field.ui.type, {
      field: input.field,
      value: input.value,
      context,
    });
  }

  /**
   * Render a widget with proper type dispatch
   */
  renderWidget<const TKey extends string>(
    widgetType: WidgetType,
    field: UnifiedField<TKey>,
    value: WidgetData,
    context: WidgetRenderContext,
  ): string {
    return renderWidget(widgetType, { field, value, context });
  }

  /**
   * Get renderer for a widget type (for compatibility)
   */
  getRenderer(widgetType: WidgetType): AnyWidgetRenderer {
    return {
      widgetType,
      render: (props) =>
        renderWidget(widgetType, {
          field: props.field,
          value: props.value,
          context: props.context,
        }),
    };
  }
}

/**
 * Default widget registry instance
 */
export const defaultWidgetRegistry = new WidgetRegistry();
