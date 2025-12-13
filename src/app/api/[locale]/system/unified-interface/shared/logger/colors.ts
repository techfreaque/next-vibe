/**
 * ANSI Color Codes for Terminal Output
 * Provides consistent, beautiful colors for CLI logging
 */

/**
 * ANSI color codes
 */
export const colors = {
  // Reset
  reset: "\x1b[0m",
  
  // Text colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  
  // Bright colors
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
  
  // Text styles
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
} as const;

/**
 * Semantic color helpers for consistent styling
 */
export const semantic = {
  // Status colors
  success: colors.green,
  error: colors.red,
  warning: colors.yellow,
  info: colors.cyan,
  debug: colors.gray,

  // Component colors
  server: colors.magenta,
  database: colors.brightCyan,
  task: colors.brightMagenta,
  generator: colors.magenta,

  // Accent colors
  highlight: colors.white,
  muted: colors.gray,
  accent: colors.cyan,
} as const;

/**
 * Format a message with color
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${colors.reset}`;
}

/**
 * Format a message with bold
 */
export function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

/**
 * Format a message with dim
 */
export function dim(text: string): string {
  return `${colors.dim}${text}${colors.reset}`;
}

/**
 * Combine multiple styles
 */
export function styled(text: string, ...styles: string[]): string {
  return `${styles.join("")}${text}${colors.reset}`;
}

/**
 * Check if colors should be disabled (e.g., in CI or when piped)
 */
export function shouldUseColors(): boolean {
  // Disable colors if NO_COLOR env var is set
  if (process.env.NO_COLOR) {
    return false;
  }
  
  // Disable colors if not in a TTY
  if (!process.stdout.isTTY) {
    return false;
  }
  
  // Enable colors by default in terminal
  return true;
}

/**
 * Conditionally apply color based on environment
 */
export function maybeColorize(text: string, color: string): string {
  return shouldUseColors() ? colorize(text, color) : text;
}

