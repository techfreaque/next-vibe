/**
 * Code Output Widget Shared Logic
 */

/**
 * Split code into lines for rendering
 */
export function splitCodeIntoLines(code: string): string[] {
  return code.split("\n");
}

/**
 * Check if a line should be highlighted
 */
export function isLineHighlighted(
  lineNumber: number,
  highlightLines: number[],
): boolean {
  return highlightLines.includes(lineNumber);
}
