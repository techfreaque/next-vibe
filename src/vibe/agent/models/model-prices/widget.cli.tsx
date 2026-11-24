/**
 * Model Prices CLI Widget
 * Shows price update results: updated counts per provider, and failures (the stuff needing attention).
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { ModelPricesGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: ModelPricesGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(value: ModelPricesGetResponseOutput): string {
  const lines: string[] = [];

  // Header
  const { summary } = value;
  lines.push(chalk.bold.cyan("═══ Model Price Comparison ═══"));
  lines.push(
    `${chalk.dim("Providers:")} ${String(summary.totalProviders)}  ` +
      `${chalk.dim("Proposed changes:")} ${chalk.green(String(summary.modelsUpdated))}  ` +
      `${chalk.dim("Files:")} ${summary.fileUpdated ? chalk.green("written") : chalk.dim(value.diff ? "preview" : "no changes")}`,
  );

  // Provider summary (one line each)
  lines.push("");
  lines.push(chalk.bold("Provider Results:"));
  for (const r of value.providerResults) {
    const status =
      r.error !== null && r.error !== undefined
        ? chalk.red(`✗ ${r.error}`)
        : chalk.green(`✓ ${String(r.modelsUpdated)} updated`);
    lines.push(
      `  ${chalk.yellow(r.provider.padEnd(22))} ${chalk.dim(String(r.modelsFound).padStart(3))} found  ${status}`,
    );
  }

  // Failures only - this is the actionable part
  if (value.failures.length > 0) {
    lines.push("");
    lines.push(chalk.bold.red(`Failures (${String(value.failures.length)}):`));
    for (const f of value.failures) {
      lines.push(
        `  ${chalk.red("✗")} ${chalk.yellow(f.provider.padEnd(18))} ${chalk.dim(f.modelId)}`,
      );
      lines.push(`    ${chalk.dim(f.reason)}`);
    }
  } else {
    lines.push("");
    lines.push(chalk.green("✓ No failures - all models priced."));
  }

  if (value.diff) {
    lines.push("", value.diff);
  }
  return lines.join("\n");
}

function renderMcp(value: ModelPricesGetResponseOutput): string {
  const lines: string[] = [];
  const { summary } = value;

  lines.push(
    `${String(summary.modelsUpdated)} proposed changes across ${String(summary.totalProviders)} providers.`,
  );

  for (const r of value.providerResults) {
    const status =
      r.error !== null && r.error !== undefined
        ? `ERROR: ${r.error}`
        : `${String(r.modelsUpdated)} updated`;
    lines.push(`${r.provider}: ${String(r.modelsFound)} found, ${status}`);
  }

  if (value.failures.length > 0) {
    lines.push(`\nFAILURES (${String(value.failures.length)}):`);
    for (const f of value.failures) {
      lines.push(`  ${f.provider} | ${f.modelId} | ${f.reason}`);
    }
  } else {
    lines.push("\nNo failures.");
  }

  if (value.diff) {
    lines.push("", value.diff);
  }
  return lines.join("\n");
}

export function ModelPricesWidget({ field }: CliWidgetProps): JSX.Element {
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
      <Text>{output}</Text>
    </Box>
  );
}

ModelPricesWidget.cliWidget = true as const;
