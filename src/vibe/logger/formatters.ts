/**
 * Log Message Formatters
 * Provides consistent, beautiful formatting for different types of log messages
 */

import { bold, colors, dim, maybeColorize, semantic } from "./colors";
import type { LoggerMetadata } from "./types";
import { formatElapsed } from "./uptime";

/**
 * Format a startup message
 */
export function formatStartup(message: string, icon = "🚀"): string {
  return `${icon} ${bold(message)}`;
}

/**
 * Format a success message
 */
export function formatSuccess(message: string, icon = "✅"): string {
  return `${icon} ${message}`;
}

/**
 * Format an error message
 */
export function formatError(message: string, icon = "❌"): string {
  return `${icon} ${maybeColorize(message, semantic.error)}`;
}

/**
 * Format a warning message
 */
export function formatWarning(message: string, icon = "⚠️"): string {
  return `${icon} ${maybeColorize(message, semantic.warning)}`;
}

/**
 * Format a database message (cyan color for all DB operations)
 */
export function formatDatabase(message: string, icon = "🗄️"): string {
  return `${icon} ${maybeColorize(message, semantic.database)}`;
}

/**
 * Format a task message (magenta color for all task operations)
 */
export function formatTask(message: string, icon = "⚡"): string {
  return `${icon} ${maybeColorize(message, semantic.task)}`;
}

/**
 * Format a vibe-sense message (bright red for analytics pipeline)
 */
export function formatSense(message: string, icon = "📊"): string {
  return `${icon} ${maybeColorize(message, semantic.sense)}`;
}

/**
 * Create a stateful Next.js output formatter.
 *
 * Behaviour:
 *  - "▲ Next.js …" header block (the banner + its indented sub-lines) → no timestamp
 *  - "✓ Starting…" and every line that follows → prepend [X.XXXs] / ISO timestamp
 *
 * Returns a function that accepts raw stdout/stderr chunks and returns the
 * formatted string ready for process.stdout.write().
 */
export function createNextjsFormatter(
  internalPort: number,
  publicPort: number,
): (chunk: string) => string {
  const isProduction = process.env["NODE_ENV"] === "production";

  const getTimePrefix = (): string => {
    if (isProduction) {
      return new Date().toISOString().slice(11, 23);
    }
    const startTime = Number(process.env["VIBE_START_TIME"]);
    return formatElapsed((Date.now() - startTime) / 1000);
  };

  let lastPrefix = "";

  return (chunk: string): string => {
    // Replace internal port with public port in Next.js output (proxy mode)
    const normalized =
      internalPort !== undefined &&
      publicPort !== undefined &&
      internalPort !== publicPort
        ? chunk.replaceAll(String(internalPort), String(publicPort))
        : chunk;
    const lines = normalized.split("\n");
    const out: string[] = [];

    for (const raw of lines) {
      if (raw.trim().length === 0) {
        out.push(raw);
        continue;
      }

      const prefix = `[${getTimePrefix()}] `;
      if (prefix === lastPrefix) {
        // Same timestamp as previous line - indent instead to visually group
        out.push(
          maybeColorize(`${" ".repeat(prefix.length)}${raw}`, semantic.nextjs),
        );
      } else {
        lastPrefix = prefix;
        out.push(
          `${maybeColorize(prefix.trimEnd(), semantic.highlight)} ${maybeColorize(raw, semantic.nextjs)}`,
        );
      }
    }

    return out.join("\n");
  };
}

/**
 * Format a Next.js output line (simple, no timestamp - use createNextjsFormatter for stateful timestamping)
 */
export function formatNextjs(line: string): string {
  return maybeColorize(line, semantic.nextjs);
}

/**
 * Format a progress message
 */
export function formatProgress(message: string, icon = "⏳"): string {
  return `${icon} ${maybeColorize(dim(message), semantic.muted)}`;
}

/**
 * Format a skip message
 */
export function formatSkip(message: string, icon = "⏭️"): string {
  return `${icon} ${maybeColorize(dim(message), semantic.muted)}`;
}

/**
 * Format a config/settings message
 */
