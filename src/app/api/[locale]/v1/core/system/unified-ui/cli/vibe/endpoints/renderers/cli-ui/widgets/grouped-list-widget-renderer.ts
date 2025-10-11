/**
 * Grouped List Widget Renderer
 * Specialized renderer for grouped lists with beautiful CLI output
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Grouped list widget renderer for organized data display
 */
export class GroupedListWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.GROUPED_LIST;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState("No issues found");
    }

    const config = this.getGroupedListConfig(field);

    // Group data by the specified field
    const groups = this.groupData(data, config.groupBy);

    let output = "";

    // Render each group
    for (const [groupKey, items] of groups) {
      output += this.renderGroup(groupKey, items, config, context);
      output += "\n";
    }

    // Add summary if requested
    if (config.showGroupSummary) {
      output += this.renderSummary(data, groups, config, context);
    }

    return output.trim();
  }

  /**
   * Get configuration for grouped list
   */
  private getGroupedListConfig(field: ResponseFieldMetadata): any {
    return {
      groupBy: field.groupBy || "file",
      sortBy: field.sortBy || "severity",
      showGroupSummary: field.showGroupSummary ?? true,
      maxItemsPerGroup: field.maxItemsPerGroup || 50,
      ...field.config,
    };
  }

  /**
   * Group data by specified field
   */
  private groupData(data: any[], groupBy: string): Map<string, any[]> {
    const groups = new Map<string, any[]>();

    for (const item of data) {
      const groupKey = item[groupBy] || "Unknown";
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }

    // Sort groups by key
    return new Map([...groups.entries()].sort());
  }

  /**
   * Render a single group
   */
  private renderGroup(
    groupKey: string,
    items: any[],
    config: any,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    // Group header with file path and count
    const groupHeader = this.renderGroupHeader(groupKey, items.length, context);
    output += `${groupHeader}\n`;

    // Sort items within group
    const sortedItems = this.sortItems(items, config.sortBy);

    // Render each item
    for (const item of sortedItems.slice(0, config.maxItemsPerGroup)) {
      const itemLine = this.renderGroupItem(item, context);
      output += `  ${itemLine}\n`;
    }

    // Show truncation message if needed
    if (items.length > config.maxItemsPerGroup) {
      const remaining = items.length - config.maxItemsPerGroup;
      const truncationMsg = this.styleText(
        `... and ${remaining} more issues`,
        "dim",
        context,
      );
      output += `  ${truncationMsg}\n`;
    }

    return output;
  }

  /**
   * Render group header
   */
  private renderGroupHeader(
    groupKey: string,
    itemCount: number,
    context: WidgetRenderContext,
  ): string {
    // Clean up file path for display
    const displayPath = this.formatFilePath(groupKey);
    const countText = `(${itemCount} issue${itemCount !== 1 ? "s" : ""})`;

    const pathText = this.styleText(displayPath, "underline", context);
    const countTextStyled = this.styleText(countText, "dim", context);

    return `📄 ${pathText} ${countTextStyled}`;
  }

  /**
   * Render individual group item (lint issue)
   */
  private renderGroupItem(item: any, context: WidgetRenderContext): string {
    const parts: string[] = [];

    // Location (line:column)
    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(this.styleText(location.padEnd(8), "blue", context));
    }

    // Severity with icon and color
    if (item.severity) {
      const severity = this.formatSeverity(item.severity, context);
      parts.push(severity.padEnd(12));
    }

    // Message
    if (item.message) {
      parts.push(item.message);
    }

    // Rule (if available)
    if (item.rule && item.rule !== "unknown") {
      const ruleText = this.styleText(`[${item.rule}]`, "dim", context);
      parts.push(ruleText);
    }

    return parts.join(" ");
  }

  /**
   * Sort items within a group
   */
  private sortItems(items: any[], sortBy: string): any[] {
    return [...items].sort((a, b) => {
      if (sortBy === "severity") {
        const severityOrder = { error: 0, warning: 1, info: 2 };
        const aOrder =
          severityOrder[a.severity as keyof typeof severityOrder] ?? 3;
        const bOrder =
          severityOrder[b.severity as keyof typeof severityOrder] ?? 3;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
      }

      // Secondary sort by line number
      if (a.line && b.line) {
        return a.line - b.line;
      }

      return 0;
    });
  }

  /**
   * Format file path for display
   */
  private formatFilePath(filePath: string): string {
    // Remove current working directory prefix if present
    const cwd = process.cwd();
    if (filePath.startsWith(cwd)) {
      return filePath.substring(cwd.length + 1);
    }
    return filePath;
  }

  /**
   * Format location (line:column)
   */
  private formatLocation(line?: number, column?: number): string {
    if (line && column) {
      return `${line}:${column}`;
    } else if (line) {
      return `${line}:0`;
    }
    return "0:0";
  }

  /**
   * Format severity with icon and color
   */
  private formatSeverity(
    severity: string,
    context: WidgetRenderContext,
  ): string {
    const icons = context.options.useEmojis;

    switch (severity) {
      case "error":
        const errorIcon = icons ? "❌" : "✗";
        const errorText = this.styleText("error", "red", context);
        return `${errorIcon} ${errorText}`;
      case "warning":
        const warnIcon = icons ? "⚠️" : "!";
        const warnText = this.styleText("warn", "yellow", context);
        return `${warnIcon} ${warnText}`;
      case "info":
        const infoIcon = icons ? "ℹ️" : "i";
        const infoText = this.styleText("info", "blue", context);
        return `${infoIcon} ${infoText}`;
      default:
        return severity;
    }
  }

  /**
   * Render summary statistics with beautiful formatting
   */

  private renderSummary(
    data: any[],
    groups: Map<string, any[]>,
    config: any,
    context: WidgetRenderContext,
  ): string {
    // Skip summary if not configured
    if (!config.showGroupSummary) {
      return "";
    }

    let output = "";

    // Add affected files list first
    output += this.renderAffectedFilesList(groups, context);

    // Then add summary section
    output += "\n\n";

    // Beautiful header with separator
    const headerIcon = context.options.useEmojis ? "📊 " : "";
    const summaryTitle = config.summaryTitle || "Summary";
    const headerText = this.styleText(
      headerIcon + summaryTitle,
      "bold",
      context,
    );
    output += `${headerText}\n`;

    // Add subtle separator line
    const separatorLength = 50;
    const separator = "─".repeat(separatorLength);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // Meaningful summary stats for code quality tools
    const totalIssues = data.length;
    const totalFiles = groups.size;
    const errors = data.filter((item) => item.severity === "error").length;
    const warnings = data.filter((item) => item.severity === "warning").length;

    // Show meaningful metrics
    output += `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${totalFiles}\n`;
    output += `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${totalIssues}\n`;

    if (errors > 0) {
      const errorIcon = context.options.useEmojis ? "❌ " : "";
      const errorText = this.styleText(`${errors} errors`, "red", context);
      output += `   ${errorIcon}${errorText}\n`;
    }

    if (warnings > 0) {
      const warnIcon = context.options.useEmojis ? "⚠️ " : "";
      const warnText = this.styleText(
        `${warnings} warnings`,
        "yellow",
        context,
      );
      output += `   ${warnIcon}${warnText}\n`;
    }

    // Custom summary stats if configured
    if (config.summaryStats) {
      for (const stat of config.summaryStats) {
        const count = this.calculateStatCount(data, stat);
        if (count > 0) {
          const icon =
            context.options.useEmojis && stat.icon ? `${stat.icon} ` : "";
          const label = stat.label || stat.field;
          const color = stat.color || "default";
          const statText = this.styleText(`${count} ${label}`, color, context);
          output += `   ${icon}${statText}\n`;
        }
      }
    }

    return output;
  }

  /**
   * Render a clean list of affected files with error counts
   */
  private renderAffectedFilesList(
    groups: Map<string, any[]>,
    context: WidgetRenderContext,
  ): string {
    if (groups.size === 0) {
      return "";
    }

    let output = "\n\n";

    // Header
    const headerIcon = context.options.useEmojis ? "📋 " : "";
    const headerText = this.styleText(
      `${headerIcon}Affected Files`,
      "bold",
      context,
    );
    output += `${headerText}\n`;

    // Separator
    const separator = "─".repeat(50);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // Sort files by error count (descending)
    const sortedFiles = Array.from(groups.entries()).sort(
      ([, a], [, b]) => b.length - a.length,
    );

    // List each file with its error count
    for (const [fileName, issues] of sortedFiles) {
      const errorCount = issues.filter(
        (item) => item.severity === "error",
      ).length;
      const warningCount = issues.filter(
        (item) => item.severity === "warning",
      ).length;

      let countText = "";
      if (errorCount > 0 && warningCount > 0) {
        countText = this.styleText(
          `${errorCount} errors, ${warningCount} warnings`,
          "red",
          context,
        );
      } else if (errorCount > 0) {
        countText = this.styleText(`${errorCount} errors`, "red", context);
      } else if (warningCount > 0) {
        countText = this.styleText(
          `${warningCount} warnings`,
          "yellow",
          context,
        );
      } else {
        countText = this.styleText(`${issues.length} issues`, "dim", context);
      }

      const fileIcon = context.options.useEmojis ? "📄 " : "";
      const fileText = fileName; // No styling for file names

      output += `   ${fileIcon}${fileText} (${countText})\n`;
    }

    return output;
  }

  /**
   * Calculate count for a specific stat configuration
   */
  private calculateStatCount(data: any[], stat: any): number {
    if (!stat.field || !stat.value) {
      return 0;
    }

    return data.filter((item) => {
      const fieldValue = item[stat.field];
      return fieldValue === stat.value;
    }).length;
  }
}
