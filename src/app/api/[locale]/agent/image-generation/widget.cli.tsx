/**
 * Image Generation CLI Widget
 * Renders image generation result for CLI and MCP platforms.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { ImageGenerationPostResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: ImageGenerationPostResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: ImageGenerationPostResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${chalk.green("✓")} ${chalk.bold("Image generated")}`);
  lines.push("");
  lines.push(`${chalk.dim("URL")}      ${chalk.cyan(value.imageUrl)}`);
  lines.push(
    `${chalk.dim("Credits")}  ${chalk.yellow(String(value.creditCost))}`,
  );
  return lines.join("\n");
}

function renderMcp(value: ImageGenerationPostResponseOutput): string {
  return [
    "Image generated successfully.",
    `URL: ${value.imageUrl}`,
    `Credits used: ${String(value.creditCost)}`,
  ].join("\n");
}

export function ImageGenerationWidget({ field }: CliWidgetProps): JSX.Element {
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

ImageGenerationWidget.cliWidget = true as const;
