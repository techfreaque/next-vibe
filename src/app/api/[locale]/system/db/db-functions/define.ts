/**
 * DB Functions — Definition with Drizzle Query Compilation
 *
 * `defineDbFunction()` creates type-safe PostgreSQL functions where:
 * - **Queries** are written in Drizzle (type-checked against db.ts schemas)
 * - **Logic** is plain JS that orchestrates query results
 * - **Compilation** happens at deploy time: Drizzle → SQL → embedded in PL/v8
 * - **Execution** is a single typed `.call()` from repository.ts
 *
 * @example
 * ```typescript
 * // credits/db-functions.ts
 * export const getBalance = defineDbFunction({
 *   name: "credits_get_balance",
 *   tables: [creditWallets],
 *   params: { p_user_id: "uuid" } as const,
 *   returns: { balance: "numeric" } as const,
 *   queries: (p) => ({
 *     wallet: db.select({ balance: creditWallets.balance })
 *       .from(creditWallets)
 *       .where(eq(creditWallets.userId, p.p_user_id)),
 *   }),
 *   logic: `
 *     var rows = __q.wallet();
 *     if (rows.length === 0) return { balance: 0 };
 *     return { balance: rows[0].balance };
 *   `,
 * });
 *
 * // credits/repository.ts
 * const result = await getBalance.call({ p_user_id: userId }, logger);
 * // result: { balance: number }
 * ```
 */

import "server-only";

import { getTableName, sql } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db/index";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CompiledQuery, PlaceholderParam, StaticParam } from "./context";
import { isPlaceholder } from "./context";
import type { InferRecord, PgType } from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Placeholder proxy — passed to the `queries` factory so Drizzle gets sql.placeholder() values */
type PlaceholderProxy<TParams extends Record<string, PgType>> = {
  [K in keyof TParams]: ReturnType<typeof sql.placeholder>;
};

/** A Drizzle query builder that has .toSQL() */
interface ToSqlable {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Drizzle's .toSQL() returns unknown[] params
  toSQL(): { sql: string; params: unknown[] };
}

/**
 * Definition input for defineDbFunction().
 */
export interface DbFunctionDef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle's PgTableWithColumns requires TableConfig which uses any internally
  // oxlint-disable-next-line no-explicit-any
  TTables extends PgTableWithColumns<any>[],
  TParams extends Record<string, PgType>,
  TReturn extends Record<string, PgType>,
  TQueries extends Record<string, ToSqlable>,
> {
  /** SQL function name (e.g. "credits_deduct") */
  name: string;

  /** Drizzle table references this function is allowed to touch */
  tables: TTables;

  /** Parameter definitions — becomes SQL signature + TS call-site type */
  params: TParams;

  /** Return type — becomes SQL RETURNS + TS result type */
  returns: TReturn;

  /** Function volatility (default: VOLATILE) */
  volatility?: "VOLATILE" | "STABLE" | "IMMUTABLE";

  /**
   * Query definitions using Drizzle builders.
   * Receives a proxy object where each param key returns sql.placeholder().
   * These queries are compiled to SQL at deploy time, NOT executed in Node.
   *
   * @example
   * queries: (p) => ({
   *   wallets: db.select().from(creditWallets)
   *     .where(eq(creditWallets.userId, p.p_user_id))
   *     .for("update"),
   * })
   */
  queries: (p: PlaceholderProxy<TParams>) => TQueries;

  /**
   * JavaScript logic that runs inside PostgreSQL's V8 engine.
   * Written as a string — this is the runtime code.
   *
   * Available in scope:
   * - `__q.queryName(optionalExtraParams)` — execute a compiled query, returns row array
   * - All function params as local variables (p_user_id, p_amount, etc.)
   * - `plv8.execute(sql, params)` — escape hatch for dynamic SQL
   * - `plv8.elog(NOTICE, msg)` — logging
   *
   * Must return an object matching the `returns` declaration.
   */
  logic: string;
}

/**
 * Returned by defineDbFunction(). Provides:
 * - `.call()` for type-safe execution from repository.ts
 * - `.toSQL()` for deployment via CREATE OR REPLACE FUNCTION
 */
export interface DbFunction<
  TParams extends Record<string, PgType>,
  TReturn extends Record<string, PgType>,
