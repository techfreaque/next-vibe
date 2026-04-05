/**
 * Models List CLI Widget
 * Renders AI model discovery results with platform-aware formatting.
 *
 * CLI: colored output with type grouping, aligned columns, tier badges
 * MCP: compact plain text, one-line-per-model or detail blocks for small sets
 *
 * Gradual exposure:
 *   ≤5 models → full detail block (id, provider, type, context, price, capabilities)
 *   >5 models → compact list grouped by type with pagination hint
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { ModelListGetResponseOutput, ModelListItem } from "./definition";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CliWidgetProps {
  field: {
    value: ModelListGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  text: "💬",
  image: "🖼",
  video: "🎬",
  audio: "🎵",
};

const INTELLIGENCE_COLORS: Record<string, (s: string) => string> = {
  quick: chalk.blue,
  smart: chalk.cyan,
  brilliant: chalk.magentaBright,
};

const CONTENT_COLORS: Record<string, (s: string) => string> = {
  mainstream: chalk.green,
  open: chalk.yellow,
  uncensored: chalk.red,
};

function intelligenceLabel(v: string): string {
  const fn = INTELLIGENCE_COLORS[v] ?? chalk.white;
  return fn(v);
}

function contentLabel(v: string): string {
  const fn = CONTENT_COLORS[v] ?? chalk.white;
  return fn(v);
}

function priceLabel(price: number): string {
  if (price === 0) {
    return chalk.green("free");
  }
  if (price <= 3) {
    return chalk.green(`${String(price)}cr`);
  }
  if (price <= 9) {
    return chalk.yellow(`${String(price)}cr`);
  }
  return chalk.red(`${String(price)}cr`);
}

function formatContext(ctx: number | null): string {
  if (!ctx) {
    return "";
  }
  if (ctx >= 1_000_000) {
    return `${String(Math.round(ctx / 1_000_000))}M ctx`;
  }
  if (ctx >= 1_000) {
    return `${String(Math.round(ctx / 1_000))}k ctx`;
  }
  return `${String(ctx)} ctx`;
}

// ── Detail Mode (≤5 models) ───────────────────────────────────────────────────

function renderDetailCli(items: ModelListItem[]): string {
  const lines: string[] = [];

  for (const item of items) {
    const typeIcon = TYPE_ICONS[item.type] ?? "•";
    lines.push(chalk.bold.cyan(`${typeIcon} ${item.name}`));
    lines.push(
      `  ${chalk.dim("Provider:")} ${item.provider}  ` +
        `${chalk.dim("Type:")} ${item.type}  ` +
        `${chalk.dim("Price:")} ${priceLabel(item.price)}`,
    );
    lines.push(
      `  ${chalk.dim("Intel:")} ${intelligenceLabel(item.intelligence)}  ` +
        `${chalk.dim("Speed:")} ${item.speed}  ` +
        `${chalk.dim("Content:")} ${contentLabel(item.content)}`,
    );
    if (item.contextWindow) {
      lines.push(
        `  ${chalk.dim("Context:")} ${formatContext(item.contextWindow)}`,
      );
    }
    if (item.supportsTools) {
      lines.push(`  ${chalk.dim("Tools:")} ${chalk.green("✓ supported")}`);
    }
    if (item.utilities.length > 0) {
      lines.push(
        `  ${chalk.dim("Good for:")} ${chalk.dim(item.utilities.slice(0, 6).join(", "))}`,
      );
    }
    lines.push(`  ${chalk.dim("ID:")} ${chalk.dim(item.id)}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function renderDetailMcp(items: ModelListItem[]): string {
  const lines: string[] = [];

  for (const item of items) {
    lines.push(`${item.name} (${item.provider}) - ${item.type}`);
    lines.push(`  ID: ${item.id}`);
    lines.push(
      `  Intelligence: ${item.intelligence} | Speed: ${item.speed} | Content: ${item.content}`,
    );
    lines.push(
      `  Price: ${item.price === 0 ? "free" : `${String(item.price)} credits`}`,
    );
    if (item.contextWindow) {
      lines.push(`  Context: ${formatContext(item.contextWindow)}`);
    }
    lines.push(`  Tools: ${item.supportsTools ? "yes" : "no"}`);
    if (item.utilities.length > 0) {
      lines.push(`  Capabilities: ${item.utilities.join(", ")}`);
    }
    lines.push(
      `  Inputs: ${item.inputs.join(", ")} | Outputs: ${item.outputs.join(", ")}`,
    );
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

// ── List Mode (>5 models) ─────────────────────────────────────────────────────

function renderListCli(data: ModelListGetResponseOutput): string {
  const lines: string[] = [];
  const { models } = data;

  // Group by type
  const groups = new Map<string, ModelListItem[]>();
  for (const m of models) {
    const existing = groups.get(m.type) ?? [];
    existing.push(m);
    groups.set(m.type, existing);
  }

  const maxNameLen = Math.max(...models.map((m) => m.name.length), 8);
  const maxProviderLen = Math.max(...models.map((m) => m.provider.length), 8);

  for (const [type, typeModels] of groups) {
    const icon = TYPE_ICONS[type] ?? "•";
    lines.push(`  ${chalk.bold.underline(`${icon} ${type.toUpperCase()}`)}`);
    for (const m of typeModels) {
      const name = chalk.green(m.name.padEnd(maxNameLen + 1));
      const provider = chalk.dim(m.provider.padEnd(maxProviderLen + 1));
      const intel = intelligenceLabel(m.intelligence.substring(0, 4));
      const content = contentLabel(m.content.substring(0, 4));
      const price = priceLabel(m.price);
      const ctx = m.contextWindow
        ? chalk.dim(formatContext(m.contextWindow).padEnd(8))
        : "        ";
      lines.push(`    ${name} ${provider} ${intel} ${content} ${price} ${ctx}`);
    }
    lines.push("");
  }

  const count = data.models.length;
  lines.push(
    chalk.dim(
      `${String(count)} model${count === 1 ? "" : "s"}. Use --query, --contentLevel, --intelligence to filter.`,
    ),
  );

  return lines.join("\n").trimEnd();
}

function renderListMcp(data: ModelListGetResponseOutput): string {
  const lines: string[] = [];

  for (const m of data.models) {
    const price = m.price === 0 ? "free" : `${String(m.price)}cr`;
    lines.push(
      `${m.name} (${m.provider}) | ${m.intelligence} | ${m.content} | ${price} | id:${m.id}`,
    );
  }

  lines.push("");
  lines.push(
    `${String(data.models.length)} models. Use query/contentLevel/intelligence to filter.`,
  );

  return lines.join("\n");
}

// ── Main Widget ───────────────────────────────────────────────────────────────

const DETAIL_THRESHOLD = 5;

export function ModelsListCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }

    const count = value.models.length;
    if (count === 0) {
      return isMcp ? "No models found." : chalk.dim("No models found.");
    }

    if (count <= DETAIL_THRESHOLD) {
      return isMcp
        ? renderDetailMcp(value.models)
        : renderDetailCli(value.models);
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

ModelsListCliWidget.cliWidget = true as const;

// Alias so lazyCliWidget factory can use the same export name as widget.tsx
export { ModelsListCliWidget as ModelsListContainer };
