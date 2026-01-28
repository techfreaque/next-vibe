/**
 * Code Quality Summary Widget - Ink Implementation
 *
 * Displays summary statistics for code quality checks
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { CliIcon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli-icons";

import type {
  CodeQualitySummarySchema,
  CodeQualitySummaryWidgetConfig,
} from "./types";

/**
 * Code Quality Summary Ink Widget
 */
export function CodeQualitySummaryWidgetInk<
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
      <Box>
        <CliIcon icon="bar-chart" />
        <Text bold>
          {" "}
          {context.t(
            "app.api.system.unifiedInterface.widgets.codeQualitySummary.summary",
          )}
        </Text>
      </Box>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
      <Text>──────────────────────────────────────────────────</Text>
      <Box flexDirection="column">
        <Box>
          <CliIcon icon="folder" />
          <Text>
            {" "}
            {context.t(
              "app.api.system.unifiedInterface.widgets.codeQualitySummary.files",
            )}
            : {filesDisplay}
          </Text>
        </Box>
        <Box>
          <CliIcon icon="alert" />
          <Text>
            {"  "}
            {context.t(
              "app.api.system.unifiedInterface.widgets.codeQualitySummary.issues",
            )}
            : {issuesDisplay}
          </Text>
        </Box>
        {totalErrors > 0 && (
          <Box>
            <CliIcon icon="x-circle" color="red" />
            <Text color="red">
              {" "}
              {context.t(
                "app.api.system.unifiedInterface.widgets.codeQualitySummary.errors",
              )}
              : {totalErrors}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
