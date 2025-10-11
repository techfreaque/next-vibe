/**
 * Data Cards Widget Renderer
 * Handles DATA_CARDS widget type with configurable templates for different display formats
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Data cards widget renderer with template-based formatting
 */
export class DataCardsWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_CARDS;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState("No data available");
    }

    const config = this.getCardsConfig(field);

    // Handle different card templates
    switch (config.cardTemplate) {
      case "eslint-issue":
        return this.renderESLintCards(data, config, context);
      case "code-issue":
        return this.renderCodeIssueCards(data, config, context);
      default:
        return this.renderDefaultCards(data, config, context);
    }
  }

  private getCardsConfig(field: ResponseFieldMetadata) {
    const config = field.config || {};

    return {
      layout: config.layout || { columns: 2, spacing: "normal" },
      groupBy: config.groupBy,
      cardTemplate: config.cardTemplate || "default",
      showSummary: config.showSummary ?? false,
      summaryTemplate: config.summaryTemplate,
      itemConfig: config.itemConfig || {
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
    data: any[],
    config: any,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    if (config.groupBy) {
      const groups = this.groupData(data, config.groupBy);

      for (const [groupKey, items] of groups) {
        // File header
        const fileHeader = this.styleText(groupKey, "underline", context);
        output += `\n${fileHeader}\n`;

        // Issues for this file
        for (const item of items) {
          const line = this.renderESLintIssue(item, context);
          output += `  ${line}\n`;
        }
      }
    } else {
      // Flat list
      for (const item of data) {
        const line = this.renderESLintIssue(item, context);
        output += `${line}\n`;
      }
    }

    // Summary
    if (config.showSummary) {
      output += `\n${this.renderSummary(data, config, context)}`;
    }

    return output;
  }

  /**
   * Render individual ESLint issue
   */
  private renderESLintIssue(item: any, context: WidgetRenderContext): string {
    const parts: string[] = [];

    // Location (line:column)
    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(location.padEnd(10));
    }

    // Severity with icon and color
    if (item.severity) {
      const severity = this.formatSeverity(item.severity, context);
      parts.push(severity.padEnd(9));
    }

    // Message
    if (item.message) {
      parts.push(item.message);
    }

    // Rule (if available)
    if (item.rule) {
      parts.push(this.styleText(item.rule, "dim", context));
    }

    return parts.join(" ");
  }

  /**
   * Render cards for code issues (more detailed format)
   */
  private renderCodeIssueCards(
    data: any[],
    config: any,
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
  private renderCodeIssueCard(item: any, context: WidgetRenderContext): string {
    const lines: string[] = [];

    // Header with file and location
    const header = this.buildCardHeader(item, context);
    lines.push(header);

    // Severity and message
    const severity = this.formatSeverity(item.severity, context);
    const message = item.message || "";
    lines.push(`${severity} ${message}`);

    // Rule if available
    if (item.rule) {
      const rule = this.styleText(`Rule: ${item.rule}`, "dim", context);
      lines.push(rule);
    }

    return lines.join("\n");
  }

  /**
   * Render default cards format
   */
  private renderDefaultCards(
    data: any[],
    config: any,
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
  private renderDefaultCard(item: any, context: WidgetRenderContext): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(item)) {
      const label = this.styleText(key, "bold", context);
      const formattedValue = String(value);
      lines.push(`${label}: ${formattedValue}`);
    }

    return lines.join("\n");
  }

  /**
   * Build card header with file and location info
   */
  private buildCardHeader(item: any, context: WidgetRenderContext): string {
    const parts: string[] = [];

    if (item.file) {
      parts.push(this.styleText(item.file, "bold", context));
    }

    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
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
        return "✖ ";
      case "warning":
        return "⚠ ";
      case "info":
        return "ℹ ";
      default:
        return "• ";
    }
  }

  /**
   * Render summary
   */
  private renderSummary(
    data: any[],
    config: any,
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
      summary = summary.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
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
    const totalCount = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalCount === 0) {
      const icon = context.options.useEmojis ? "✨ " : "";
      const text = "No issues found";
      return this.styleText(`${icon}${text}`, "green", context);
    }

    const parts: string[] = [];
    const icon = context.options.useEmojis ? "✖ " : "";

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
      return `${icon}${problemText} (${parts.join(", ")})`;
    }

    return `${icon}${totalCount} issue${totalCount === 1 ? "" : "s"}`;
  }

  /**
   * Group data by specified field
   */
  private groupData(data: any[], groupBy: string): Map<string, any[]> {
    const groups = new Map<string, any[]>();

    for (const item of data) {
      const groupKey = item[groupBy] || "unknown";
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
  private countBySeverity(data: any[]): Record<string, number> {
    const counts: Record<string, number> = { error: 0, warning: 0, info: 0 };

    for (const item of data) {
      const severity = item.severity || "info";
      if (severity in counts) {
        counts[severity]++;
      } else {
        counts[severity] = 1;
      }
    }

    return counts;
  }
}
