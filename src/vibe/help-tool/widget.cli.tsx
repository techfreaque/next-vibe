/**
 * Help Tools Widget (CLI/MCP)
 *
 * ONE widget, both modes — there is no separate interactive file.
 *
 *   responseOnly  → format the endpoint's response to text.
 *                   CLI: colored output with category grouping, borders, icons.
 *                   MCP: compact plain text, one-line-per-tool.
 *   otherwise     → the live Ink tool browser (categories → sub-categories →
 *                   tools → detail → execute → result).
 *
 * Both are just Ink React. The only thing that differs is whether the host render
 * is a single synchronous pass (responseOnly, via the CLI/MCP result formatters)
 * or a live Ink tree that can take keystrokes (`vibe help -i`, via CliEndpointPage).
 *
 * The browser used to live in repository/interactive.cli.tsx, which called Ink's
 * render() itself and exported startInteractiveHelp(). Nothing ever imported that
 * export, and the widget-stub plugin only rewrites widget.tsx (see
 * tooling/builder/repository/vibe-package/package-plugins.ts), so the file was
 * never reachable from any surface. It lives here now: one widget per endpoint,
 * and that dead file is gone.
 */

import chalk from "chalk";
import { Box, Text, useApp, useInput } from "ink";
import SelectInput from "ink-select-input";
import {
  DefaultFolderId,
  makeHeadlessContext,
} from "next-vibe/core/execution-context";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import type { ResponseType } from "../core/route/response.schema";
import type { WidgetData } from "../core/utils/json";
import type { JwtPayloadType } from "../identity/auth/types";
import { UserRole } from "../identity/roles/enum";
import { scopedTranslation as cliScopedTranslation } from "../platforms/cli/i18n";
import type { CliCompatiblePlatform } from "../platforms/cli/runtime/route-executor";
import { CLI_BINARY_NAME } from "../platforms/cli/types/cli-target";
import { Platform } from "../platforms/platforms";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "../unified-ui/_shared/use-widget-context";
import { EndpointRenderer } from "../unified-ui/renderers/web/EndpointRenderer";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";

// ── Category label lookup ───────────────────────────────────────────────────

function getCategoryLabel(key: string, locale: string): string {
  const cat = CATEGORY_REGISTRY.find((c) => c.key === key);
  if (!cat) {
    return key;
  }
  return cat.labels?.[locale as keyof typeof cat.labels] ?? cat.label ?? key;
}

