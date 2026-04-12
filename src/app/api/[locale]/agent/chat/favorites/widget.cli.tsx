/**
 * Favorites List CLI Widget
 * Renders the favorites list for CLI and MCP.
 *
 * CLI: grouped by skill, compact aligned columns
 * MCP: one-line-per-favorite, compact and parseable
 *
 * Gradual exposure:
 *   ≤5 favorites → detail block (name, tagline, model, provider)
 *   >5 favorites → compact list
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { FavoritesListResponseOutput } from "./definition";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CliWidgetProps {
  field: {
    value: FavoritesListResponseOutput | null | undefined;
  };
  fieldName: string;
}

type FavoriteItem = FavoritesListResponseOutput["favorites"][number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function modelLine(item: FavoriteItem): string {
  const info = item.modelInfo?.trim();
  if (!info || info === "No model" || info === "unknown") {
    return "Inherits from skill";
  }
  return info;
}

// ── Detail Mode (≤5 favorites) ────────────────────────────────────────────────

function renderDetailCli(items: FavoriteItem[]): string {
  const lines: string[] = [];
  for (const item of items) {
    lines.push(chalk.bold.cyan(item.name));
    if (item.tagline) {
      lines.push(chalk.dim(`  ${item.tagline}`));
    }
    lines.push(chalk.dim(`  ${modelLine(item)}`));
    lines.push(`  ${chalk.gray("id:")} ${chalk.dim(item.id)}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function renderDetailMcp(items: FavoriteItem[]): string {
  const lines: string[] = [];
  for (const item of items) {
    lines.push(`${item.name} (id: ${item.id})`);
    if (item.tagline) {
      lines.push(`  Tagline: ${item.tagline}`);
    }
    lines.push(`  Model: ${modelLine(item)}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

// ── List Mode (>5 favorites) ──────────────────────────────────────────────────

function renderListCli(data: FavoritesListResponseOutput): string {
  const lines: string[] = [];
  const items = data.favorites;
  const maxNameLen = Math.max(...items.map((i) => i.name.length), 8);

  for (const item of items) {
    const name = chalk.green(item.name.padEnd(maxNameLen + 1));
    const tagline = chalk.dim(
      item.tagline && item.tagline.length > 38
        ? `${item.tagline.slice(0, 35)}...`
        : (item.tagline ?? ""),
    );
    const model = chalk.yellow(modelLine(item));
    lines.push(`  ${name} ${tagline}  ${model}`);
  }

  const count = data.matchedCount ?? items.length;
  lines.push("");
  lines.push(
    chalk.dim(data.hint ?? `${count} favorite${count === 1 ? "" : "s"}.`),
  );
  return lines.join("\n").trimEnd();
}

function renderListMcp(data: FavoritesListResponseOutput): string {
  const lines: string[] = [];
  for (const item of data.favorites) {
    lines.push(
      `${item.name} (id: ${item.id}) - ${item.tagline ?? ""} • ${modelLine(item)}`,
    );
  }
  const count = data.matchedCount ?? data.favorites.length;
  lines.push(`${count} favorite${count === 1 ? "" : "s"}.`);
  return lines.join("\n");
}

// ── Main Widget ───────────────────────────────────────────────────────────────

const DETAIL_THRESHOLD = 5;

export function FavoritesListCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }

    const items = value.favorites;
    if (items.length === 0) {
      return isMcp
        ? "No favorites yet. Use favorite-create to add one."
        : chalk.dim("No favorites yet.");
    }

    if (items.length <= DETAIL_THRESHOLD) {
      return isMcp ? renderDetailMcp(items) : renderDetailCli(items);
    }

    return isMcp ? renderListMcp(value) : renderListCli(value);
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

FavoritesListCliWidget.cliWidget = true as const;

// Alias so lazyCliWidget factory matches the widget.tsx export name
export { FavoritesListCliWidget as FavoritesListContainer };
