/**
 * Visitor country from the client IP, offline.
 * - compact table: build from a DB-IP style CSV, encode/decode, lookups
 *   (IPv4, IPv6, IPv4-mapped IPv6, gaps, garbage)
 * - client IP: first X-Forwarded-For hop (what Caddy sets), else X-Real-IP
 * - lead creation stores only the country; the backfill fills leads that
 *   have an IP but no country
 * Integration parts need the dev DB, like the other lead repository tests.
 */

import "server-only";

import { setImmediate as yieldToEventLoop } from "node:timers/promises";
import { gzipSync } from "node:zlib";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  buildAsnTable,
  decodeAsnTable,
  encodeAsnTable,
  lookupHostingAsn,
} from "./asn/compact";
import {
  buildGeoTable,
  decodeGeoTable,
  encodeGeoTable,
  lookupCountry,
} from "./compact";
import { UNKNOWN_COUNTRY } from "./constants";
import { geoIpDatabases } from "./db";
import {
  clientIpFromHeaders,
  GEO_SOURCE_ID,
  geoCountryForIp,
  invalidateGeoCache,
} from "./lookup";
import { backfillLeadCountries, storeGeoRelease } from "./update/repository";

const logger = createEndpointLogger(false, defaultLocale);

/** DB-IP country lite format: start,end,country (documentation ranges). */
const FIXTURE_CSV = [
  "0.0.0.0,0.255.255.255,ZZ",
  "1.0.0.0,1.0.0.255,AU",
  "1.0.1.0,1.0.3.255,CN",
  "37.111.224.0,37.111.231.255,BD",
  "57.141.0.0,57.141.255.255,US",
  "185.163.8.0,185.163.11.255,DE",
  "198.51.100.0,198.51.100.255,GB",
  "203.0.113.0,203.0.113.255,PL",
  "2001:db8::,2001:db8:ffff:ffff:ffff:ffff:ffff:ffff,NL",
  "2a03:2880::,2a03:2880:ffff:ffff:ffff:ffff:ffff:ffff,IE",
].join("\n");

it("yields while building an ASN release and preserves the final quoted row", async () => {
  const repeated = `${'1.0.0.0,1.0.0.255,13335,"Cloudflare, Inc."\n'.repeat(8192)}1.0.1.0,1.0.1.255,16509,"Example Hosting, Inc."`;
  const build = buildAsnTable(
    repeated,
    (_asn, org) => org === "Example Hosting, Inc.",
  );
  const first = await Promise.race([
    build.then(() => "build"),
    yieldToEventLoop("event-loop"),
  ]);
  expect(first).toBe("event-loop");
  const decoded = decodeAsnTable(encodeAsnTable(await build));
  expect(decoded && lookupHostingAsn(decoded, "1.0.0.7")).toBeNull();
  expect(decoded && lookupHostingAsn(decoded, "1.0.1.7")).toBe(16509);
});

describe("compact geo table", () => {
  const table = buildGeoTable(FIXTURE_CSV);
  const decoded = table.then((original) => decodeGeoTable(encodeGeoTable(original)));

  it("round-trips through the binary format", async () => {
    const original = await table;
    const result = await decoded;
    expect(result).not.toBeNull();
    expect(result?.codes).toEqual(original.codes);
    expect(result?.v4Starts.length).toBe(original.v4Starts.length);
    expect(result?.v6Hi.length).toBe(original.v6Hi.length);
  });

  it("yields during large imports and parses the final row", async () => {
    const repeated = `${"1.0.0.0,1.0.0.255,AU\n".repeat(8192)}1.0.1.0,1.0.1.255,CN`;
    const build = buildGeoTable(repeated);
    const first = await Promise.race([
      build.then(() => "build"),
      yieldToEventLoop("event-loop"),
    ]);
    expect(first).toBe("event-loop");
    expect(lookupCountry(await build, "1.0.1.7")).toBe("CN");
  });

  it.each([
    ["1.0.0.7", "AU"],
    ["1.0.2.9", "CN"],
    ["37.111.227.9", "BD"],
    ["57.141.20.5", "US"],
    ["185.163.9.183", "DE"],
    ["198.51.100.42", "GB"],
    ["203.0.113.255", "PL"],
    ["::ffff:198.51.100.1", "GB"],
    ["2001:db8:1:2::5", "NL"],
    ["2a03:2880:f000::1", "IE"],
    // gaps between listed ranges, reserved space and bad input
    ["9.9.9.9", UNKNOWN_COUNTRY],
    ["0.1.2.3", UNKNOWN_COUNTRY],
    ["2600::1", UNKNOWN_COUNTRY],
    ["not-an-ip", UNKNOWN_COUNTRY],
  ])("%s -> %s", async (ip, country) => {
    const result = await decoded;
    expect(result && lookupCountry(result, ip)).toBe(country);
  });

  it("rejects bytes that are not a GEO1 table", () => {
    expect(decodeGeoTable(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))).toBe(
      null,
    );
  });
});

