/**
 * Source-level helpers for the model price updater.
 *
 * The updater edits the model definition files as text. These helpers patch
 * single fields in place so a refresh only touches values that actually
 * changed: unchanged values keep their formatting and their
 * `// updated: <date>` comment, and fields the updater does not own
 * (capabilities such as supportedSizes, allowedPassthroughParameters) are
 * never rewritten.
 */

import { z } from "zod";

import type { TokenTariff } from "../token-tariffs";
import type { ProviderEntryOperation } from "./providers/base";
import { tariffLiteral } from "./providers/base";

const PRINT_WIDTH = 80;

/** Whitespace- and trailing-comma-insensitive form of a TS literal. */
export function normalizeLiteral(literal: string): string {
  return literal
    .replaceAll(/\s+/g, "")
    .replaceAll(/,([\]}])/g, "$1")
    .replaceAll(/,$/g, "");
}

const jsonScalarSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
const flatArraySchema = z.array(jsonScalarSchema);
const flatObjectSchema = z.record(z.string(), jsonScalarSchema);
const numberMapSchema = z.record(z.string(), z.number());

type JsonScalar = z.infer<typeof jsonScalarSchema>;

/** Parse a JSON literal against a schema; null when it is not JSON or does not match. */
export function parseJsonLiteral<T>(
  schema: z.ZodType<T>,
  literal: string,
): T | null {
  try {
    const parsed = schema.safeParse(JSON.parse(literal));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** A flat `{ "key": number }` JSON literal as a map, else null. */
export function parseNumberMap(literal: string): Record<string, number> | null {
  return literal.startsWith("{")
    ? parseJsonLiteral(numberMapSchema, literal)
    : null;
}

/** True when two TS literals describe the same value. */
export function literalsEqual(a: string, b: string): boolean {
  const left = normalizeLiteral(a);
  const right = normalizeLiteral(b);
  if (left === right) {
    return true;
  }
  // Price maps are keyed: `{ "4K": 60, "720p": 40 }` equals `{ "720p": 40, "4K": 60 }`.
  const leftMap = parseNumberMap(left);
  const rightMap = parseNumberMap(right);
  if (leftMap && rightMap) {
    const keys = Object.keys(leftMap);
    return (
      keys.length === Object.keys(rightMap).length &&
      keys.every((key) => leftMap[key] === rightMap[key])
    );
  }
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  return (
    left !== "" &&
    right !== "" &&
    Number.isFinite(leftNumber) &&
    Number.isFinite(rightNumber) &&
    leftNumber === rightNumber
  );
}

function scalarLiteral(value: JsonScalar): string {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

/**
 * Format a flat JSON array/object literal the way the formatter prints it:
 * one line when `<indent><field>: <value>,` fits the print width, otherwise
 * one element per line. Literals that are not flat JSON are returned as is.
 */
export function formatTsLiteral(
  literal: string,
  indent: string,
  field: string,
): string {
  const prefixLength = indent.length + field.length + 2;
  const inner = `${indent}  `;
  const array = parseJsonLiteral(flatArraySchema, literal);
  if (array) {
    const items = array.map(scalarLiteral);
    const oneLine = `[${items.join(", ")}]`;
    if (
      items.length === 0 ||
      prefixLength + oneLine.length + 1 <= PRINT_WIDTH
    ) {
      return oneLine;
    }
    return `[\n${items.map((item) => `${inner}${item},`).join("\n")}\n${indent}]`;
  }
  const object = parseJsonLiteral(flatObjectSchema, literal);
  if (object) {
    const entries = Object.entries(object).map(
      ([key, value]) => `${JSON.stringify(key)}: ${scalarLiteral(value)}`,
    );
    if (entries.length === 0) {
      return "{}";
    }
    const oneLine = `{ ${entries.join(", ")} }`;
    if (prefixLength + oneLine.length + 1 <= PRINT_WIDTH) {
      return oneLine;
    }
    return `{\n${entries.map((entry) => `${inner}${entry},`).join("\n")}\n${indent}}`;
  }
  return literal;
}

/** Location of one `field: value, // comment` entry inside a source block. */
export interface FieldSpan {
  /** Start of the line holding the field */
  lineStart: number;
  valueStart: number;
  valueEnd: number;
  /** Index right after the field's trailing comment (before the newline) */
  lineEnd: number;
  value: string;
}

/** Index after the bracket that closes the one at `start` (strings skipped). */
function matchBracket(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (inString) {
      if (char === "\\") {
        i++;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "[" || char === "{") {
      depth++;
    } else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return -1;
}

/** Find a field at exactly `indent` (nested tariff fields are ignored). */
export function findField(
  block: string,
  indent: string,
  field: string,
): FieldSpan | null {
  const regex = new RegExp(`^${indent}${field}:[ \\t]*`, "m");
  const match = regex.exec(block);
  if (!match) {
    return null;
  }
  const valueStart = match.index + match[0].length;
  const opener = block[valueStart];
  let valueEnd: number;
  if (opener === "[" || opener === "{") {
    valueEnd = matchBracket(block, valueStart);
    if (valueEnd === -1) {
      return null;
    }
  } else {
    const rest = /^[^,\n]*/.exec(block.slice(valueStart));
    valueEnd = valueStart + (rest?.[0].trimEnd().length ?? 0);
  }
  const tail = /^,?(?:[ \t]*\/\/[^\n]*)?/.exec(block.slice(valueEnd));
  return {
    lineStart: match.index,
    valueStart,
    valueEnd,
    lineEnd: valueEnd + (tail?.[0].length ?? 0),
    value: block.slice(valueStart, valueEnd),
  };
}

/** Fields the price updater owns on an UNBOTTLED relay row, in file order. */
const RELAY_COST_FIELDS = [
  "creditCost",
  "inputTokenCost",
  "outputTokenCost",
  "cacheReadTokenCost",
  "cacheWriteTokenCost",
  "cacheWrite1hTokenCost",
  "pricingTiers",
  "imageOutputTokenCost",
  "creditCostPerImage",
  "creditCostPerSecond",
  "creditCostPerClip",
  "creditCostPerCharacter",
  "pricingByResolution",
  "pricingBySize",
  "pricingByQuality",
] as const;

type RelayCostField = (typeof RELAY_COST_FIELDS)[number];

function pricingMapLiteral(map: Partial<Record<string, number>>): string {
  const entries = Object.entries(map).filter(
    (entry): entry is [string, number] => entry[1] !== undefined,
  );
  return JSON.stringify(Object.fromEntries(entries));
}

function relayLiteral(
  op: ProviderEntryOperation,
  field: RelayCostField,
): { literal: string; annotate: boolean } | null {
  switch (field) {
    case "creditCost":
      if (typeof op.inputTokenCost === "number") {
        return { literal: "calculateCreditCost", annotate: false };
      }
      return typeof op.creditCost === "number"
        ? { literal: String(op.creditCost), annotate: true }
        : null;
    case "pricingTiers": {
      const tiers: readonly TokenTariff[] | undefined = op.pricingTiers;
      return tiers?.length
        ? { literal: tariffLiteral(tiers), annotate: true }
        : null;
    }
    case "pricingByResolution":
    case "pricingBySize":
    case "pricingByQuality": {
      const map = op[field];
      return map ? { literal: pricingMapLiteral(map), annotate: true } : null;
    }
    default: {
      const value = op[field];
      return typeof value === "number"
        ? { literal: String(value), annotate: true }
        : null;
    }
  }
}

/**
 * Patch an UNBOTTLED relay block (the `{ ... }` object text) in place from a
 * typed op. Only price fields change, and only when their value differs.
 * Every other line (capabilities, durations, passthrough params, comments)
 * is kept byte for byte. Missing price fields are inserted after the last
 * price field present (or after providerModel).
 */
export function patchRelayBlock(
  block: string,
  op: ProviderEntryOperation,
  comment: string,
): { block: string; changed: boolean } {
  const indentMatch = /^([ \t]*)providerModel:/m.exec(block);
  const indent = indentMatch?.[1];
  if (indent === undefined) {
    return { block, changed: false };
  }
  let result = block;
  let changed = false;
  for (const field of RELAY_COST_FIELDS) {
    const next = relayLiteral(op, field);
    if (!next) {
      continue;
    }
    const literal = formatTsLiteral(next.literal, indent, field);
    const suffix = next.annotate ? `, ${comment}` : ",";
    const span = findField(result, indent, field);
    if (span) {
      if (literalsEqual(span.value, literal)) {
        continue;
      }
      result = `${result.slice(0, span.lineStart)}${indent}${field}: ${literal}${suffix}${result.slice(span.lineEnd)}`;
      changed = true;
      continue;
    }
    // Insert after the last owned field already present, else providerModel.
    let anchorEnd = -1;
    for (const candidate of RELAY_COST_FIELDS) {
      const found = findField(result, indent, candidate);
      if (found && found.lineEnd > anchorEnd) {
        anchorEnd = found.lineEnd;
      }
    }
    if (anchorEnd === -1) {
      anchorEnd = findField(result, indent, "providerModel")?.lineEnd ?? -1;
    }
    if (anchorEnd === -1) {
      continue;
    }
    result = `${result.slice(0, anchorEnd)}\n${indent}${field}: ${literal}${suffix}${result.slice(anchorEnd)}`;
    changed = true;
  }
  return { block: result, changed };
}

/**
 * True when `offset` (a position inside a provider object, after its
 * apiProvider line) belongs to an UNBOTTLED relay row. Relay rows often share
 * their providerModel string with the primary route (e.g. "seedance-1-5-pro"),
 * so an upstream price update matched by providerModel alone would overwrite
 * the relay's marked-up price with the raw upstream one.
 */
export function isRelayRowAt(content: string, offset: number): boolean {
  const marker = "apiProvider: ApiProvider.";
  const at = content.lastIndexOf(marker, offset);
  if (at === -1 || content.slice(at, offset).includes("\n      },")) {
    return false;
  }
  return content.startsWith("UNBOTTLED,", at + marker.length);
}
