/**
 * Data Cards Widget Renderer
 * Handles DATA_CARDS widget type with configurable templates for different display formats
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

// Severity icon constants
const SEVERITY_ICONS = {
  ERROR: "✖ ",
  WARNING: "⚠ ",
  INFO: "ℹ ",
  DEFAULT: "• ",
  SUCCESS: "✨ ",
} as const;

/**
 * Configuration for card rendering
 */
interface CardConfig {
  layout: {
    columns: number;
    spacing: string;
  };
  groupBy?: string;
  cardTemplate: string;
  showSummary: boolean;
  summaryTemplate?: string;
  itemConfig: {
    template: string;
    size: string;
    spacing: string;
  };
}

/**
 * Individual item in a card collection
 */
interface CardItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | CardItem
    | CardItem[];
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

/**
 * Data cards widget renderer with template-based formatting
 */
export class DataCardsWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_CARDS;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const t = context.t;
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Type narrow the array items to CardItem
    const typedData: CardItem[] = data.filter(
      (item): item is CardItem => typeof item === "object" && item !== null,
    );

    const config = this.getCardsConfig(field);

    // Handle different card templates
    switch (config.cardTemplate) {
      case "eslint-issue":
        return this.renderESLintCards(typedData, config, context);
      case "code-issue":
        return this.renderCodeIssueCards(typedData, config, context);
      default:
        return this.renderDefaultCards(typedData, config, context);
    }
  }

  private getCardsConfig(field: ResponseFieldMetadata): CardConfig {
    const config = field.config || {};

    // Handle layout config - ensure it's an object
    let layout: { columns: number; spacing: string } = {
      columns: 2,
      spacing: "normal",
    };
    if (
      config.layout &&
      typeof config.layout === "object" &&
      "columns" in config.layout &&
      "spacing" in config.layout
    ) {
      layout = {
        columns:
          typeof config.layout.columns === "number" ? config.layout.columns : 2,
        spacing:
          typeof config.layout.spacing === "string"
            ? config.layout.spacing
            : "normal",
      };
    }

    return {
      layout,
      groupBy:
        config.groupBy !== undefined ? String(config.groupBy) : undefined,
      cardTemplate:
        config.cardTemplate !== undefined
          ? String(config.cardTemplate)
          : "default",
      showSummary:
        config.showSummary !== undefined ? Boolean(config.showSummary) : false,
      summaryTemplate:
        config.summaryTemplate !== undefined
          ? String(config.summaryTemplate)
          : undefined,
      itemConfig:
        config.itemConfig &&
        typeof config.itemConfig === "object" &&
        "template" in config.itemConfig &&
        "size" in config.itemConfig &&
        "spacing" in config.itemConfig
          ? {
              template:
                typeof config.itemConfig.template === "string"
                  ? config.itemConfig.template
                  : "default",
              size:
                typeof config.itemConfig.size === "string"
                  ? config.itemConfig.size
                  : "medium",
              spacing:
                typeof config.itemConfig.spacing === "string"
                  ? config.itemConfig.spacing
                  : "normal",
            }
          : {
              template: "default",
              size: "medium",
              spacing: "normal",
            },
    };
  }

  /**
   * Render cards in ESLint-like format (grouped by file)
   */
  private renderESLintCards(
    data: CardItem[],
    config: CardConfig,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    if (config.groupBy) {
      const groups = this.groupData(data, config.groupBy);

      for (const [groupKey, items] of groups) {
        // File header
        const fileHeader = this.styleText(groupKey, "underline", context);
        // eslint-disable-next-line i18next/no-literal-string
        output += `\n${fileHeader}\n`;

        // Issues for this file
        for (const item of items) {
          const line = this.renderESLintIssue(item, context);
          // eslint-disable-next-line i18next/no-literal-string
          output += `  ${line}\n`;
        }
      }
    } else {
      // Flat list
      for (const item of data) {
        const line = this.renderESLintIssue(item, context);
        // eslint-disable-next-line i18next/no-literal-string
        output += `${line}\n`;
      }
    }

    // Summary
    if (config.showSummary) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `\n${this.renderSummary(data, config, context)}`;
    }

    return output;
  }

  /**
   * Render individual ESLint issue
   */
  private renderESLintIssue(
    item: CardItem,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    // Location (line:column)
    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(location.padEnd(10));
    }

    // Severity with icon and color
    if (item.severity && typeof item.severity === "string") {
      const severity = this.formatSeverity(item.severity, context);
      parts.push(severity.padEnd(9));
    }

    // Message
    if (item.message && typeof item.message === "string") {
      parts.push(item.message);
    }

    // Rule (if available)
    if (item.rule && typeof item.rule === "string") {
      parts.push(this.styleText(item.rule, "dim", context));
    }

    return parts.join(" ");
  }

  /**
   * Render cards for code issues (more detailed format)
   */
  private renderCodeIssueCards(
    data: CardItem[],
    config: CardConfig,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];
    const indent = this.createIndent(context.depth, context);

    for (const item of data) {
      const card = this.renderCodeIssueCard(item, context);
      result.push(indent + card);
    }

    if (config.showSummary) {
      result.push("");
      result.push(indent + this.renderSummary(data, config, context));
    }

    return result.join("\n");
  }

  /**
   * Render individual code issue card
   */
  private renderCodeIssueCard(
    item: CardItem,
    context: WidgetRenderContext,
  ): string {
    const lines: string[] = [];

    // Header with file and location
    const header = this.buildCardHeader(item, context);
    lines.push(header);

    // Severity and message
    const severityStr =
      item.severity && typeof item.severity === "string"
        ? item.severity
        : "info";
    const severity = this.formatSeverity(severityStr, context);
    const message =
      item.message && typeof item.message === "string" ? item.message : "";
    lines.push(`${severity} ${message}`);

    // Rule if available
    if (item.rule && typeof item.rule === "string") {
      // eslint-disable-next-line i18next/no-literal-string
      const rule = this.styleText(`Rule: ${item.rule}`, "dim", context);
      lines.push(rule);
    }

    return lines.join("\n");
  }

  /**
   * Render default cards format
   */
  private renderDefaultCards(
    data: CardItem[],
    config: CardConfig,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];
    const indent = this.createIndent(context.depth, context);

    for (const item of data) {
      const card = this.renderDefaultCard(item, context);
      result.push(indent + card);
    }

    return result.join("\n\n");
  }

  /**
   * Render default card format
   */
  private renderDefaultCard(
    item: CardItem,
    context: WidgetRenderContext,
  ): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(item)) {
      const label = this.styleText(key, "bold", context);
      let formattedValue = "";
      if (typeof value === "string") {
        formattedValue = value;
      } else if (typeof value === "number") {
        formattedValue = String(value);
      } else if (typeof value === "boolean") {
        formattedValue = value ? "true" : "false";
      } else if (value === null) {
        formattedValue = "null";
      } else if (value === undefined) {
        formattedValue = "undefined";
      }
      lines.push(`${label}: ${formattedValue}`);
    }

    return lines.join("\n");
  }

  /**
   * Build card header with file and location info
   */
  private buildCardHeader(
    item: CardItem,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    if (item.file && typeof item.file === "string") {
      parts.push(this.styleText(item.file, "bold", context));
    }

    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      // eslint-disable-next-line i18next/no-literal-string
      parts.push(this.styleText(`(${location})`, "dim", context));
    }

    return parts.join(" ");
  }

  /**
   * Format location (line:column)
   */
  private formatLocation(line?: number, column?: number): string {
    if (!line && !column) {
      return "";
    }
    if (line && column) {
      return `${line}:${column}`;
    }
    if (line) {
      // eslint-disable-next-line i18next/no-literal-string
      return `${line}:0`;
    }

    return "";
  }

  /**
   * Format severity with colors and icons
   */
  private formatSeverity(
    severity: string,
    context: WidgetRenderContext,
  ): string {
    const icon = context.options.useEmojis
      ? this.getSeverityIcon(severity)
      : "";
    const text = severity;

    if (!context.options.useColors) {
      return `${icon}${text}`;
    }

    switch (severity) {
      case "error":
        return `${icon}${this.styleText(text, "red", context)}`;
      case "warning":
        return `${icon}${this.styleText(text, "yellow", context)}`;
      case "info":
        return `${icon}${this.styleText(text, "blue", context)}`;
      default:
        return `${icon}${text}`;
    }
  }

  /**
   * Get severity icon
   */
  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case "error":
        return SEVERITY_ICONS.ERROR;
      case "warning":
        return SEVERITY_ICONS.WARNING;
      case "info":
        return SEVERITY_ICONS.INFO;
      default:
        return SEVERITY_ICONS.DEFAULT;
    }
  }

  /**
   * Render summary
   */
  private renderSummary(
    data: CardItem[],
    config: CardConfig,
    context: WidgetRenderContext,
  ): string {
    const severityCounts = this.countBySeverity(data);

    if (config.summaryTemplate) {
      return this.renderCustomSummary(severityCounts, config.summaryTemplate);
    }

    return this.renderDefaultSummary(severityCounts, context);
  }

  /**
   * Render custom summary using template
   */
  private renderCustomSummary(
    counts: Record<string, number>,
    template: string,
  ): string {
    let summary = template;
    for (const [key, value] of Object.entries(counts)) {
      // Use replaceAll for better performance than RegExp in loop
      // eslint-disable-next-line i18next/no-literal-string
      summary = summary.replaceAll(`{${key}}`, String(value));
    }
    return summary;
  }

  /**
   * Render default summary
   */
  private renderDefaultSummary(
    counts: Record<string, number>,
    context: WidgetRenderContext,
  ): string {
    const t = context.t;
    const totalCount = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalCount === 0) {
      const icon = context.options.useEmojis ? SEVERITY_ICONS.SUCCESS : "";
      const text = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
      );
      return this.styleText(`${icon}${text}`, "green", context);
    }

    const parts: string[] = [];
    const icon = context.options.useEmojis ? SEVERITY_ICONS.ERROR : "";

    if (counts.error > 0) {
      const errorText = `${counts.error} error${counts.error === 1 ? "" : "s"}`;
      parts.push(this.styleText(errorText, "red", context));
    }

    if (counts.warning > 0) {
      const warningText = `${counts.warning} warning${counts.warning === 1 ? "" : "s"}`;
      parts.push(this.styleText(warningText, "yellow", context));
    }

    if (parts.length === 1) {
      return `${icon}${parts[0]}`;
    } else if (parts.length > 1) {
      const problemText = `${totalCount} problem${totalCount === 1 ? "" : "s"}`;
      // eslint-disable-next-line i18next/no-literal-string
      return `${icon}${problemText} (${parts.join(", ")})`;
    }

    return `${icon}${totalCount} issue${totalCount === 1 ? "" : "s"}`;
  }

  /**
   * Group data by specified field
   */
  private groupData(
    data: CardItem[],
    groupBy: string,
  ): Map<string, CardItem[]> {
    const groups = new Map<string, CardItem[]>();

    for (const item of data) {
      const groupValue = item[groupBy];
      let groupKey = "unknown";
      if (typeof groupValue === "string") {
        groupKey = groupValue;
      } else if (typeof groupValue === "number") {
        groupKey = String(groupValue);
      } else if (typeof groupValue === "boolean") {
        groupKey = groupValue ? "true" : "false";
      } else if (groupValue !== null && groupValue !== undefined) {
        groupKey = "unknown";
      }
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }

    return groups;
  }

  /**
   * Count items by severity
   */
  private countBySeverity(data: CardItem[]): Record<string, number> {
    const counts: Record<string, number> = { error: 0, warning: 0, info: 0 };

    for (const item of data) {
      const severityValue = item.severity;
      let severity = "info";
      if (typeof severityValue === "string") {
        severity = severityValue;
      }
      if (severity in counts) {
        counts[severity]++;
      } else {
        counts[severity] = 1;
      }
    }

    return counts;
  }
}
