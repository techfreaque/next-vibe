/**
 * One-off maintenance for the production primary. Run after both app nodes
 * use the sanitizer. The count uses a read-only connection and prints counts
 * only. Drain S2 before applying and watch replica/WireGuard health.
 *
 * In the deployed S1 container, with the existing DATABASE_URL:
 *   TELEMETRY_CLEANUP_DATABASE_URL="$DATABASE_URL" bun src/leads/tracking/scrub-stored-urls.ts --count
 *   TELEMETRY_CLEANUP_DATABASE_URL="$DATABASE_URL" bun src/leads/tracking/scrub-stored-urls.ts --apply
 *
 * Apply also counts first. Each batch commits independently. Rerun --count
 * to verify zero remaining and rerun --apply if a concurrent write was skipped.
 */
import { Client } from "pg";

import {
  sanitizeLeadUrlMetadata,
  sanitizeTelemetryUrl,
} from "../../vibe/core/utils/telemetry-url";
import {
  sanitizeLogText,
  scrubStoredLogValue,
} from "../../vibe/logger/telemetry-privacy";
import type { LoggerMetadata } from "../../vibe/logger/types";

const PAGE_SIZE = 1000;
const BATCH_SIZE = 50_000;
const BATCH_PAUSE_MS = 5000;
const LOCK_NAME = "scrub-stored-telemetry-urls";

type LeadMetadata = Record<string, string | number | boolean | null>;
interface StoredRow {
  id: string;
  metadata?: LeadMetadata | LoggerMetadata[] | null;
  first_landing_path?: string | null;
  last_landing_path?: string | null;
  message?: string;
  stack_trace?: string | null;
}

type Column = Exclude<keyof StoredRow, "id">;
type RowValues = Partial<Pick<StoredRow, Column>>;

interface Patch {
  id: string;
  before: RowValues;
  after: RowValues;
}

interface Target {
  table: "lead_engagements" | "leads" | "growth_journeys" | "error_logs";
  columns: readonly Column[];
}

interface CleanupDatabase {
  query<Row>(
    statement: string,
    args?: (string | number | null)[],
  ): Promise<{ rows: Row[] }>;
}

const TARGETS: readonly Target[] = [
  { table: "lead_engagements", columns: ["metadata"] },
  { table: "leads", columns: ["metadata"] },
  {
    table: "growth_journeys",
    columns: ["first_landing_path", "last_landing_path"],
  },
  { table: "error_logs", columns: ["metadata", "message", "stack_trace"] },
];

function scrubMetadata(metadata: StoredRow["metadata"]): StoredRow["metadata"] {
  if (!metadata) {
    return metadata;
  }
  if (!Array.isArray(metadata)) {
    return sanitizeLeadUrlMetadata(metadata);
  }
  return metadata.map((item) => scrubStoredLogValue(item));
}

function patchRow(target: Target, row: StoredRow): Patch | null {
  const before: RowValues = Object.fromEntries(
    target.columns.map((column) => [column, row[column]]),
  );
  const after: RowValues = {
    ...(target.columns.includes("metadata") && {
      metadata: scrubMetadata(row.metadata),
    }),
    ...(row.first_landing_path !== undefined && {
      first_landing_path: sanitizeTelemetryUrl(row.first_landing_path),
    }),
    ...(row.last_landing_path !== undefined && {
      last_landing_path: sanitizeTelemetryUrl(row.last_landing_path),
    }),
    ...(row.message !== undefined && { message: sanitizeLogText(row.message) }),
    ...(row.stack_trace !== undefined && {
      stack_trace:
        row.stack_trace === null ? null : sanitizeLogText(row.stack_trace),
    }),
  };
  const changed = target.columns.some(
    (column) =>
      JSON.stringify(before[column]) !== JSON.stringify(after[column]),
  );
  return changed ? { id: row.id, before, after } : null;
}

function valueSql(
  record: "before_value" | "after_value",
  column: Column,
): string {
  return column === "metadata"
    ? `nullif(patch.${record}->'${column}', 'null'::jsonb)`
    : `patch.${record}->>'${column}'`;
}

async function writePage(
  db: CleanupDatabase,
  target: Target,
  patches: Patch[],
): Promise<number> {
  if (patches.length === 0) {
    return 0;
  }
  const assignments = target.columns.map(
    (column) => `${column} = ${valueSql("after_value", column)}`,
  );
  const matches = target.columns.map(
    (column) =>
      `stored.${column} IS NOT DISTINCT FROM ${valueSql("before_value", column)}`,
  );
  const { rows } = await db.query<{ id: string }>(
    `UPDATE ${target.table} AS stored SET ${assignments.join(", ")}
     FROM jsonb_to_recordset($1::jsonb) AS patch(id uuid, before_value jsonb, after_value jsonb)
     WHERE stored.id = patch.id AND ${matches.join(" AND ")}
     RETURNING stored.id`,
    [
      JSON.stringify(
        patches.map(({ id, before, after }) => ({
          id,
          before_value: before,
          after_value: after,
        })),
      ),
    ],
  );
  return rows.length;
}

