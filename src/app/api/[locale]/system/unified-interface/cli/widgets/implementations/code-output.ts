/**
 * Code Output Widget Renderer
 * Pure rendering implementation - ANSI codes, styling, layout only
 * All business logic imported from shared
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  buildTableData,
  type CodeOutputConfig,
  countCodeOutputBySeverity,
  getCodeOutputConfig,
  groupCodeOutputData,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/code-output";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  isWidgetDataArray,
  isWidgetDataNumber,
  isWidgetDataObject,
  isWidgetDataString,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";
import {
  formatLocation,
  processSummaryTemplate,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

// Default severity icon constants
const DEFAULT_SEVERITY_ICONS = {
  ERROR: "✖ ",
  WARNING: "⚠ ",
  INFO: "ℹ ",
  SUCCESS: "✓ ",
  SPARKLE: "✨ ",
} as const;

export class CodeOutputWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_OUTPUT
> {
  readonly widgetType = WidgetType.CODE_OUTPUT;

  render(props: CLIWidgetProps<typeof WidgetType.CODE_OUTPUT, string>): string {
    const { field, value, context } = props;
    // Use shared logic to extract config
    const config = getCodeOutputConfig(field);

    // Handle plain string output (e.g., build logs, command output)
    const stringValue = isWidgetDataString(value, context);
    if (stringValue) {
      if (stringValue.trim() === "") {
        return this.renderEmptyState(context);
      }
      return stringValue;
    }

    if (!isWidgetDataArray(value) || value.length === 0) {
      return this.renderEmptyState(context);
    }

    // Filter to objects only - use loop for proper type narrowing
    const typedData: { [key: string]: WidgetData }[] = [];
    for (const item of value) {
      if (isWidgetDataObject(item)) {
        typedData.push(item);
      }
    }

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

  private renderEmptyState(context: WidgetRenderContext): string {
    const t = context.t;
    const icon = context.options.useEmojis
      ? DEFAULT_SEVERITY_ICONS.SPARKLE
      : "";
    const text = t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
    );
    return this.styleText(`${icon}${text}`, "green", context);
  }

  private renderESLintFormat(
    data: { [key: string]: WidgetData }[],
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
    data: { [key: string]: WidgetData }[],
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
    data: { [key: string]: WidgetData }[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    return data
      .map((item) => this.renderDataItem(item, config, context))
      .join("\n");
  }

  private renderDataItem(
    item: { [key: string]: WidgetData },
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    const parts: string[] = [];

    if (item.line || item.column) {
      // Use shared formatting logic - narrow types to numbers
      const line = isWidgetDataNumber(item.line) ? item.line : undefined;
      const column = isWidgetDataNumber(item.column) ? item.column : undefined;
      const location = formatLocation(line, column);
      parts.push(location.padEnd(10));
    }

    if (item.severity) {
      const severity = isWidgetDataString(item.severity, context);
      if (severity) {
        const formatted = this.formatSeverity(severity, config, context);
        parts.push(formatted.padEnd(9));
      }
    }

    if (item.message) {
      const message = isWidgetDataString(item.message, context);
      if (message) {
        parts.push(message);
      }
    }

    if (item.rule) {
      const rule = isWidgetDataString(item.rule, context);
      if (rule) {
        parts.push(this.styleText(rule, "dim", context));
      }
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
    data: { [key: string]: WidgetData }[],
    config: CodeOutputConfig,
    context: WidgetRenderContext,
  ): string {
    if (config.summaryTemplate) {
      return this.renderCustomSummary(data, config);
    }

    return this.renderDefaultSummary(data, config, context);
  }

  private renderDefaultSummary(
    data: { [key: string]: WidgetData }[],
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
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
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
    data: { [key: string]: WidgetData }[],
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

  private renderJSONFormat(data: { [key: string]: WidgetData }[]): string {
    return JSON.stringify(data, null, 2);
  }

  private renderTableFormat(data: { [key: string]: WidgetData }[]): string {
    return this.renderSimpleTable(data);
  }

  private renderGenericFormat(data: { [key: string]: WidgetData }[]): string {
    return data.map((item) => JSON.stringify(item)).join("\n");
  }

  private renderSimpleTable(data: { [key: string]: WidgetData }[]): string {
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
