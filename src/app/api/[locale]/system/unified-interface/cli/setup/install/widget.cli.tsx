import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { InstallResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: InstallResponseOutput | null | undefined;
  };
  fieldName: string;
}

export function SetupInstallWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!value) {
    return <Box />;
  }

  if (isMcp) {
    const lines: string[] = [];
    lines.push(value.installed ? "status: installed" : "status: failed");
    if (value.version) {
      lines.push(`version: ${value.version}`);
    }
    if (value.path) {
      lines.push(`path: ${value.path}`);
    }
    lines.push(`message: ${value.message}`);
    if (value.output) {
      lines.push("");
      lines.push(value.output);
    }
    return (
      <Box flexDirection="column">
        <Text wrap="truncate-end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  // CLI: colored human-readable output
  const lines: string[] = [];

  if (value.installed) {
    lines.push(chalk.bold.green("✓ vibe CLI installed successfully"));
  } else {
    lines.push(chalk.bold.red("✗ Installation failed"));
  }

  if (value.version) {
    lines.push(chalk.dim(`  version: ${value.version}`));
  }
  if (value.path) {
    lines.push(chalk.dim(`  path:    ${value.path}`));
  }

  lines.push("");
  lines.push(chalk.white(value.message));

  if (value.output) {
    lines.push("");
    lines.push(chalk.dim(value.output));
  }

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{lines.join("\n")}</Text>
    </Box>
  );
}

SetupInstallWidget.cliWidget = true as const;
