/**
 * Video Generation CLI Widget
 * Renders video generation result for CLI and MCP platforms.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { VideoGenerationPostResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: VideoGenerationPostResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: VideoGenerationPostResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${chalk.green("✓")} ${chalk.bold("Video generated")}`);
  lines.push("");
  lines.push(`${chalk.dim("URL")}       ${chalk.cyan(value.videoUrl)}`);
  lines.push(
    `${chalk.dim("Credits")}   ${chalk.yellow(String(value.creditCost))}`,
  );
  if (value.jobId) {
    lines.push(`${chalk.dim("Job ID")}    ${chalk.yellow(value.jobId)}`);
  }
  return lines.join("\n");
}

function renderMcp(value: VideoGenerationPostResponseOutput): string {
  const parts = [
    "Video generated successfully.",
    `URL: ${value.videoUrl}`,
    `Credits used: ${String(value.creditCost)}`,
  ];
  if (value.jobId) {
    parts.push(`Job ID: ${value.jobId}`);
  }
  return parts.join("\n");
}

export function VideoGenerationWidget({ field }: CliWidgetProps): JSX.Element {
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

VideoGenerationWidget.cliWidget = true as const;