describe("clientIpFromHeaders", () => {
  it("takes the first X-Forwarded-For hop", () => {
    expect(
      clientIpFromHeaders(
        new Headers({ "x-forwarded-for": " 203.0.113.9 , 10.88.0.1" }),
      ),
    ).toBe("203.0.113.9");
  });
  it("falls back to X-Real-IP", () => {
    expect(
      clientIpFromHeaders(new Headers({ "x-real-ip": "198.51.100.3" })),
    ).toBe("198.51.100.3");
  });
  it("is undefined without either header", () => {
    expect(clientIpFromHeaders(new Headers())).toBeUndefined();
  });
});

describe("lead geo resolution (dev DB)", () => {
  const createdLeadIds: string[] = [];
  let saved: typeof geoIpDatabases.$inferSelect | undefined;

  beforeAll(async () => {
    [saved] = await db
      .select()
      .from(geoIpDatabases)
      .where(eq(geoIpDatabases.id, GEO_SOURCE_ID));
    await storeGeoRelease("test-fixture", gzipSync(FIXTURE_CSV));
  });

  afterAll(async () => {
    if (createdLeadIds.length > 0) {
      await db.delete(leads).where(inArray(leads.id, createdLeadIds));
    }
    if (saved) {
      await db
        .update(geoIpDatabases)
        .set(saved)
        .where(eq(geoIpDatabases.id, GEO_SOURCE_ID));
    } else {
      await db
        .delete(geoIpDatabases)
        .where(eq(geoIpDatabases.id, GEO_SOURCE_ID));
    }
    invalidateGeoCache();
  });

  it("resolves fixture IPs from the stored table", async () => {
    expect(await geoCountryForIp("185.163.9.183", logger)).toBe("DE");
    expect(await geoCountryForIp("2001:db8::1", logger)).toBe("NL");
    expect(await geoCountryForIp(undefined, logger)).toBeNull();
  });

  it("stores the visitor country on a new lead, separate from the locale", async () => {
    const ip = `203.0.113.${String(1 + Math.floor(Math.random() * 254))}`;
    const leadId = await createAnonymousLead(
      {
        ipAddress: ip,
        userAgent: `geo-test-${String(Math.random())}`,
        geoCountry: await geoCountryForIp(ip, logger),
      },
      defaultLocale,
      logger,
    );
    createdLeadIds.push(leadId);
    const [row] = await db
      .select({ geoCountry: leads.geoCountry, country: leads.country })
      .from(leads)
      .where(eq(leads.id, leadId));
    expect(row?.geoCountry).toBe("PL");
    expect(row?.country).not.toBe("PL");
  });

  it("backfills leads that have an IP but no country", async () => {
    const [row] = await db
      .insert(leads)
      .values({
        email: null,
        businessName: "",
        country: "GLOBAL",
        language: "en",
        source: LeadSource.WEBSITE,
        status: LeadStatus.WEBSITE_USER,
        ipAddress: "198.51.100.77",
        metadata: {},
      })
      .returning({ id: leads.id });
    const leadId = row?.id ?? "";
    createdLeadIds.push(leadId);

    // Newest first: a small batch reaches the lead just inserted.
    await backfillLeadCountries(logger, 5);
    const [after] = await db
      .select({ geoCountry: leads.geoCountry })
      .from(leads)
      .where(eq(leads.id, leadId));
    expect(after?.geoCountry).toBe("GB");
  });
});
