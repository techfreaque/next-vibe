/**
 * Code Quality Files Widget - Ink Implementation
 *
 * Displays list of files with error/warning counts
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type {
  CodeQualityFilesSchema,
  CodeQualityFilesWidgetConfig,
} from "./types";

/**
 * Code Quality Files Ink Widget
 */
export function CodeQualityFilesWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends
    | CodeQualityFilesSchema
    | z.ZodOptional<CodeQualityFilesSchema>,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  CodeQualityFilesWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const value = field.value;
  const locale = useInkWidgetLocale();
  const { t } = simpleT(locale);
  // Build file list output as ANSI-encoded strings
  const fileLines = useMemo(() => {
    if (!value || value.length === 0) {
      return [];
    }

    const lines: string[] = [];
    for (const fileEntry of value) {
      const { file, errors, warnings, total } = fileEntry;
      const parts = [`  ${chalk.blue(chalk.underline(file))}`];

      if (errors > 0) {
        parts.push(chalk.red(`${errors} error${errors !== 1 ? "s" : ""}`));
      }
      if (warnings > 0) {
        parts.push(
          chalk.yellow(`${warnings} warning${warnings !== 1 ? "s" : ""}`),
        );
      }
      if (errors === 0 && warnings === 0 && total > 0) {
        parts.push(chalk.dim(`${total} issue${total !== 1 ? "s" : ""}`));
      }
      lines.push(parts.join(" "));
    }

    return lines;
  }, [value]);

  if (!value || value.length === 0) {
    return <Box />;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>
        {t(
          "app.api.system.unifiedInterface.widgets.codeQualityFiles.affectedFiles",
        )}
      </Text>
      <Text>{fileLines.join("\n")}</Text>
    </Box>
  );
}
