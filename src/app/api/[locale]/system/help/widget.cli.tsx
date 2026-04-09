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

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
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

/** JSON Schema property - may have nested properties, enum values, anyOf etc. */
interface JsonSchemaProperty {
  type?: string | string[];
  description?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  enum?: string[];
  const?: string;
  anyOf?: JsonSchemaProperty[];
  oneOf?: JsonSchemaProperty[];
  items?: JsonSchemaProperty;
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
 * Flatten a nested value into dot-notation flag strings.
 * Skips undefined and null values. Arrays are JSON-encoded.
 * e.g. { intelligenceRange: { min: "quick", max: "smart" } }
 *   → ['--key.intelligenceRange.min="quick"', '--key.intelligenceRange.max="smart"']
 */
type CliValue = CliRequestData[string];

function flattenValue(
  keyPath: string,
  value: CliValue,
  prefix: string,
): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return [`${prefix}${keyPath}=${JSON.stringify(value)}`];
  }
  if (typeof value === "object") {
    const results: string[] = [];
    for (const [sk, sv] of Object.entries(value as CliRequestData)) {
      results.push(...flattenValue(`${keyPath}.${sk}`, sv, prefix));
    }
    return results;
  }
  // Strip i18n enum prefix for readability: "enums.category.coding" → "coding"
  const display =
    typeof value === "string" && value.startsWith("enums.")
      ? (value.split(".").pop() ?? value)
      : value;
  const formatted =
    typeof display === "string" ? `"${display}"` : String(display);
  return [`${prefix}${keyPath}=${formatted}`];
}

/**
 * Serialize one example entry into dot-notation flags.
 * Objects expand recursively as --key.sub.subkey="value".
 * Undefined and null values are omitted.
 */
function serializeExampleArgs(exData: CliRequestData, prefix = "--"): string {
  const flags: string[] = [];
  for (const [k, v] of Object.entries(exData)) {
    flags.push(...flattenValue(k, v, prefix));
  }
  return flags.join(" ");
}

// ── Parameter schema helpers ──────────────────────────────────────────────

/**
 * Collapse anyOf/oneOf into the most informative single schema.
 * Strips null-only branches; if multiple object branches remain, merges their properties.
 */
function isNullBranch(v: JsonSchemaProperty): boolean {
  if (v.type === "null") {
    return true;
  }
  if (Array.isArray(v.type) && v.type.every((t) => t === "null")) {
    return true;
  }
  return false;
}

function resolveSchema(prop: JsonSchemaProperty): JsonSchemaProperty {
  const variants = prop.anyOf ?? prop.oneOf;
  if (!variants) {
    return prop;
  }
  const nonNull = variants.filter((v) => !isNullBranch(v));
  if (nonNull.length === 0) {
    return prop;
  }
  if (nonNull.length === 1) {
    const inner = resolveSchema(nonNull[0]);
    return { ...inner, description: prop.description ?? inner.description };
  }
  // Discriminated union - merge all object branches' properties
  const merged: JsonSchemaProperty = {
    description: prop.description,
    properties: {},
    required: [],
  };
  for (const branch of nonNull) {
    const r = resolveSchema(branch);
    if (r.properties) {
      for (const [pk, pv] of Object.entries(r.properties)) {
        if (!merged.properties![pk]) {
          merged.properties![pk] = pv;
        } else {
          const existing = merged.properties![pk];
          // Both branches have a const (discriminator) - merge into enum
          if (pv.const !== undefined || existing.const !== undefined) {
            const base =
              existing.enum ??
              (existing.const !== undefined ? [existing.const] : []);
            const add = pv.const !== undefined ? [pv.const] : (pv.enum ?? []);
            const merged2: JsonSchemaProperty = {
              type: "string",
              enum: [...base, ...add],
            };
            // Remove const from merged to avoid conflict
            merged.properties![pk] = merged2;
          }
        }
      }
    }
    if (r.required) {
      for (const req of r.required) {
        if (!merged.required!.includes(req)) {
          merged.required!.push(req);
        }
      }
    }
    if (r.enum) {
      merged.enum = [...(merged.enum ?? []), ...r.enum];
    }
  }
  return merged;
}

function isNullable(prop: JsonSchemaProperty): boolean {
  const variants = prop.anyOf ?? prop.oneOf;
  if (variants) {
    return variants.some(isNullBranch);
  }
  if (Array.isArray(prop.type)) {
    return prop.type.includes("null");
  }
  return false;
}

/** Strip i18n prefix: "enums.category.coding" → "coding" */
function stripEnumPrefix(v: string): string {
  return v.split(".").pop() ?? v;
}

