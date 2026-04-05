/**
 * Single Skill CLI Widget
 * Renders GET (skill detail) and PATCH (update confirmation) responses.
 *
 * GET: shows skill name, tagline, model selection, variants list
 * PATCH: shows success confirmation with updated skill name
 * CLI: colored output
 * MCP: compact plain text
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type {
  SkillGetResponseOutput,
  SkillUpdateResponseOutput,
} from "./definition";

// ── GET Widget ────────────────────────────────────────────────────────────────

interface GetCliWidgetProps {
  field: {
    value: SkillGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

function renderGetCli(value: SkillGetResponseOutput): string {
  const lines: string[] = [];
  lines.push(chalk.bold.cyan(value.name ?? "(unnamed)"));
  if (value.tagline) {
    lines.push(chalk.white(`  ${value.tagline}`));
  }
  if (value.description && value.description !== value.tagline) {
    lines.push(chalk.dim(`  ${value.description}`));
  }
  if (value.variants && value.variants.length > 0) {
    lines.push("");
    lines.push(chalk.dim(`  Variants (${String(value.variants.length)}):`));
    for (const v of value.variants) {
      const variantLabel = v.isDefault
        ? chalk.green("default")
        : chalk.dim(v.id);
      lines.push(`    ${variantLabel}`);
    }
  }
  return lines.join("\n");
}

function renderGetMcp(value: SkillGetResponseOutput): string {
  const lines: string[] = [];
  lines.push(`${value.name ?? "(unnamed)"} - ${value.tagline ?? ""}`);
  if (value.description && value.description !== value.tagline) {
    lines.push(`Description: ${value.description}`);
  }
  if (value.variants && value.variants.length > 0) {
    lines.push(
      `Variants: ${value.variants.map((v) => (v.isDefault ? `default (${v.id})` : v.id)).join(", ")}`,
    );
  }
  return lines.join("\n");
}

export function SkillGetCliWidget({ field }: GetCliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
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
      <Text wrap="end">{output}</Text>
    </Box>
  );
}

SkillGetCliWidget.cliWidget = true as const;

// ── PATCH Widget ──────────────────────────────────────────────────────────────

interface PatchCliWidgetProps {
  field: {
    value: SkillUpdateResponseOutput | null | undefined;
  };
  fieldName: string;
}

// oxlint-disable-next-line no-unused-vars
function renderPatchCli(_value: SkillUpdateResponseOutput): string {
  return `${chalk.green("✓")} ${chalk.bold("Skill updated successfully")}`;
}

// oxlint-disable-next-line no-unused-vars
function renderPatchMcp(_value: SkillUpdateResponseOutput): string {
  return "Skill updated successfully.";
}

export function SkillEditCliWidget({
  field,
}: PatchCliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
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
      <Text wrap="end">{output}</Text>
    </Box>
  );
}

SkillEditCliWidget.cliWidget = true as const;

// Aliases for lazy widget factory
export { SkillGetCliWidget as SkillViewContainer };
export { SkillEditCliWidget as SkillEditContainer };