function getSubCategoryLabel(
  catKey: string,
  subKey: string,
  locale: string,
): string {
  const cat = CATEGORY_REGISTRY.find((c) => c.key === catKey);
  if (!cat?.subcategories) {
    return subKey;
  }
  const sub = cat.subcategories[subKey];
  if (!sub) {
    return subKey;
  }
  return sub.labels?.[locale as keyof typeof sub.labels] ?? sub.label ?? subKey;
}

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
function flattenValue(
  keyPath: string,
  value: WidgetData,
  prefix: string,
  isMcp = false,
): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return [`${prefix}${keyPath}=${JSON.stringify(value)}`];
  }
  if (typeof value === "object") {
    const results: string[] = [];
    for (const [sk, sv] of Object.entries(
      value as Record<string, WidgetData>,
    )) {
      results.push(...flattenValue(`${keyPath}.${sk}`, sv, prefix, isMcp));
    }
    return results;
  }
  // Strip i18n enum prefix for CLI readability: "enums.category.coding" → "coding"
  // MCP keeps full key so AI can pass exact values
  const display =
    typeof value === "string" && value.startsWith("enums.")
      ? stripEnumPrefix(value, isMcp)
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
function serializeExampleArgs(
  exData: Record<string, WidgetData>,
  prefix = "--",
  isMcp = false,
): string {
  const flags: string[] = [];
  for (const [k, v] of Object.entries(exData)) {
    flags.push(...flattenValue(k, v, prefix, isMcp));
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

/**
 * Strip i18n prefix for display: "enums.category.coding" → "coding"
 * MCP mode: keep full key so AI can copy-paste exact values
 * CLI mode: strip for human readability
 */
function stripEnumPrefix(v: string, isMcp = false): string {
  if (isMcp) {
    return v;
  }
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
function typeLabel(prop: JsonSchemaProperty, isMcp = false): string {
  const resolved = resolveSchema(prop);
  const nullable = isNullable(prop) ? "|null" : "";

  // Single const value (literal)
  if (resolved.const !== undefined) {
    return `"${stripEnumPrefix(resolved.const, isMcp)}"${nullable}`;
  }

  if (resolved.enum && resolved.enum.length > 0) {
    // Truncate huge enum lists (e.g. all model IDs) to avoid noise
    if (resolved.enum.length > 10) {
      return `string${nullable}`;
    }
    return (
      resolved.enum.map((v) => stripEnumPrefix(v, isMcp)).join("|") + nullable
    );
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
        return `(${itemResolved.enum.map((v) => stripEnumPrefix(v, isMcp)).join("|")})[]${nullable}`;
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
  isMcp = false,
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
          isMcp,
        ),
      );
    } else {
      rows.push({
        key: fullKey,
        indent,
        required: isReq,
        typeStr: typeLabel(rawProp, isMcp),
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

/**
 * One tool, rendered in full.
 *
 * `showSearchHelp` appends the help search/filter reference. Off by default:
 * a direct `<cli> <tool> -h` already names the tool, so that block is noise.
 * The multi-result path turns it on, where narrowing the search is the useful
 * next action.
 */
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
  lines.push(
    `${chalk.dim("Call as")}   ${CLI_BINARY_NAME} ${chalk.green(tool.name)}`,
  );

  // Parameters
  if (tool.parameters && typeof tool.parameters === "object") {
    const schema = tool.parameters as JsonSchemaObject;
    const props = schema.properties;
    const required = schema.required ?? [];
    if (props && Object.keys(props).length > 0) {
      lines.push("");
      lines.push(chalk.bold("Parameters"));
      const rows = collectParamRows(props, required, "", 0, 0, true, false);
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
        for (const [k, v] of Object.entries(
          exData as Record<string, WidgetData>,
        )) {
          for (const flag of flattenValue(k, v, "--", false)) {
            flags.push(flag);
          }
        }
        const cmd = `${CLI_BINARY_NAME} ${tool.name}`;
        lines.push(chalk.dim(`  ${exName}:`));
        lines.push(`  ${wrapExampleCli(cmd, flags)}`);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

/**
 * The help search/filter reference.
 *
 * Deliberately NOT part of a detail view. `<cli> <tool> -h` asked for exactly
 * one tool and got it; telling the user how to search for tools answers a
 * question they did not ask and buries the answer they did. And when several
 * tools are auto-expanded, repeating this nine-line block between each one is
 * worse than printing it once — so the multi-result path appends it a single
 * time at the end.
 */
function renderSearchHelpCli(): string {
  const lines: string[] = [];
  lines.push(chalk.dim("─".repeat(49)));
  lines.push(
    `  ${chalk.bold(`${CLI_BINARY_NAME} help`)} ${chalk.dim("— search & filter options")}`,
  );
  lines.push("");
  const helpCmds: [string, string][] = [
    [`${CLI_BINARY_NAME} help`, "list all tools"],
    [`${CLI_BINARY_NAME} help <query>`, "search by keyword"],
    [`${CLI_BINARY_NAME} help --toolName=<name>`, "show this detail view"],
    [`${CLI_BINARY_NAME} help --category=<cat>`, "filter by category"],
    [`${CLI_BINARY_NAME} help --subCategory=<sub>`, "filter by subcategory"],
    [`${CLI_BINARY_NAME} help --page=<n>`, "paginate results"],
    [`${CLI_BINARY_NAME} help --pageSize=<n>`, "results per page (max 1000)"],
  ];
  const helpCmdCol = Math.max(...helpCmds.map(([cmd]) => cmd.length));
  for (const [cmd, desc] of helpCmds) {
    lines.push(
      `  ${chalk.green(cmd.padEnd(helpCmdCol + 2))}${chalk.dim(desc)}`,
    );
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
      const rows = collectParamRows(props, required, "", 0, 0, true, true);
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
        const args = serializeExampleArgs(
          exData as Record<string, WidgetData>,
          "--",
          true,
        );
        lines.push(`  ${exName}: ${CLI_BINARY_NAME} ${tool.name} ${args}`);
      }
    }
  }

  return lines.join("\n");
}

// ── Category Overview ────────────────────────────────────────────────────

function renderCategoriesCli(
  categories: {
    name: string;
    count: number;
    subCategories?: { name: string; count: number }[];
  }[],
  totalCount: number,
  hint?: string,
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
      `  ${chalk.bold.blue(padded)}${chalk.dim(`${cat.count} tool${cat.count !== 1 ? "s" : ""}`)}`,
    );
    if (cat.subCategories && cat.subCategories.length > 0) {
      for (const sub of cat.subCategories) {
        const subPadded = sub.name.padEnd(maxNameLen);
        lines.push(
          `    ${chalk.cyan(subPadded)}  ${chalk.dim(`${sub.count}`)}`,
        );
      }
    }
  }

  lines.push("");
  lines.push(
    chalk.dim(
      hint ??
        `Use: ${CLI_BINARY_NAME} help --category="<name>" or --subCategory="<name>" to filter`,
    ),
  );

  return lines.join("\n");
}

function renderCategoriesMcp(
  categories: {
    name: string;
    count: number;
    subCategories?: { name: string; count: number }[];
  }[],
  totalCount: number,
  hint?: string,
): string {
  const lines: string[] = [];
  lines.push(`Tool Categories (${totalCount} tools)`);
  for (const cat of categories) {
    lines.push(`  ${cat.name}: ${cat.count} tools`);
    if (cat.subCategories && cat.subCategories.length > 0) {
      for (const sub of cat.subCategories) {
        lines.push(`    ${sub.name}: ${sub.count}`);
      }
    }
  }
  lines.push("");
  lines.push(
    hint ??
      `Use category="<name>" or subCategory="<name>" to filter, toolName="<name>" for detail.`,
  );
  return lines.join("\n");
}

// ── Tool List ────────────────────────────────────────────────────────────

function renderToolListCli(
  tools: HelpToolItem[],
  matchedCount: number,
  currentPage?: number,
  totalPages?: number,
  hint?: string,
  locale = "en-US",
): string {
  const lines: string[] = [];

  // Header
  const showing =
    tools.length < matchedCount
      ? `showing ${tools.length} of ${matchedCount}`
      : `${matchedCount}`;
  lines.push(chalk.bold(`Available Tools`) + chalk.dim(` (${showing})`));
  lines.push("");

  // Group by category → subCategory
  const groups = new Map<string, Map<string, HelpToolItem[]>>();
  for (const tool of tools) {
    const cat = tool.category || "Other";
    const sub = tool.subCategory ?? cat;
    const subMap = groups.get(cat) ?? new Map<string, HelpToolItem[]>();
    const existing = subMap.get(sub) ?? [];
    existing.push(tool);
    subMap.set(sub, existing);
    groups.set(cat, subMap);
  }

  // Find longest tool name for alignment
  const maxNameLen = Math.max(...tools.map((t) => t.name.length), 8);

  for (const [category, subMap] of groups) {
    const catLabel = getCategoryLabel(category, locale);
    lines.push(`  ${chalk.bold.underline(catLabel)}`);
    for (const [sub, subTools] of subMap) {
      // Only print subCategory header if it differs from category and there are multiple subCategories
      if (subMap.size > 1 && sub !== category) {
        const subLabel = getSubCategoryLabel(category, sub, locale);
        lines.push(`    ${chalk.dim(subLabel)}`);
      }
      for (const tool of subTools) {
        const name = chalk.green(tool.name.padEnd(maxNameLen + 1));
        const desc = chalk.dim(
          tool.description.length > 60
            ? `${tool.description.slice(0, 57)}...`
            : tool.description,
        );
        const credits = formatCredits(tool.credits);
        const creditsStr = credits ? ` ${chalk.yellow(credits)}` : "";
        const indent = subMap.size > 1 && sub !== category ? "      " : "    ";
        lines.push(`${indent}${name} ${desc}${creditsStr}`);
      }
    }
    lines.push("");
  }

  // Pagination
  if (currentPage && totalPages && totalPages > 1) {
    lines.push(
      chalk.dim(
        `Page ${currentPage}/${totalPages} - ${CLI_BINARY_NAME} help --page=${currentPage + 1}`,
      ),
    );
  }

  // Footer - use server hint if available, fallback to default
  lines.push(
    chalk.dim(hint ?? `Use: ${CLI_BINARY_NAME} help <name> for full details`),
  );

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

// ── Response Mode (responseOnly) ─────────────────────────────────────────

function HelpToolsResponse({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const locale = useWidgetLocale();
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
      const joined = sections.join(sep);
      // Once, after everything - not repeated between sections. MCP gets none:
      // an agent reads the tool list programmatically and every extra line is
      // wasted context.
      return isMcp ? joined : `${joined}\n${renderSearchHelpCli()}`;
    }

    // Mode 2: Category overview (no tools, categories present)
    if (tools.length === 0 && categories && categories.length > 0) {
      return isMcp
        ? renderCategoriesMcp(categories, totalCount, hint)
        : renderCategoriesCli(categories, totalCount, hint);
    }

    // Mode 3: Tool list
    if (tools.length > 0) {
      return isMcp
        ? renderToolListMcp(tools, matchedCount, currentPage, totalPages)
        : renderToolListCli(
            tools,
            matchedCount,
            currentPage,
            totalPages,
            hint,
            locale,
          );
    }

    return isMcp ? "No tools found." : chalk.dim("No tools found.");
  }, [field.value, isMcp, locale]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{output}</Text>
    </Box>
  );
}

// ── Interactive Mode: the tool browser ───────────────────────────────────
//
// Views: categories → sub-categories → tools → detail → execute → result.
//
// This half never runs under the synchronous CLI/MCP result formatters — they
// render with responseOnly, and useInput/useApp need a live Ink tree. The
// dispatcher at the bottom of this file is what keeps the two apart.

interface SelectItem<V> {
  key?: string;
  label: string;
  value: V;
}

interface CategoryInfo {
  /** Registry key — what tools are filtered by. */
  name: string;
  /** Display label from the category registry. */
  label: string;
  subCategories: SubCategoryInfo[];
  totalCount: number;
}

interface SubCategoryInfo {
  name: string;
  label: string;
  category: string;
  count: number;
}

interface ToolInfo {
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  subCategory: string;
  subCategoryLabel: string;
  method: string;
  toolName: string;
  credits?: number;
  aliases: string[];
  endpoint?: CreateApiEndpointAny;
}

type View =
  | { type: "categories" }
  | { type: "subcategories"; category: string }
  | { type: "tools"; category: string | null; subCategory: string | null }
  | { type: "detail"; tool: ToolInfo }
  | { type: "result"; tool: ToolInfo; response: ResponseType<WidgetData> };

// ── Data loading ──────────────────────────────────────────────────────────

/**
 * The browser reads the generated endpoint meta directly rather than this
 * endpoint's own response: the CLI seeds parsed argv as the GET's react-query
 * initialData, so in interactive mode field.value holds request args, not a help
 * response. Meta is also what the detail view needs — it resolves full definitions
 * from it via getEndpoint().
 *
 * Both imports stay deferred so neither lands on the response path's module graph.
 */
async function getToolsForUser(
  platform: CliCompatiblePlatform,
  user: JwtPayloadType,
  locale: string,
): Promise<{ tools: ToolInfo[]; categories: CategoryInfo[] }> {
  const [{ endpointsMeta }, { permissionsRegistry }] = await Promise.all([
    import("@/generated/endpoints/meta/en"),
    import("../core/permissions/registry"),
  ]);

  const tools: ToolInfo[] = [];
  // category → subCategory → count
  const catMap = new Map<string, Map<string, number>>();

  for (const ep of endpointsMeta) {
    const allowedRoles = ep.allowedRoles;
    if (
      !permissionsRegistry.checkPlatformAccess(allowedRoles, platform).allowed
    ) {
      continue;
    }
    if (user.isPublic) {
      if (!allowedRoles.includes(UserRole.PUBLIC)) {
        continue;
      }
    } else if (!user.roles.some((role) => allowedRoles.includes(role))) {
      continue;
    }

    const cat = ep.category || "Other";
    const sub = ep.subCategory || cat;

    tools.push({
      name: ep.toolName,
      description: ep.description,
      category: cat,
      categoryLabel: getCategoryLabel(cat, locale),
      subCategory: sub,
      subCategoryLabel: getSubCategoryLabel(cat, sub, locale),
      method: ep.method,
      toolName: ep.toolName,
      credits: ep.credits,
      aliases: ep.aliases,
    });

    const subMap = catMap.get(cat) ?? new Map<string, number>();
    subMap.set(sub, (subMap.get(sub) ?? 0) + 1);
    catMap.set(cat, subMap);
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));

  const categories: CategoryInfo[] = [...catMap.entries()]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([name, subMap]) => {
      const subCategories: SubCategoryInfo[] = [...subMap.entries()]
        .toSorted(([a], [b]) => a.localeCompare(b))
        .map(([subName, count]) => ({
          name: subName,
          label: getSubCategoryLabel(name, subName, locale),
          category: name,
          count,
        }));
      return {
        name,
        label: getCategoryLabel(name, locale),
        subCategories,
        totalCount: subCategories.reduce((n, s) => n + s.count, 0),
      };
    });

  return { tools, categories };
}