> {
  readonly name: string;
  readonly tableNames: readonly string[];

  call(
    params: InferRecord<TParams>,
    logger: EndpointLogger,
  ): Promise<InferRecord<TReturn>>;

  toSQL(): string;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Define a type-safe database function with Drizzle-compiled queries.
 */
export function defineDbFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle's PgTableWithColumns requires TableConfig which uses any internally
  // oxlint-disable-next-line no-explicit-any
  TTables extends PgTableWithColumns<any>[],
  TParams extends Record<string, PgType>,
  TReturn extends Record<string, PgType>,
  TQueries extends Record<string, ToSqlable>,
>(
  def: DbFunctionDef<TTables, TParams, TReturn, TQueries>,
): DbFunction<TParams, TReturn> {
  const paramEntries = Object.entries(def.params) as [string, PgType][];
  const returnEntries = Object.entries(def.returns) as [string, PgType][];

  // Extract SQL table names from Drizzle table objects
  const tableNames = def.tables.map((t) => getTableName(t));

  // Build placeholder proxy: { p_user_id: sql.placeholder("p_user_id"), ... }
  const placeholderProxy = Object.fromEntries(
    paramEntries.map(([name]) => [name, sql.placeholder(name)]),
  ) as PlaceholderProxy<TParams>;

  // Compile all queries at definition time
  const queryBuilders = def.queries(placeholderProxy);
  const compiledQueries: Record<string, CompiledQuery> = {};
  for (const [queryName, builder] of Object.entries(queryBuilders)) {
    const compiled = builder.toSQL();
    compiledQueries[queryName] = {
      sql: compiled.sql,
      params: compiled.params as readonly (PlaceholderParam | StaticParam)[],
    };
  }

  return {
    name: def.name,
    tableNames,

    async call(params, logger) {
      try {
        // Build: SELECT * FROM fn_name($1::type, $2::type, ...)
        const castParts = paramEntries.map(
          ([, type], i) => `$${String(i + 1)}::${type}`,
        );
        const values = paramEntries.map(
          ([key]) =>
            params[key as keyof typeof params] as
              | string
              | number
              | boolean
              | null
              | undefined,
        );

        const queryText = `SELECT * FROM ${def.name}(${castParts.join(", ")})`;

        // Inline values into sql.raw() — Drizzle's sql.raw doesn't support $N params
        const inlinedSql = inlineParams(queryText, values);
        const result = await db.execute(sql.raw(inlinedSql));

        const rows = result.rows as Record<
          string,
          string | number | boolean | null
        >[];
        if (rows.length === 0) {
          logger.error(`DB function ${def.name} returned no rows`);
          return buildDefaults(returnEntries) as InferRecord<TReturn>;
        }

        return mapRow(rows[0], returnEntries) as InferRecord<TReturn>;
      } catch (error) {
        logger.error(`DB function ${def.name} failed`, parseError(error));
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- DB function wrapper must propagate DB errors
        throw error;
      }
    },

    toSQL() {
      // SQL parameter list
      const sqlParams = paramEntries
        .map(([name, type]) => `${name} ${type}`)
        .join(", ");

      // SQL return type
      let sqlReturn: string;
      if (returnEntries.length === 1 && returnEntries[0]) {
        sqlReturn = returnEntries[0][1];
      } else {
        const cols = returnEntries
          .map(([name, type]) => `${name} ${type}`)
          .join(", ");
        sqlReturn = `TABLE(${cols})`;
      }

      // Generate the PL/v8 body with compiled queries + user logic
      const body = generateBody(compiledQueries, paramEntries, def.logic);

      const volatility = def.volatility ?? "VOLATILE";

      return [
        `CREATE OR REPLACE FUNCTION ${def.name}(${sqlParams})`,
        `RETURNS ${sqlReturn}`,
        `LANGUAGE plv8`,
        volatility,
        `AS $plv8$`,
        body,
        `$plv8$;`,
      ].join("\n");
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Inline parameter values into a SQL string for sql.raw() */
function inlineParams(
  queryText: string,
  values: (string | number | boolean | null | undefined)[],
): string {
  return queryText.replace(/\$(\d+)::\w+/g, (...args) => {
    const idx = args[1] as string;
    const value = values[Number(idx) - 1];
    if (value === null || value === undefined) {
      return "NULL";
    }
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }
    return String(value);
  });
}

/** Build default return values (null/0/false) for empty results */
function buildDefaults(
  returnEntries: [string, PgType][],
): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    returnEntries.map(([key, type]) => {
      if (type === "boolean") {
        return [key, false];
      }
      if (type === "numeric" || type === "integer" || type === "bigint") {
        return [key, 0];
      }
      return [key, null];
    }),
  );
}

/** Map a raw PG result row to typed values */
function mapRow(
  row: Record<string, string | number | boolean | null> | undefined,
  returnEntries: [string, PgType][],
): Record<string, string | number | boolean | null> {
  if (!row) {
    return buildDefaults(returnEntries);
  }
  return Object.fromEntries(
    returnEntries.map(([key, type]) => {
      const raw = row[key];
      if (raw === null || raw === undefined) {
        return [key, null];
      }
      if (
        (type === "numeric" || type === "integer" || type === "bigint") &&
        typeof raw === "string"
      ) {
        return [key, Number(raw)];
      }
      return [key, raw];
    }),
  );
}

/**
 * Generate the PL/v8 function body.
 *
 * Embeds compiled Drizzle queries as a `__q` object where each key is a function
 * that calls plv8.execute() with the pre-compiled SQL. Named placeholders are
 * resolved from the function params at runtime.
 */
function generateBody(
  compiledQueries: Record<string, CompiledQuery>,
  paramEntries: [string, PgType][],
  userLogic: string,
): string {
  const paramNames = paramEntries.map(([name]) => name);

  // Build __q object: { queryName: function(extra) { return plv8.execute(sql, params); }, ... }
  const queryFunctions: string[] = [];
  for (const [queryName, compiled] of Object.entries(compiledQueries)) {
    const resolvedParams = compiled.params.map(
      (p: PlaceholderParam | StaticParam) => {
        if (isPlaceholder(p)) {
          // Named placeholder → resolve from function params or extra params
          if (paramNames.includes(p.name)) {
            return p.name; // direct function param reference
          }
          // Runtime param passed via extra arg
          return `(extra && extra["${p.name}"] !== undefined ? extra["${p.name}"] : null)`;
        }
        // Static value → inline as literal
        if (typeof p === "string") {
          return `"${p.replace(/"/g, '\\"')}"`;
        }
        if (p === null) {
          return "null";
        }
        return String(p);
      },
    );

    const paramsArray = `[${resolvedParams.join(", ")}]`;
    const escapedSql = compiled.sql.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    queryFunctions.push(
      `  ${queryName}: function(extra) { return plv8.execute("${escapedSql}", ${paramsArray}); }`,
    );
  }

  return `
// --- Compiled Drizzle queries (generated at deploy time) ---
var __q = {
${queryFunctions.join(",\n")}
};

// --- User logic ---
${userLogic}
`;
}
