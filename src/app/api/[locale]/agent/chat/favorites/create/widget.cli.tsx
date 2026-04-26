/**
 * Favorite Create CLI Widget
 * Renders the result of creating a new favorite in CLI and MCP platforms.
 *
 * CLI: colored success with ID
 * MCP: compact plain text
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { FavoriteCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: FavoriteCreateResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: FavoriteCreateResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${chalk.green("✓")} ${chalk.bold("Favorite created")}`);
  lines.push("");
  lines.push(`${chalk.dim("ID")}  ${chalk.cyan(value.id)}`);
  return lines.join("\n");
}

function renderMcp(value: FavoriteCreateResponseOutput): string {
  return [`Favorite created successfully.`, `ID: ${value.id}`].join("\n");
}

export function FavoriteCreateCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }
    return isMcp ? renderMcp(value) : renderCli(value);
  }, [field.value, isMcp]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{output}</Text>
    </Box>
  );
}

FavoriteCreateCliWidget.cliWidget = true as const;

export { FavoriteCreateCliWidget as FavoriteCreateContainer };