/** Inline object shape: {key1,key2,...} - max 5 keys to stay readable */
function inlineObjectShape(
  properties: Record<string, JsonSchemaProperty>,
): string {
  const keys = Object.keys(properties).slice(0, 5);
  const suffix = Object.keys(properties).length > 5 ? ",…" : "";
  return `{${keys.join(",")}${suffix}}`;
}

/** Human-readable type label for a schema property. */
function typeLabel(prop: JsonSchemaProperty): string {
  const resolved = resolveSchema(prop);
  const nullable = isNullable(prop) ? "|null" : "";

  // Single const value (literal)
  if (resolved.const !== undefined) {
    return `"${stripEnumPrefix(resolved.const)}"${nullable}`;
  }

  if (resolved.enum && resolved.enum.length > 0) {
    // Truncate huge enum lists (e.g. all model IDs) to avoid noise
    if (resolved.enum.length > 10) {
      return `string${nullable}`;
    }
    return resolved.enum.map(stripEnumPrefix).join("|") + nullable;
  }

  // Array - show item shape if available
  const rawType = Array.isArray(resolved.type)
    ? resolved.type.filter((x) => x !== "null").join("|")
    : (resolved.type ?? "");
  if (rawType === "array") {
    if (resolved.items) {
      const itemResolved = resolveSchema(resolved.items);
      if (
        itemResolved.properties &&
        Object.keys(itemResolved.properties).length > 0
      ) {
        return `${inlineObjectShape(itemResolved.properties)}[]${nullable}`;
      }
      if (itemResolved.enum && itemResolved.enum.length > 0) {
        if (itemResolved.enum.length > 10) {
          return `string[]${nullable}`;
        }
        return `(${itemResolved.enum.map(stripEnumPrefix).join("|")})[]${nullable}`;
      }
      const itemType = Array.isArray(itemResolved.type)
        ? itemResolved.type.filter((x) => x !== "null").join("|")
        : (itemResolved.type ?? "any");
      return `${itemType}[]${nullable}`;
    }
    return `any[]${nullable}`;
  }

  // Object - show inline shape instead of bare "object"
  if (resolved.properties && Object.keys(resolved.properties).length > 0) {
    return `${inlineObjectShape(resolved.properties)}${nullable}`;
  }

  return rawType ? rawType + nullable : `any${nullable}`;
}

/**
 * Collect flat parameter rows for display.
 *
 * Expansion rules:
 * - Only expand `modelSelection` at the top level (the primary chat model param).
 *   Auxiliary model selections (voiceModelSelection, imageGenModelSelection etc.)
 *   stay collapsed - their usage is covered by the description.
 * - At depth 1, only show selectionType + manualModelId; skip filter-range noise
 *   (intelligenceRange, priceRange, contentRange, speedRange, sortBy*, sortDirection*).
 */
interface ParamRow {
  key: string;
  indent: number;
  required: boolean;
  typeStr: string;
  description: string;
}

const FILTER_NOISE_KEYS = new Set([
  "intelligenceRange",
  "priceRange",
  "contentRange",
  "speedRange",
  "sortBy",
  "sortBy2",
  "sortDirection",
  "sortDirection2",
]);

// All top-level object params are expanded - no whitelist needed.
// typeLabel() always shows inline shapes; collectParamRows expands any object.

function collectParamRows(
  props: Record<string, JsonSchemaProperty>,
  required: string[],
  prefix = "",
  indent = 0,
  depth = 0,
  parentRequired = true,
): ParamRow[] {
  const rows: ParamRow[] = [];
  for (const [key, rawProp] of Object.entries(props)) {
    if (depth >= 1 && FILTER_NOISE_KEYS.has(key)) {
      continue;
    }
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const resolved = resolveSchema(rawProp);
    const isReq = parentRequired && required.includes(key);
    const hasSubFields =
      !resolved.enum &&
      resolved.properties &&
      Object.keys(resolved.properties).length > 0;
    // At depth 0: expand object params into sub-field rows (skip the parent row).
    // Sub-fields are optional when parent is nullable (isNullable check).
    if (depth === 0 && hasSubFields) {
      const subParentRequired = isReq && !isNullable(rawProp);
      rows.push(
        ...collectParamRows(
          resolved.properties!,
          resolved.required ?? [],
          fullKey,
          indent,
          depth + 1,
          subParentRequired,
        ),
      );
    } else {
      rows.push({
        key: fullKey,
        indent,
        required: isReq,
        typeStr: typeLabel(rawProp),
        description: rawProp.description ?? "",
      });
    }
  }
  return rows;
}

