/**
 * DB Functions - Type System
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
  jsonb: string; // serialized JSON - use JSON.parse() inside function body
  timestamp: string;
  void: void;
}

/** Valid PG type string literal */
export type PgType = keyof PgToTs;

/** Infer TS types from a record of PG type strings */
export type InferRecord<R extends Record<string, PgType>> = {
  [K in keyof R]: PgToTs[R[K]];
};

/**
 * A Drizzle query builder that has .toSQL() and a typed `_` metadata object.
 * Drizzle exposes the result type via `builder._.result` - we use this for inference.
 */
export interface TypedQueryBuilder<TResult> {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Drizzle's .toSQL() returns unknown[] params
  toSQL(): { sql: string; params: unknown[] };
  /** Drizzle stores all HKT type params in `_` - `_.result` is the row array type */
  readonly _: { readonly result: TResult };
}

/**
 * Extract the result row type from a typed Drizzle query builder.
 * `db.select({...}).from(table)` has `_.result: Row[]` - we extract `Row`.
 */
export type InferQueryResult<TBuilder> =
  TBuilder extends TypedQueryBuilder<infer TResult>
    ? TResult extends readonly (infer TRow)[]
      ? TRow
      : TResult extends (infer TRow)[]
        ? TRow
        : TResult
    : Record<string, string | number | boolean | null>;

/**
 * The typed query proxy passed to the `logic` function at authoring time.
 * Each key is a function returning typed row arrays inferred from Drizzle's schema.
 *
 * At runtime (inside PL/v8) this is replaced by the compiled __q object
 * that calls plv8.execute() with pre-compiled SQL.
 */
export type QueryProxy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- query result types vary per builder
  // oxlint-disable-next-line no-explicit-any
  TQueries extends Record<string, TypedQueryBuilder<any>>,
> = {
  [K in keyof TQueries]: (
    extra?: Record<string, string | number | boolean | null>,
  ) => InferQueryResult<TQueries[K]>[];
};

/**
 * Type for the `plv8` global available inside PostgreSQL's V8 engine.
 * Declare this in your db-functions.ts file:
 *
 * @example
 * declare const plv8: Plv8Global;
 */
export interface Plv8Global {
  execute<TRow = Record<string, string | number | boolean | null>>(
    sql: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- plv8 accepts any[] for params
    // oxlint-disable-next-line no-explicit-any
    params?: any[],
  ): TRow[];
  elog(level: number, msg: string): void;
  quote_literal(value: string): string;
  quote_ident(value: string): string;
}
