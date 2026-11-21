import "server-only";

import { createHash } from "node:crypto";

import type { PoolClient, Query } from "pg";
import type { RowDescriptionMessage } from "pg-protocol/dist/messages";

import type { LoggerMetadata } from "../logger/types";

const QUERY_LIMIT = 256;
const DECODE_LIMIT = 48;
const MIN_DECODE_MS = 10;
const LARGE_BATCH_ROWS = 128;
const QUERY_LABEL_SCAN_LIMIT = 16_384;
const LOGGABLE_PAYLOAD_COLUMNS = new Set([
  "content",
  "error_message",
  "metadata",
  "search_vector",
]);
// Labels may include these application relations. Arbitrary identifiers,
// comments, literals, and bound parameters stay out of error logs.
const LOGGABLE_RELATIONS = new Set([
  "chat_messages",
  "chat_threads",
  "credit_packs",
  "credit_transactions",
  "credit_wallets",
  "cron_task_executions",
  "cron_tasks",
  "error_logs",
  "growth_visits",
  "lead_lead_links",
  "leads",
  "payment_invoices",
  "remote_connections",
  "sessions",
  "subscriptions",
  "user_lead_links",
  "users",
]);

interface QueryIdentity {
  queryName: string;
  caller: string | null;
}

interface PgResult {
  queryId: string;
  queryName: string;
  caller: string | null;
  relationOids: number[];
  columnCount: number;
  payloadColumns: string[];
  rowCount: number;
  complete: boolean;
}

interface DecodeBatch {
  result: PgResult;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  rows: number;
  packetBytes: number;
}

interface PgDecodeState {
  queries: Map<string, QueryIdentity>;
  batches: DecodeBatch[];
}

const observedClients = new WeakSet<PoolClient>();

declare global {
  var __vibePgDecodeDiagnostics: PgDecodeState | undefined;
}

export function enablePgResultDiagnostics(): void {
  globalThis.__vibePgDecodeDiagnostics ??= {
    queries: new Map(),
    batches: [],
  };
}

function queryId(sql: string): string {
  return createHash("sha256").update(sql).digest("hex").slice(0, 16);
}

function queryName(sql: string): string {
  const statement = sql
    .slice(0, QUERY_LABEL_SCAN_LIMIT)
    .replaceAll(
      /'(?:''|[^'])*'|--[^\n]*|\/\*[\s\S]*?\*\/|(\$(?:[a-z_][a-z_0-9]*)?\$)[\s\S]*?\1/gi,
      " ",
    );
  const operation =
    /^(select|with|insert|update|delete|values|show|explain)\b/i
      .exec(statement.trimStart())?.[1]
      ?.toUpperCase() ?? "OTHER";
  const tables = new Set<string>();
  for (const [, table] of statement.matchAll(
    /\b(?:from|join|update|into)\s+(?:"?public"?\.)?"?([a-z0-9_]+)"?/gi,
  )) {
    if (table && LOGGABLE_RELATIONS.has(table)) {
      tables.add(table);
    }
    if (tables.size === 4) {
      break;
    }
  }
  return [operation, ...tables].join(" ");
}

