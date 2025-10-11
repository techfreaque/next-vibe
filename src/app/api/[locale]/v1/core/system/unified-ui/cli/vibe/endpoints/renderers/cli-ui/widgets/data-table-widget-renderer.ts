/**
 * Data Table Widget Renderer
 * Handles DATA_TABLE widget type with column definitions and formatting
 */

import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  ResponseFieldMetadata,
  TableRenderConfig,
  WidgetRenderContext,
} from "./types";

/**
 * Data table widget renderer for tabular data display
 */
export class DataTableWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_TABLE;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const data = field.value;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState("No data available");
    }

    const config = this.getTableConfig(field);

    if (config.columns && config.columns.length > 0) {
      return this.renderTableWithColumns(data, config, context);
    } else {
      return this.renderTableAutoColumns(data, context);
    }
  }

  private getTableConfig(field: ResponseFieldMetadata): TableRenderConfig {
    const columns =
      field.columns?.map((col) => ({
        key: col.key,
        label: col.label,
        type: col.type,
        width: col.width,
        align: "left" as const,
        formatter: this.getColumnFormatter(col.type),
      })) || [];

    return {
      columns,
      pagination: field.config?.pagination || { enabled: false, pageSize: 50 },
      sorting: field.config?.sorting || { enabled: false },
      filtering: field.config?.filtering || { enabled: false },
    };
  }

  private getColumnFormatter(type: FieldDataType): (value: any) => string {
    switch (type) {
      case FieldDataType.NUMBER:
        return (value) => this.formatter.formatNumber(value);
      case FieldDataType.BOOLEAN:
        return (value) => this.formatter.formatBoolean(value);
      case FieldDataType.DATE:
        return (value) => this.formatter.formatDate(value);
      case FieldDataType.ARRAY:
        return (value) => this.formatter.formatArray(value, { maxItems: 3 });
      case FieldDataType.OBJECT:
        return (value) => this.formatter.formatObject(value);
      default:
        return (value) =>
          this.formatter.formatText(String(value), { maxLength: 50 });
    }
  }

  private renderTableWithColumns(
    data: any[],
    config: TableRenderConfig,
    context: WidgetRenderContext,
  ): string {
    const indent = this.createIndent(context.depth, context);

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(data, config, context);

    // Render header
    const header = this.renderTableHeader(config, columnWidths, context);

    // Render separator
    const separator = this.renderTableSeparator(columnWidths, context);

    // Render rows
    const rows = data.map((row) =>
      this.renderTableRow(row, config, columnWidths, context),
    );

    const result = [header, separator, ...rows];

    return result.map((line) => indent + line).join("\n");
  }

  private calculateColumnWidths(
    data: any[],
    config: TableRenderConfig,
    context: WidgetRenderContext,
  ): number[] {
    const maxWidth =
      context.options.maxWidth - context.depth * context.options.indentSize;
    const availableWidth = maxWidth - (config.columns.length - 1) * 3; // Account for separators

    return config.columns.map((col, index) => {
      if (col.width?.endsWith("%")) {
        const percentage = parseInt(col.width.replace("%", "")) / 100;
        return Math.floor(availableWidth * percentage);
      }

      // Auto-calculate based on content
      const headerWidth = col.label.length;
      const maxContentWidth = Math.max(
        ...data.slice(0, 10).map((row) => {
          const value = row[col.key];
          const formatted = col.formatter
            ? col.formatter(value)
            : String(value);
          return formatted.length;
        }),
      );

      return Math.min(Math.max(headerWidth, maxContentWidth), 50);
    });
  }

  private renderTableHeader(
    config: TableRenderConfig,
    columnWidths: number[],
    context: WidgetRenderContext,
  ): string {
    const cells = config.columns.map((col, index) => {
      const label = context.translate(col.label);
      const styledLabel = this.styleText(label, "bold", context);
      return this.padText(styledLabel, columnWidths[index], col.align);
    });

    return cells.join(" │ ");
  }

  private renderTableSeparator(
    columnWidths: number[],
    context: WidgetRenderContext,
  ): string {
    const separators = columnWidths.map((width) =>
      this.createSeparator(width, "─"),
    );
    return separators.join("─┼─");
  }

  private renderTableRow(
    row: any,
    config: TableRenderConfig,
    columnWidths: number[],
    context: WidgetRenderContext,
  ): string {
    const cells = config.columns.map((col, index) => {
      const value = row[col.key];
      const formatted = col.formatter
        ? col.formatter(value)
        : String(value || "");
      const truncated = this.formatter.formatText(formatted, {
        maxLength: columnWidths[index],
      });
      return this.padText(truncated, columnWidths[index], col.align);
    });

    return cells.join(" │ ");
  }

  private renderTableAutoColumns(
    data: any[],
    context: WidgetRenderContext,
  ): string {
    if (data.length === 0) {
      return context.renderEmptyState("No data available");
    }

    // Auto-detect columns from first row
    const firstRow = data[0];
    const columns = Object.keys(firstRow).map((key) => ({
      key,
      label: key,
      type: this.detectFieldType(firstRow[key]),
      align: "left" as const,
      formatter: this.getColumnFormatter(this.detectFieldType(firstRow[key])),
    }));

    const config: TableRenderConfig = {
      columns,
      pagination: { enabled: false, pageSize: 50 },
      sorting: { enabled: false },
      filtering: { enabled: false },
    };

    return this.renderTableWithColumns(data, config, context);
  }

  private detectFieldType(value: any): FieldDataType {
    if (typeof value === "number") {
      return FieldDataType.NUMBER;
    }
    if (typeof value === "boolean") {
      return FieldDataType.BOOLEAN;
    }
    if (Array.isArray(value)) {
      return FieldDataType.ARRAY;
    }
    if (value && typeof value === "object") {
      return FieldDataType.OBJECT;
    }
    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      return FieldDataType.DATE;
    }
    return FieldDataType.TEXT;
  }
}
