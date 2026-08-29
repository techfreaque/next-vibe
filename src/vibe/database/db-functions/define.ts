/**
 * DB Functions - Definition with Drizzle Query Compilation
 *
 * `defineDbFunction()` creates type-safe PostgreSQL functions where:
 * - **Queries** are written in Drizzle (type-checked against db.ts schemas)
 * - **Logic** is a typed TypeScript function - full IDE support, no raw strings
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
 *   logic: (q, { p_user_id }) => {
 *     // q.wallet() is typed: { balance: number | string }[]
 *     const rows = q.wallet();
 *     if (rows.length === 0) return { balance: 0 };
 *     return { balance: Number(rows[0].balance) };
 *   },
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
import type { QueryResultRow } from "pg";

import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import { db, isPglite, serialisePgliteAccess } from "..";
import { pool } from "../client";
import type { CompiledQuery, PlaceholderParam, StaticParam } from "./context";
import { isPlaceholder } from "./context";
import type {
  InferRecord,
  PgType,
  QueryProxy,
  TypedQueryBuilder,
} from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Placeholder proxy - passed to the `queries` factory so Drizzle gets sql.placeholder() values */
type PlaceholderProxy<TParams extends Record<string, PgType>> = {
  [K in keyof TParams]: ReturnType<typeof sql.placeholder>;
};

/**
 * Definition input for defineDbFunction().
 */
interface DbFunctionDef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle's PgTableWithColumns requires TableConfig which uses any internally
  // oxlint-disable-next-line no-explicit-any
  TTables extends PgTableWithColumns<any>[],
  TParams extends Record<string, PgType>,
  TReturn extends Record<string, PgType>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- query result types are inferred per-query
  // oxlint-disable-next-line no-explicit-any
  TQueries extends Record<string, TypedQueryBuilder<any>>,
> {
  /** SQL function name (e.g. "credits_deduct") */
  name: string;

  /** Drizzle table references this function is allowed to touch */
  tables: TTables;

  /** Parameter definitions - becomes SQL signature + TS call-site type */
  params: TParams;

  /** Return type - becomes SQL RETURNS + TS result type */
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
   * Typed logic function - runs inside PostgreSQL's V8 engine.
   *
   * Receives:
   * - `q` - typed query proxy: `q.wallets()` returns typed row arrays
   * - `params` - typed function parameters
   *
   * Must return an object matching the `returns` declaration.
   *
   * Available globals (PL/v8 runtime):
   * - `plv8.execute(sql, params)` - raw SQL escape hatch
   * - `plv8.elog(NOTICE, msg)` - logging
   *
   * At deploy time this function is serialized via .toString() and embedded
   * into the PL/v8 function body. The `q` param becomes `__q` at runtime.
   *
   * @example
   * logic: (q, { p_user_id, p_amount }) => {
   *   const wallets = q.wallets();  // typed: CreditWallet[]
   *   if (wallets.length === 0) return { success: false, deducted: 0 };
   *   // ...
   *   return { success: true, deducted: p_amount };
   * }
   */
  logic: (
    q: QueryProxy<TQueries>,
    params: InferRecord<TParams>,
  ) => InferRecord<TReturn>;
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
// PGlite in-process execution
// ---------------------------------------------------------------------------

/** snake_case → camelCase mapper for PGlite query results (mirrors Drizzle's field naming) */
function snakeToCamel(
  row: Record<string, string | number | boolean | null>,
): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const k of Object.keys(row)) {
    const camel = k
      .split("_")
      .map((part, i) =>
        i === 0 ? part : part[0]?.toUpperCase() + part.slice(1),
      )
      .join("");
    out[camel] = row[k] as string | number | boolean | null;
  }
  return out;
}

