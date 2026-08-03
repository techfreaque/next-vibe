import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "../../../platforms/platforms";
import { useWidgetPlatform } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { UninstallResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: UninstallResponseOutput | null | undefined;
  };
  fieldName: string;
}

/**
 * The mirror of install's, and terse for the same reason: each setup has already
 * narrated what it removed through the logger by the time this renders, so
 * repeating every summary here would print the run twice. This is the verdict,
 * not the transcript.
 *
 * MCP has no logger stream to have seen any of it, so it gets the full list.
 */
export function SetupUninstallWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const value = field.value;

  if (!value) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    const lines = value.results.map(
      (entry) =>
        `${entry.ok ? "ok" : "FAILED"}  ${entry.key}: ${entry.summary}`,
    );
    return (
      <Box flexDirection="column">
        <Text wrap="truncate-end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  const failed = value.results.filter((entry) => !entry.ok);
  const line =
    failed.length > 0
      ? chalk.bold.red(`✗ ${failed.length} of ${value.results.length} failed`)
      : chalk.bold.green("✓ uninstall complete");

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{line}</Text>
    </Box>
  );
}

SetupUninstallWidget.cliWidget = true as const;
