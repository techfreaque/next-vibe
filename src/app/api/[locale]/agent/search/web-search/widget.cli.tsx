/**
 * CLI/MCP Widget for Unified Web Search Results
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { SearchProvider } from "../enum";
import type { WebSearchGetResponseOutput } from "./definition";

/** Map enum i18n keys to display names for CLI/MCP */
const PROVIDER_DISPLAY: Record<string, string> = {
  [SearchProvider.BRAVE]: "Brave Search",
  [SearchProvider.KAGI]: "Kagi FastGPT",
};

function providerName(value: string): string {
  return PROVIDER_DISPLAY[value] ?? value;
}

interface CliWidgetProps {
  field: {
    value: WebSearchGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderCli(data: WebSearchGetResponseOutput): string {
  const lines: string[] = [];

  lines.push(
    `${chalk.green("✓")} ${chalk.bold("Web Search")} ${chalk.dim(`via ${providerName(data.usedProvider)}`)}`,
  );

  // AI answer (Kagi)
  if (data.output) {
    lines.push("");
    lines.push(`${chalk.cyan.bold("AI Answer:")}`);
    lines.push(data.output);
  }

  // Results
  if (data.results.length > 0) {
    lines.push("");
    lines.push(chalk.dim(`${String(data.results.length)} result(s):`));
    lines.push("");

    for (const result of data.results) {
      lines.push(`  ${chalk.bold(result.title)}`);
      lines.push(`  ${chalk.cyan(result.url)}`);
      if (result.snippet) {
        lines.push(`  ${chalk.dim(result.snippet)}`);
      }
      const meta: string[] = [];
      if (result.age) {
        meta.push(result.age);
      }
      if (result.source) {
        meta.push(result.source);
      }
      if (meta.length > 0) {
        lines.push(`  ${chalk.dim(meta.join(" • "))}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

function renderMcp(data: WebSearchGetResponseOutput): string {
  const lines: string[] = [];

  lines.push(`Provider: ${providerName(data.usedProvider)}`);

  if (data.output) {
    lines.push("");
    lines.push("AI Answer:");
    lines.push(data.output);
  }

  if (data.results.length > 0) {
    lines.push("");
    lines.push(`Results (${String(data.results.length)}):`);
    for (const result of data.results) {
      const parts = [result.title, result.url];
      if (result.snippet) {
        parts.push(result.snippet);
      }
      lines.push(`- ${parts.join(" | ")}`);
    }
  }

  return lines.join("\n");
}

export function WebSearchCliWidget({ field }: CliWidgetProps): JSX.Element {
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

WebSearchCliWidget.cliWidget = true as const;

export { WebSearchCliWidget as WebSearchResultsContainer };