/**
 * runInProcess wraps a successful payload as `{ result: <data> }` for MCP/AI
 * display. ResultView hands the payload to the TARGET endpoint's own renderer,
 * which expects its response flat — the envelope makes every field read as
 * undefined (help-tool's own widget crashes on `tools.length`). The CLI route
 * executor strips the same envelope for the same reason; see
 * unwrapExecuteToolResult in platforms/cli/runtime/route-executor.ts.
 *
 * Re-shapes the response rather than rebuilding it via success(), which would mean
 * a value import of response.schema for no gain — the spread already carries
 * isErrorResponse/performance/headers through untouched.
 */
function unwrapToolResult(
  raw: ResponseType<WidgetData>,
): ResponseType<WidgetData> {
  if (!raw.success) {
    return raw;
  }
  const data = raw.data;
  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    data instanceof Date ||
    !("result" in data)
  ) {
    return raw;
  }
  return { ...raw, data: data["result"] };
}

// ── Shared chrome ─────────────────────────────────────────────────────────

function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): JSX.Element {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="cyan">
        {title}
      </Text>
      {subtitle && <Text dimColor>{subtitle}</Text>}
    </Box>
  );
}

function Breadcrumb({ parts }: { parts: string[] }): JSX.Element {
  return (
    <Box marginBottom={1}>
      {parts.map((part, i) => (
        <Text key={`${i}-${part}`} dimColor={i < parts.length - 1}>
          {i > 0 ? " > " : ""}
          {part}
        </Text>
      ))}
    </Box>
  );
}

