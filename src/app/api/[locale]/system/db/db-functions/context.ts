/**
 * DB Functions — Compiled Query Types
 *
 * Types for the intermediate format between Drizzle query builders
 * and the final function body. Used during deploy-time compilation.
 */

import "server-only";

// ---------------------------------------------------------------------------
// Compiled query representation
// ---------------------------------------------------------------------------

/** A named placeholder parameter from sql.placeholder() */
export interface PlaceholderParam {
  readonly name: string;
}

/** A static (literal) parameter value */
export type StaticParam = string | number | boolean | null;

/** Compiled query — SQL string + ordered parameter list */
export interface CompiledQuery {
  readonly sql: string;
  readonly params: readonly (PlaceholderParam | StaticParam)[];
}

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------

/** Check if a compiled param is a named placeholder (vs. a static value) */
export function isPlaceholder(
  param: PlaceholderParam | StaticParam,
): param is PlaceholderParam {
  return (
    typeof param === "object" &&
    param !== null &&
    "name" in param &&
    typeof param.name === "string"
  );
}
