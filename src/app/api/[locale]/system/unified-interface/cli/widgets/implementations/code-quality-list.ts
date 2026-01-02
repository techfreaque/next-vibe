/**
 * Code Quality List Widget Renderer
 * Pure rendering implementation - ANSI codes, styling, layout only
 * All business logic imported from shared
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  type CodeQualityItem,
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
  maxItemsPerGroup: number;
}

export class CodeQualityListWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_LIST
> {
  readonly widgetType = WidgetType.CODE_QUALITY_LIST;

  render(props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_LIST, string>): string {
    const { field, value, context } = props;
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

    // Render the items
    const itemsOutput = this.renderCodeQualityList(data, context);
    const result: string[] = [itemsOutput];

    // Add truncation notice if data is truncated
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      "summary" in value &&
      typeof value.summary === "object" &&
      value.summary !== null
    ) {
      const summary = value.summary;
      const totalIssues =
        "totalIssues" in summary && typeof summary.totalIssues === "number"
          ? summary.totalIssues
          : 0;
      const displayedIssues =
        "displayedIssues" in summary && typeof summary.displayedIssues === "number"
          ? summary.displayedIssues
          : 0;
      const totalFiles =
        "totalFiles" in summary && typeof summary.totalFiles === "number" ? summary.totalFiles : 0;
      const displayedFiles =
        "displayedFiles" in summary && typeof summary.displayedFiles === "number"
          ? summary.displayedFiles
          : 0;
      const totalErrors =
        "totalErrors" in summary && typeof summary.totalErrors === "number"
          ? summary.totalErrors
          : 0;

      const displayedErrors = data.items.filter((item) => item.severity === "error").length;

      if (displayedIssues < totalIssues || displayedFiles < totalFiles) {
        const hiddenIssues = totalIssues - displayedIssues;
        const hiddenFiles = totalFiles - displayedFiles;
        const hiddenErrors = totalErrors - displayedErrors;

        const infoIcon = context.options.useEmojis ? "ℹ️  " : "";
        const truncationMsg = this.styleText(
          `${infoIcon}+ ${hiddenIssues} more issue${hiddenIssues !== 1 ? "s" : ""} from ${hiddenFiles} more file${hiddenFiles !== 1 ? "s" : ""} (${hiddenErrors} error${hiddenErrors !== 1 ? "s" : ""})`,
          "dim",
          context,
        );
        result.push("");
        result.push(truncationMsg);
      }
    }

    // Recursively render children (like summary) if field has children
    if (
      field.type === "object" &&
      field.children &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      for (const [key, childValue] of Object.entries(value)) {
        // Skip items array (already rendered)
        if (key === "items") {
          continue;
        }

        if (childValue !== undefined && childValue !== null) {
          const childField = field.children[key];
          if (childField) {
            const rendered = context.renderWidget(childField.ui.type, childField, childValue);
            if (rendered) {
              result.push("");
              result.push(rendered);
            }
          }
        }
      }
    }

    return result.join("\n");
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

    return output.trim();
  }

  private getConfig(): CodeQualityConfig {
    return {
      groupBy: "file",
      sortBy: "severity",
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
  private renderIssue(item: CodeQualityItem, context: WidgetRenderContext): string {
    const parts: string[] = [];

    // OSC 8 Approach 2: vscode://file/ protocol with absolute path
    if (item.line !== undefined || item.column !== undefined) {
      // Convert to absolute path
      const absolutePath = item.file.startsWith("/") ? item.file : `${process.cwd()}/${item.file}`;

      // Build URL with vscode://file/ protocol and line/column
      let vscodeUrl = `vscode://file${absolutePath}:${item.line || 1}:${item.column || 1}`;

      // Display text (just line:column without padding)
      const location = formatLocation(item.line, item.column);
      const styledLocation = this.styleText(location, "blue", context);

      // OSC 8 hyperlink: \x1b]8;;URL\x1b\\TEXT\x1b]8;;\x1b\\
      const hyperlink = `\x1b]8;;${vscodeUrl}\x1b\\${styledLocation}\x1b]8;;\x1b\\`;

      // Add padding after the hyperlink to maintain alignment
      const paddingNeeded = Math.max(0, 8 - location.length);
      parts.push(hyperlink + " ".repeat(paddingNeeded));
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
        const warnIcon = icons ? "⚠️  " : "!  ";
        const warnText = this.styleText("warn", "yellow", context);
        return `${warnIcon}${warnText}`;
      }
      case "info": {
        const infoIcon = icons ? "ℹ️  " : "i  ";
        const infoText = this.styleText("info", "blue", context);
        return `${infoIcon}${infoText}`;
      }
      default:
        return severity;
    }
  }
}