function Footer({ hints }: { hints: string }): JSX.Element {
  return (
    <Box marginTop={1}>
      <Text dimColor>{hints}</Text>
    </Box>
  );
}

// ── Category View ─────────────────────────────────────────────────────────

function CategoryView({
  categories,
  totalTools,
  onSelect,
  onSelectAll,
}: {
  categories: CategoryInfo[];
  totalTools: number;
  onSelect: (category: string) => void;
  onSelectAll: () => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  const items: SelectItem<string | null>[] = useMemo(
    () => [
      { label: `All Tools (${totalTools})`, value: null, key: "__all__" },
      ...categories.map((cat) => ({
        label: `${cat.label.padEnd(28)} ${cat.subCategories.length} groups · ${cat.totalCount} tools`,
        value: cat.name,
        key: cat.name,
      })),
    ],
    [categories, totalTools],
  );

  const handleSelect = useCallback(
    (item: SelectItem<string | null>): void => {
      if (item.value === null) {
        onSelectAll();
      } else {
        onSelect(item.value);
      }
    },
    [onSelect, onSelectAll],
  );

  return (
    <Box flexDirection="column">
      <Header
        title={`Tool Categories (${totalTools} tools)`}
        subtitle={cliT("vibe.interactive.help.selectCategory")}
      />
      <SelectInput<string | null>
        items={items}
        onSelect={handleSelect}
        limit={20}
      />
      <Footer hints={cliT("vibe.interactive.help.hintsNavSelect")} />
    </Box>
  );
}

// ── SubCategory View ──────────────────────────────────────────────────────

function SubCategoryView({
  category,
  subCategories,
  onSelect,
  onSelectAll,
  onBack,
}: {
  category: CategoryInfo;
  subCategories: SubCategoryInfo[];
  onSelect: (subCategory: string) => void;
  onSelectAll: () => void;
  onBack: () => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const total = subCategories.reduce((n, s) => n + s.count, 0);

  const items: SelectItem<string | null>[] = useMemo(
    () => [
      { label: "< Back to categories", value: "__back__", key: "__back__" },
      {
        label: `All in ${category.label} (${total})`,
        value: null,
        key: "__all__",
      },
      ...subCategories.map((sub) => ({
        label: `${sub.label.padEnd(28)} ${sub.count} tools`,
        value: sub.name,
        key: sub.name,
      })),
    ],
    [subCategories, category.label, total],
  );

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
  });

  const handleSelect = useCallback(
    (item: SelectItem<string | null>): void => {
      if (item.value === "__back__") {
        onBack();
      } else if (item.value === null) {
        onSelectAll();
      } else {
        onSelect(item.value);
      }
    },
    [onSelect, onSelectAll, onBack],
  );

  return (
    <Box flexDirection="column">
      <Breadcrumb parts={["Help", category.label]} />
      <Header
        title={`${category.label} - ${subCategories.length} groups · ${total} tools`}
        subtitle={cliT("vibe.interactive.help.selectCategory")}
      />
      <SelectInput<string | null>
        items={items}
        onSelect={handleSelect}
        limit={20}
      />
      <Footer hints={cliT("vibe.interactive.help.hintsNavSelectBack")} />
    </Box>
  );
}

