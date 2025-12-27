/**
 * Code Quality List Widget Renderer
 * Pure rendering implementation - ANSI codes, styling, layout only
 * All business logic imported from shared
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  type CodeQualityItem,
  type CodeQualitySummary,
  countCodeQualityBySeverity,
  extractCodeQualityListData,
  groupCodeQualityItems,
  type ProcessedCodeQualityList,
  sortBySeverity,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/code-quality-list";
import {
  formatFilePath,
  formatLocation,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

/**
 * Configuration for code quality list widget
 */
interface CodeQualityConfig {
  groupBy: string;
  sortBy: string;
  showSummary: boolean;
  maxItemsPerGroup: number;
}

export class CodeQualityListWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_LIST
> {
  readonly widgetType = WidgetType.CODE_QUALITY_LIST;

  render(
    props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_LIST, string>,
  ): string {
    const { value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractCodeQualityListData(value);

    // Handle null case
    if (!data) {
      const successMsg = this.styleText(
        t("app.api.system.check.codeQuality.noIssues"),
        "green",
        context,
      );
      return `\n${successMsg}\n`;
    }

    // Render using extracted data
    return this.renderCodeQualityList(data, context);
  }

  private renderCodeQualityList(
    data: ProcessedCodeQualityList,
    context: WidgetRenderContext,
  ): string {
    const config = this.getConfig();
    let output = "";

    // Group data by file using shared logic
    const groups = groupCodeQualityItems(data.items, "file");

    // Render each group
    for (const [filePath, items] of groups) {
      output += this.renderFileGroup(filePath, items, config, context);
      output += "\n";
    }

    // Add truncation notice if issues were limited
    if (data.summary) {
      const isTruncated =
        data.summary.displayedIssues < data.summary.totalIssues ||
        data.summary.displayedFiles < data.summary.totalFiles;
      if (isTruncated) {
        const hiddenIssues =
          data.summary.totalIssues - data.summary.displayedIssues;
        const hiddenFiles =
          data.summary.totalFiles - data.summary.displayedFiles;
        const hiddenErrors =
          data.summary.totalErrors -
          data.items.filter((item) => item.severity === "error").length;

        const infoIcon = context.options.useEmojis ? "ℹ️ " : "";
        const truncationMsg = this.styleText(
          `${infoIcon}+ ${hiddenIssues} more issue${hiddenIssues !== 1 ? "s" : ""} from ${hiddenFiles} more file${hiddenFiles !== 1 ? "s" : ""} (${hiddenErrors} error${hiddenErrors !== 1 ? "s" : ""})`,
          "dim",
          context,
        );
        output += `${truncationMsg}\n\n`;
      }
    }

    // Add summary statistics
    if (config.showSummary) {
      output += this.renderSummary(data.items, groups, context, data.summary);
    }

    return output.trim();
  }

  private getConfig(): CodeQualityConfig {
    return {
      groupBy: "file",
      sortBy: "severity",
      showSummary: true,
      maxItemsPerGroup: 100,
    };
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
    const displayPath = formatFilePath(filePath);
    const countText = `(${items.length} item${items.length !== 1 ? "s" : ""})`;

    const fileIcon = context.options.useEmojis ? "● " : "";
    const pathText = this.styleText(displayPath, "underline", context);
    const countTextStyled = this.styleText(countText, "dim", context);

    output += `${fileIcon}${pathText} ${countTextStyled}\n`;

    // Sort items by severity (errors first, then warnings, then info) using shared logic
    const sortedItems = sortBySeverity(items);

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

    // Location (line:column) in blue using shared logic
    if (item.line !== undefined || item.column !== undefined) {
      const location = formatLocation(item.line, item.column);
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
   * Format severity with icon and color (ANSI styling only)
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
   * Render summary statistics with affected files list
   */
  private renderSummary(
    data: CodeQualityItem[],
    groups: Map<string, CodeQualityItem[]>,
    context: WidgetRenderContext,
    summary?: CodeQualitySummary,
  ): string {
    let output = "\n";

    // Affected Files List
    output += this.renderAffectedFilesList(groups, context, summary);
    output += "\n\n";

    // Summary Header
    const headerIcon = context.options.useEmojis ? "📊 " : "";
    const headerText = this.styleText(`${headerIcon}Summary`, "bold", context);
    output += `${headerText}\n`;

    // Separator line
    const separator = "─".repeat(50);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // Use summary object if available, otherwise calculate from displayed data
    let totalFiles: number;
    let totalIssues: number;
    let displayedFiles: number;
    let displayedIssues: number;
    let errors: number;
    let warnings: number;
    let isTruncated = false;

    if (summary) {
      // Use the summary object from the response
      totalFiles = summary.totalFiles;
      totalIssues = summary.totalIssues;
      displayedFiles = summary.displayedFiles;
      displayedIssues = summary.displayedIssues;
      errors = summary.totalErrors;
      isTruncated =
        displayedIssues < totalIssues || displayedFiles < totalFiles;

      // Calculate warnings from total - errors
      const severityCounts = countCodeQualityBySeverity(data);
      warnings = severityCounts.warning;
    } else {
      // Fallback: calculate from displayed data
      totalFiles = groups.size;
      totalIssues = data.length;
      displayedFiles = totalFiles;
      displayedIssues = totalIssues;
      const severityCounts = countCodeQualityBySeverity(data);
      errors = severityCounts.error;
      warnings = severityCounts.warning;
    }

    // Display stats with truncation info if applicable
    if (isTruncated) {
      output += `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${displayedFiles} of ${totalFiles}\n`;
      output += `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${displayedIssues} of ${totalIssues}\n`;
    } else {
      output += `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${totalFiles}\n`;
      output += `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${totalIssues}\n`;
    }

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

    // Show truncation message if applicable
    if (isTruncated && summary?.truncatedMessage) {
      output += `\n   ${this.styleText(summary.truncatedMessage, "dim", context)}\n`;
    }

    return output;
  }

  /**
   * Render list of affected files with issue counts
   */
  private renderAffectedFilesList(
    groups: Map<string, CodeQualityItem[]>,
    context: WidgetRenderContext,
    summary?: CodeQualitySummary,
  ): string {
    let output = "";

    // Header
    const headerIcon = context.options.useEmojis ? "📂 " : "";
    const headerText = this.styleText(
      `${headerIcon}Affected Files`,
      "bold",
      context,
    );
    output += `${headerText}\n`;

    // Separator
    const separator = "─".repeat(50);
    output += `${this.styleText(separator, "dim", context)}\n`;

    // List files with counts
    for (const [filePath, items] of groups) {
      const displayPath = formatFilePath(filePath);
      const errors = items.filter((item) => item.severity === "error").length;
      const warnings = items.filter(
        (item) => item.severity === "warning",
      ).length;

      let countParts: string[] = [];
      if (errors > 0) {
        countParts.push(
          this.styleText(
            `${errors} error${errors !== 1 ? "s" : ""}`,
            "red",
            context,
          ),
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

      const countText =
        countParts.length > 0 ? countParts.join(", ") : "0 issues";
      output += `   ${displayPath} (${countText})\n`;
    }

    // Add truncation info if files were limited
    if (summary) {
      const isTruncated = summary.displayedFiles < summary.totalFiles;
      if (isTruncated) {
        const hiddenFiles = summary.totalFiles - summary.displayedFiles;
        const truncationText = this.styleText(
          `   + ${hiddenFiles} more file${hiddenFiles !== 1 ? "s" : ""} not shown`,
          "dim",
          context,
        );
        output += `${truncationText}\n`;
      }
    }

    return output;
  }
}