export function formatConfig(
  key: string,
  value: string | number | boolean,
): string {
  const formattedKey = key ? `${key}` : "";
  const formattedValue = maybeColorize(bold(String(value)), semantic.success);
  return key ? `${formattedKey}: ${formattedValue}` : formattedValue;
}

/**
 * Format a duration (grey color)
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return maybeColorize(`${ms}ms`, semantic.muted);
  }
  const seconds = (ms / 1000).toFixed(2);
  return maybeColorize(`${seconds}s`, semantic.muted);
}

/**
 * Format a count
 */
export function formatCount(
  count: number,
  singular: string,
  plural?: string,
): string {
  const label = count === 1 ? singular : plural || `${singular}s`;
  return `${maybeColorize(bold(String(count)), semantic.highlight)} ${maybeColorize(label, semantic.muted)}`;
}

/**
 * Format a file path
 */
export function formatPath(path: string): string {
  return maybeColorize(path, semantic.muted);
}

/**
 * Format a separator line
 */
function formatSeparator(char = "─", length = 50): string {
  return maybeColorize(char.repeat(length), semantic.muted);
}

/**
 * Format a section header
 */
export function formatSection(title: string): string {
  return `\n${maybeColorize(bold(title), semantic.highlight)}\n${formatSeparator()}`;
}

/**
 * Format a command suggestion
 */
export function formatCommand(command: string): string {
  return maybeColorize(command, semantic.accent);
}

/**
 * Format a hint/help text (grey color, no dim)
 */
export function formatHint(text: string): string {
  return maybeColorize(text, semantic.muted);
}

/**
 * Format an action with a command (e.g., "Started PostgreSQL using: 'command'")
 */
export function formatActionCommand(action: string, command: string): string {
  return `${action} ${maybeColorize(`'${command}'`, semantic.muted)}`;
}

/**
 * Prefixes (inside leading square brackets) of the remote-connector log family.
 * Matched against the START of the message only - never scanned mid-line.
 */
const CONNECTOR_PREFIXES: readonly string[] = [
  "Connector",
  "WsConnection",
  "WsProvider",
  "runReverseWsPulse",
];

/** Prefixes of the reverse-proxy / upstream-health log family. */
const PROXY_PREFIXES: readonly string[] = ["Proxy"];

const LOG_PREFIX_RE = /^\s*\[([A-Za-z][\w-]*)\]/;

/**
 * Pick a console colour for a log message by its leading `[Prefix]` tag.
 * Returns undefined when the message has no dedicated category colour.
 */
export function getLogCategoryColor(message: string): string | undefined {
  const match = LOG_PREFIX_RE.exec(message);
  const tag = match?.[1] ?? "";
  if (CONNECTOR_PREFIXES.includes(tag)) {
    return semantic.connector;
  }
  if (PROXY_PREFIXES.includes(tag)) {
    return semantic.proxy;
  }
  return undefined;
}

/**
 * True when a message's metadata should render as compact `key=value` pairs
 * (connector + proxy families) rather than the generic indented pretty-printer.
 */
export function usesCompactMetadata(message: string): boolean {
  return getLogCategoryColor(message) !== undefined;
}

/**
 * Colourize a console log message by category (console only, never the file log).
 * Categorised lines get a bold `[Tag]` followed by the message in the same hue.
 */
export function colorizeLogMessage(message: string): string {
  const color = getLogCategoryColor(message);
  if (!color) {
    return message;
  }
  const match = LOG_PREFIX_RE.exec(message);
  if (match) {
    const tagLen = match[0].length;
    const tag = message.slice(0, tagLen).trimStart();
    const lead = message.slice(0, tagLen - tag.length);
    return `${lead}${maybeColorize(tag, `${color}${colors.bold}`)}${maybeColorize(message.slice(tagLen), color)}`;
  }
  return maybeColorize(message, color);
}

function connectorValue(v: LoggerMetadata): string {
  if (v === null || v === undefined) {
    return String(v);
  }
  if (typeof v === "string") {
    return /[\s,[\]{}]/.test(v) ? JSON.stringify(v) : v;
  }
  if (Array.isArray(v)) {
    return `[${v.map((x) => connectorValue(x)).join(", ")}]`;
  }
  if (typeof v === "object" && !(v instanceof Date) && !(v instanceof Error)) {
    return `{ ${Object.entries(v)
      .map(([k, x]) => `${k}=${connectorValue(x)}`)
      .join(" ")} }`;
  }
  return v instanceof Date ? v.toISOString() : String(v);
}