// ── Tool List View ────────────────────────────────────────────────────────

function ToolListView({
  tools,
  category,
  subCategory,
  onSelect,
  onBack,
}: {
  tools: ToolInfo[];
  category: string | null;
  subCategory: string | null;
  onSelect: (tool: ToolInfo) => void;
  onBack: () => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const filtered = useMemo(() => {
    let result = tools;
    if (category) {
      result = result.filter((t) => t.category === category);
    }
    if (subCategory) {
      result = result.filter((t) => t.subCategory === subCategory);
    }
    return result;
  }, [tools, category, subCategory]);

  const items: SelectItem<ToolInfo | null>[] = useMemo(
    () => [
      { label: "< Back", value: null, key: "__back__" },
      ...filtered.map((tool) => {
        const credits =
          tool.credits && tool.credits > 0 ? ` (${tool.credits}cr)` : "";
        const desc =
          tool.description.length > 50
            ? `${tool.description.slice(0, 47)}...`
            : tool.description;
        return {
          label: `${tool.name.padEnd(25)} ${desc}${credits}`,
          value: tool,
          key: `${tool.name}_${tool.method}`,
        };
      }),
    ],
    [filtered],
  );

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
  });

  const handleSelect = useCallback(
    (item: SelectItem<ToolInfo | null>): void => {
      if (item.value === null) {
        onBack();
      } else {
        onSelect(item.value);
      }
    },
    [onBack, onSelect],
  );

  // Labels come off the first matching tool: every tool in a filtered list shares
  // the same category/subCategory, so this avoids re-resolving the registry here.
  const first = filtered[0];
  const categoryLabel = category ? (first?.categoryLabel ?? category) : null;
  const subCategoryLabel = subCategory
    ? (first?.subCategoryLabel ?? subCategory)
    : null;

  const breadcrumb = [
    "Help",
    ...(categoryLabel ? [categoryLabel] : []),
    ...(subCategoryLabel ? [subCategoryLabel] : []),
  ];
  const title = subCategoryLabel ?? categoryLabel ?? "All Tools";

  return (
    <Box flexDirection="column">
      <Breadcrumb parts={breadcrumb} />
      <Header
        title={`${title} (${filtered.length} tools)`}
        subtitle={cliT("vibe.interactive.help.selectTool")}
      />
      <SelectInput<ToolInfo | null>
        items={items}
        onSelect={handleSelect}
        limit={20}
      />
      <Footer hints={cliT("vibe.interactive.help.hintsNavSelectBack")} />
    </Box>
  );
}

