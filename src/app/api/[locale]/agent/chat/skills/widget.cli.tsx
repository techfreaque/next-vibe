/**
 * Skills List Widget (CLI/MCP)
 * Renders skill discovery results with platform-aware formatting.
 *
 * CLI: colored output with category grouping, aligned columns
 * MCP: compact plain text, one-line-per-skill or detail blocks for small result sets
 *
 * Gradual exposure:
 *   ≤5 skills → full detail block (name, variantName, tagline, model, provider, description)
 *   >5 skills → compact list with pagination hint
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { SkillListItem, SkillListResponseOutput } from "./definition";

// ── Types ────────────────────────────────────────────────────────────────────

interface CliWidgetProps {
  field: {
    value: SkillListResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Display name for a skill item — includes variantName when present */
function skillLabel(item: SkillListItem): string {
  if (item.variantName) {
    return `${item.name} (${item.variantName})`;
  }
  return item.name;
}

/** Flatten all skills from all sections into a single array */
function flattenSkills(data: SkillListResponseOutput): SkillListItem[] {
  return data.sections.flatMap((s) => s.skills);
}

/** Total number of skills in this response (sum of all section skill arrays) */
function totalSkillCount(data: SkillListResponseOutput): number {
  return data.sections.reduce((sum, s) => sum + s.skills.length, 0);
}

// ── Detail Mode (≤5 skills) ───────────────────────────────────────────────

function renderDetailCli(items: SkillListItem[]): string {
  const lines: string[] = [];

  for (const item of items) {
    const label = skillLabel(item);
    const icon = ""; // icon keys are not ANSI-renderable, skip
    lines.push(chalk.bold.cyan(`${icon}${label}`));
    lines.push(chalk.white(`  ${item.tagline}`));
    lines.push(
      chalk.dim(`  ${item.modelInfo}`) +
        chalk.dim(" • ") +
        chalk.dim(item.modelProvider),
    );
    if (item.description && item.description !== item.tagline) {
      lines.push(chalk.dim(`  ${item.description}`));
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function renderDetailMcp(items: SkillListItem[]): string {
  const lines: string[] = [];

  for (const item of items) {
    const label = skillLabel(item);
    lines.push(`${label} — ${item.tagline}`);
    lines.push(`  Model: ${item.modelInfo} (${item.modelProvider})`);
    if (item.description && item.description !== item.tagline) {
      lines.push(`  Description: ${item.description}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

// ── List Mode (>5 skills) ─────────────────────────────────────────────────

function renderListCli(data: SkillListResponseOutput): string {
  const lines: string[] = [];
  const allItems = flattenSkills(data);
  const maxLabelLen = Math.max(...allItems.map((i) => skillLabel(i).length), 8);

  for (const section of data.sections) {
    if (section.skills.length === 0) {
      continue;
    }
    lines.push(`  ${chalk.bold.underline(section.sectionTitle)}`);
    for (const item of section.skills) {
      const label = chalk.green(skillLabel(item).padEnd(maxLabelLen + 1));
      const tagline = chalk.dim(
        item.tagline.length > 50
          ? `${item.tagline.slice(0, 47)}...`
          : item.tagline,
      );
      const model = chalk.yellow(item.modelInfo);
      lines.push(`    ${label} ${tagline}  ${model}`);
    }
    lines.push("");
  }

  // Pagination (only when compact/paginated — hint is null for CLI)
  if (data.currentPage && data.totalPages && data.totalPages > 1) {
    lines.push(
      chalk.dim(
        `Page ${data.currentPage}/${data.totalPages} — vibe skills --page=${data.currentPage + 1}`,
      ),
    );
  }

  const count = data.matchedCount ?? totalSkillCount(data);
  lines.push(
    chalk.dim(
      data.hint ??
        `${count} skill${count === 1 ? "" : "s"}. Use --query to filter.`,
    ),
  );

  return lines.join("\n").trimEnd();
}

function renderListMcp(data: SkillListResponseOutput): string {
  const lines: string[] = [];
  const allItems = flattenSkills(data);

  for (const item of allItems) {
    lines.push(
      `${skillLabel(item)} - ${item.tagline} • ${item.modelInfo} • ${item.modelProvider}`,
    );
  }

  if (data.currentPage && data.totalPages && data.totalPages > 1) {
    lines.push("");
    lines.push(
      `Page ${data.currentPage}/${data.totalPages} - use page=${data.currentPage + 1} for next`,
    );
  }

  if (data.hint) {
    lines.push("");
    lines.push(data.hint);
  }

  return lines.join("\n");
}

// ── Main Widget ───────────────────────────────────────────────────────────

const DETAIL_THRESHOLD = 5;

export function SkillsListCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }

    const count = totalSkillCount(value);
    if (count === 0) {
      return isMcp ? "No skills found." : chalk.dim("No skills found.");
    }

    const allItems = flattenSkills(value);

    if (count <= DETAIL_THRESHOLD) {
      return isMcp ? renderDetailMcp(allItems) : renderDetailCli(allItems);
    }

    return isMcp ? renderListMcp(value) : renderListCli(value);
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

SkillsListCliWidget.cliWidget = true as const;

// Alias so the lazyCliWidget factory can use the same export name as widget.tsx
export { SkillsListCliWidget as SkillsListContainer };
