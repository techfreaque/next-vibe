/**
 * Data Table Widget Renderer
 * Handles DATA_TABLE widget type with column definitions and formatting
 */

import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  RenderableValue,
  ResponseFieldMetadata,
  TableRenderConfig,
  WidgetRenderContext,
} from "./types";

/**
 * Table row type - object with string keys and renderable values
 */
interface TableRow {
  [key: string]: RenderableValue;
}

/**
 * Data table widget renderer for tabular data display
 */
export class DataTableWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_TABLE;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const data = field.value;
    const t = context.translate;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
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

    const config = field.config || {};

    // Extract and type-check pagination config
    const paginationValue = config.pagination;
    let pagination: { enabled: boolean; pageSize: number } = {
      enabled: false,
      pageSize: 50,
    };
    if (
      typeof paginationValue === "object" &&
      paginationValue !== null &&
      !Array.isArray(paginationValue)
    ) {
      const paginationObj = paginationValue;
      if ("enabled" in paginationObj && "pageSize" in paginationObj) {
        const enabledVal = paginationObj.enabled;
        const pageSizeVal = paginationObj.pageSize;
        if (
          typeof enabledVal === "boolean" &&
          typeof pageSizeVal === "number"
        ) {
          pagination = { enabled: enabledVal, pageSize: pageSizeVal };
        }
      }
    }

    // Extract and type-check sorting config
    const sortingValue = config.sorting;
    let sorting: {
      enabled: boolean;
      defaultSort?: { key: string; direction: "asc" | "desc" };
    } = {
      enabled: false,
    };
    if (
      typeof sortingValue === "object" &&
      sortingValue !== null &&
      !Array.isArray(sortingValue)
    ) {
      const sortingObj = sortingValue;
      if ("enabled" in sortingObj) {
        const enabledVal = sortingObj.enabled;
        if (typeof enabledVal === "boolean") {
          sorting.enabled = enabledVal;
        }
      }
    }

    // Extract and type-check filtering config
    const filteringValue = config.filtering;
    let filtering: { enabled: boolean } = { enabled: false };
    if (
      typeof filteringValue === "object" &&
      filteringValue !== null &&
      !Array.isArray(filteringValue)
    ) {
      const filteringObj = filteringValue;
      if ("enabled" in filteringObj) {
        const enabledVal = filteringObj.enabled;
        if (typeof enabledVal === "boolean") {
          filtering = { enabled: enabledVal };
        }
      }
    }

    return {
      columns,
      pagination,
      sorting,
      filtering,
    };
  }

  /**
   * Safely convert value to string
   */
  private safeToString(value: RenderableValue): string {
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (value === null || value === undefined) {
      return "";
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return "";
  }

  private getColumnFormatter(
    type: FieldDataType,
  ): (value: RenderableValue) => string {
    switch (type) {
      case FieldDataType.NUMBER:
        return (value) => {
          if (typeof value === "number") {
            return this.formatter.formatNumber(value);
          }
          return this.safeToString(value);
        };
      case FieldDataType.BOOLEAN:
        return (value) => {
          if (typeof value === "boolean") {
            return this.formatter.formatBoolean(value);
          }
          return this.safeToString(value);
        };
      case FieldDataType.DATE:
        return (value) => {
          if (typeof value === "string" || value instanceof Date) {
            return this.formatter.formatDate(value);
          }
          return this.safeToString(value);
        };
      case FieldDataType.ARRAY:
        return (value) => {
          if (Array.isArray(value)) {
            return this.formatter.formatArray(value, { maxItems: 3 });
          }
          return this.safeToString(value);
        };
      case FieldDataType.OBJECT:
        return (value) => {
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return this.formatter.formatObject(value);
          }
          return this.safeToString(value);
        };
      default:
        return (value) =>
          this.formatter.formatText(this.safeToString(value), {
            maxLength: 50,
          });
    }
  }

  private renderTableWithColumns(
    data: RenderableValue[],
    config: TableRenderConfig,
    context: WidgetRenderContext,
  ): string {
    const indent = this.createIndent(context.depth, context);

    // Filter data to only TableRow objects
    const typedData: TableRow[] = data.filter(
      (item): item is TableRow =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(typedData, config, context);

    // Render header
    const header = this.renderTableHeader(config, columnWidths, context);

    // Render separator
    const separator = this.renderTableSeparator(columnWidths);

    // Render rows
    const rows = typedData.map((row) =>
      this.renderTableRow(row, config, columnWidths),
    );

    const result = [header, separator, ...rows];

    return result.map((line) => indent + line).join("\n");
  }

  private calculateColumnWidths(
    data: TableRow[],
    config: TableRenderConfig,
    context: WidgetRenderContext,
  ): number[] {
    const maxWidth =
      context.options.maxWidth - context.depth * context.options.indentSize;
    const availableWidth = maxWidth - (config.columns.length - 1) * 3; // Account for separators

    return config.columns.map((col) => {
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
            : this.safeToString(value);
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
      // Column labels are literal strings, not translation keys
      const styledLabel = this.styleText(col.label, "bold", context);
      return this.padText(styledLabel, columnWidths[index], col.align);
    });

    // eslint-disable-next-line i18next/no-literal-string
    return cells.join(" │ ");
  }

  private renderTableSeparator(columnWidths: number[]): string {
    /* eslint-disable i18next/no-literal-string */
    const separators = columnWidths.map((width) =>
      this.createSeparator(width, "─"),
    );
    return separators.join("─┼─");
    /* eslint-enable i18next/no-literal-string */
  }

  private renderTableRow(
    row: TableRow,
    config: TableRenderConfig,
    columnWidths: number[],
  ): string {
    const cells = config.columns.map((col, index) => {
      const value = row[col.key];
      const formatted = col.formatter
        ? col.formatter(value)
        : this.safeToString(value);
      const truncated = this.formatter.formatText(formatted, {
        maxLength: columnWidths[index],
      });
      return this.padText(truncated, columnWidths[index], col.align);
    });

    // eslint-disable-next-line i18next/no-literal-string
    return cells.join(" │ ");
  }

  private renderTableAutoColumns(
    data: RenderableValue[],
    context: WidgetRenderContext,
  ): string {
    const t = context.translate;

    if (data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Auto-detect columns from first row
    const firstRow = data[0];
    if (
      typeof firstRow !== "object" ||
      firstRow === null ||
      Array.isArray(firstRow)
    ) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.invalidDataFormat",
        ),
      );
    }

    const firstRowObj = firstRow as TableRow;
    const columns = Object.keys(firstRowObj).map((key) => {
      const fieldType = this.detectFieldType(firstRowObj[key]);
      return {
        key,
        label: key,
        type: fieldType,
        align: "left" as const,
        formatter: this.getColumnFormatter(fieldType),
      };
    });

    const config: TableRenderConfig = {
      columns,
      pagination: { enabled: false, pageSize: 50 },
      sorting: { enabled: false },
      filtering: { enabled: false },
    };

    return this.renderTableWithColumns(data, config, context);
  }

  private detectFieldType(value: RenderableValue): FieldDataType {
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