/** Capture the app call site when it is still present at Drizzle dispatch. */
export const pgDiagnosticQueryLogger = {
  logQuery(sql: string): void {
    const state = globalThis.__vibePgDecodeDiagnostics;
    if (!state) {
      return;
    }
    const id = queryId(sql);
    if (state.queries.has(id)) {
      return;
    }
    // Only repo-relative source locations survive. SQL and bind values never
    // enter the diagnostic catalog, even for unparameterized statements.
    const caller = new Error().stack
      ?.match(/(?:^|[/\s(])(src\/[a-z0-9_./[\]-]+\.tsx?:\d+:\d+)/gi)
      ?.map((match) => match.slice(match.indexOf("src/")))
      .find(
        (frame) =>
          !frame.startsWith("src/vibe/database/pg-result-diagnostics.ts:"),
      );
    state.queries.set(id, {
      queryName: queryName(sql),
      caller: caller ?? null,
    });
    if (state.queries.size > QUERY_LIMIT) {
      const oldest = state.queries.keys().next().value;
      if (oldest !== undefined) {
        state.queries.delete(oldest);
      }
    }
  },
};

/** The pinned pg driver exposes the running query to its own wire handlers. */
export function getActivePgQuery(client: PoolClient): Query | null | undefined {
  if (
    "_getActiveQuery" in client &&
    typeof client._getActiveQuery === "function"
  ) {
    return client._getActiveQuery.call(client);
  }
  return undefined;
}

/** Observe wire decoding without replacing pg's handlers or accessing result values. */
export function observePgResultDecoding(client: PoolClient): void {
  const state = globalThis.__vibePgDecodeDiagnostics;
  if (!state || observedClients.has(client)) {
    return;
  }
  observedClients.add(client);
  const { connection } = client;
  const { stream } = connection;
  let result: PgResult | undefined;
  let packetStartedAt = 0;
  let packetStartTick = 0;
  const resultRows = new Map<PgResult, number>();

  // The registered pg-protocol data listener parses and dispatches all of a
  // packet synchronously. Bracketing it measures parser work even when a
  // single very large field arrives as part of a small row count.
  stream.prependListener("data", () => {
    packetStartedAt = Date.now();
    packetStartTick = performance.now();
  });
  connection.on("rowDescription", (message: RowDescriptionMessage) => {
    const query = getActivePgQuery(client);
    if (!query || !("text" in query) || typeof query.text !== "string") {
      return;
    }
    const id = queryId(query.text);
    const entry = state.queries.get(id);
    result = {
      queryId: id,
      queryName: entry?.queryName ?? queryName(query.text),
      caller: entry?.caller ?? null,
      relationOids: [...new Set(message.fields.map((field) => field.tableID))]
        .filter((oid) => oid > 0)
        .slice(0, 8),
      columnCount: message.fields.length,
      payloadColumns: [
        ...new Set(
          message.fields
            .filter(
              (field) =>
                field.tableID > 0 && LOGGABLE_PAYLOAD_COLUMNS.has(field.name),
            )
            .map((field) => field.name),
        ),
      ],
      rowCount: 0,
      complete: false,
    };
  });
  connection.on("dataRow", () => {
    if (result) {
      result.rowCount++;
      resultRows.set(result, (resultRows.get(result) ?? 0) + 1);
    }
  });
  connection.on("commandComplete", () => {
    if (result) {
      result.complete = true;
      result = undefined;
    }
  });
  connection.on("readyForQuery", () => {
    result = undefined;
  });
  connection.on("errorMessage", () => {
    result = undefined;
  });
  stream.on("data", (packet: Buffer) => {
    if (resultRows.size === 0) {
      return;
    }
    const endedAt = Date.now();
    const durationMs = performance.now() - packetStartTick;
    for (const [decoded, rows] of resultRows) {
      if (durationMs >= MIN_DECODE_MS || rows >= LARGE_BATCH_ROWS) {
        state.batches.push({
          result: decoded,
          rows,
          startedAt: packetStartedAt,
          endedAt,
          durationMs,
          // A packet can span multiple results. Count its bytes only
          // when a single result contributed rows to this packet.
          packetBytes: resultRows.size === 1 ? packet.byteLength : 0,
        });
      }
    }
    resultRows.clear();
    if (state.batches.length > DECODE_LIMIT) {
      state.batches.splice(0, state.batches.length - DECODE_LIMIT);
    }
  });
}

/** The result may still be arriving. In that case rowCount is the count seen so far. */
export function summarizePgResultDecodes(
  startedAt: number,
  endedAt: number,
): LoggerMetadata[] | undefined {
  const matches = new Map<
    PgResult,
    { rowsInBatches: number; batchMs: number; decodedPacketBytes: number }
  >();
  for (const batch of globalThis.__vibePgDecodeDiagnostics?.batches ?? []) {
    if (batch.endedAt < startedAt || batch.startedAt > endedAt) {
      continue;
    }
    const summary = matches.get(batch.result) ?? {
      rowsInBatches: 0,
      batchMs: 0,
      decodedPacketBytes: 0,
    };
    summary.rowsInBatches += batch.rows;
    summary.batchMs += batch.durationMs;
    summary.decodedPacketBytes += batch.packetBytes;
    matches.set(batch.result, summary);
  }
  if (matches.size === 0) {
    return undefined;
  }
  return [...matches]
    .toSorted((a, b) => b[1].batchMs - a[1].batchMs)
    .slice(0, 4)
    .map(([result, summary]) => ({
      ...result,
      rowsInBatches: summary.rowsInBatches,
      decodedPacketBytes: summary.decodedPacketBytes,
      batchMs: Math.round(summary.batchMs),
    }));
}
