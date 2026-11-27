import "server-only";

/**
 * Geo IP update: keep the DB-IP country table current (one download per
 * month) and resolve the visitor country of leads that have an IP but no
 * country yet, a bounded batch per run (small WAL bursts on the replica).
 */
import { setImmediate as yieldToEventLoop } from "node:timers/promises";
import { gunzipSync, gzipSync } from "node:zlib";

import { sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { DatabaseError, type QueryResultRow } from "pg";

import { buildGeoTable, encodeGeoTable, lookupCountry } from "../compact";
import { geoIpDatabases } from "../db";
import { GeoUpdateStatus } from "../enum";
import type { GeoT } from "../i18n";
import { GEO_SOURCE_ID, geoTableNow, invalidateGeoCache } from "../lookup";
import type {
  GeoUpdatePostRequestOutput,
  GeoUpdatePostResponseOutput,
} from "./definition";

/** Leads resolved per run (hourly): ~2 MB of WAL at most. */
export const GEO_BACKFILL_BATCH = 2000;

const DOWNLOAD_TIMEOUT_MS = 120_000;

/** DB-IP publishes `dbip-country-lite-YYYY-MM.csv.gz` on the 1st of a month. */
export function geoReleaseUrl(version: string): string {
  return `https://download.db-ip.com/free/dbip-country-lite-${version}.csv.gz`;
}

/** This month and the previous one (the new file can lag the 1st). */
export function geoReleaseCandidates(now: Date): string[] {
  const month = (offset: number): string => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1),
    );
    return `${String(date.getUTCFullYear())}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  };
  return [month(0), month(-1)];
}

async function download(
  version: string,
  logger: EndpointLogger,
): Promise<Buffer | null> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(geoReleaseUrl(version), {
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    });
    if (!response.ok) {
      logger.debug("Geo release not available", {
        version,
        status: response.status,
      });
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    logger.warn("Geo release download failed", {
      version,
      error: parseError(error).message,
    });
    return null;
  }
}

interface StoredRelease {
  version: string;
  v4Ranges: number;
  v6Ranges: number;
}

async function storedRelease(): Promise<StoredRelease | null> {
  const [row] = await db
    .select({
      version: geoIpDatabases.version,
      v4Ranges: geoIpDatabases.v4Ranges,
      v6Ranges: geoIpDatabases.v6Ranges,
    })
    .from(geoIpDatabases)
    .where(sql`${geoIpDatabases.id} = ${GEO_SOURCE_ID}`)
    .limit(1);
  return row ?? null;
}

/** Store a release from the gzipped DB-IP CSV. Exported for tests. */
export async function storeGeoRelease(
  version: string,
  csvGz: Buffer,
): Promise<StoredRelease> {
  const table = buildGeoTable(gunzipSync(csvGz).toString("utf8"));
  const data = gzipSync(encodeGeoTable(table), { level: 9 }).toString("base64");
  const values = {
    version,
    data,
    v4Ranges: table.v4Starts.length,
    v6Ranges: table.v6Hi.length,
    updatedAt: new Date(),
  };
  await db
    .insert(geoIpDatabases)
    .values({ id: GEO_SOURCE_ID, ...values })
    .onConflictDoUpdate({ target: geoIpDatabases.id, set: values });
  invalidateGeoCache();
  return {
    version,
    v4Ranges: values.v4Ranges,
    v6Ranges: values.v6Ranges,
  };
}

/** Lead IP: typed column first, middleware leads keep it in metadata. */
const LEAD_IP_SQL = sql.raw(
  "NULLIF(COALESCE(l.ip_address, l.metadata->>'ipAddress'), '')",
);

/**
 * Resolve up to `limit` leads (newest first) that have an IP but no country.
 * Returns how many were written and how many are still open.
 */
/** The email index rejected the update (see backfillLeadCountries). */
const EMAIL_INDEX_CONFLICT = "email-index-conflict";

async function updateLeadCountries(
  countries: readonly { id: string; country: string }[],
): Promise<number | typeof EMAIL_INDEX_CONFLICT> {
  return db
    .execute<QueryResultRow & { n: number }>(
      sql`
        WITH updated AS (
          UPDATE leads SET geo_country = v.country
          FROM jsonb_to_recordset(${JSON.stringify(countries)}::jsonb) AS v(id uuid, country text)
          WHERE leads.id = v.id AND leads.geo_country IS NULL
          RETURNING 1
        ) SELECT count(*)::int AS n FROM updated
      `,
    )
    .then(
      ({ rows }) => rows[0]?.n ?? 0,
      (error: Error) =>
        isEmailUniqueViolation(parseError(error))
          ? EMAIL_INDEX_CONFLICT
          : // Any other failure keeps failing the run with its stage logged.
            Promise.reject(error),
    );
}

function isEmailUniqueViolation(parsed: Error): boolean {
  const cause = parsed.cause instanceof Error ? parsed.cause : parsed;
  // Field check instead of instanceof: node-postgres and PGlite raise
  // different classes with the same SQLSTATE fields.
  return (
    "code" in cause &&
    cause.code === "23505" &&
    "constraint" in cause &&
    cause.constraint === "leads_email_unique"
  );
}

export async function backfillLeadCountries(
  logger: EndpointLogger,
  limit = GEO_BACKFILL_BATCH,
): Promise<{ backfilled: number; unresolved: number }> {
  const table = await geoTableNow(logger);
  const open = sql`l.geo_country IS NULL AND ${LEAD_IP_SQL} IS NOT NULL`;
  if (!table) {
    const { rows } = await db.execute<QueryResultRow & { n: number }>(
      sql`SELECT count(*)::int AS n FROM leads l WHERE ${open}`,
    );
    return { backfilled: 0, unresolved: rows[0]?.n ?? 0 };
  }
  // PostgreSQL can recheck the email index even on a country-only update.
  // Leave existing duplicate emails for repair without blocking other leads.
  const { rows } = await db.execute<
    QueryResultRow & { id: string; ip: string }
  >(sql`
    SELECT l.id, ${LEAD_IP_SQL} AS ip FROM leads l
    WHERE ${open}
      AND NOT EXISTS (
        SELECT 1 FROM leads duplicate
        WHERE duplicate.email = l.email AND duplicate.id <> l.id
      )
    ORDER BY l.created_at DESC
    LIMIT ${limit}
  `);
  let backfilled = 0;
  if (rows.length > 0) {
    // Yield between groups of lookups so an hourly backfill can share the JS
    // thread with requests. Bind the results once for a single atomic update.
    const countries: { id: string; country: string }[] = [];
    for (const row of rows) {
      if (countries.length > 0 && countries.length % 100 === 0) {
        await yieldToEventLoop();
      }
      countries.push({ id: row.id, country: lookupCountry(table, row.ip) });
    }
    const batch = await updateLeadCountries(countries);
    if (batch !== EMAIL_INDEX_CONFLICT) {
      backfilled = batch;
    } else {
      // The NOT EXISTS guard above did not see the duplicate, so the email
      // index answers differently depending on the access path (prod
      // 2026-11-27: 18 duplicate emails under a valid leads_email_unique,
      // one inserted the same day). One bad row used to fail the whole
      // batch every hour. Update row by row and name the blocked leads.
      const blockedLeadIds: string[] = [];
      for (const [index, row] of countries.entries()) {
        if (index > 0 && index % 100 === 0) {
          await yieldToEventLoop();
        }
        const single = await updateLeadCountries([row]);
        if (single === EMAIL_INDEX_CONFLICT) {
          blockedLeadIds.push(row.id);
        } else {
          backfilled += single;
        }
      }
      logger.error(
        "Geo IP backfill blocked by duplicate lead emails - leads_email_unique does not enforce uniqueness, the index needs a dedupe + REINDEX",
        {
          constraint: "leads_email_unique",
          blockedCount: blockedLeadIds.length,
          blockedLeadIds: blockedLeadIds.slice(0, 20).join(","),
        },
      );
    }
  }
  const { rows: remaining } = await db.execute<QueryResultRow & { n: number }>(
    sql`SELECT count(*)::int AS n FROM leads l WHERE ${open}`,
  );
  return { backfilled, unresolved: remaining[0]?.n ?? 0 };
}

export class GeoUpdateRepository {
  static async run(
    data: GeoUpdatePostRequestOutput,
    logger: EndpointLogger,
    t: GeoT,
  ): Promise<ResponseType<GeoUpdatePostResponseOutput>> {
    let stage = "readRelease";
    try {
      const stored = await storedRelease();
      let release = stored;
      let status: (typeof GeoUpdateStatus)[keyof typeof GeoUpdateStatus] =
        GeoUpdateStatus.CURRENT;
      const candidates = geoReleaseCandidates(new Date());
      const isCurrent =
        stored !== null && !data.force && stored.version === candidates[0];
      if (!isCurrent) {
        status = GeoUpdateStatus.UNAVAILABLE;
        for (const version of candidates) {
          if (!data.force && stored?.version === version) {
            // Last month's file is stored and this month's is not out yet.
            status = GeoUpdateStatus.CURRENT;
            break;
          }
          const file = await download(version, logger);
          if (file) {
            stage = "storeRelease";
            release = await storeGeoRelease(version, file);
            status = GeoUpdateStatus.UPDATED;
            logger.info("Geo IP table updated", { ...release });
            break;
          }
        }
      }
      if (!release) {
        return fail({
          message: t("update.post.errors.network.description"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      stage = "backfillLeadCountries";
      const backfill = await backfillLeadCountries(logger);
      return success({
        status,
        version: release.version,
        v4Ranges: release.v4Ranges,
        v6Ranges: release.v6Ranges,
        ...backfill,
      });
    } catch (error) {
      const parsed = parseError(error);
      const cause = parsed.cause instanceof Error ? parsed.cause : parsed;
      logger.error("Geo IP update failed", {
        stage,
        errorName: parsed.name,
        databaseCode: cause instanceof DatabaseError ? cause.code : undefined,
        constraint:
          cause instanceof DatabaseError ? cause.constraint : undefined,
        // A failed bulk insert/update message can include the entire SQL payload.
        detail:
          cause instanceof DatabaseError || "query" in parsed
            ? undefined
            : cause.message.slice(0, 200),
      });
      return fail({
        message: t("update.post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
