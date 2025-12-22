/**
 * Log Message Formatters
 * Provides consistent, beautiful formatting for different types of log messages
 */

import { bold, dim, maybeColorize, semantic } from "./colors";

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
 * Format an info message
 */
export function formatInfo(message: string, icon = "ℹ️"): string {
  return `${icon} ${maybeColorize(message, semantic.info)}`;
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
 * Format a generator message
 */
export function formatGenerator(message: string, icon = "⚙️"): string {
  return `${icon} ${maybeColorize(message, semantic.generator)}`;
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
 * Format a URL
 */
export function formatUrl(url: string): string {
  return maybeColorize(url, semantic.accent);
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
export function formatSeparator(char = "─", length = 50): string {
  return maybeColorize(char.repeat(length), semantic.muted);
}

/**
 * Format a section header
 */
export function formatSection(title: string): string {
  return `\n${maybeColorize(bold(title), semantic.highlight)}\n${formatSeparator()}`;
}

/**
 * Format a key-value pair
 */
export function formatKeyValue(
  key: string,
  value: string | number | boolean,
): string {
  return `${maybeColorize(key, semantic.muted)}: ${maybeColorize(bold(String(value)), semantic.highlight)}`;
}

/**
 * Format a list item
 */
export function formatListItem(item: string, icon = "•"): string {
  return `  ${maybeColorize(icon, semantic.muted)} ${item}`;
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
