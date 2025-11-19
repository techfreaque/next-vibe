/**
 * Code Output Widget Renderer
 * Modular renderer that constructs output from building blocks based on configuration
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  CodeOutputConfig,
  RenderableValue,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

// Default severity icon constants
const DEFAULT_SEVERITY_ICONS = {
  ERROR: "✖ ",
  WARNING: "⚠ ",
  INFO: "ℹ ",
  SUCCESS: "✓ ",
  SPARKLE: "✨ ",
} as const;

/**
 * Code output item interface
 */
interface CodeOutputItem {
  [key: string]: RenderableValue;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

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

    const typedData: CodeOutputItem[] = data.filter(
      (item): item is CodeOutputItem =>
        typeof item === "object" && item !== null,
    );

    switch (config.format) {
      case "eslint":
        return this.renderESLintFormat(typedData, config, context);
      case "json":
        return this.renderJSONFormat(typedData);
      case "table":
        return this.renderTableFormat(typedData);
      default:
        return this.renderGenericFormat(typedData);
    }
  }

  private getCodeOutputConfig(field: ResponseFieldMetadata): CodeOutputConfig {
    const config = field.config || {};

    const formatValue = config.outputFormat || config.format;
    const format =
      typeof formatValue === "string" &&
      (formatValue === "eslint" ||
        formatValue === "generic" ||
        formatValue === "json" ||
        formatValue === "table")
        ? formatValue
        : "generic";

    const showSummaryValue = config.showSummary;
    const showSummary =
      typeof showSummaryValue === "boolean" ? showSummaryValue : true;

    const colorSchemeValue = config.colorScheme;
    const colorScheme =
      typeof colorSchemeValue === "string" &&
      (colorSchemeValue === "auto" ||
        colorSchemeValue === "light" ||
        colorSchemeValue === "dark")
        ? colorSchemeValue
        : "auto";

    const severityIconsValue = config.severityIcons;
    let severityIcons: Record<string, string> = {
      error: DEFAULT_SEVERITY_ICONS.ERROR,
      warning: DEFAULT_SEVERITY_ICONS.WARNING,
      info: DEFAULT_SEVERITY_ICONS.INFO,
      success: DEFAULT_SEVERITY_ICONS.SUCCESS,
    };

    if (
      typeof severityIconsValue === "object" &&
      severityIconsValue !== null &&
      !Array.isArray(severityIconsValue)
    ) {
      const icons: Record<string, string> = {};
      for (const [key, val] of Object.entries(severityIconsValue)) {
        if (typeof val === "string") {
          icons[key] = val;
        }
      }
      if (Object.keys(icons).length) {
        severityIcons = icons;
      }
    }

    const groupByValue = config.groupBy;
    const groupBy = typeof groupByValue === "string" ? groupByValue : undefined;

    const summaryTemplateValue = config.summaryTemplate;
    const summaryTemplate =
      typeof summaryTemplateValue === "string"
        ? summaryTemplateValue
        : undefined;

    return {
      format,
      groupBy,
      showSummary,
      showLineNumbers: false,
      colorScheme,
      severityIcons,
      summaryTemplate,
    };
  }

  private renderEmptyState(
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const t = context.t;
    const icon = context.options.useEmojis
      ? DEFAULT_SEVERITY_ICONS.SPARKLE
      : "";
    const text = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
    );
    return this.styleText(`${icon}${text}`, "green", context);
  }

  private renderESLintFormat(
    data: CodeOutputItem[],
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
      // eslint-disable-next-line i18next/no-literal-string
      output += `\n${this.renderSummary(data, config, context)}`;
    }

    return output;
  }

  private renderGroupedData(
    data: CodeOutputItem[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const groups = this.groupData(data, config.groupBy!);
    const result: string[] = [];

    for (const [groupKey, items] of groups) {
      const groupHeader = this.styleText(groupKey, "underline", context);
      // eslint-disable-next-line i18next/no-literal-string
      result.push(`\n${groupHeader}`);

      for (const item of items) {
        const line = this.renderDataItem(item, config, context);
        result.push(`  ${line}`);
      }
    }

    return result.join("\n");
  }

  private renderFlatData(
    data: CodeOutputItem[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    return data
      .map((item) => this.renderDataItem(item, config, context))
      .join("\n");
  }

  private renderDataItem(
    item: CodeOutputItem,
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    if (item.line || item.column) {
      const location = this.formatLocation(item.line, item.column);
      parts.push(location.padEnd(10));
    }

    if (item.severity && typeof item.severity === "string") {
      const severity = this.formatSeverity(item.severity, config, context);
      parts.push(severity.padEnd(9));
    }

    if (item.message && typeof item.message === "string") {
      parts.push(item.message);
    }

    if (item.rule && typeof item.rule === "string") {
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
      // eslint-disable-next-line i18next/no-literal-string
      return `${line}:0`;
    }
    return "";
  }

  private formatSeverity(
    severity: string,
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const icons = config.severityIcons || {};
    const icon = context.options.useEmojis ? icons[severity] || "" : "";
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
    data: CodeOutputItem[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    if (config.summaryTemplate) {
      return this.renderCustomSummary(data, config);
    }

    return this.renderDefaultSummary(data, config, context);
  }

  private renderDefaultSummary(
    data: CodeOutputItem[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const t = context.t;
    const severityCounts = this.countBySeverity(data);
    const totalCount = data.length;

    if (totalCount === 0) {
      const icon = context.options.useEmojis
        ? DEFAULT_SEVERITY_ICONS.SPARKLE
        : "";
      const text = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
      );
      return this.styleText(`${icon}${text}`, "green", context);
    }

    const parts: string[] = [];
    const icons = config.severityIcons || {};
    const icon = context.options.useEmojis
      ? icons.error || DEFAULT_SEVERITY_ICONS.ERROR
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
      // eslint-disable-next-line i18next/no-literal-string
      return `${icon}${problemText} (${parts.join(", ")})`;
    }

    return `${icon}${totalCount} issue${totalCount === 1 ? "" : "s"}`;
  }

  private renderCustomSummary(
    data: CodeOutputItem[],
    config: CodeOutputConfig,
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
      // Use replaceAll for better performance than RegExp in loop
      // eslint-disable-next-line i18next/no-literal-string
      summary = summary.replaceAll(`{${key}}`, String(value));
    }

    return summary;
  }

  private renderJSONFormat(data: CodeOutputItem[]): string {
    return JSON.stringify(data, null, 2);
  }

  private renderTableFormat(data: CodeOutputItem[]): string {
    return this.renderSimpleTable(data);
  }

  private renderGenericFormat(data: CodeOutputItem[]): string {
    return data.map((item) => JSON.stringify(item)).join("\n");
  }

  private renderSimpleTable(data: CodeOutputItem[]): string {
    if (data.length === 0) {
      return "";
    }

    const keys = Object.keys(data[0]);
    // eslint-disable-next-line i18next/no-literal-string
    const header = keys.join(" | ");
    // eslint-disable-next-line i18next/no-literal-string
    const separator = keys.map(() => "---").join(" | ");
    const rows = data.map((item) => {
      const row: string[] = [];
      for (const key of keys) {
        const val = item[key];
        if (typeof val === "string") {
          row.push(val);
        } else if (typeof val === "number") {
          row.push(String(val));
        } else if (typeof val === "boolean") {
          row.push(val ? "true" : "false");
        } else {
          row.push("");
        }
      }
      // eslint-disable-next-line i18next/no-literal-string
      return row.join(" | ");
    });

    return [header, separator, ...rows].join("\n");
  }

  private groupData(
    data: CodeOutputItem[],
    groupBy: string,
  ): Map<string, CodeOutputItem[]> {
    const groups = new Map<string, CodeOutputItem[]>();

    for (const item of data) {
      const groupValue = item[groupBy];
      let groupKey = "unknown";
      if (typeof groupValue === "string") {
        groupKey = groupValue;
      } else if (typeof groupValue === "number") {
        groupKey = String(groupValue);
      } else if (typeof groupValue === "boolean") {
        groupKey = groupValue ? "true" : "false";
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }

    return groups;
  }

  private countBySeverity(data: CodeOutputItem[]): Record<string, number> {
    const counts = { error: 0, warning: 0, info: 0, success: 0 };

    for (const item of data) {
      const severityValue = item.severity;
      let severity = "info";
      if (typeof severityValue === "string") {
        severity = severityValue;
      }
      if (severity in counts) {
        counts[severity as keyof typeof counts]++;
      }
    }

    return counts;
  }
}
