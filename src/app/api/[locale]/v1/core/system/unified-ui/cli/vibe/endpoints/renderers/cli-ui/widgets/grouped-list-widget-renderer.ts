/**
 * Grouped List Widget Renderer
 * Specialized renderer for grouped lists with beautiful CLI output
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Configuration for grouped list rendering
 */
interface GroupedListConfig {
  groupBy: string;
  sortBy: string;
  showGroupSummary: boolean;
  maxItemsPerGroup: number;
  summaryTitle?: string;
  summaryStats?: StatConfig[];
}

/**
 * Individual item in a grouped list
 */
interface GroupedListItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | GroupedListItem
    | GroupedListItem[];
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
}

/**
 * Configuration for summary statistics
 */
interface StatConfig {
  field: string;
  value: string;
  label?: string;
  icon?: string;
  color?: string;
}

/**
 * Grouped list widget renderer for organized data display
 */
export class GroupedListWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.GROUPED_LIST;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const t = context.translate;
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Type narrow the array items to GroupedListItem
    const typedData: GroupedListItem[] = data.filter(
      (item): item is GroupedListItem =>
        typeof item === "object" && item !== null,
    );
    const config = this.getGroupedListConfig(field);

    // Group data by the specified field
    const groups = this.groupData(typedData, config.groupBy, context);

    let output = "";

    // Render each group
    for (const [groupKey, items] of groups) {
      output += this.renderGroup(groupKey, items, config, context);
      output += "\n";
    }

    // Add summary if requested
    if (config.showGroupSummary) {
      output += this.renderSummary(typedData, groups, config, context);
    }

    return output.trim();
  }

  /**
   * Get configuration for grouped list
   */
  private getGroupedListConfig(
    field: ResponseFieldMetadata,
  ): GroupedListConfig {
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
  private groupData(
    data: GroupedListItem[],
    groupBy: string,
    context: WidgetRenderContext,
  ): Map<string, GroupedListItem[]> {
    const t = context.translate;
    const groups = new Map<string, GroupedListItem[]>();
    const otherLabel = t(
      "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.other",
    );

    for (const item of data) {
      const groupValue = item[groupBy];
      let groupKey = otherLabel;
      if (typeof groupValue === "string") {
        groupKey = groupValue;
      } else if (typeof groupValue === "number") {
        groupKey = String(groupValue);
      } else if (typeof groupValue === "boolean") {
        groupKey = groupValue ? "true" : "false";
      } else if (groupValue !== null && groupValue !== undefined) {
        groupKey = otherLabel;
      }
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }

    // Sort groups by filename (alphabetically)
    return new Map([...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }

  /**
   * Render a single group
   */
  private renderGroup(
    groupKey: string,
    items: GroupedListItem[],
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    // Group header with file path and count
    const groupHeader = this.renderGroupHeader(groupKey, items.length, context);
    output += `${groupHeader}${String.fromCharCode(10)}`;

    // Sort items within group
    const sortedItems = this.sortItems(items, config.sortBy);

    // Render each item
    for (const item of sortedItems.slice(0, config.maxItemsPerGroup)) {
      const itemLine = this.renderGroupItem(item, context);
      output += `  ${itemLine}${String.fromCharCode(10)}`;
    }

    // Show truncation message if needed
    if (items.length > config.maxItemsPerGroup) {
      const t = context.translate;
      const remaining = items.length - config.maxItemsPerGroup;
      const truncationMsg = this.styleText(
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.andMoreItems",
          { count: remaining.toString() },
        ),
        "dim",
        context,
      );
      output += `  ${truncationMsg}${String.fromCharCode(10)}`;
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
    const countText = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

    const pathText = this.styleText(displayPath, "underline", context);
    const countTextStyled = this.styleText(
      String.fromCharCode(40) + countText + String.fromCharCode(41),
      "dim",
      context,
    );

    const fileIcon = context.options.useEmojis
      ? `${String.fromCharCode(128196)} `
      : "";
    return `${fileIcon}${pathText} ${countTextStyled}`;
  }

  /**
   * Render individual group item (lint issue)
   */
  private renderGroupItem(
    item: GroupedListItem,
    context: WidgetRenderContext,
  ): string {
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
    if (item.rule && typeof item.rule === "string" && item.rule !== "unknown") {
      const ruleText = this.styleText(`[${item.rule}]`, "dim", context);
      parts.push(ruleText);
    }

    return parts.join(" ");
  }

  /**
   * Sort items within a group
   */
  private sortItems(
    items: GroupedListItem[],
    sortBy: string,
  ): GroupedListItem[] {
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
      if (typeof a.line === "number" && typeof b.line === "number") {
        return a.line - b.line;
      }

      return 0;
    });
  }

  /**
   * Format file path for display
   */
  private formatFilePath(filePath: string): string {
    // Return file path as-is - CWD stripping not available without process
    return filePath;
  }

  /**
   * Format location (line:column)
   */
  private formatLocation(line?: number, column?: number): string {
    if (typeof line === "number" && typeof column === "number") {
      return `${line}:${column}`;
    } else if (typeof line === "number") {
      return `${line}:${0}`;
    }
    return `${0}:${0}`;
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
      case "error": {
        const errorIcon = icons
          ? `${String.fromCharCode(10060)} `
          : `${String.fromCharCode(10007)} `;
        const errorText = this.styleText("error", "red", context);
        return `${errorIcon}${errorText}`;
      }
      case "warning": {
        const warnIcon = icons
          ? `${String.fromCharCode(9888)}${String.fromCharCode(65039)} `
          : `${String.fromCharCode(33)}  `;
        const warnText = this.styleText("warn", "yellow", context);
        return `${warnIcon}${warnText}`;
      }
      case "info": {
        const infoIcon = icons
          ? `${String.fromCharCode(8505)}${String.fromCharCode(65039)} `
          : `${String.fromCharCode(105)} `;
        const infoText = this.styleText("info", "blue", context);
        return `${infoIcon}${infoText}`;
      }
      default:
        return severity;
    }
  }

  /**
   * Render summary statistics with beautiful formatting
   */

  private renderSummary(
    data: GroupedListItem[],
    groups: Map<string, GroupedListItem[]>,
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    const t = context.translate;
    // Skip summary if not configured
    if (!config.showGroupSummary) {
      return "";
    }

    let output = "";

    // Add affected files list first
    output += this.renderAffectedFilesList(groups, context);

    // Then add summary section
    output += String.fromCharCode(10) + String.fromCharCode(10);

    // Beautiful header with separator
    const headerIcon = context.options.useEmojis
      ? `${String.fromCharCode(128202)} `
      : "";
    const summaryTitle =
      config.summaryTitle ||
      t(
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.summary",
      );
    const headerText = this.styleText(
      `${headerIcon}${summaryTitle}`,
      "bold",
      context,
    );
    output += `${headerText}${String.fromCharCode(10)}`;

    // Add subtle separator line
    const separatorLength = 50;
    const separator = String.fromCharCode(9472).repeat(separatorLength);
    output += `${this.styleText(separator, "dim", context)}${String.fromCharCode(10)}`;

    // Meaningful summary stats for code quality tools
    const totalIssues = data.length;
    const totalFiles = groups.size;
    const errors = data.filter((item) => item.severity === "error").length;
    const warnings = data.filter((item) => item.severity === "warning").length;

    // Show meaningful metrics
    const filesLabel = t(
      "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.files",
    );
    const issuesLabel = t(
      "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.issues",
    );
    output += `   ${this.styleText(`${filesLabel}:`, "dim", context).padEnd(12)} ${totalFiles}${String.fromCharCode(10)}`;
    output += `   ${this.styleText(`${issuesLabel}:`, "dim", context).padEnd(12)} ${totalIssues}${String.fromCharCode(10)}`;

    if (errors > 0) {
      const errorIcon = context.options.useEmojis
        ? `${String.fromCharCode(10060)} `
        : "";
      const errorText = this.styleText(
        `${errors} error${errors !== 1 ? "s" : ""}`,
        "red",
        context,
      );
      output += `   ${errorIcon}${errorText}${String.fromCharCode(10)}`;
    }

    if (warnings > 0) {
      const warnIcon = context.options.useEmojis
        ? `${String.fromCharCode(9888)}${String.fromCharCode(65039)} `
        : "";
      const warnText = this.styleText(
        `${warnings} warning${warnings !== 1 ? "s" : ""}`,
        "yellow",
        context,
      );
      output += `   ${warnIcon}${warnText}${String.fromCharCode(10)}`;
    }

    // Custom summary stats if configured
    if (config.summaryStats && Array.isArray(config.summaryStats)) {
      for (const stat of config.summaryStats) {
        const count = this.calculateStatCount(data, stat);
        if (count > 0) {
          const icon =
            context.options.useEmojis && stat.icon ? `${stat.icon} ` : "";
          const label = stat.label || stat.field;
          const color = stat.color || "dim";
          const validColor =
            color === "red" ||
            color === "yellow" ||
            color === "blue" ||
            color === "green" ||
            color === "dim" ||
            color === "bold" ||
            color === "underline"
              ? color
              : "dim";
          const statText = this.styleText(
            `${count} ${label}`,
            validColor,
            context,
          );
          output += `   ${icon}${statText}${String.fromCharCode(10)}`;
        }
      }
    }

    return output;
  }

  /**
   * Render a clean list of affected files with error counts
   */
  private renderAffectedFilesList(
    groups: Map<string, GroupedListItem[]>,
    context: WidgetRenderContext,
  ): string {
    const t = context.translate;
    if (groups.size === 0) {
      return "";
    }

    let output = `${String.fromCharCode(10)}${String.fromCharCode(10)}`;

    // Header
    const headerIcon = context.options.useEmojis
      ? `${String.fromCharCode(128203)} `
      : "";
    const headerText = this.styleText(
      `${headerIcon}${t("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.affectedFiles")}`,
      "bold",
      context,
    );
    output += `${headerText}${String.fromCharCode(10)}`;

    // Separator
    const separator = String.fromCharCode(9472).repeat(50);
    output += `${this.styleText(separator, "dim", context)}${String.fromCharCode(10)}`;

    // Sort files by filename (alphabetically)
    const sortedFiles = Array.from(groups.entries()).sort(
      ([aKey], [bKey]) => aKey.localeCompare(bKey),
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
        const errorText = `${errorCount} ${t(`app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.${errorCount === 1 ? "error" : "errors"}`)}`;
        const warningText = `${warningCount} ${t(`app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.${warningCount === 1 ? "warning" : "warnings"}`)}`;
        countText = this.styleText(
          `${errorText}, ${warningText}`,
          "red",
          context,
        );
      } else if (errorCount > 0) {
        countText = this.styleText(
          `${errorCount} error${errorCount !== 1 ? "s" : ""}`,
          "red",
          context,
        );
      } else if (warningCount > 0) {
        countText = this.styleText(
          `${warningCount} warning${warningCount !== 1 ? "s" : ""}`,
          "yellow",
          context,
        );
      } else {
        countText = this.styleText(
          `${issues.length} item${issues.length !== 1 ? "s" : ""}`,
          "dim",
          context,
        );
      }

      const fileIcon = context.options.useEmojis
        ? `${String.fromCharCode(128196)} `
        : "";
      const fileText = fileName; // No styling for file names

      const fileEntry = `   ${fileIcon}${fileText} ${String.fromCharCode(40)}${countText}${String.fromCharCode(41)}`;
      output += `${fileEntry}${String.fromCharCode(10)}`;
    }

    return output;
  }

  /**
   * Calculate count for a specific stat configuration
   */
  private calculateStatCount(
    data: GroupedListItem[],
    stat: StatConfig,
  ): number {
    if (!stat.field || !stat.value) {
      return 0;
    }

    return data.filter((item) => {
      const fieldValue = item[stat.field];
      return fieldValue === stat.value;
    }).length;
  }
}
