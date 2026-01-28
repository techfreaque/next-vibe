/**
 * Code Quality List Widget - Ink Implementation
 *
 * Displays code quality issues grouped by file with severity-based styling
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";
import terminalLink from "terminal-link";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { CliIcon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli-icons";
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
 * Code Quality List Ink Widget
 */
export function CodeQualityListWidgetInk<
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

  // Get editor URI scheme from response data if field key is provided
  const editorUriScheme = useMemo(() => {
    if (
      field.editorUriSchemaFieldKey &&
      context.response?.success &&
      context.response?.data
    ) {
      const responseData = context.response.data;
      const scheme =
        responseData &&
        typeof responseData === "object" &&
        !Array.isArray(responseData)
          ? responseData[field.editorUriSchemaFieldKey]
          : undefined;
      if (typeof scheme === "string") {
        return scheme;
      }
    }
    // Default to vscode://file/ if not provided
    return "vscode://file/";
  }, [field.editorUriSchemaFieldKey, context.response]);

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

  // Build entire output as a single ANSI-encoded string
  const outputLines = useMemo(() => {
    const lines: string[] = [];

    for (const [file, items] of groupedItems.entries()) {
      const sortedItems = sortBySeverity(items);

      // File header
      lines.push(
        chalk.bold(
          `● ${chalk.underline(chalk.blue(file))} ${chalk.dim(`(${items.length} item${items.length !== 1 ? "s" : ""})`)}`,
        ),
      );

      // Build all issues for this file
      for (const item of sortedItems) {
        const severityColor =
          item.severity === "error"
            ? chalk.red
            : item.severity === "warning"
              ? chalk.yellow
              : chalk.blue;

        const icon =
          item.severity === "error"
            ? "❌"
            : item.severity === "warning"
              ? "⚠️ "
              : "ℹ️ ";

        // Create clickable editor link using configured URI scheme
        const absolutePath = item.file.startsWith("/")
          ? item.file
          : `${process.cwd()}/${item.file}`;
        const editorUrl = `${editorUriScheme}${absolutePath}:${item.line || 1}:${item.column || 1}`;
        const lineDisplay = `${item.line || 1}:${item.column || 1}`;
        const pathLineDisplay = `${item.file}:${item.line || 1}:${item.column || 1}`;

        // When piped (not a TTY), show path:line:char format; otherwise use terminal links
        const hyperlink = process.stdout.isTTY
          ? terminalLink(lineDisplay, editorUrl, {
              fallback: () => pathLineDisplay,
            })
          : pathLineDisplay;

        const line = `  ${chalk.blue(hyperlink)} ${severityColor(`${icon} ${item.severity}`)} ${item.message}${item.rule ? ` [${item.rule}]` : ""}`;
        lines.push(line);
      }

      // Add spacing between file groups
      lines.push("");
    }

    return lines;
  }, [groupedItems, editorUriScheme]);

  if (field.value.length === 0) {
    return (
      <Box>
        <CliIcon icon="check-circle" color="green" />
        <Text color="green">
          {" "}
          {t(
            "app.api.system.unifiedInterface.widgets.codeQualityList.noIssues",
          )}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text wrap="end">{outputLines.join("\n")}</Text>
    </Box>
  );
}
