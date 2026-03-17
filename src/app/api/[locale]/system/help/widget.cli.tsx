/**
 * Help Tools Widget (CLI/MCP)
 * Renders tool discovery results with platform-aware formatting.
 * CLI: colored output with category grouping, borders, icons
 * MCP: compact plain text, one-line-per-tool
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import {
  useInkWidgetLocale,
  useInkWidgetPlatform,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";

// ── Types ──────────────────────────────────────────────────────────────────

type HelpToolItem = HelpToolMetadataSerialized;

/** JSON Schema property shape for parameter display */
interface JsonSchemaProperty {
  type?: string;
  description?: string;
}

/** JSON Schema object shape for tool parameters */
interface JsonSchemaObject {
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
}

interface CliWidgetProps {
  field: {
    value: HelpGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function formatCredits(credits: number | undefined): string {
  if (!credits || credits <= 0) {
    return "";
  }
  return `${credits}cr`;
}

// ── Shared example serialization ─────────────────────────────────────────

/**
 * Serialize one example entry into dot-notation flags.
 * Objects expand as --key.subkey="value"; primitives as --key="value".
 */
function serializeExampleArgs(exData: CliRequestData, prefix = "--"): string {
  return Object.entries(exData)
    .map(([k, v]) => {
      if (v !== null && typeof v === "object" && !Array.isArray(v)) {
        const entries = Object.entries(v);
        if (entries.length === 0) {
          return `${prefix}${k}.KEY="value"`;
        }
        return entries
          .map(([sk, sv]) => `${prefix}${k}.${sk}="${String(sv)}"`)
          .join(" ");
      }
      return `${prefix}${k}=${typeof v === "string" ? `"${v}"` : String(v)}`;
    })
    .join(" ");
}

// ── Detail Mode (single tool) ────────────────────────────────────────────

function renderDetailCli(tool: HelpToolItem): string {
  const lines: string[] = [];
  const nameDisplay = tool.aliases?.length
    ? `${tool.name} ${chalk.dim(`(${tool.aliases.join(", ")})`)}`
    : tool.name;

  lines.push(chalk.bold.cyan(nameDisplay));
  lines.push(chalk.white(tool.description));
  lines.push("");

  // Metadata
  if (tool.category) {
    lines.push(`${chalk.dim("Category")}  ${tool.category}`);
  }
  if (tool.method) {
    lines.push(`${chalk.dim("Method")}    ${chalk.yellow(tool.method)}`);
  }
  if (tool.credits && tool.credits > 0) {
    lines.push(
      `${chalk.dim("Credits")}   ${chalk.yellow(String(tool.credits))}`,
    );
  }
  if (tool.requiresConfirmation) {
    lines.push(
      `${chalk.dim("Confirm")}   ${chalk.red("Yes — requires confirmation")}`,
    );
  }
  lines.push(`${chalk.dim("Call as")}   vibe ${chalk.green(tool.name)}`);

  // Parameters
  if (tool.parameters && typeof tool.parameters === "object") {
    const schema = tool.parameters as JsonSchemaObject;
    const props = schema.properties;
    const required = schema.required ?? [];
    if (props && Object.keys(props).length > 0) {
      lines.push("");
      lines.push(chalk.bold("Parameters"));
      for (const [key, prop] of Object.entries(props)) {
        const isRequired = required.includes(key);
        const typeStr = prop.type ?? "any";
        const reqLabel = isRequired ? chalk.red("*") : " ";
        const desc = prop.description
          ? chalk.dim(` — ${prop.description}`)
          : "";
        lines.push(
          `  ${reqLabel} ${chalk.blue(key)} ${chalk.dim(typeStr)}${desc}`,
        );
      }
    }
  }

  // Examples
  if (tool.examples?.inputs) {
    const exampleEntries = Object.entries(tool.examples.inputs);
    if (exampleEntries.length > 0) {
      lines.push("");
      lines.push(chalk.bold("Examples"));
      for (const [exName, exData] of exampleEntries) {
        const args = serializeExampleArgs(exData);
        lines.push(`  ${chalk.dim(`${exName}:`)} vibe ${tool.name} ${args}`);
      }
    }
  }

  return lines.join("\n");
}

function renderDetailMcp(tool: HelpToolItem): string {
  const lines: string[] = [];
  lines.push(`${tool.name} — ${tool.description}`);
  if (tool.aliases?.length) {
    lines.push(`Aliases: ${tool.aliases.join(", ")}`);
  }
  if (tool.category) {
    lines.push(`Category: ${tool.category}`);
  }
  if (tool.method) {
    lines.push(`Method: ${tool.method}`);
  }
  if (tool.credits && tool.credits > 0) {
    lines.push(`Credits: ${tool.credits}`);
  }
  lines.push(`Call: execute-tool toolName="${tool.name}"`);

  if (tool.parameters && typeof tool.parameters === "object") {
    const schema = tool.parameters as JsonSchemaObject;
    const props = schema.properties;
    const required = schema.required ?? [];
    if (props && Object.keys(props).length > 0) {
      lines.push("");
      lines.push("Parameters:");
      for (const [key, prop] of Object.entries(props)) {
        const isRequired = required.includes(key);
        const typeStr = prop.type ?? "any";
        const desc = prop.description ? ` — ${prop.description}` : "";
        lines.push(
          `  ${key} (${typeStr}${isRequired ? ", required" : ""})${desc}`,
        );
      }
    }
  }

  if (tool.examples?.inputs) {
    const exampleEntries = Object.entries(tool.examples.inputs);
    if (exampleEntries.length > 0) {
      lines.push("");
      lines.push("Examples:");
      for (const [exName, exData] of exampleEntries) {
        const args = serializeExampleArgs(exData);
        lines.push(`  ${exName}: vibe ${tool.name} ${args}`);
      }
    }
  }

  return lines.join("\n");
}

// ── Category Overview ────────────────────────────────────────────────────

function renderCategoriesCli(
  categories: { name: string; count: number }[],
  totalCount: number,
): string {
  const lines: string[] = [];
  lines.push(
    chalk.bold(`📂 Tool Categories`) + chalk.dim(` (${totalCount} tools)`),
  );
  lines.push("");

  const maxNameLen = Math.max(...categories.map((c) => c.name.length));
  for (const cat of categories) {
    const padded = cat.name.padEnd(maxNameLen + 2);
    lines.push(
      `  ${chalk.blue(padded)}${chalk.dim(`${cat.count} tool${cat.count !== 1 ? "s" : ""}`)}`,
    );
  }

  lines.push("");
  lines.push(chalk.dim(`Use: vibe help --category="<name>" to filter`));

  return lines.join("\n");
}

function renderCategoriesMcp(
  categories: { name: string; count: number }[],
  totalCount: number,
): string {
  const lines: string[] = [];
  lines.push(`Tool Categories (${totalCount} tools)`);
  for (const cat of categories) {
    lines.push(`  ${cat.name}: ${cat.count} tools`);
  }
  lines.push("");
  lines.push(`Use category="<name>" to filter, toolName="<name>" for detail.`);
  return lines.join("\n");
}

// ── Tool List ────────────────────────────────────────────────────────────

function renderToolListCli(
  tools: HelpToolItem[],
  matchedCount: number,
  currentPage?: number,
  totalPages?: number,
): string {
  const lines: string[] = [];

  // Header
  const showing =
    tools.length < matchedCount
      ? `showing ${tools.length} of ${matchedCount}`
      : `${matchedCount}`;
  lines.push(chalk.bold(`Available Tools`) + chalk.dim(` (${showing})`));
  lines.push("");

  // Group by category
  const groups = new Map<string, HelpToolItem[]>();
  for (const tool of tools) {
    const cat = tool.category || "Other";
    const existing = groups.get(cat) ?? [];
    existing.push(tool);
    groups.set(cat, existing);
  }

  // Find longest tool name for alignment
  const maxNameLen = Math.max(...tools.map((t) => t.name.length), 8);

  for (const [category, categoryTools] of groups) {
    lines.push(`  ${chalk.bold.underline(category)}`);
    for (const tool of categoryTools) {
      const name = chalk.green(tool.name.padEnd(maxNameLen + 1));
      const desc = chalk.dim(
        tool.description.length > 60
          ? `${tool.description.slice(0, 57)}...`
          : tool.description,
      );
      const credits = formatCredits(tool.credits);
      const creditsStr = credits ? ` ${chalk.yellow(credits)}` : "";
      lines.push(`    ${name} ${desc}${creditsStr}`);
    }
    lines.push("");
  }

  // Pagination
  if (currentPage && totalPages && totalPages > 1) {
    lines.push(
      chalk.dim(
        `Page ${currentPage}/${totalPages} — vibe help --page=${currentPage + 1}`,
      ),
    );
  }

  // Footer
  lines.push(chalk.dim(`Use: vibe help <name> for full details`));

  return lines.join("\n");
}

function renderToolListMcp(
  tools: HelpToolItem[],
  matchedCount: number,
  currentPage?: number,
  totalPages?: number,
): string {
  const lines: string[] = [];

  for (const tool of tools) {
    const credits = formatCredits(tool.credits);
    const creditsStr = credits ? ` (${credits})` : "";
    lines.push(`${tool.name} — ${tool.description}${creditsStr}`);
  }

  if (currentPage && totalPages && totalPages > 1) {
    lines.push("");
    lines.push(
      `Page ${currentPage}/${totalPages} — use page=${currentPage + 1} for next`,
    );
  }

  lines.push("");
  lines.push(
    `${matchedCount} tools matched. Use toolName="<name>" for full schema + examples.`,
  );

  return lines.join("\n");
}

// ── Main Widget ──────────────────────────────────────────────────────────

export function HelpToolsWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useInkWidgetLocale();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }

    const {
      tools,
      totalCount,
      matchedCount,
      categories,
      currentPage,
      totalPages,
    } = value;

    // Mode 1: Detail (single tool)
    if (tools.length === 1 && matchedCount === 1) {
      return isMcp ? renderDetailMcp(tools[0]) : renderDetailCli(tools[0]);
    }

    // Mode 2: Category overview (no tools, categories present)
    if (tools.length === 0 && categories && categories.length > 0) {
      return isMcp
        ? renderCategoriesMcp(categories, totalCount)
        : renderCategoriesCli(categories, totalCount);
    }

    // Mode 3: Tool list
    if (tools.length > 0) {
      return isMcp
        ? renderToolListMcp(tools, matchedCount, currentPage, totalPages)
        : renderToolListCli(tools, matchedCount, currentPage, totalPages);
    }

    return isMcp ? "No tools found." : chalk.dim("No tools found.");
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

HelpToolsWidget.cliWidget = true as const;
