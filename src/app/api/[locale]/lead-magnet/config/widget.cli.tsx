/**
 * Lead Magnet Config CLI Widget
 * CLI: colored status output showing current provider config
 * MCP: compact plain text for AI consumption
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { LeadMagnetConfigGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: LeadMagnetConfigGetResponseOutput | null | undefined;
  };
}

function renderCli(value: LeadMagnetConfigGetResponseOutput): string {
  if (!value.exists || !value.config) {
    return [
      `${chalk.dim("●")} ${chalk.yellow("No email platform connected")}`,
      `${chalk.dim("  Use")} ${chalk.cyan("vibe lead-magnet providers <platform>")} ${chalk.dim("to connect one")}`,
    ].join("\n");
  }

  const c = value.config;
  const status = c.isActive
    ? chalk.green("● Active")
    : chalk.yellow("○ Inactive");

  const lines: string[] = [
    `${status}  ${chalk.bold(c.provider)}`,
    "",
    `${chalk.dim("List ID")}      ${c.listId ?? chalk.dim("—")}`,
    `${chalk.dim("Headline")}     ${c.headline ?? chalk.dim("—")}`,
    `${chalk.dim("Button")}       ${c.buttonText ?? chalk.dim("—")}`,
    `${chalk.dim("Updated")}      ${new Date(c.updatedAt).toLocaleDateString()}`,
  ];

  return lines.join("\n");
}

function renderMcp(value: LeadMagnetConfigGetResponseOutput): string {
  if (!value.exists || !value.config) {
    return "No lead magnet config. Use a provider endpoint to connect.";
  }

  const c = value.config;
  return [
    `Provider: ${c.provider}`,
    `Active: ${c.isActive ? "yes" : "no"}`,
    `List ID: ${c.listId ?? "none"}`,
    `Headline: ${c.headline ?? "none"}`,
    `Button text: ${c.buttonText ?? "none"}`,
  ].join("\n");
}

export function LeadMagnetConfigCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
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

LeadMagnetConfigCliWidget.cliWidget = true as const;

export { LeadMagnetConfigCliWidget as LeadMagnetConfigContainer };
