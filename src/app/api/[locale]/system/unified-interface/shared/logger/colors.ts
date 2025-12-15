/**
 * ANSI Color Codes for Terminal Output
 * Provides consistent, beautiful colors for CLI logging
 */

/**
 * ANSI color codes
 */
export const colors = {
  // Reset
  reset: "\u001B[0m",
  
  // Text colors
  black: "\u001B[30m",
  red: "\u001B[31m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  blue: "\u001B[34m",
  magenta: "\u001B[35m",
  cyan: "\u001B[36m",
  white: "\u001B[37m",
  gray: "\u001B[90m",
  
  // Bright colors
  brightRed: "\u001B[91m",
  brightGreen: "\u001B[92m",
  brightYellow: "\u001B[93m",
  brightBlue: "\u001B[94m",
  brightMagenta: "\u001B[95m",
  brightCyan: "\u001B[96m",
  brightWhite: "\u001B[97m",
  
  // Text styles
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  italic: "\u001B[3m",
  underline: "\u001B[4m",
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

