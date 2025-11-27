/**
 * Code Output Widget Renderer
 * Pure rendering implementation - ANSI codes, styling, layout only
 * All business logic imported from shared
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import {
  getCodeOutputConfig,
  groupCodeOutputData,
  countCodeOutputBySeverity,
  buildTableData,
  type CodeOutputItem,
  type CodeOutputConfig,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/logic/code-output";
import {
  formatLocation,
  processSummaryTemplate,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

// Default severity icon constants
const DEFAULT_SEVERITY_ICONS = {
  ERROR: "✖ ",
  WARNING: "⚠ ",
  INFO: "ℹ ",
  SUCCESS: "✓ ",
  SPARKLE: "✨ ",
} as const;

export class CodeOutputWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.CODE_OUTPUT;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;
    // Use shared logic to extract config
    const config = getCodeOutputConfig(field);

    if (!Array.isArray(value) || value.length === 0) {
      return this.renderEmptyState(config, context);
    }

    const typedData: CodeOutputItem[] = value.filter(
      (item): item is CodeOutputItem =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    ) as CodeOutputItem[];

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
    // Use shared grouping logic
    const groups = groupCodeOutputData(data, config.groupBy!);
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
      // Use shared formatting logic
      const location = formatLocation(item.line, item.column);
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
    // Use shared counting logic
    const severityCounts = countCodeOutputBySeverity(data);
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
    // Use shared counting and template processing logic
    const severityCounts = countCodeOutputBySeverity(data);
    const variables = {
      total: data.length,
      errors: severityCounts.error,
      warnings: severityCounts.warning,
      info: severityCounts.info,
    };

    return processSummaryTemplate(config.summaryTemplate!, variables);
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

    // Use shared table building logic
    const { keys, rows } = buildTableData(data);
    // eslint-disable-next-line i18next/no-literal-string
    const header = keys.join(" | ");
    // eslint-disable-next-line i18next/no-literal-string
    const separator = keys.map(() => "---").join(" | ");
    const tableRows = rows.map((row) => {
      // eslint-disable-next-line i18next/no-literal-string
      return keys.map((key) => row[key] || "").join(" | ");
    });

    return [header, separator, ...tableRows].join("\n");
  }
}
