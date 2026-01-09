/**
 * Data Cards Widget Renderer
 *
 * Handles DATA_CARDS widget type with configurable templates for different display formats.
 * Supports multiple rendering modes:
 * - ESLint-style issue cards (grouped by file)
 * - Code issue cards (detailed format with file headers)
 * - Default cards (generic key-value display)
 *
 * Features:
 * - Automatic grouping by specified field
 * - Severity-based styling and icons
 * - Configurable layouts and spacing
 * - Summary generation with custom templates
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  isWidgetDataArray,
  isWidgetDataBoolean,
  isWidgetDataObject,
  isWidgetDataPrimitive,
  isWidgetDataString,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

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
  [key: string]: WidgetData;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

export class DataCardsWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.DATA_CARDS> {
  readonly widgetType = WidgetType.DATA_CARDS;

  render(props: CLIWidgetProps<typeof WidgetType.DATA_CARDS, string>): string {
    const { field, value, context } = props;
    const t = context.t;

    // Type narrow to array for data cards
    if (!isWidgetDataArray(value) || value.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Extract data with type narrowing
    const typedData: CardItem[] = value.filter((item): item is CardItem =>
      isWidgetDataObject(item),
    ) as CardItem[];

    if (typedData.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Extract config directly with proper types (field is already narrowed here)
    const ui = field.ui;
    const config: CardConfig = {
      layout: {
        columns: ui.layout?.columns ?? 2,
        spacing: ui.layout?.spacing ?? "normal",
      },
      groupBy: ui.groupBy,
      cardTemplate: ui.cardTemplate ?? "default",
      showSummary: ui.showSummary ?? false,
      summaryTemplate: ui.summaryTemplate,
      itemConfig: {
        template: ui.itemConfig?.template ?? "default",
        size: ui.itemConfig?.size ?? "medium",
        spacing: ui.itemConfig?.spacing ?? "normal",
      },
    };

    switch (config.cardTemplate) {
      case "eslint-issue":
        return this.renderESLintCards(typedData, config, context);
      case "code-issue":
        return this.renderCodeIssueCards(typedData, config, context);
      default:
        return this.renderDefaultCards(typedData, context);
    }
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
  private renderESLintIssue(item: CardItem, context: WidgetRenderContext): string {
    const parts: string[] = [];

    // Location (line:column)
    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(location.padEnd(10));
    }

    // Severity with icon and color
    const severityStr = isWidgetDataString(item.severity, context);
    if (severityStr) {
      const severity = this.formatSeverity(severityStr, context);
      parts.push(severity.padEnd(9));
    }

    // Message
    const messageStr = isWidgetDataString(item.message, context);
    if (messageStr) {
      parts.push(messageStr);
    }

    // Rule (if available)
    const ruleStr = isWidgetDataString(item.rule, context);
    if (ruleStr) {
      parts.push(this.styleText(ruleStr, "dim", context));
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
  private renderCodeIssueCard(item: CardItem, context: WidgetRenderContext): string {
    const lines: string[] = [];

    // Header with file and location
    const header = this.buildCardHeader(item, context);
    lines.push(header);

    // Severity and message
    const severityStr = isWidgetDataString(item.severity, context) || "info";
    const severity = this.formatSeverity(severityStr, context);
    const messageStr = isWidgetDataString(item.message, context) || "";
    lines.push(`${severity} ${messageStr}`);

    // Rule if available
    const ruleStr = isWidgetDataString(item.rule, context);
    if (ruleStr) {
      // eslint-disable-next-line i18next/no-literal-string
      const rule = this.styleText(`Rule: ${ruleStr}`, "dim", context);
      lines.push(rule);
    }

    return lines.join("\n");
  }

  /**
   * Render default cards format
   */
  private renderDefaultCards(data: CardItem[], context: WidgetRenderContext): string {
    const result: string[] = [];
    const indent = this.createIndent(context.depth, context);

    for (const item of data) {
      const card = this.renderDefaultCard(item, context);
      result.push(indent + card);
    }

    return result.join("\n\n");
  }

  /**
   * Render default card format.
   * Uses centralized renderValue helper for consistent formatting.
   */
  private renderDefaultCard(item: CardItem, context: WidgetRenderContext): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(item)) {
      const label = this.styleText(key, "bold", context);
      // Use centralized renderValue for consistent formatting across all value types
      const formattedValue = this.renderValue(value, context);
      lines.push(`${label}: ${formattedValue}`);
    }

    return lines.join("\n");
  }

  /**
   * Build card header with file and location info
   */
  private buildCardHeader(item: CardItem, context: WidgetRenderContext): string {
    const parts: string[] = [];

    const fileStr = isWidgetDataString(item.file, context);
    if (fileStr) {
      parts.push(this.styleText(fileStr, "bold", context));
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
  private formatSeverity(severity: string, context: WidgetRenderContext): string {
    const icon = context.options.useEmojis ? this.getSeverityIcon(severity) : "";
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
    const severityCounts = this.countBySeverity(data, context);

    if (config.summaryTemplate) {
      return this.renderCustomSummary(severityCounts, config.summaryTemplate);
    }

    return this.renderDefaultSummary(severityCounts, context);
  }

  /**
   * Render custom summary using template
   */
  private renderCustomSummary(counts: Record<string, number>, template: string): string {
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
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (totalCount === 0) {
      const icon = context.options.useEmojis ? SEVERITY_ICONS.SUCCESS : "";
      const text = t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
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
  private groupData(data: CardItem[], groupBy: string): Map<string, CardItem[]> {
    const groups = new Map<string, CardItem[]>();

    for (const item of data) {
      const groupValue = item[groupBy];
      let groupKey = "unknown";
      if (isWidgetDataPrimitive(groupValue) && groupValue !== null && groupValue !== undefined) {
        if (isWidgetDataBoolean(groupValue)) {
          groupKey = groupValue ? "true" : "false";
        } else {
          groupKey = String(groupValue);
        }
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
  private countBySeverity(data: CardItem[], context: WidgetRenderContext): Record<string, number> {
    const counts: Record<string, number> = { error: 0, warning: 0, info: 0 };

    for (const item of data) {
      const severityValue = item.severity;
      const severity = isWidgetDataString(severityValue, context) || "info";
      if (severity in counts) {
        counts[severity]++;
      } else {
        counts[severity] = 1;
      }
    }

    return counts;
  }
}
