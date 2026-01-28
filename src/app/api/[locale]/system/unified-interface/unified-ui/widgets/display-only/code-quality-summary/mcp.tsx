/**
 * Code Quality Summary Widget - MCP Implementation
 *
 * Displays summary statistics for code quality checks (plain text)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type {
  CodeQualitySummarySchema,
  CodeQualitySummaryWidgetConfig,
} from "./types";

/**
 * Code Quality Summary MCP Widget - Plain text output
 */
export function CodeQualitySummaryWidgetMcp<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends CodeQualitySummarySchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  context,
  field,
}: InkWidgetProps<
  TEndpoint,
  CodeQualitySummaryWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const value = field.value;

  if (!value) {
    context.logger.debug("[CodeQualitySummaryMcp] No value, returning empty");
    return <Box />;
  }

  const {
    totalFiles,
    displayedFiles,
    totalIssues,
    displayedIssues,
    totalErrors,
  } = value;

  const filesDisplay =
    displayedFiles < totalFiles
      ? `${displayedFiles} ${context.t("app.api.system.unifiedInterface.widgets.codeQualitySummary.of")} ${totalFiles}`
      : totalFiles;

  const issuesDisplay =
    displayedIssues < totalIssues
      ? `${displayedIssues} ${context.t("app.api.system.unifiedInterface.widgets.codeQualitySummary.of")} ${totalIssues}`
      : totalIssues;

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text>
        {context.t(
          "app.api.system.unifiedInterface.widgets.codeQualitySummary.summary",
        )}
      </Text>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
      <Text>──────────────────────────────────────────────────</Text>
      <Box flexDirection="column">
        <Text>
          {context.t(
            "app.api.system.unifiedInterface.widgets.codeQualitySummary.files",
          )}
          : {filesDisplay}
        </Text>
        <Text>
          {context.t(
            "app.api.system.unifiedInterface.widgets.codeQualitySummary.issues",
          )}
          : {issuesDisplay}
        </Text>
        {totalErrors > 0 && (
          <Text>
            {context.t(
              "app.api.system.unifiedInterface.widgets.codeQualitySummary.errors",
            )}
            : {totalErrors}
          </Text>
        )}
      </Box>
    </Box>
  );
}