async function scanTarget(
  db: CleanupDatabase,
  target: Target,
  apply: boolean,
  pauseMs: number,
): Promise<{ table: Target["table"]; affected: number; updated: number }> {
  const result = { table: target.table, affected: 0, updated: 0 };
  const cursor: { id: string | null; done: boolean } = {
    id: null,
    done: false,
  };
  while (!cursor.done) {
    await db.query(apply ? "BEGIN" : "BEGIN READ ONLY");
    try {
      for (let scanned = 0; scanned < BATCH_SIZE; scanned += PAGE_SIZE) {
        const { rows } = await db.query<StoredRow>(
          `SELECT id, ${target.columns.join(", ")} FROM ${target.table}
           ${cursor.id === null ? "" : "WHERE id > $2::uuid"} ORDER BY id LIMIT $1`,
          cursor.id === null ? [PAGE_SIZE] : [PAGE_SIZE, cursor.id],
        );
        const patches = rows.flatMap((row) => {
          const patch = patchRow(target, row);
          return patch ? [patch] : [];
        });
        result.affected += patches.length;
        if (apply) {
          result.updated += await writePage(db, target, patches);
        }
        cursor.id = rows.at(-1)?.id ?? cursor.id;
        if (rows.length < PAGE_SIZE) {
          cursor.done = true;
          break;
        }
      }
      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      return Promise.reject(error);
    }
    if (apply) {
      await Bun.sleep(pauseMs);
    }
  }
  return result;
}

export async function scrubStoredTelemetryUrls(
  db: CleanupDatabase,
  apply: boolean,
  pauseMs = BATCH_PAUSE_MS,
): Promise<Awaited<ReturnType<typeof scanTarget>>[]> {
  const results: Awaited<ReturnType<typeof scanTarget>>[] = [];
  for (const target of TARGETS) {
    results.push(await scanTarget(db, target, apply, pauseMs));
  }
  return results;
}

function report(phase: string, rows: Record<string, string | number>[]): void {
  process.stdout.write(`${JSON.stringify({ phase, rows })}\n`);
}

async function main(): Promise<number> {
  const [mode, ...rest] = Bun.argv.slice(2);
  const connectionString = process.env["TELEMETRY_CLEANUP_DATABASE_URL"];
  if (
    (mode !== "--count" && mode !== "--apply") ||
    rest.length > 0 ||
    !connectionString ||
    !/^postgres(?:ql)?:\/\//i.test(connectionString)
  ) {
    process.stderr.write(
      "Set TELEMETRY_CLEANUP_DATABASE_URL to a PostgreSQL connection and pass --count or --apply.\n",
    );
    return 1;
  }
  const db = new Client({ connectionString, connectionTimeoutMillis: 10_000 });
  try {
    await db.connect();
    await db.query("SET lock_timeout = '2s'");
    await db.query("SET statement_timeout = '120s'");
    if (mode === "--apply") {
      const { rows } = await db.query<{ allowed: boolean }>(
        "SELECT NOT pg_is_in_recovery() AND pg_try_advisory_lock(hashtext($1)) AS allowed",
        [LOCK_NAME],
      );
      if (!rows[0]?.allowed) {
        process.stderr.write(
          "Apply requires the writable primary and an exclusive cleanup lock.\n",
        );
        return 1;
      }
    }
    const counts = await scrubStoredTelemetryUrls(db, false);
    report(
      "count",
      counts.map(({ table, affected }) => ({ table, affected })),
    );
    if (mode === "--count") {
      return 0;
    }
    report("apply", await scrubStoredTelemetryUrls(db, true));
    const remaining = await scrubStoredTelemetryUrls(db, false);
    report(
      "verify",
      remaining.map(({ table, affected }) => ({ table, remaining: affected })),
    );
    return remaining.some(({ affected }) => affected > 0) ? 1 : 0;
  } catch {
    // Driver errors can echo a connection string or a row value.
    process.stderr.write(
      "Cleanup failed. Uncommitted changes were rolled back. Run --count before retrying.\n",
    );
    return 1;
  } finally {
    await db.end();
  }
}

if (import.meta.main) {
  void main().then(
    (exitCode) => {
      process.exitCode = exitCode;
      return undefined;
    },
    () => {
      process.stderr.write("Cleanup failed. Run --count before retrying.\n");
      process.exitCode = 1;
    },
  );
}
