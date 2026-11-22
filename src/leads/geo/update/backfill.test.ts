import { gzipSync } from "node:zlib";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

afterAll(async () => {
  await pg.close();
});

it("fills a healthy lead within the batch limit when newer rows have duplicate emails", async () => {
  await pg.exec(`
    CREATE TABLE geo_ip_databases (
      id text PRIMARY KEY, version text, data text, v4_ranges int,
      v6_ranges int, created_at timestamp DEFAULT now(), updated_at timestamp
    );
    CREATE TABLE leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text, geo_country text,
      ip_address text, metadata jsonb, created_at timestamp
    );
    INSERT INTO leads (email, ip_address, metadata, created_at) VALUES
      ('duplicate@example.test', '198.51.100.77', '{}', '2026-11-22'),
      ('duplicate@example.test', NULL, '{"ipAddress":"198.51.100.77"}', '2026-11-21'),
      ('eligible@example.test', NULL, '{"ipAddress":"198.51.100.77"}', '2026-11-20');
  `);
  const { backfillLeadCountries, storeGeoRelease } =
    await import("./repository");
  await storeGeoRelease(
    "test-fixture",
    gzipSync("198.51.100.0,198.51.100.255,GB"),
  );
  const logger = createEndpointLogger(false, defaultLocale);
  expect(await backfillLeadCountries(logger, 1)).toEqual({
    backfilled: 1,
    unresolved: 2,
  });
  expect(
    (
      await pg.query<{ geo_country: string | null }>(
        "SELECT geo_country FROM leads ORDER BY created_at DESC",
      )
    ).rows.map((row) => row.geo_country),
  ).toEqual([null, null, "GB"]);
  expect(await backfillLeadCountries(logger, 1)).toEqual({
    backfilled: 0,
    unresolved: 2,
  });
});
