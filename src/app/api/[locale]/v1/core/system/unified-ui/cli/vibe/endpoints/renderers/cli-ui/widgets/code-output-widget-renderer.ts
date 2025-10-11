/**
 * Code Output Widget Renderer
 * Modular renderer that constructs output from building blocks based on configuration
 */

import { WidgetType } from "../../../endpoint-types/core/enums";
import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  CodeOutputConfig,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

/**
 * Code output widget renderer with configurable building blocks
 */
export class CodeOutputWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.CODE_OUTPUT;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const data = field.value;
    const config = this.getCodeOutputConfig(field);

    if (!Array.isArray(data) || data.length === 0) {
      return this.renderEmptyState(config, context);
    }

    switch (config.format) {
      case "eslint":
        return this.renderESLintFormat(data, config, context);
      case "json":
        return this.renderJSONFormat(data, config, context);
      case "table":
        return this.renderTableFormat(data, config, context);
      default:
        return this.renderGenericFormat(data, config, context);
    }
  }

  private getCodeOutputConfig(field: ResponseFieldMetadata): CodeOutputConfig {
    const config = field.config || {};

    return {
      format: config.outputFormat || config.format || "generic",
      groupBy: config.groupBy || config.groupByFile ? "file" : undefined,
      showSummary: config.showSummary ?? true,
      showLineNumbers: config.showLineNumbers ?? false,
      colorScheme: config.colorScheme || "auto",
      severityIcons: config.severityIcons || {
        error: "✖ ",
        warning: "⚠ ",
        info: "ℹ ",
        success: "✓ ",
      },
      summaryTemplate: config.summaryTemplate,
    };
  }

  private renderEmptyState(
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const icon = context.options.useEmojis ? "✨ " : "";
    const text = "No issues found";
    return this.styleText(`${icon}${text}`, "green", context);
  }

  private renderESLintFormat(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    if (config.groupBy) {
      output += this.renderGroupedData(data, config, context);
    } else {
      output += this.renderFlatData(data, config, context);
    }

    if (config.showSummary) {
      output += `\n${this.renderSummary(data, config, context)}`;
    }

    return output;
  }

  private renderGroupedData(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const groups = this.groupData(data, config.groupBy!);
    const result: string[] = [];

    for (const [groupKey, items] of groups) {
      // Group header
      const groupHeader = this.styleText(groupKey, "underline", context);
      result.push(`\n${groupHeader}`);

      // Group items
      for (const item of items) {
        const line = this.renderDataItem(item, config, context);
        result.push(`  ${line}`);
      }
    }

    return result.join("\n");
  }

  private renderFlatData(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    return data
      .map((item) => this.renderDataItem(item, config, context))
      .join("\n");
  }

  private renderDataItem(
    item: any,
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    // Location (line:column)
    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(location.padEnd(10));
    }

    // Severity with icon and color
    if (item.severity) {
      const severity = this.formatSeverity(item.severity, config, context);
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

  private formatSeverity(
    severity: string,
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const icon = context.options.useEmojis
      ? config.severityIcons[severity] || ""
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
      case "success":
        return `${icon}${this.styleText(text, "green", context)}`;
      default:
        return `${icon}${text}`;
    }
  }

  private renderSummary(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    if (config.summaryTemplate) {
      return this.renderCustomSummary(data, config, context);
    }

    return this.renderDefaultSummary(data, config, context);
  }

  private renderDefaultSummary(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const severityCounts = this.countBySeverity(data);
    const totalCount = data.length;

    if (totalCount === 0) {
      const icon = context.options.useEmojis ? "✨ " : "";
      const text = "No issues found";
      return this.styleText(`${icon}${text}`, "green", context);
    }

    const parts: string[] = [];
    const icon = context.options.useEmojis
      ? config.severityIcons.error || "✖ "
      : "";

    if (severityCounts.error > 0) {
      const errorText = `${severityCounts.error} error${severityCounts.error === 1 ? "" : "s"}`;
      parts.push(this.styleText(errorText, "red", context));
    }

    if (severityCounts.warning > 0) {
      const warningText = `${severityCounts.warning} warning${severityCounts.warning === 1 ? "" : "s"}`;
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

  private renderCustomSummary(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const severityCounts = this.countBySeverity(data);
    const variables = {
      total: data.length,
      errors: severityCounts.error,
      warnings: severityCounts.warning,
      info: severityCounts.info,
    };

    let summary = config.summaryTemplate!;
    for (const [key, value] of Object.entries(variables)) {
      summary = summary.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    }

    return summary;
  }

  private renderJSONFormat(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    return JSON.stringify(data, null, 2);
  }

  private renderTableFormat(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    // Delegate to table renderer
    const tableField: ResponseFieldMetadata = {
      ...({} as ResponseFieldMetadata),
      value: data,
      widgetType: WidgetType.DATA_TABLE,
    };

    // This would need to be injected or imported
    // For now, return a simple table representation
    return this.renderSimpleTable(data, context);
  }

  private renderGenericFormat(
    data: any[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    return data.map((item) => JSON.stringify(item)).join("\n");
  }

  private renderSimpleTable(data: any[], context: WidgetRenderContext): string {
    if (data.length === 0) {
      return "";
    }

    const keys = Object.keys(data[0]);
    const header = keys.join(" | ");
    const separator = keys.map(() => "---").join(" | ");
    const rows = data.map((item) =>
      keys.map((key) => String(item[key] || "")).join(" | "),
    );

    return [header, separator, ...rows].join("\n");
  }

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

  private countBySeverity(data: any[]): Record<string, number> {
    const counts = { error: 0, warning: 0, info: 0, success: 0 };

    for (const item of data) {
      const severity = item.severity || "info";
      if (severity in counts) {
        counts[severity as keyof typeof counts]++;
      }
    }

    return counts;
  }
}
