import "server-only";

/**
 * Hosting / VPN ASN of a client IP, resolved offline (no per-request API call).
 *
 * Same storage and cache rules as the country table (../lookup.ts): one row in
 * geo_ip_databases (id ASN_SOURCE_ID), read once per process, re-checked
 * against the stored version every few hours. Only hosting/VPN ranges are in
 * the table, so a residential IP always resolves to null.
 * Data: DB-IP "IP to ASN Lite", CC BY 4.0, https://db-ip.com.
 */
import { promisify } from "node:util";
import { gunzip } from "node:zlib";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { geoIpDatabases } from "../db";
import { type AsnTable, decodeAsnTable, lookupHostingAsn } from "./compact";

export const ASN_SOURCE_ID = "dbip-asn-lite";

const RECHECK_MS = 6 * 60 * 60 * 1000;
const MISSING_RECHECK_MS = 10 * 60 * 1000;
const inflate = promisify(gunzip);

interface AsnCache {
  table: AsnTable | null;
  version: string | null;
  checkedAt: number;
  loading: Promise<AsnTable | null> | null;
}

declare global {
  var __vibeAsnCache: AsnCache | undefined;
}

function cache(): AsnCache {
  globalThis.__vibeAsnCache ??= {
    table: null,
    version: null,
    checkedAt: 0,
    loading: null,
  };
  return globalThis.__vibeAsnCache;
}

async function refresh(logger: EndpointLogger): Promise<AsnTable | null> {
  const state = cache();
  try {
    const [head] = await db
      .select({ version: geoIpDatabases.version })
      .from(geoIpDatabases)
      .where(eq(geoIpDatabases.id, ASN_SOURCE_ID))
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
      .where(eq(geoIpDatabases.id, ASN_SOURCE_ID))
      .limit(1);
    const table = row
      ? decodeAsnTable(await inflate(Buffer.from(row.data, "base64")))
      : null;
    if (!table) {
      logger.error("ASN table in the database is unreadable", {
        version: row?.version ?? null,
      });
    }
    state.table = table ?? state.table;
    state.version = table ? (row?.version ?? null) : state.version;
    state.checkedAt = Date.now();
    return state.table;
  } catch (error) {
    logger.error("Failed to load the ASN table", parseError(error));
    state.checkedAt = Date.now() - RECHECK_MS + MISSING_RECHECK_MS;
    return state.table;
  }
}

async function asnTableNow(logger: EndpointLogger): Promise<AsnTable | null> {
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
export function invalidateAsnCache(): void {
  globalThis.__vibeAsnCache = { ...cache(), checkedAt: 0, loading: null };
}

/**
 * ASN of the IP when it belongs to a hosting / VPN network, else null
 * (residential, mobile, unknown, no table loaded yet, no IP).
 */
export async function hostingAsnForIp(
  ip: string | null | undefined,
  logger: EndpointLogger,
): Promise<number | null> {
  if (!ip) {
    return null;
  }
  const table = await asnTableNow(logger);
  return table ? lookupHostingAsn(table, ip) : null;
}