// ── Tool Detail View ──────────────────────────────────────────────────────

function ToolDetailView({
  tool,
  onBack,
  onExecute,
}: {
  tool: ToolInfo;
  onBack: () => void;
  onExecute: () => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetContext().user;
  const platform = useCliBrowserPlatform();

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
    if (key.return) {
      onExecute();
    }
  });

  return (
    <Box flexDirection="column">
      <Breadcrumb
        parts={["Help", tool.categoryLabel, tool.subCategoryLabel, tool.name]}
      />

      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold color="cyan">
          {tool.name}
          {tool.aliases.length > 0 && (
            <Text dimColor>{` (${tool.aliases.join(", ")})`}</Text>
          )}
        </Text>
        <Text>{tool.description}</Text>
        <Text />
        <Box gap={4}>
          <Text>
            <Text dimColor>{cliT("vibe.interactive.help.category")}</Text>
            {tool.categoryLabel}
            {tool.subCategory !== tool.category
              ? ` › ${tool.subCategoryLabel}`
              : ""}
          </Text>
          <Text>
            <Text dimColor>{cliT("vibe.interactive.help.method")}</Text>
            <Text color="yellow">{tool.method}</Text>
          </Text>
          {tool.credits !== undefined && tool.credits > 0 && (
            <Text>
              <Text dimColor>{cliT("vibe.interactive.help.credits")}</Text>
              <Text color="yellow">{String(tool.credits)}</Text>
            </Text>
          )}
        </Box>
        <Text>
          <Text dimColor>{"Call as   "}</Text>
          <Text color="green">{`${CLI_BINARY_NAME} ${tool.name}`}</Text>
        </Text>
      </Box>

      {tool.endpoint && (
        <Box
          marginTop={1}
          borderStyle="round"
          borderColor="blue"
          paddingX={1}
          paddingY={1}
          flexDirection="column"
        >
          <Text bold color="blue">
            {cliT("vibe.interactive.help.fields")}
          </Text>
          {/*
            `disabled` marks this a preview of the target's schema, not a live form
            — and it is load-bearing, not cosmetic. The target may be help-tool
            itself, and a widget is free to render a session when it is neither
            disabled nor responseOnly. Without this, browsing to tool-help mounts a
            SECOND browser inside this box, whose useInput handlers then race this
            one for every keystroke. The old standalone interactive.cli.tsx could
            leave it live only because it sat outside the widget and could not recurse.
          */}
          <EndpointRenderer
            endpoint={tool.endpoint}
            locale={locale}
            data={undefined}
            isSubmitting={false}
            disabled
            logger={logger}
            user={user}
            platform={platform}
            response={undefined}
          />
        </Box>
      )}

      <Footer hints={cliT("vibe.interactive.help.hintsExecuteBack")} />
    </Box>
  );
}

