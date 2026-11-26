import "server-only";

/**
 * Visitor country from the client IP, resolved offline (no per-visit API call).
 *
 * The table is read from geo_ip_databases once per process, kept in memory
 * (~5 MB) and re-checked against the stored version every few hours, so a
 * monthly update reaches every node without a restart. Only the country is
 * ever returned or stored; the IP is not persisted for this purpose.
 */
import { promisify } from "node:util";
import { gunzip } from "node:zlib";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { decodeGeoTable, type GeoTable, lookupCountry } from "./compact";
import { geoIpDatabases } from "./db";

export const GEO_SOURCE_ID = "dbip-country-lite";

const RECHECK_MS = 6 * 60 * 60 * 1000;
const MISSING_RECHECK_MS = 10 * 60 * 1000;
const inflateGeoTable = promisify(gunzip);

interface GeoCache {
  table: GeoTable | null;
  version: string | null;
  checkedAt: number;
  loading: Promise<GeoTable | null> | null;
}

declare global {
  var __vibeGeoCache: GeoCache | undefined;
}

function cache(): GeoCache {
  globalThis.__vibeGeoCache ??= {
    table: null,
    version: null,
    checkedAt: 0,
    loading: null,
  };
  return globalThis.__vibeGeoCache;
}

/** Client IP as Caddy forwards it: first X-Forwarded-For hop, else X-Real-IP. */
export function clientIpFromHeaders(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || undefined;
}

async function refresh(logger: EndpointLogger): Promise<GeoTable | null> {
  const state = cache();
  try {
    const [head] = await db
      .select({ version: geoIpDatabases.version })
      .from(geoIpDatabases)
      .where(eq(geoIpDatabases.id, GEO_SOURCE_ID))
      .limit(1);
    if (!head) {
      state.table = null;
      state.version = null;
      state.checkedAt = Date.now() - RECHECK_MS + MISSING_RECHECK_MS;
      return null;
    }
    if (state.table && state.version === head.version) {
      state.checkedAt = Date.now();
      return state.table;
    }
    const [row] = await db
      .select({ version: geoIpDatabases.version, data: geoIpDatabases.data })
      .from(geoIpDatabases)
      .where(eq(geoIpDatabases.id, GEO_SOURCE_ID))
      .limit(1);
    // A cold load can happen on either the request or the cron path. Keep
    // decompression of the multi-megabyte table off the server event loop.
    const table = row
      ? decodeGeoTable(await inflateGeoTable(Buffer.from(row.data, "base64")))
      : null;
    if (!table) {
      logger.error("Geo IP table in the database is unreadable", {
        version: row?.version ?? null,
      });
    }
    state.table = table ?? state.table;
    state.version = table ? (row?.version ?? null) : state.version;
    state.checkedAt = Date.now();
    return state.table;
  } catch (error) {
    logger.error("Failed to load the geo IP table", parseError(error));
    state.checkedAt = Date.now() - RECHECK_MS + MISSING_RECHECK_MS;
    return state.table;
  }
}

/** The in-memory table, loading or re-checking the stored copy when due. */
export async function geoTableNow(
  logger: EndpointLogger,
): Promise<GeoTable | null> {
  const state = cache();
  if (Date.now() - state.checkedAt < RECHECK_MS) {
    return state.table;
  }
  state.loading ??= refresh(logger).finally(() => {
    state.loading = null;
  });
  return state.loading;
}

/** Force the next lookup to re-read the stored version (after an update). */
export function invalidateGeoCache(): void {
  // An older in-flight refresh must not replace the new release after it
  // finishes decoding. Keep the previous table available as a fallback.
  globalThis.__vibeGeoCache = { ...cache(), checkedAt: 0, loading: null };
}

/**
 * ISO 3166-1 alpha-2 country of the IP ("ZZ" = reserved/unknown range).
 * Null when there is no IP or no geo table yet (the row stays unresolved and
 * the hourly backfill can still fill it).
 */
export async function geoCountryForIp(
  ip: string | null | undefined,
  logger: EndpointLogger,
): Promise<string | null> {
  if (!ip) {
    return null;
  }
  const table = await geoTableNow(logger);
  return table ? lookupCountry(table, ip) : null;
}
