import {
  type ResponseFieldMetadata,
  type WidgetRenderContext,
} from "@/app/api/[locale]/v1/core/system/unified-backend/cli/widgets/types";
import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { BaseWidgetRenderer } from "./base-widget-renderer";

/**
 * Configuration for code quality list widget
 */
interface CodeQualityConfig {
  groupBy: string;
  sortBy: string;
  showSummary: boolean;
  maxItemsPerGroup: number;
}

/**
 * Item structure for code quality issues (lint, typecheck, test errors)
 */
interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule?: string;
  code?: string;
  type: "lint" | "type" | "test";
  [key: string]: unknown;
}

/**
 * Code Quality List Widget Renderer
 *
 * Dedicated widget for displaying code quality issues (lint errors, type errors, test failures)
 * with proper ASCII-based formatting that works in all terminals.
 *
 * Features:
 * - Groups issues by file
 * - Shows line:column location
 * - Color-coded severity (red for errors, yellow for warnings, blue for info)
 * - ASCII-only icons (no emojis that might break in certain terminals)
 * - Summary statistics with breakdown by severity
 * - Affected files list
 */
export class CodeQualityListWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.CODE_QUALITY_LIST;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const t = context.translate;
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      const successMsg = this.styleText(
        "✓ No issues found",
        "green",
        context,
      );
      return `\n${successMsg}\n`;
    }

    // Type narrow the array items
    const typedData = data.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        !Array.isArray(item) &&
        "severity" in item,
    ) as CodeQualityItem[];

    const config = this.getConfig(field);
    let output = "";

    // Group data by file
    const groups = this.groupByFile(typedData, config.groupBy);

    // Render each group
    for (const [filePath, items] of groups) {
      output += this.renderFileGroup(filePath, items, config, context);
      output += "\n";
    }

    // Add summary statistics
    if (config.showSummary) {
      output += this.renderSummary(typedData, groups, context);
    }

    return output.trim();
  }

  /**
   * Get configuration from field metadata
   */
  private getConfig(field: ResponseFieldMetadata): CodeQualityConfig {
    return {
      groupBy: field.groupBy || "file",
      sortBy: field.sortBy || "severity",
      showSummary: field.showGroupSummary ?? true,
      maxItemsPerGroup: field.maxItemsPerGroup || 50,
      ...field.config,
    };
  }

  /**
   * Group issues by file path
   */
  private groupByFile(
    data: CodeQualityItem[],
    groupBy: string,
  ): Map<string, CodeQualityItem[]> {
    const groups = new Map<string, CodeQualityItem[]>();

    for (const item of data) {
      const filePath = item[groupBy] as string || "unknown";
      if (!groups.has(filePath)) {
        groups.set(filePath, []);
      }
      groups.get(filePath)!.push(item);
    }

    // Sort groups by file path alphabetically
    return new Map(
      [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    );
  }

  /**
   * Render a single file group with its issues
   */
  private renderFileGroup(
    filePath: string,
    items: CodeQualityItem[],
    config: CodeQualityConfig,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    // File header with file icon
    const displayPath = this.formatFilePath(filePath);
    const countText = `(${items.length} item${items.length !== 1 ? "s" : ""})`;

    const fileIcon = context.options.useEmojis
      ? "● "
      : "";
    const pathText = this.styleText(displayPath, "underline", context);
    const countTextStyled = this.styleText(countText, "dim", context);

    output += `${fileIcon}${pathText} ${countTextStyled}\n`;

    // Sort items by severity (errors first, then warnings, then info)
    const sortedItems = this.sortBySeverity(items);

    // Render each issue
    for (const item of sortedItems.slice(0, config.maxItemsPerGroup)) {
      output += this.renderIssue(item, context);
      output += "\n";
    }

    // Show truncation if needed
    if (items.length > config.maxItemsPerGroup) {
      const remaining = items.length - config.maxItemsPerGroup;
      const truncationMsg = this.styleText(
        `  ... and ${remaining} more issue${remaining !== 1 ? "s" : ""}`,
        "dim",
        context,
      );
      output += `${truncationMsg}\n`;
    }

    return output;
  }

  /**
   * Render a single code quality issue
   */
  private renderIssue(
    item: CodeQualityItem,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    // Location (line:column) in blue
    if (item.line !== undefined || item.column !== undefined) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(this.styleText(location.padEnd(8), "blue", context));
    } else {
      parts.push("        "); // 8 spaces padding
    }

    // Severity with ASCII icon and color
    const severity = this.formatSeverity(item.severity, context);
    parts.push(severity.padEnd(12)); // Padding for alignment

    // Message
    if (item.message) {
      parts.push(item.message);
    }

    // Rule name in dim if available
    if (item.rule && item.rule !== "unknown") {
      const ruleText = this.styleText(`[${item.rule}]`, "dim", context);
      parts.push(ruleText);
    }

    return `  ${parts.join(" ")}`;
  }

  /**
   * Format location as line:column
   */
  private formatLocation(line?: number, column?: number): string {
    if (line !== undefined && column !== undefined) {
      return `${line}:${column}`;
    }
    if (line !== undefined) {
      return `${line}:0`;
    }
    if (column !== undefined) {
      return `0:${column}`;
    }
    return "0:0";
  }

  /**
   * Format severity with icon and color
   */
  private formatSeverity(
    severity: "error" | "warning" | "info",
    context: WidgetRenderContext,
  ): string {
    const icons = context.options.useEmojis;

    switch (severity) {
      case "error": {
        const errorIcon = icons ? "❌ " : "✗ ";
        const errorText = this.styleText("error", "red", context);
        return `${errorIcon}${errorText}`;
      }
      case "warning": {
        const warnIcon = icons ? "⚠️ " : "!  ";
        const warnText = this.styleText("warn", "yellow", context);
        return `${warnIcon}${warnText}`;
      }
      case "info": {
        const infoIcon = icons ? "ℹ️ " : "i ";
        const infoText = this.styleText("info", "blue", context);
        return `${infoIcon}${infoText}`;
      }
      default:
        return severity;
    }
  }

  /**
   * Sort issues by severity (errors first, then warnings, then info)
   */
  private sortBySeverity(items: CodeQualityItem[]): CodeQualityItem[] {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return [...items].sort((a, b) => {
      const aOrder = severityOrder[a.severity] ?? 3;
      const bOrder = severityOrder[b.severity] ?? 3;
      if (aOrder !== bOrder) return aOrder - bOrder;
      // Secondary sort by line number
      return (a.line || 0) - (b.line || 0);
    });
  }

  /**
   * Clean up file paths for display
   */
  private formatFilePath(path: string): string {
    // Remove common prefixes
    return path
      .replace(/^\.\//, "")
      .replace(/^src\//, "src/");
  }

  /**
   * Render summary statistics with affected files list
   */
  private renderSummary(
    data: CodeQualityItem[],
    groups: Map<string, CodeQualityItem[]>,
    context: WidgetRenderContext,
  ): string {
    let output = "\n";

    // Affected Files List
    output += this.renderAffectedFilesList(groups, context);
    output += "\n\n";

    // Summary Header
    const headerIcon = context.options.useEmojis ? "📊 " : "";
    const headerText = this.styleText(
      `${headerIcon}Summary`,
      "bold",
      context,
    );
    output += `${headerText}\n`;

    // Separator line
    const separator = "─".repeat(50);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // Calculate stats
    const totalFiles = groups.size;
    const totalIssues = data.length;
    const errors = data.filter((item) => item.severity === "error").length;
    const warnings = data.filter((item) => item.severity === "warning").length;

    // Display stats
    output += `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${totalFiles}\n`;
    output += `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${totalIssues}\n`;

    // Error count with color and icon
    if (errors > 0) {
      const errorIcon = context.options.useEmojis ? "❌ " : "";
      const errorText = this.styleText(
        `${errors} error${errors !== 1 ? "s" : ""}`,
        "red",
        context,
      );
      output += `   ${errorIcon}${errorText}\n`;
    }

    // Warning count with color and icon
    if (warnings > 0) {
      const warnIcon = context.options.useEmojis ? "⚠️ " : "";
      const warnText = this.styleText(
        `${warnings} warning${warnings !== 1 ? "s" : ""}`,
        "yellow",
        context,
      );
      output += `   ${warnIcon}${warnText}\n`;
    }

    return output;
  }

  /**
   * Render list of affected files with issue counts
   */
  private renderAffectedFilesList(
    groups: Map<string, CodeQualityItem[]>,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    // Header
    const headerIcon = context.options.useEmojis ? "📂 " : "";
    const headerText = this.styleText(`${headerIcon}Affected Files`, "bold", context);
    output += `${headerText}\n`;

    // Separator
    const separator = "─".repeat(50);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // List files with counts
    for (const [filePath, items] of groups) {
      const displayPath = this.formatFilePath(filePath);
      const errors = items.filter((item) => item.severity === "error").length;
      const warnings = items.filter(
        (item) => item.severity === "warning",
      ).length;

      let countParts: string[] = [];
      if (errors > 0) {
        countParts.push(
          this.styleText(`${errors} error${errors !== 1 ? "s" : ""}`, "red", context),
        );
      }
      if (warnings > 0) {
        countParts.push(
          this.styleText(
            `${warnings} warning${warnings !== 1 ? "s" : ""}`,
            "yellow",
            context,
          ),
        );
      }

      const countText = countParts.length > 0 ? countParts.join(", ") : "0 issues";
      output += `   ${displayPath} (${countText})\n`;
    }

    return output;
  }
}
