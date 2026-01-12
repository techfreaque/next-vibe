/**
 * Data Table Widget Renderer
 *
 * Handles DATA_TABLE widget type with column definitions and formatting.
 * Supports both configured and auto-detected column layouts.
 *
 * Features:
 * - Column-based rendering with type-aware formatters
 * - Auto-column detection from data structure
 * - Configurable column widths (fixed or percentage-based)
 * - Type-specific formatting (numbers, dates, booleans, arrays, objects)
 * - Pagination, sorting, and filtering support
 * - Responsive column width calculation
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 */

import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractDataTableData,
  formatCellValue,
  type TableColumn,
  type TableRenderConfig,
  type TableRow,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/data-table";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  isWidgetDataArray,
  isWidgetDataBoolean,
  isWidgetDataNumber,
  isWidgetDataObject,
  isWidgetDataString,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";
import type { CountryLanguage } from "@/i18n/core/config";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class DataTableWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.DATA_TABLE
> {
  readonly widgetType = WidgetType.DATA_TABLE;

  /**
   * Render data table with configured or auto-detected columns.
   * Supports pagination, sorting, and filtering configurations.
   * Uses type-aware formatters for different data types.
   */
  render(props: CLIWidgetProps<typeof WidgetType.DATA_TABLE, string>): string {
    const { field, value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractDataTableData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Extract config directly where types are properly narrowed
    const ui = field.ui;
    const locale = context.options.locale;
    const configColumns = ui.columns;
    const pagination = ui.pagination;
    const sorting = ui.sorting;
    const filtering = ui.filtering;

    const columns: TableColumn<string>[] =
      configColumns?.map(
        (col): TableColumn<string> => ({
          key: col.key,
          label: col.label,
          type: FieldDataType.TEXT,
          width: typeof col.width === "number" ? String(col.width) : col.width,
          align: col.align ?? "left",
          formatter: this.getColumnFormatter(FieldDataType.TEXT, locale),
        }),
      ) ?? [];

    const config: TableRenderConfig<string> = {
      columns,
      pagination: {
        enabled: pagination?.enabled ?? false,
        pageSize: pagination?.pageSize ?? 50,
      },
      sorting: {
        enabled: sorting?.enabled ?? false,
        defaultSort: Array.isArray(sorting?.defaultSort)
          ? sorting?.defaultSort[0]
          : sorting?.defaultSort,
      },
      filtering: {
        enabled: filtering?.enabled ?? false,
      },
    };

    if (config.columns && config.columns.length > 0) {
      return this.renderTableWithColumns(data.rows, config, context);
    }
    return this.renderTableAutoColumns(data.rows, context);
  }

  private getColumnFormatter(
    type: FieldDataType,
    locale: CountryLanguage,
  ): (value: WidgetData) => string {
    switch (type) {
      case FieldDataType.NUMBER:
        return (value) => {
          if (isWidgetDataNumber(value)) {
            return this.formatter.formatNumber(value, locale);
          }
          return formatCellValue(value);
        };
      case FieldDataType.BOOLEAN:
        return (value) => {
          if (isWidgetDataBoolean(value)) {
            return this.formatter.formatBoolean(value);
          }
          return formatCellValue(value);
        };
      case FieldDataType.DATE:
        return (value) => {
          if (typeof value === "string" || value instanceof Date) {
            return this.formatter.formatDate(value, locale);
          }
          return formatCellValue(value);
        };
      case FieldDataType.ARRAY:
        return (value) => {
          if (isWidgetDataArray(value)) {
            return this.formatter.formatArray(value, { maxItems: 3 });
          }
          return formatCellValue(value);
        };
      case FieldDataType.OBJECT:
        return (value) => {
          if (isWidgetDataObject(value)) {
            return this.formatter.formatObject(value);
          }
          return formatCellValue(value);
        };
      default:
        return (value) =>
          this.formatter.formatText(formatCellValue(value), {
            maxLength: 50,
          });
    }
  }

  private renderTableWithColumns<TKey extends string>(
    data: WidgetData[],
    config: TableRenderConfig<TKey>,
    context: WidgetRenderContext,
  ): string {
    const indent = this.createIndent(context.depth, context);

    // Filter data to only TableRow objects
    const typedData: TableRow[] = data.filter((item): item is TableRow =>
      isWidgetDataObject(item),
    );

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(typedData, config, context);

    // Render header
    const header = this.renderTableHeader(config, columnWidths, context);

    // Render separator
    const separator = this.renderTableSeparator(columnWidths);

    // Render rows
    const rows = typedData.map((row) =>
      this.renderTableRow(row, config, columnWidths, context),
    );

    const result = [header, separator, ...rows];

    return result.map((line) => indent + line).join("\n");
  }

  private calculateColumnWidths<TKey extends string>(
    data: TableRow[],
    config: TableRenderConfig<TKey>,
    context: WidgetRenderContext,
  ): number[] {
    const maxWidth =
      context.options.maxWidth - context.depth * context.options.indentSize;
    const availableWidth = maxWidth - (config.columns.length - 1) * 3; // Account for separators

    return config.columns.map((col) => {
      if (col.width?.endsWith("%")) {
        const percentage = parseInt(col.width.replace("%", ""), 10) / 100;
        return Math.floor(availableWidth * percentage);
      }

      // Auto-calculate based on content - always translate labels
      const translatedLabel = context.t(col.label);
      const headerWidth = translatedLabel.length;
      const maxContentWidth = Math.max(
        ...data.slice(0, 10).map((row) => {
          const value = row[col.key];
          const formatted = col.formatter
            ? col.formatter(value)
            : formatCellValue(value);
          return formatted.length;
        }),
      );

      return Math.min(Math.max(headerWidth, maxContentWidth), 50);
    });
  }

  private renderTableHeader<TKey extends string>(
    config: TableRenderConfig<TKey>,
    columnWidths: number[],
    context: WidgetRenderContext,
  ): string {
    const cells = config.columns.map((col, index) => {
      // Always translate column labels
      const translatedLabel = context.t(col.label);
      const styledLabel = this.styleText(translatedLabel, "bold", context);
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

  private renderTableRow<TKey extends string>(
    row: TableRow,
    config: TableRenderConfig<TKey>,
    columnWidths: number[],
    context: WidgetRenderContext,
  ): string {
    const cells = config.columns.map((col, index) => {
      const value = row[col.key];
      // Translate string values (handles translation keys in data)
      const translatedValue = isWidgetDataString(value, context);
      const formatted = col.formatter
        ? col.formatter(translatedValue)
        : formatCellValue(translatedValue);
      const truncated = this.formatter.formatText(formatted, {
        maxLength: columnWidths[index],
      });
      return this.padText(truncated, columnWidths[index], col.align);
    });

    // eslint-disable-next-line i18next/no-literal-string
    return cells.join(" │ ");
  }

  private renderTableAutoColumns(
    data: WidgetData[],
    context: WidgetRenderContext,
  ): string {
    const t = context.t;

    if (data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Auto-detect columns from first row
    const firstRow = data[0];
    if (!isWidgetDataObject(firstRow)) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.invalidDataFormat",
        ),
      );
    }

    const firstRowObj = firstRow as TableRow;
    const columns: TableColumn<string>[] = Object.keys(firstRowObj).map(
      (key) => ({
        key,
        label: key,
        type: this.detectFieldType(firstRowObj[key]),
        align: "left" as const,
        formatter: this.getColumnFormatter(
          this.detectFieldType(firstRowObj[key]),
          context.options.locale,
        ),
      }),
    );

    const config = {
      columns,
      pagination: { enabled: false, pageSize: 50 },
      sorting: { enabled: false },
      filtering: { enabled: false },
    };

    return this.renderTableWithColumns(data, config, context);
  }

  private detectFieldType(value: WidgetData): FieldDataType {
    if (isWidgetDataNumber(value)) {
      return FieldDataType.NUMBER;
    }
    if (isWidgetDataBoolean(value)) {
      return FieldDataType.BOOLEAN;
    }
    if (isWidgetDataArray(value)) {
      return FieldDataType.ARRAY;
    }
    if (isWidgetDataObject(value)) {
      return FieldDataType.OBJECT;
    }
    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      return FieldDataType.DATE;
    }
    return FieldDataType.TEXT;
  }
}
