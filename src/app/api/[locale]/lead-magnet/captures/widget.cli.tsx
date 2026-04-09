/**
 * Lead Magnet Captures CLI Widget
 * CLI: chalk-colored table of captured leads
 * MCP: compact plain text list for AI consumption
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CapturesListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CapturesListResponseOutput | null | undefined;
  };
}

function renderCli(value: CapturesListResponseOutput): string {
  if (value.items.length === 0) {
    return chalk.dim("No leads captured yet.");
  }

  const header = [
    chalk.dim.bold("Date".padEnd(20)),
    chalk.dim.bold("Name".padEnd(16)),
    chalk.dim.bold("Email".padEnd(30)),
    chalk.dim.bold("Status"),
  ].join("  ");

  const divider = chalk.dim("─".repeat(80));

  const rows = value.items.map((r) => {
    const date = new Date(r.createdAt)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .padEnd(20);
    const name = r.firstName.slice(0, 15).padEnd(16);
    const email = r.email.slice(0, 29).padEnd(30);
    const status =
      r.status === "SUCCESS"
        ? chalk.green("✓ Captured")
        : chalk.red("✗ Failed");
    return `${chalk.dim(date)}  ${name}  ${chalk.cyan(email)}  ${status}`;
  });

  const footer = chalk.dim(
    `\nTotal: ${value.total} lead${value.total !== 1 ? "s" : ""}`,
  );

  return [header, divider, ...rows, footer].join("\n");
}

function renderMcp(value: CapturesListResponseOutput): string {
  if (value.items.length === 0) {
    return "No leads captured yet.";
  }

  const lines = value.items.map(
    (r) => `${r.createdAt} | ${r.firstName} | ${r.email} | ${r.status}`,
  );

  return [`Total: ${value.total}`, ...lines].join("\n");
}

export function LeadMagnetCapturesCliWidget({
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
      <Text wrap="end">{output}</Text>
    </Box>
  );
}

LeadMagnetCapturesCliWidget.cliWidget = true as const;
