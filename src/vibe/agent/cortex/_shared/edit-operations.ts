import "server-only";

/**
 * Shared edit operations for Cortex file editing.
 * Used by both DB-backed files and virtual mount files.
 */

/**
 * Apply find-and-replace on content string.
 * Replaces ALL occurrences of `find` with `replace`.
 */
export function applyFindReplace(
  content: string,
  find: string,
  replace: string,
): { content: string; replacements: number } {
  const parts = content.split(find);
  const replacements = parts.length - 1;
  return {
    content: parts.join(replace),
    replacements,
  };
}

/**
 * Replace a range of lines (1-indexed, inclusive) with new content.
 * Returns the modified content string.
 */
export function applyLineReplace(
  content: string,
  startLine: number,
  endLine: number,
  newContent: string,
): string {
  const lines = content.split("\n");
  const before = lines.slice(0, startLine - 1);
  const after = lines.slice(endLine);
  return [...before, newContent, ...after].join("\n");
}
