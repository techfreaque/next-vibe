/**
 * System Prompt Debug Widget (CLI/MCP)
 * Renders the full system prompt output in a readable format.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { SystemPromptDebugResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: SystemPromptDebugResponseOutput | null | undefined };
  fieldName: string;
}

const SEP = chalk.gray("─".repeat(60));

export function SystemPromptDebugWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const lines = useMemo(() => {
    const v = field.value;
    if (!v) {
      return null;
    }

    const chars = v.charCount.toLocaleString();
    const tokens = v.tokenEstimate.toLocaleString();

    const diagLines: string[] = [];
    if (v.cortexDiagnostics) {
      const d = v.cortexDiagnostics;
      if (!d.embeddingGenerated) {
        diagLines.push(
          isMcp
            ? "cortex-embedding: FAILED (no API key or call error)"
            : chalk.red.bold("⚠ Cortex embedding FAILED — no API key or error"),
        );
      } else if (d.topScores.length === 0) {
        diagLines.push(
          isMcp
            ? "cortex-embedding: generated but 0 nodes with embeddings"
            : chalk.yellow("Embedding generated but no nodes found"),
        );
      } else {
        const passing = d.topScores.filter((s) => s.passesThreshold).length;
        if (isMcp) {
          diagLines.push(
            `cortex-embedding: ${passing}/${d.topScores.length} pass threshold`,
          );
          for (const s of d.topScores.slice(0, 5)) {
            const mark = s.passesThreshold ? "✓" : "✗";
            diagLines.push(
              `  ${mark} ${s.path} sim:${s.baseSimilarity} +rec:${s.recencyBoost} ×path:${s.pathWeight} = ${s.adjustedScore}`,
            );
          }
        } else {
          diagLines.push(
            chalk.cyan(
              `Cortex Embeddings — top ${d.topScores.length} (${passing} pass >${0.2})`,
            ),
          );
          for (const s of d.topScores) {
            const mark = s.passesThreshold ? chalk.green("✓") : chalk.red("✗");
            const score = s.passesThreshold
              ? chalk.green(String(s.adjustedScore))
              : chalk.red(String(s.adjustedScore));
            const pathStr = chalk.gray(
              s.path.replace(/^\//, "").slice(0, 40).padEnd(40),
            );
            diagLines.push(
              `  ${mark} ${pathStr} ${score}  (sim:${s.baseSimilarity} +rec:${s.recencyBoost} ×${s.pathWeight})`,
            );
          }
        }
      }
    }

    if (isMcp) {
      return [
        `chars:${v.charCount} tokens:~${v.tokenEstimate}`,
        ...(diagLines.length > 0
          ? ["--- CORTEX DIAGNOSTICS ---", ...diagLines]
          : []),
        `--- SYSTEM PROMPT ---`,
        v.systemPrompt,
        `--- TRAILING CONTEXT ---`,
        v.trailingSystemMessage || "(empty)",
      ].join("\n");
    }

    const parts: string[] = [
      `${chalk.cyan.bold("System Prompt Debug")}  ${chalk.gray(`${chalk.bold(chars)} chars / ~${chalk.bold(tokens)} tokens`)}`,
    ];

    if (diagLines.length > 0) {
      parts.push(SEP, ...diagLines);
    }

    parts.push(SEP, chalk.yellow.bold("SYSTEM PROMPT"), v.systemPrompt);

    if (v.trailingSystemMessage) {
      parts.push(
        SEP,
        chalk.yellow.bold("TRAILING CONTEXT"),
        v.trailingSystemMessage,
      );
    }

    parts.push(SEP, chalk.gray.dim(`Total: ${chars} chars ≈ ${tokens} tokens`));

    return parts.join("\n");
  }, [field.value, isMcp]);

  if (!lines) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="wrap">{lines}</Text>
    </Box>
  );
}

SystemPromptDebugWidget.cliWidget = true as const;