/**
 * Wrap a long example command into multiple lines with \ continuation.
 * Each flag goes on its own indented line for readability.
 */
function wrapExampleCli(cmd: string, flags: string[]): string {
  if (flags.length === 0) {
    return cmd;
  }
  const indent = "    ";
  return [cmd, ...flags.map((f) => `${indent}${f}`)].join(" \\\n");
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
      `${chalk.dim("Confirm")}   ${chalk.red("Yes - requires confirmation")}`,
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
      const rows = collectParamRows(props, required);
      // Cap key column at 28 chars - avoids blowout from long sub-keys
      const KEY_COL = Math.min(
        Math.max(...rows.map((r) => r.key.length + r.indent * 2), 4),
        28,
      );
      for (const row of rows) {
        const pad = " ".repeat(row.indent * 2);
        const reqLabel = row.required ? chalk.red("*") : " ";
        const rawKey = pad + row.key;
        const keyPadded = rawKey.padEnd(KEY_COL + 1);
        // Trim description to first sentence, max 80 chars
        let desc = row.description;
        if (desc) {
          const sentenceEnd = desc.search(/\.\s+[A-Z]/);
          if (sentenceEnd > 0) {
            desc = desc.slice(0, sentenceEnd + 1);
          }
          if (desc.length > 80) {
            desc = `${desc.slice(0, 77)}...`;
          }
        }
        const descStr = desc ? chalk.dim(` - ${desc}`) : "";
        // Long enum types go on their own indented line to keep key column tight
        if (row.typeStr.length > 30) {
          lines.push(`  ${reqLabel} ${chalk.blue(keyPadded)}`);
          lines.push(`       ${chalk.dim(row.typeStr)}${descStr}`);
        } else {
          lines.push(
            `  ${reqLabel} ${chalk.blue(keyPadded)} ${chalk.dim(row.typeStr)}${descStr}`,
          );
        }
      }
    }
  }

  // Examples - one flag per line for readability
  if (tool.examples?.inputs) {
    const exampleEntries = Object.entries(tool.examples.inputs);
    if (exampleEntries.length > 0) {
      lines.push("");
      lines.push(chalk.bold("Examples"));
      for (const [exName, exData] of exampleEntries) {
        const flags: string[] = [];
        for (const [k, v] of Object.entries(exData)) {
          for (const flag of flattenValue(k, v, "--")) {
            flags.push(flag);
          }
        }
        const cmd = `vibe ${tool.name}`;
        lines.push(chalk.dim(`  ${exName}:`));
        lines.push(`  ${wrapExampleCli(cmd, flags)}`);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

function renderDetailMcp(tool: HelpToolItem): string {
  const lines: string[] = [];
  lines.push(`${tool.name} - ${tool.description}`);
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
      const rows = collectParamRows(props, required);
      for (const row of rows) {
        const pad = " ".repeat(row.indent * 2);
        const req = row.required ? ", required" : "";
        const desc = row.description ? ` - ${row.description}` : "";
        lines.push(`  ${pad}${row.key} (${row.typeStr}${req})${desc}`);
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
  hint?: string,
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
        `Page ${currentPage}/${totalPages} - vibe help --page=${currentPage + 1}`,
      ),
    );
  }

  // Footer - use server hint if available, fallback to default
  lines.push(chalk.dim(hint ?? `Use: vibe help <name> for full details`));

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
    lines.push(`${tool.name} - ${tool.description}${creditsStr}`);
  }

  if (currentPage && totalPages && totalPages > 1) {
    lines.push("");
    lines.push(
      `Page ${currentPage}/${totalPages} - use page=${currentPage + 1} for next`,
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
      hint,
    } = value;

    // Mode 1: Detail - single tool OR multiple tools with full schemas (≤5 auto-expand)
    const hasFullSchemas =
      tools.length > 0 &&
      tools.every(
        (t) => t.parameters !== undefined || t.examples !== undefined,
      );
    if (tools.length === 1 && matchedCount === 1) {
      return isMcp ? renderDetailMcp(tools[0]) : renderDetailCli(tools[0]);
    }
    if (hasFullSchemas && tools.length > 1) {
      const sections = tools.map((t) =>
        isMcp ? renderDetailMcp(t) : renderDetailCli(t),
      );
      const sep = isMcp ? "\n---\n" : `\n${chalk.dim("─".repeat(60))}\n`;
      return sections.join(sep);
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
        : renderToolListCli(tools, matchedCount, currentPage, totalPages, hint);
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
