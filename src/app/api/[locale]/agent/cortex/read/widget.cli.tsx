/**
 * Cortex Read Widget (CLI/MCP)
 * File content display with metadata header.
 * CLI: colored header + content
 * MCP: compact metadata + raw content
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexReadResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexReadResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexReadWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (isMcp) {
      const meta = [
        v.responsePath,
        `${v.size}B`,
        v.readonly ? "readonly" : "writable",
        v.truncated ? "truncated" : "",
      ]
        .filter(Boolean)
        .join(" | ");
      return `${meta}\n\n${v.content}`;
    }

    // CLI
    const flags: string[] = [];
    if (v.readonly) {
      flags.push(chalk.yellow("readonly"));
    }
    if (v.truncated) {
      flags.push(chalk.red("truncated"));
    }
    const flagStr = flags.length > 0 ? ` ${flags.join(" ")}` : "";

    const header = `${chalk.bold(v.responsePath)} ${chalk.dim(`${v.size}B`)}${flagStr}`;
    return `${header}\n${"─".repeat(40)}\n${v.content}`;
  }, [field.value, isMcp]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="wrap">{output}</Text>
    </Box>
  );
}

CortexReadWidget.cliWidget = true as const;
