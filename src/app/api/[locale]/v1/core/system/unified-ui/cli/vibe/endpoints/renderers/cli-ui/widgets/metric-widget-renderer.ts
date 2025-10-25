/**
 * Metric Widget Renderer
 * Handles METRIC_CARD widget type for displaying key metrics and statistics
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  MetricConfig,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

/**
 * Metric widget renderer for displaying key performance indicators
 */
export class MetricWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.METRIC_CARD;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const config = this.getMetricConfig(field);
    const value = field.value;

    const indent = this.createIndent(context.depth, context);

    // Handle object with multiple metrics (like summary)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderMetricObject(value, config, context, indent);
    }

    // Handle single metric value
    const label = this.formatLabel(field, context);
    const formattedValue = this.formatMetricValue(value, config, context);
    const icon = this.getMetricIcon(config, value, context);

    return `${indent}${icon}${label}: ${formattedValue}`;
  }

  private renderMetricObject(
    value: Record<string, string | number | boolean>,
    config: MetricConfig,
    context: WidgetRenderContext,
    indent: string,
  ): string {
    const lines: string[] = [];

    // Special handling for lint summary object
    if ("total" in value && "errors" in value && "warnings" in value) {
      return this.renderLintSummary(value, context, indent);
    }

    // Generic object rendering
    for (const [key, val] of Object.entries(value)) {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const formattedValue = this.formatMetricValue(val, config, context);
      const icon = this.getMetricIcon(config, val, context);
      lines.push(`${indent}${icon}${formattedKey}: ${formattedValue}`);
    }

    return lines.join("\n");
  }

  private renderLintSummary(
    summary: {
      total: number;
      errors: number;
      warnings: number;
      info: number;
      hasIssues: boolean;
    },
    context: WidgetRenderContext,
    indent: string,
  ): string {
    if (!summary.hasIssues) {
      // eslint-disable-next-line i18next/no-literal-string
      const icon = context.options.useEmojis ? "✨ " : "";
      const text = context.translate(
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.noIssuesFound",
      );
      return `${indent}${icon}${this.styleText(text, "green", context)}`;
    }

    const parts: string[] = [];

    if (summary.errors > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      const icon = context.options.useEmojis ? "✖ " : "";
      const errorWord =
        summary.errors === 1
          ? context.translate(
              "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.error",
            )
          : context.translate(
              "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.errors",
            );
      const text = `${summary.errors} ${errorWord}`;
      parts.push(`${indent}${icon}${this.styleText(text, "red", context)}`);
    }

    if (summary.warnings > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      const icon = context.options.useEmojis ? "⚠ " : "";
      const warningWord =
        summary.warnings === 1
          ? context.translate(
              "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.warning",
            )
          : context.translate(
              "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.warnings",
            );
      const text = `${summary.warnings} ${warningWord}`;
      parts.push(`${indent}${icon}${this.styleText(text, "yellow", context)}`);
    }

    if (summary.info > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      const icon = context.options.useEmojis ? "ℹ " : "";
      const text = `${summary.info} ${context.translate("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.info")}`;
      parts.push(`${indent}${icon}${this.styleText(text, "blue", context)}`);
    }

    return parts.join("\n");
  }

  private getMetricConfig(field: ResponseFieldMetadata): MetricConfig {
    const config = field.config || {};

    return {
      icon: config.icon,
      unit: config.unit || field.unit,
      precision: config.precision ?? field.precision ?? 2,
      threshold: config.threshold,
      format: config.format || field.format || "number",
    };
  }

  private formatMetricValue(
    value: string | number | boolean,
    config: MetricConfig,
    context: WidgetRenderContext,
  ): string {
    if (typeof value !== "number") {
      return String(value);
    }

    let formatted: string;

    switch (config.format) {
      case "percentage":
        formatted = `${(value * 100).toFixed(config.precision)}%`;
        break;
      case "currency":
        // eslint-disable-next-line i18next/no-literal-string
        formatted = `$${value.toFixed(config.precision)}`;
        break;
      case "bytes":
        formatted = this.formatBytes(value);
        break;
      default:
        // For integer values (like counts), don't show decimal places
        if (Number.isInteger(value) && config.precision === 2) {
          formatted = value.toString();
        } else {
          formatted = value.toFixed(config.precision);
        }
        if (config.unit) {
          formatted += ` ${config.unit}`;
        }
    }

    // Apply threshold-based styling
    if (config.threshold && context.options.useColors) {
      if (config.threshold.error && value >= config.threshold.error) {
        return this.styleText(formatted, "red", context);
      }
      if (config.threshold.warning && value >= config.threshold.warning) {
        return this.styleText(formatted, "yellow", context);
      }
      return this.styleText(formatted, "green", context);
    }

    return formatted;
  }

  private getMetricIcon(
    config: MetricConfig,
    value: string | number | boolean,
    context: WidgetRenderContext,
  ): string {
    if (!context.options.useEmojis) {
      return "";
    }

    if (config.icon) {
      return `${config.icon} `;
    }

    // Default icons based on thresholds
    if (typeof value === "number" && config.threshold) {
      if (config.threshold.error && value >= config.threshold.error) {
        // eslint-disable-next-line i18next/no-literal-string
        return "🔴 ";
      }
      if (config.threshold.warning && value >= config.threshold.warning) {
        // eslint-disable-next-line i18next/no-literal-string
        return "🟡 ";
      }
      // eslint-disable-next-line i18next/no-literal-string
      return "🟢 ";
    }

    // eslint-disable-next-line i18next/no-literal-string
    return "📊 ";
  }

  private formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
