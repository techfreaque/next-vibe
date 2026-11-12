/**
 * Music Generation CLI Widget
 * Renders music generation result for CLI and MCP platforms.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import { resolveMediaSrc } from "../chat/storage/media-src";
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
  lines.push(
    `${chalk.dim("URL")}       ${chalk.cyan(resolveMediaSrc(value.audioUrl, { absolute: true }))}`,
  );
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
    `URL: ${resolveMediaSrc(value.audioUrl, { absolute: true })}`,
    `Duration: ${String(value.durationSeconds)}s`,
    `Credits used: ${String(value.creditCost)}`,
  ].join("\n");
}

export function MusicGenerationWidget({ field }: CliWidgetProps): JSX.Element {
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

MusicGenerationWidget.cliWidget = true as const;
