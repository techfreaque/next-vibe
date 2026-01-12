/**
 * Data Table Widget Renderer
 * Handles DATA_TABLE widget type with column definitions and formatting
 */

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
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
import { getTranslator } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-helpers";
import type { CountryLanguage } from "@/i18n/core/config";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class DataTableWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.DATA_TABLE
> {
  readonly widgetType = WidgetType.DATA_TABLE;

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

    const config = this.getTableConfig(field, context.options.locale);

    if (config.columns && config.columns.length > 0) {
      return this.renderTableWithColumns(data.rows, config, context);
    }
    return this.renderTableAutoColumns(data.rows, context);
  }

  private getTableConfig<const TKey extends string>(
    field: UnifiedField<TKey>,
    locale: CountryLanguage,
  ): TableRenderConfig<TKey> {
    if (field.ui.type !== WidgetType.DATA_TABLE) {
      return {
        columns: [],
        pagination: { enabled: false, pageSize: 50 },
        sorting: { enabled: false },
        filtering: { enabled: false },
      };
    }

    const config = field.ui;

    const columns: TableColumn<TKey>[] =
      config.columns?.map((col) => ({
        key: col.key,
        label: col.label,
        type: FieldDataType.TEXT,
        width: typeof col.width === "string" ? col.width : undefined,
        align: col.align || ("left" as const),
        formatter: this.getColumnFormatter(FieldDataType.TEXT, locale),
      })) || [];

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

  private getColumnFormatter(
    type: FieldDataType,
    locale: CountryLanguage,
  ): (value: WidgetData) => string {
    switch (type) {
      case FieldDataType.NUMBER:
        return (value) => {
          if (typeof value === "number") {
            return this.formatter.formatNumber(value, locale);
          }
          return formatCellValue(value);
        };
      case FieldDataType.BOOLEAN:
        return (value) => {
          if (typeof value === "boolean") {
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
          if (Array.isArray(value)) {
            return this.formatter.formatArray(value, { maxItems: 3 });
          }
          return formatCellValue(value);
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
    const { t } = getTranslator(context);
    const maxWidth =
      context.options.maxWidth - context.depth * context.options.indentSize;
    const availableWidth = maxWidth - (config.columns.length - 1) * 3; // Account for separators

    return config.columns.map((col) => {
      if (col.width?.endsWith("%")) {
        const percentage = parseInt(col.width.replace("%", ""), 10) / 100;
        return Math.floor(availableWidth * percentage);
      }

      // Auto-calculate based on content - always translate labels
      const translatedLabel = t(col.label);
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
    const { t } = getTranslator(context);
    const cells = config.columns.map((col, index) => {
      // Always translate column labels
      const translatedLabel = t(col.label);
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
    const { t } = getTranslator(context);
    const cells = config.columns.map((col, index) => {
      const value = row[col.key];
      // Translate string values (handles translation keys in data)
      const translatedValue = typeof value === "string" ? t(value) : value;
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
    if (
      typeof firstRow !== "object" ||
      firstRow === null ||
      Array.isArray(firstRow)
    ) {
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
