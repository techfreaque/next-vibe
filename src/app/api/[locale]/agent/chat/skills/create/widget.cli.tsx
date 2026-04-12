/**
 * Skill Create CLI Widget
 * Renders the result of creating a new skill in CLI and MCP platforms.
 *
 * CLI: colored success output with skill summary
 * MCP: compact plain text showing what was created
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { SkillCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: SkillCreateResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: SkillCreateResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${chalk.green("✓")} ${chalk.bold("Skill created")}`);
  lines.push("");
  lines.push(`${chalk.dim("ID")}  ${chalk.cyan(value.id)}`);
  return lines.join("\n");
}

function renderMcp(value: SkillCreateResponseOutput): string {
  return [`Skill created successfully.`, `ID: ${value.id}`].join("\n");
}

export function SkillCreateCliWidget({ field }: CliWidgetProps): JSX.Element {
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

SkillCreateCliWidget.cliWidget = true as const;

export { SkillCreateCliWidget as SkillCreateContainer };
