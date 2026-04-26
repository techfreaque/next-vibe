/**
 * Single Favorite CLI Widget
 * Renders GET (favorite detail) and PATCH (update confirmation) responses.
 *
 * GET: shows name, tagline, skill ID, variant, model selection summary
 * PATCH: shows success confirmation with favorite name
 * CLI: colored output
 * MCP: compact plain text
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { ModelSelectionType } from "../../skills/enum";
import type {
  FavoriteGetResponseOutput,
  FavoriteUpdateResponseOutput,
} from "./definition";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Extract display label from i18n enum key, e.g. "enums.intelligence.brilliant" → "brilliant" */
function fmtEnumKey(v: string | undefined): string {
  return v ? (v.split(".").pop() ?? v) : "any";
}

function modelSummary(
  selection: FavoriteGetResponseOutput["modelSelection"],
): string {
  if (!selection) {
    return "skill default";
  }
  if (selection.selectionType === ModelSelectionType.MANUAL) {
    return `manual: ${selection.manualModelId}`;
  }
  const parts: string[] = ["filters:"];
  if (selection.intelligenceRange) {
    const { min, max } = selection.intelligenceRange;
    parts.push(
      min === max ? fmtEnumKey(min) : `${fmtEnumKey(min)}–${fmtEnumKey(max)}`,
    );
  }
  return parts.join(" ");
}

// ── GET Widget ────────────────────────────────────────────────────────────────

interface GetCliWidgetProps {
  field: {
    value: FavoriteGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderGetCli(value: FavoriteGetResponseOutput): string {
  const lines: string[] = [];
  lines.push(chalk.bold.cyan(value.name));
  if (value.tagline) {
    lines.push(chalk.white(`  ${value.tagline}`));
  }
  lines.push(chalk.dim(`  Skill: ${value.skillId}`));
  lines.push(chalk.dim(`  Model: ${modelSummary(value.modelSelection)}`));
  if (value.promptAppend) {
    const preview =
      value.promptAppend.length > 60
        ? `${value.promptAppend.slice(0, 57)}...`
        : value.promptAppend;
    lines.push(chalk.dim(`  Prompt append: ${preview}`));
  }
  return lines.join("\n");
}

function renderGetMcp(value: FavoriteGetResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${value.name} - ${value.tagline ?? ""}`);
  lines.push(`Skill: ${value.skillId}`);
  lines.push(`Model: ${modelSummary(value.modelSelection)}`);
  if (value.promptAppend) {
    lines.push(`Prompt append: ${value.promptAppend}`);
  }
  return lines.join("\n");
}

export function FavoriteGetCliWidget({
  field,
}: GetCliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }
    return isMcp ? renderGetMcp(value) : renderGetCli(value);
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

FavoriteGetCliWidget.cliWidget = true as const;

// ── PATCH Widget ──────────────────────────────────────────────────────────────

interface PatchCliWidgetProps {
  field: {
    value: FavoriteUpdateResponseOutput | null | undefined;
  };
  fieldName: string;
}

// oxlint-disable-next-line no-unused-vars
function renderPatchCli(_value: FavoriteUpdateResponseOutput): string {
  return `${chalk.green("✓")} ${chalk.bold("Favorite updated successfully")}`;
}

// oxlint-disable-next-line no-unused-vars
function renderPatchMcp(_value: FavoriteUpdateResponseOutput): string {
  return "Favorite updated successfully.";
}

export function FavoriteEditCliWidget({
  field,
}: PatchCliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }
    return isMcp ? renderPatchMcp(value) : renderPatchCli(value);
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

FavoriteEditCliWidget.cliWidget = true as const;

// Aliases for lazy widget factory
export { FavoriteGetCliWidget as FavoriteViewContainer };
export { FavoriteEditCliWidget as FavoriteEditContainer };
