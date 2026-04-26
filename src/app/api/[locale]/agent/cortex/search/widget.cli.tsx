/**
 * Cortex Search Widget (CLI/MCP)
 * Search results with excerpts and match highlighting.
 * CLI: colored paths + excerpts with detail threshold
 * MCP: compact one-line results
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexSearchResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexSearchResponseOutput | null | undefined };
  fieldName: string;
}

const DETAIL_THRESHOLD = 10;

export function CortexSearchWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (v.results.length === 0) {
      return isMcp
        ? `No results for "${v.responseQuery}".`
        : chalk.dim(`No results for "${v.responseQuery}".`);
    }

    if (isMcp) {
      const lines = [`${v.total} results for "${v.responseQuery}"`];
      for (const r of v.results) {
        const excerpt = r.excerpt ? ` - ${r.excerpt.slice(0, 80)}` : "";
        lines.push(`  ${r.resultPath}${excerpt}`);
      }
      return lines.join("\n");
    }

    // CLI
    const lines: string[] = [
      chalk.bold(`${v.total} results`) + chalk.dim(` for "${v.responseQuery}"`),
      "",
    ];

    for (const r of v.results) {
      lines.push(chalk.green(r.resultPath));
      if (r.excerpt && v.results.length <= DETAIL_THRESHOLD) {
        const truncExcerpt =
          r.excerpt.length > 120 ? `${r.excerpt.slice(0, 117)}...` : r.excerpt;
        lines.push(chalk.dim(`  ${truncExcerpt}`));
      }
    }

    return lines.join("\n");
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

CortexSearchWidget.cliWidget = true as const;
