/**
 * Data Table Widget - Ink implementation
 * Handles DATA_TABLE widget type for tabular data
 * Supports both array (multi-row) and object (single-row) variants.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { MultiWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/MultiWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { getFieldLabel } from "../../_shared/field-helpers";
import { hasChild, hasChildren } from "../../_shared/type-guards";
import type { DataTableWidgetConfig } from "./types";

/**
 * Shared table rendering: columns + separator + rows.
 * Extracted so both array and object variants reuse identical layout logic.
 */
function renderTable({
  title,
  columns,
  fieldDefinitions,
  rows,
  t,
}: {
  title: string | undefined;
  columns: string[];
  fieldDefinitions: Record<
    string,
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>
  >;
  rows: Array<Record<string, WidgetData>>;
  t: (key: string) => string;
}): JSX.Element {
  return (
    <Box flexDirection="column" marginY={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold>{title}</Text>
        </Box>
      )}

      {/* Header */}
      <Box>
        {columns.map((col, index) => {
          const label = getFieldLabel(fieldDefinitions[col], col, t);

          return (
            <Box key={index} width={20} marginRight={1}>
              <Text bold dimColor>
                {label}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Separator */}
      <Text dimColor>{"─".repeat(columns.length * 21)}</Text>

      {/* Rows */}
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex}>
          {columns.map((col, colIndex) => {
            const fieldDef = fieldDefinitions[col];
            const cellValue = row[col];

            return (
              <Box key={colIndex} width={20} marginRight={1}>
                {fieldDef ? (
                  <MultiWidgetRenderer
                    childrenSchema={{ [col]: fieldDef }}
                    value={row}
                    fieldName={undefined}
                  />
                ) : (
                  <Text>{`${cellValue ?? "—"}`}</Text>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

/**
 * Data Table Widget - Ink functional component
 *
 * Displays data in a simple table format.
 * - Array variant: each array item is a row, child's children are columns
 * - Object variant: single row table, children are columns
 */
export function DataTableWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional" | "object" | "object-optional",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  DataTableWidgetConfig<TKey, TUsage, TSchemaType, TChildOrChildren>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { title: titleKey } = field;

  const title = titleKey ? t(titleKey) : undefined;

  // Array variant: field.value is an array of row objects
  if (hasChild(field)) {
    if (field.value.length === 0) {
      return (
        <Box flexDirection="column" marginY={1}>
          {title && <Text bold>{title}</Text>}
          <Text dimColor>{t("system.ui.widgets.dataTable.noData")}</Text>
        </Box>
      );
    }

    // Child template must be an object widget (columns) to render as table
    const child = field.child;
    if (
      !(
        typeof child === "object" &&
        child !== null &&
        "children" in child &&
        child.children &&
        typeof child.children === "object"
      )
    ) {
      return (
        <Box flexDirection="column" marginY={1}>
          {title && <Text bold>{title}</Text>}
          <Text dimColor>{t("system.ui.widgets.dataTable.noData")}</Text>
        </Box>
      );
    }

    const fieldDefinitions = child.children;
    const columns = Object.keys(fieldDefinitions);

    // Each array item becomes a row — filter to plain objects (not arrays/primitives)
    // oxlint-disable-next-line typescript/no-unsafe-assignment -- runtime filter guards shape; predicate can't narrow recursive WidgetData to Record
    const rows = field.value.filter(
      (row: WidgetData): row is Record<string, WidgetData> =>
        Boolean(row) && typeof row === "object" && !Array.isArray(row),
    );

    return renderTable({ title, columns, fieldDefinitions, rows, t });
  }

  // Object variant: field.value is a single object, children are columns
  if (hasChildren(field)) {
    const { children: fieldDefinitions, value } = field;
    const columns = Object.keys(fieldDefinitions);

    // Single row from the object value (hasChildren narrows to Record<string, WidgetData>)
    const rows = [value];

    return renderTable({ title, columns, fieldDefinitions, rows, t });
  }

  // Fallback: no renderable data
  return (
    <Box flexDirection="column" marginY={1}>
      {title && <Text bold>{title}</Text>}
      <Text dimColor>{t("system.ui.widgets.dataTable.noData")}</Text>
    </Box>
  );
}