/**
 * Execute a db function's logic directly in Node.js when running against PGlite.
 *
 * Strategy:
 * - Build async versions of every compiled query that run via pgliteClient.query()
 * - Provide a plv8 shim whose .execute() runs pgliteClient.query() (async, awaited)
 * - Wrap the logic body in an AsyncFunction so await works inside it
 * - The logic body uses `q.name()` and `plv8.execute()` — we prefix those calls
 *   with `await` via a simple text transform so the async wrapper works
 */
async function callInPglite(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- logic has complex generic signature
  // oxlint-disable-next-line no-explicit-any
  logic: (...args: any[]) => any,
  compiledQueries: Record<string, CompiledQuery>,
  paramEntries: [string, PgType][],
  returnEntries: [string, PgType][],
  params: Record<string, string | number | boolean | null>,
  logger: EndpointLogger,
): Promise<Record<string, string | number | boolean | null>> {
  // Always go through the loopback pool, never the raw pgliteClient handle —
  // pgliteClient is only ever non-null in the ONE process that won the
  // port-claim race (see client.ts). Any other process, or a separate Vite
  // SSR module instance within the same dev server, would otherwise crash on
  // a null pgliteClient. The pool works uniformly everywhere, always.
  const client = pool!;

  // Build async query functions — resolve placeholders from params
  const asyncQ: Record<
    string,
    (
      extra?: Record<string, string | number | boolean | null>,
    ) => Promise<Record<string, string | number | boolean | null>[]>
  > = {};
  for (const [queryName, compiled] of Object.entries(compiledQueries)) {
    asyncQ[queryName] = async (
      extra?: Record<string, string | number | boolean | null>,
    ): Promise<Record<string, string | number | boolean | null>[]> => {
      const values: (string | number | boolean | null)[] = compiled.params.map(
        (p) => {
          if (isPlaceholder(p)) {
            const fromParams = params[p.name];
            if (fromParams !== undefined) {
              return fromParams ?? null;
            }
            return extra?.[p.name] ?? null;
          }
          return p;
        },
      );
      // PGlite uses $1, $2 positional params — Drizzle emits those already
      const result = await client.query<
        Record<string, string | number | boolean | null>
      >(compiled.sql, values);
      return result.rows.map(snakeToCamel);
    };
  }

  // plv8 shim — execute() runs raw SQL via the loopback pool
  const plv8Shim = {
    async execute<
      TRow extends QueryResultRow = Record<
        string,
        string | number | boolean | null
      >,
    >(
      querySql: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors plv8.execute signature
      // oxlint-disable-next-line no-explicit-any
      queryParams?: any[],
    ): Promise<TRow[]> {
      const result = await client.query<TRow>(querySql, queryParams);
      return result.rows;
    },
    // eslint-disable-next-line no-unused-vars -- _level is PL/v8 log severity (NOTICE/WARNING); not mapped to Node log levels
    elog(_level: number, msg: string): void {
      logger.debug(`[plv8.elog] ${msg}`);
    },
    quote_literal(value: string): string {
      return `'${value.replaceAll("'", "''")}'`;
    },
    quote_ident(value: string): string {
      return `"${value.replaceAll('"', '""')}"`;
    },
  };

  // Extract and transform logic body for async execution
  // Replace q.name() → await __q.name() and plv8.execute() → await plv8.execute()
  const logicBody = extractLogicBody(logic)
    .replaceAll(/\b__q\.(\w+)\s*\(/g, "await __q.$1(")
    .replaceAll(/\bplv8\.execute\s*\(/g, "await plv8.execute(");

  // Build params shim (for (q, params) style)
  const paramsShimEntries = paramEntries
    .map(([n]) => `"${n}": __params_raw["${n}"]`)
    .join(", ");

  // Also inject individual variable declarations so destructuring-style logic
  // bodies (q, { p_user_id }) can reference p_user_id directly, matching how
  // PL/v8 exposes function params as individual in-scope variables.
  const paramVarDecls = paramEntries
    .map(([n]) => `const ${n} = __params_raw["${n}"];`)
    .join(" ");

  const asyncBody = `
    const __params = { ${paramsShimEntries} };
    ${paramVarDecls}
    ${logicBody}
  `;

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- intentional: executes extracted logic body in async context for PGlite dev mode
    const fn = new Function(
      "__q",
      "plv8",
      "__params_raw",
      `return (async () => { ${asyncBody} })()`,
    );
    const result = await serialisePgliteAccess(async () => {
      return (await fn(asyncQ, plv8Shim, params)) as Record<
        string,
        string | number | boolean | null
      >;
    });
    return mapRow(result, returnEntries);
  } catch (error) {
    logger.error(`PGlite db function ${name} failed`, parseError(error));
    return buildDefaults(returnEntries);
  }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- query result types are inferred per-query
  // oxlint-disable-next-line no-explicit-any
  TQueries extends Record<string, TypedQueryBuilder<any>>,
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
    const compiled = (builder as TypedQueryBuilder<never[]>).toSQL();
    compiledQueries[queryName] = {
      sql: compiled.sql,
      params: compiled.params as readonly (PlaceholderParam | StaticParam)[],
    };
  }

  // Extract the raw logic body from the typed function
  const logicBody = extractLogicBody(def.logic);

  return {
    name: def.name,
    tableNames,

    async call(params, logger) {
      if (isPglite) {
        return callInPglite(
          def.name,
          def.logic,
          compiledQueries,
          paramEntries,
          returnEntries,
          // Object.entries/fromEntries erases the branded type → plain Record
          Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, v ?? null]),
          ),
          logger,
        ) as Promise<InferRecord<TReturn>>;
      }

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

        // Inline values into sql.raw() - Drizzle's sql.raw doesn't support $N params
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
        // eslint-disable-next-line restricted/restricted-syntax -- DB function wrapper must propagate DB errors
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

      // Generate the PL/v8 body with compiled queries + extracted logic
      const body = generateBody(compiledQueries, paramEntries, logicBody);

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
// Logic extraction
// ---------------------------------------------------------------------------

