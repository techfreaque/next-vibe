/**
 * Music Generation CLI Widget
 * Renders music generation result for CLI and MCP platforms.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { MusicGenerationPostResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: MusicGenerationPostResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: MusicGenerationPostResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${chalk.green("✓")} ${chalk.bold("Music generated")}`);
  lines.push("");
  lines.push(`${chalk.dim("URL")}       ${chalk.cyan(value.audioUrl)}`);
  lines.push(
    `${chalk.dim("Duration")}  ${chalk.yellow(`${String(value.durationSeconds)}s`)}`,
  );
  lines.push(
    `${chalk.dim("Credits")}   ${chalk.yellow(String(value.creditCost))}`,
  );
  return lines.join("\n");
}

function renderMcp(value: MusicGenerationPostResponseOutput): string {
  return [
    "Music generated successfully.",
    `URL: ${value.audioUrl}`,
    `Duration: ${String(value.durationSeconds)}s`,
    `Credits used: ${String(value.creditCost)}`,
  ].join("\n");
}

export function MusicGenerationWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
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

MusicGenerationWidget.cliWidget = true as const;
