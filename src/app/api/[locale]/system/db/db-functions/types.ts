/**
 * DB Functions — Type System
 *
 * Maps PostgreSQL types to TypeScript for type-safe database function definitions.
 * Used by defineDbFunction() to infer SQL signatures and TS call-site types.
 */

/**
 * PostgreSQL → TypeScript type mapping.
 * Nullable PG types (uuid, text) map to `T | null`.
 */
export interface PgToTs {
  uuid: string | null;
  text: string | null;
  numeric: number;
  boolean: boolean;
  integer: number;
  bigint: number;
  jsonb: string; // serialized JSON — use JSON.parse() inside function body
  timestamp: string;
  void: void;
}

/** Valid PG type string literal */
export type PgType = keyof PgToTs;

/** Infer TS types from a record of PG type strings */
export type InferRecord<R extends Record<string, PgType>> = {
  [K in keyof R]: PgToTs[R[K]];
};