/**
 * Extract the body of the logic function for embedding in PL/v8.
 *
 * The logic function is defined as:
 *   (q, params) => { ... }         - arrow function
 *   function(q, params) { ... }    - function expression
 *
 * We serialize it with .toString(), then:
 * 1. Extract the body (everything between the outer braces)
 * 2. Replace the `q` param name with `__q` (the runtime variable name)
 * 3. Replace the `params` destructure with individual `var` declarations
 *    that read from PL/v8 function params (which are in scope as-is)
 *
 * The result is plain JS that runs correctly inside PL/v8.
 */
function extractLogicBody(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- logic function has complex generic signature
  // oxlint-disable-next-line no-explicit-any
  logicFn: (...args: any[]) => any,
): string {
  const src = logicFn.toString();

  // Find the function body `{...}`.
  // Arrow functions: find `=>` first, then `{` after it.
  // Regular functions: find `{` after the closing `)` of the param list.
  let bodyStart: number;
  const arrowIdx = src.indexOf("=>");
  if (arrowIdx !== -1) {
    // Arrow function: body starts at `{` after `=>`
    bodyStart = src.indexOf("{", arrowIdx);
  } else {
    // Regular function: skip past `function` keyword and param list
    const parenClose = src.indexOf(")");
    bodyStart = src.indexOf("{", parenClose);
  }
  const bodyEnd = src.lastIndexOf("}");

  if (bodyStart === -1 || bodyEnd === -1 || bodyEnd <= bodyStart) {
    // eslint-disable-next-line restricted/restricted-syntax -- framework error during deploy, not user error
    throw new Error(
      `defineDbFunction: logic must be a function with a block body. Got: ${src.slice(0, 100)}`,
    );
  }

  let body = src.slice(bodyStart + 1, bodyEnd);

  // Extract the first parameter name (the query proxy) from the function signature.
  // We look at the part before the body start.
  const signaturePart = src.slice(0, bodyStart);
  const qParamMatch = /\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/.exec(signaturePart);
  const qParamName = qParamMatch?.[1] ?? "q";

  // Replace the query proxy param name with __q (the runtime variable).
  // Only replace `q.something` usages - not standalone `q` references.
  if (qParamName !== "__q" && qParamName !== "_") {
    body = body.replaceAll(
      new RegExp(`\\b${escapeRegex(qParamName)}\\.`, "g"),
      "__q.",
    );
  }

  // The second param is the params object. In PL/v8, function params are in scope
  // as individual variables (p_user_id, p_amount, etc.).
  //
  // If using destructuring `(q, { p_user_id })`: the body already uses `p_user_id`
  // directly - works perfectly with PL/v8's scope.
  //
  // If using named object `(q, params)`: the body uses `params.p_user_id` which
  // won't work. We inject a shim: `var params = __params;`
  const secondParamMatch = /\(\s*[^,]+,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/.exec(
    signaturePart,
  );
  const paramsParamName = secondParamMatch?.[1];
  if (paramsParamName && paramsParamName !== "_") {
    // Named params object - inject a shim using the __params object from generateBody
    body = `var ${paramsParamName} = __params;\n${body}`;
  }

  return body.trim();
}

/** Escape a string for use in a RegExp */
function escapeRegex(str: string): string {
  return str.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Inline parameter values into a SQL string for sql.raw() */
function inlineParams(
  queryText: string,
  values: (string | number | boolean | null | undefined)[],
): string {
  return queryText.replaceAll(/\$(\d+)::\w+/g, (...args) => {
    const idx = args[1] as string;
    const value = values[Number(idx) - 1];
    if (value === null || value === undefined) {
      return "NULL";
    }
    if (typeof value === "string") {
      return `'${value.replaceAll("'", "''")}'`;
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
 *
 * Also injects `__params` object for named-params-object compatibility.
 */
function generateBody(
  compiledQueries: Record<string, CompiledQuery>,
  paramEntries: [string, PgType][],
  logicBody: string,
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
          return `"${p.replaceAll('"', '\\"')}"`;
        }
        if (p === null) {
          return "null";
        }
        return String(p);
      },
    );

    const paramsArray = `[${resolvedParams.join(", ")}]`;
    const escapedSql = compiled.sql
      .replaceAll("\\", "\\\\")
      .replaceAll('"', '\\"')
      .replaceAll(/\r?\n/g, "\\n")
      .replaceAll("	", "\\t");

    // Drizzle generates snake_case column names in SQL, but the TypeScript
    // type uses camelCase (Drizzle's field names). Map snake_case → camelCase
    // so `q.latestFreeGrant()[0].createdAt` works at both type and runtime level.
    queryFunctions.push(
      `  ${queryName}: function(extra) { return plv8.execute("${escapedSql}", ${paramsArray}).map(__toCamel); }`,
    );
  }

  // Build __params shim for (q, params) style logic functions
  const paramsShimEntries = paramNames
    .map((name) => `  "${name}": ${name}`)
    .join(",\n");
  const paramsShim = `var __params = {\n${paramsShimEntries}\n};`;

  return `
// --- snake_case → camelCase mapper for Drizzle query results ---
// Drizzle compiles field names to snake_case SQL columns; PL/v8 returns snake_case.
// This maps results back to camelCase so q.*() results match TypeScript types.
function __toCamel(row) {
  var out = {};
  for (var k in row) {
    var camel = k.replace(/_([a-z])/g, function(_, c) { return c.toUpperCase(); });
    out[camel] = row[k];
  }
  return out;
}

// --- Compiled Drizzle queries (generated at deploy time) ---
var __q = {
${queryFunctions.join(",\n")}
};

// --- Params shim (for named params object access) ---
${paramsShim}

// --- User logic ---
${logicBody}
`;
}
