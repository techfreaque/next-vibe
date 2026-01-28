/**
 * Data Table Widget - Ink implementation
 * Handles DATA_TABLE widget type for tabular data
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { InkWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { DataTableWidgetConfig } from "./types";

/**
 * Data Table Widget - Ink functional component
 *
 * Displays data in a simple table format.
 */
export function DataTableWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  DataTableWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  const { title: titleKey } = field;
  const { t } = context;

  const title = titleKey ? t(titleKey) : undefined;

  if (!Array.isArray(field.value) || field.value.length === 0) {
    return (
      <Box flexDirection="column" marginY={1}>
        {title && <Text bold>{title}</Text>}
        <Text dimColor>{t("system.ui.widgets.dataTable.noData")}</Text>
      </Box>
    );
  }

  let fieldDefinitions: Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  > = {};

  const childField = field.child;
  if (childField) {
    fieldDefinitions = childField.children;
  }

  const columns = Object.keys(fieldDefinitions);

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
          const fieldDef = fieldDefinitions[col];
          let label = col;
          if (fieldDef) {
            if (typeof fieldDef.label === "string") {
              label = t(fieldDef.label);
            } else if (
              "content" in fieldDef &&
              typeof fieldDef.content === "string"
            ) {
              label = t(fieldDef.content);
            } else if (
              "text" in fieldDef &&
              typeof fieldDef.text === "string"
            ) {
              label = t(fieldDef.text);
            }
          }

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
      {field.value.map((row, rowIndex) => {
        if (!row || typeof row !== "object") {
          return null;
        }

        return (
          <Box key={rowIndex}>
            {columns.map((col, colIndex) => {
              const fieldDef = fieldDefinitions[col];
              const cellValue = row[col];

              return (
                <Box key={colIndex} width={20} marginRight={1}>
                  {fieldDef ? (
                    <InkWidgetRenderer
                      field={{ ...fieldDef, value: cellValue }}
                      fieldName={col}
                      context={context}
                    />
                  ) : (
                    <Text>{`${cellValue ?? "—"}`}</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
