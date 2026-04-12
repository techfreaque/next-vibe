/**
 * Lead Magnet Capture CLI Widget
 * CLI: colored result showing capture status and signup URL
 * MCP: compact plain text for AI consumption
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CapturePostResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CapturePostResponseOutput | null | undefined;
  };
}

function renderCli(value: CapturePostResponseOutput): string {
  const captured = value.captured
    ? chalk.green("✓ Subscribed")
    : chalk.yellow("→ Not subscribed (form inactive or no config)");

  return [
    captured,
    "",
    `${chalk.dim("Next step")}   ${value.nextStep}`,
    `${chalk.dim("Sign-up URL")} ${chalk.cyan(value.signupUrl)}`,
  ].join("\n");
}

function renderMcp(value: CapturePostResponseOutput): string {
  return [
    `Captured: ${value.captured ? "yes" : "no"}`,
    `Next step: ${value.nextStep}`,
    `Sign-up URL: ${value.signupUrl}`,
  ].join("\n");
}

export function LeadMagnetCaptureCliWidget({
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

LeadMagnetCaptureCliWidget.cliWidget = true as const;

export { LeadMagnetCaptureCliWidget as LeadMagnetCaptureContainer };