// ── Result View ───────────────────────────────────────────────────────────

function ResultView({
  tool,
  response,
  onBack,
}: {
  tool: ToolInfo;
  response: ResponseType<WidgetData>;
  onBack: () => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetContext().user;
  const platform = useCliBrowserPlatform();

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape || key.return) {
      onBack();
    }
  });

  const isSuccess = response.success;

  return (
    <Box flexDirection="column">
      <Breadcrumb
        parts={[
          "Help",
          tool.categoryLabel,
          tool.subCategoryLabel,
          tool.name,
          cliT("vibe.interactive.help.result"),
        ]}
      />

      <Box
        borderStyle="round"
        borderColor={isSuccess ? "green" : "red"}
        paddingX={1}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold color={isSuccess ? "green" : "red"}>
          {isSuccess
            ? cliT("vibe.interactive.help.success")
            : cliT("vibe.interactive.help.error")}
        </Text>

        {response.success && tool.endpoint && (
          <EndpointRenderer
            endpoint={tool.endpoint}
            locale={locale}
            data={response.data}
            isSubmitting={false}
            logger={logger}
            user={user}
            platform={platform}
            response={response}
            responseOnly
          />
        )}

        {!response.success && <Text color="red">{response.message}</Text>}
      </Box>

      <Footer hints={cliT("vibe.interactive.help.hintsBack")} />
    </Box>
  );
}

// ── Browser root ──────────────────────────────────────────────────────────

/** The browser only ever runs on a terminal surface; MCP is always responseOnly. */
function useCliBrowserPlatform(): CliCompatiblePlatform {
  const platform = useWidgetPlatform();
  return platform === Platform.MCP ? Platform.MCP : Platform.CLI;
}

