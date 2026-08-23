/**
 * Driver-compatibility SQL helpers.
 *
 * PGlite v0.5.x does not support JSONB ->> text extraction or pgvector <=>
 * operators. These helpers return the correct SQL fragment for the active
 * driver so business logic stays agnostic.
 */

import { sql } from "drizzle-orm";
import type { SQL, SQLWrapper } from "drizzle-orm";

import { isPglite } from "./client";

/**
 * Returns `(jsonb_col->>'key')::boolean` on real Postgres, or `false` on PGlite.
 * Use for JSONB boolean flags (e.g. metadata->>'isCompacting').
 */
export function jsonbBool(jsonbCol: SQLWrapper, key: string): SQL {
  if (isPglite) {
    return sql.raw("false");
  }
  return sql`(${jsonbCol}->>${key})::boolean`;
}

/**
 * True when the database supports pgvector and full JSONB operators.
 * Gate feature branches that have no PGlite-compatible fallback.
 */
export const supportsAdvancedSql = !isPglite;
