/**
 * Code Quality Summary Widget - Ink Implementation
 *
 * Displays summary statistics for code quality checks
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useInkWidgetLocale,
  useInkWidgetPlatform,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
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
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  CodeQualitySummaryWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  // field.value is typed as the inferred schema output; cast to the concrete type
  // since TSchema is constrained to CodeQualitySummarySchema (a ZodObject)
  const value = field.value as z.output<CodeQualitySummarySchema> | undefined;
  const platform = useInkWidgetPlatform();
  const locale = useInkWidgetLocale();
  const { t: globalT } = unifiedInterfaceScopedTranslation.scopedT(locale);

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
      ? `${displayedFiles} ${globalT("widgets.codeQualitySummary.of")} ${totalFiles}`
      : totalFiles;

  const issuesDisplay =
    displayedIssues < totalIssues
      ? `${displayedIssues} ${globalT("widgets.codeQualitySummary.of")} ${totalIssues}`
      : totalIssues;

  // MCP uses plain text without icons/colors
  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text>{globalT("widgets.codeQualitySummary.summary")}</Text>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
        <Text>──────────────────────────────────────────────────</Text>
        <Box flexDirection="column">
          <Text>
            {globalT("widgets.codeQualitySummary.files")}: {filesDisplay}
          </Text>
          <Text>
            {globalT("widgets.codeQualitySummary.issues")}: {issuesDisplay}
          </Text>
          {totalErrors > 0 && (
            <Text>
              {globalT("widgets.codeQualitySummary.errors")}: {totalErrors}
            </Text>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Box>
        <CliIcon icon="bar-chart" />
        <Text bold> {globalT("widgets.codeQualitySummary.summary")}</Text>
      </Box>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
      <Text>──────────────────────────────────────────────────</Text>
      <Box flexDirection="column">
        <Box>
          <CliIcon icon="folder" />
          <Text>
            {" "}
            {globalT("widgets.codeQualitySummary.files")}: {filesDisplay}
          </Text>
        </Box>
        <Box>
          <CliIcon icon="alert" />
          <Text>
            {"  "}
            {globalT("widgets.codeQualitySummary.issues")}: {issuesDisplay}
          </Text>
        </Box>
        {totalErrors > 0 && (
          <Box>
            <CliIcon icon="x-circle" color="red" />
            <Text color="red">
              {" "}
              {globalT("widgets.codeQualitySummary.errors")}: {totalErrors}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
