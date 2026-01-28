/**
 * Code Quality List Widget - MCP Implementation
 *
 * Displays code quality issues grouped by file (plain text, no coloring)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { simpleT } from "@/i18n/core/shared";

import type {
  CodeQualityListSchema,
  CodeQualityListWidgetConfig,
} from "./types";

interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

// Sort by severity
function sortBySeverity(items: CodeQualityItem[]): CodeQualityItem[] {
  const severityOrder = { error: 0, warning: 1, info: 2 };
  return [...items].toSorted(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}

/**
 * Code Quality List MCP Widget - Plain text output
 */
export function CodeQualityListWidgetMcp<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends CodeQualityListSchema,
  TUsage extends FieldUsageConfig,
>({
  context,
  field,
}: InkWidgetProps<
  TEndpoint,
  CodeQualityListWidgetConfig<TSchema, TUsage, "primitive">
>): JSX.Element {
  const value = field.value;

  const { t } = simpleT(context.locale);

  // Group items by file
  const groupedItems = useMemo(() => {
    const groups = new Map<string, CodeQualityItem[]>();

    if (!value) {
      return groups;
    }

    for (const item of value) {
      const existing = groups.get(item.file) || [];
      existing.push(item);
      groups.set(item.file, existing);
    }

    return groups;
  }, [value]);

  // Build entire output as plain text
  const outputLines = useMemo(() => {
    const lines: string[] = [];

    for (const [file, items] of groupedItems.entries()) {
      const sortedItems = sortBySeverity(items);

      // File header
      lines.push(
        `● ${file} (${items.length} item${items.length !== 1 ? "s" : ""})`,
      );

      // Build all issues for this file
      for (const item of sortedItems) {
        const icon =
          item.severity === "error"
            ? "❌"
            : item.severity === "warning"
              ? "⚠️ "
              : "ℹ️ ";

        const locationDisplay = `${item.line || 1}:${item.column || 1}`;
        const line = `  ${locationDisplay} ${icon} ${item.severity} ${item.message}${item.rule ? ` [${item.rule}]` : ""}`;
        lines.push(line);
      }

      // Add spacing between file groups
      lines.push("");
    }

    return lines;
  }, [groupedItems]);

  if (!value || field.value.length === 0) {
    return (
      <Text>
        {t("app.api.system.unifiedInterface.widgets.codeQualityList.noIssues")}
      </Text>
    );
  }

  return (
    <Box flexDirection="column">
      <Text wrap="end">{outputLines.join("\n")}</Text>
    </Box>
  );
}