/**
 * Compact `key=value` rendering for connector metadata: keys dim, values plain,
 * one line when it fits. Falls back to the generic pretty printer when wide.
 */
export function formatConnectorMetadata(value: LoggerMetadata): string {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value instanceof Date ||
    value instanceof Error
  ) {
    return formatMetadata(value);
  }
  const pairs = Object.entries(value).map(
    ([k, v]) => [k, connectorValue(v)] as const,
  );
  const plain = pairs.map(([k, v]) => `${k}=${v}`).join("  ");
  if (plain.length > 140) {
    return formatMetadata(value);
  }
  return pairs
    .map(([k, v]) => `${maybeColorize(`${k}=`, semantic.muted)}${v}`)
    .join("  ");
}

/** Colourize an HTTP request line (GET /path 200 in 12ms). */
export function formatHttpRequest(line: string): string {
  return maybeColorize(line, semantic.webServer);
}

const PRETTY_INLINE_MAX = 100;
const PRETTY_MAX_DEPTH = 6;
const PRETTY_INDENT = "  ";

function prettyKey(key: string): string {
  return maybeColorize(`${key}:`, semantic.muted);
}

function prettyValue(
  value: LoggerMetadata,
  depth: number,
  seen: Set<LoggerMetadata>,
): { inline: string; multi: string[] | null } {
  if (value === null || value === undefined) {
    return { inline: String(value), multi: null };
  }
  if (typeof value === "string") {
    return { inline: JSON.stringify(value), multi: null };
  }
  if (typeof value !== "object") {
    return { inline: String(value), multi: null };
  }
  if (value instanceof Date) {
    return { inline: value.toISOString(), multi: null };
  }
  if (value instanceof Error) {
    return { inline: `${value.name}: ${value.message}`, multi: null };
  }
  if (seen.has(value) || depth >= PRETTY_MAX_DEPTH) {
    return { inline: seen.has(value) ? "[Circular]" : "[…]", multi: null };
  }
  seen.add(value);
  const entries: Array<
    [string | null, { inline: string; multi: string[] | null }]
  > = Array.isArray(value)
    ? value.map((v): [null, ReturnType<typeof prettyValue>] => [
        null,
        prettyValue(v, depth + 1, seen),
      ])
    : Object.entries(value).map(
        ([k, v]): [string, ReturnType<typeof prettyValue>] => [
          k,
          prettyValue(v, depth + 1, seen),
        ],
      );
  seen.delete(value);

  const open = Array.isArray(value) ? "[" : "{";
  const close = Array.isArray(value) ? "]" : "}";
  if (entries.length === 0) {
    return { inline: `${open}${close}`, multi: null };
  }
  const parts = entries.map(([k, v]) =>
    k === null ? v.inline : `${prettyKey(k)} ${v.inline}`,
  );
  // eslint-disable-next-line no-control-regex
  const plainLen = parts.join(", ").replace(/\u001B\[[0-9;]*m/g, "").length;
  const anyMulti = entries.some(([, v]) => v.multi !== null);
  const inline = `${open}${parts.join(", ")}${close}`;
  if (!anyMulti && plainLen <= PRETTY_INLINE_MAX) {
    return { inline: `${open} ${parts.join(", ")} ${close}`, multi: null };
  }
  const lines = entries.map(([k, v]) => {
    const body = v.multi ? v.multi.join("\n") : v.inline;
    return `${PRETTY_INDENT}${k === null ? "" : `${prettyKey(k)} `}${body.split("\n").join(`\n${PRETTY_INDENT}`)}`;
  });
  const multi = [open, ...lines.map((l) => l), close];
  return { inline, multi };
}

/**
 * Pretty-print a structured metadata value for the terminal.
 * Small values collapse onto one line; large ones are indented with dim keys.
 * Console only - file logs keep full structured JSON.
 */
export function formatMetadata(value: LoggerMetadata): string {
  const result = prettyValue(value, 0, new Set());
  return result.multi ? result.multi.join("\n") : result.inline;
}