function HelpToolsBrowser(): JSX.Element {
  const { exit } = useApp();
  const locale = useWidgetLocale();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetContext().user;
  const platform = useCliBrowserPlatform();

  const [view, setView] = useState<View>({ type: "categories" });
  const [isExecuting, setIsExecuting] = useState(false);
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    let cancelled = false;
    void getToolsForUser(platform, user, locale).then(
      ({ tools: t, categories: c }) => {
        if (!cancelled) {
          setTools(t);
          setCategories(c);
        }
        return undefined;
      },
    );
    return (): void => {
      cancelled = true;
    };
  }, [platform, user, locale]);

  // Global quit
  useInput((input) => {
    if (input === "q" && view.type !== "result") {
      exit();
    }
  });

  const handleCategorySelect = useCallback((category: string): void => {
    setView({ type: "subcategories", category });
  }, []);

  const handleSelectAllTools = useCallback((): void => {
    setView({ type: "tools", category: null, subCategory: null });
  }, []);

  const handleSubCategorySelect = useCallback(
    (category: string, subCategory: string): void => {
      setView({ type: "tools", category, subCategory });
    },
    [],
  );

  const handleSelectAllInCategory = useCallback((category: string): void => {
    setView({ type: "tools", category, subCategory: null });
  }, []);

  const handleToolSelect = useCallback((tool: ToolInfo): void => {
    void import("@/generated/endpoints/endpoint")
      .then(({ getEndpoint }) => getEndpoint(tool.toolName))
      .then((endpointDef) => {
        setView({
          type: "detail",
          tool: endpointDef ? { ...tool, endpoint: endpointDef } : tool,
        });
        return undefined;
      });
  }, []);

  const handleBack = useCallback((): void => {
    setView((current) => {
      switch (current.type) {
        case "subcategories":
          return { type: "categories" };
        case "tools":
          if (current.subCategory && current.category) {
            return { type: "subcategories", category: current.category };
          }
          return { type: "categories" };
        case "detail":
          return {
            type: "tools",
            category: current.tool.category,
            subCategory: current.tool.subCategory,
          };
        case "result":
          return { type: "detail", tool: current.tool };
        default:
          return current;
      }
    });
  }, []);

  const handleExecute = useCallback((): void => {
    if (view.type !== "detail") {
      return;
    }
    const { tool } = view;
    setIsExecuting(true);

    // Deferred: the execution stack is the heaviest graph in the build and the
    // response path must never pay for it.
    void import("../execute-tool/repository")
      .then(({ RouteExecuteRepository }) =>
        RouteExecuteRepository.runInProcess({
          toolName: tool.toolName,
          input: {},
          user,
          locale,
          logger,
          platform,
          toolExecutionContext: {
            // no user context — UTC (dates not user-facing here)
            ...makeHeadlessContext(undefined, undefined, "UTC"),
            rootFolderId: DefaultFolderId.PRIVATE,
          },
        }),
      )
      .then(
        (result) => {
          setIsExecuting(false);
          setView({ type: "result", tool, response: unwrapToolResult(result) });
          return undefined;
        },
        () => {
          setIsExecuting(false);
        },
      );
  }, [view, user, locale, logger, platform]);

  // Derive current category's sub-categories
  const currentCategoryInfo = useMemo(() => {
    if (view.type !== "subcategories") {
      return null;
    }
    return categories.find((c) => c.name === view.category) ?? null;
  }, [view, categories]);

  if (isExecuting) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="yellow">
          {cliT(
            "vibe.endpoints.renderers.cliUi.widgets.common.hints.executing",
          )}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {view.type === "categories" && (
        <CategoryView
          categories={categories}
          totalTools={tools.length}
          onSelect={handleCategorySelect}
          onSelectAll={handleSelectAllTools}
        />
      )}

      {view.type === "subcategories" && currentCategoryInfo && (
        <SubCategoryView
          category={currentCategoryInfo}
          subCategories={currentCategoryInfo.subCategories}
          onSelect={(sub) =>
            handleSubCategorySelect(currentCategoryInfo.name, sub)
          }
          onSelectAll={() =>
            handleSelectAllInCategory(currentCategoryInfo.name)
          }
          onBack={handleBack}
        />
      )}

      {view.type === "tools" && (
        <ToolListView
          tools={tools}
          category={view.category}
          subCategory={view.subCategory}
          onSelect={handleToolSelect}
          onBack={handleBack}
        />
      )}

      {view.type === "detail" && (
        <ToolDetailView
          tool={view.tool}
          onBack={handleBack}
          onExecute={handleExecute}
        />
      )}

      {view.type === "result" && (
        <ResultView
          tool={view.tool}
          response={view.response}
          onBack={handleBack}
        />
      )}
    </Box>
  );
}

// ── Main Widget ──────────────────────────────────────────────────────────

/**
 * The `interactive` request field is endpoint contract — it is what a caller SAYS,
 * and `-i` on the CLI is what makes the host mount a live Ink tree. The widget
 * branches on `responseOnly` instead, because that is what the host REPORTS: it is
 * set by every surface that renders in one synchronous pass (CLI result formatter,
 * MCP render tree), and those passes cannot host useInput/useApp or a re-render.
 * Keying off `interactive` alone would draw a browser into a dead frame for
 * `vibe help --interactive` (a bare arg, no `-i`), and requiring both would leave a
 * third state — !responseOnly && !interactive — with nothing to render, since
 * noFormElement means this widget IS the layout. `disabled` joins it for the same
 * reason it does in execute-tool's widget: a disabled render is a transcript,
 * not a session.
 */
export function HelpToolsWidget({
  field,
  fieldName,
}: CliWidgetProps): JSX.Element {
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();

  if (!responseOnly && !disabled) {
    return <HelpToolsBrowser />;
  }
  return <HelpToolsResponse field={field} fieldName={fieldName} />;
}

HelpToolsWidget.cliWidget = true as const;
