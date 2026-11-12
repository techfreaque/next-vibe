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
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

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
    lines.push(chalk.dim(`  ${value.tagline}`));
  }
  if (value.variants && value.variants.length > 0) {
    lines.push("");
    lines.push(chalk.dim(`  Variants (${String(value.variants.length)}):`));
    for (const v of value.variants) {
      const name = v.displayName ?? v.id;
      const variantLabel = v.isDefault
        ? `${chalk.bold(name)} ${chalk.green("default")}`
        : chalk.bold(name);
      lines.push(`    ${variantLabel} ${chalk.dim(`(${v.id})`)}`);
      if (v.description) {
        lines.push(`      ${v.description}`);
      }
      if (v.strength) {
        lines.push(`      ${chalk.green("+")} ${v.strength}`);
      }
      if (v.weakness) {
        lines.push(`      ${chalk.yellow("-")} ${v.weakness}`);
      }
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
    lines.push("Variants:");
    for (const v of value.variants) {
      const head = `- ${v.id}${v.displayName ? ` "${v.displayName}"` : ""}${v.isDefault ? " (default)" : ""}`;
      const details = [
        v.description,
        v.strength ? `+ ${v.strength}` : undefined,
        v.weakness ? `- ${v.weakness}` : undefined,
      ].filter((part): part is string => Boolean(part));
      lines.push(details.length > 0 ? `${head}: ${details.join(" ")}` : head);
    }
  }
  return lines.join("\n");
}

export function SkillViewContainer({ field }: GetCliWidgetProps): JSX.Element {
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

SkillViewContainer.cliWidget = true as const;

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

export function SkillEditContainer({
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

SkillEditContainer.cliWidget = true as const;
