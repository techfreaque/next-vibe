import { gzipSync } from "node:zlib";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
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
  const { storeGeoRelease } = await import("./repository");
  await storeGeoRelease(
    "test-fixture",
    gzipSync("198.51.100.0,198.51.100.255,GB"),
  );
});

afterAll(async () => {
  await pg.close();
});

it("starts a new geo refresh when the current load is invalidated", async () => {
  const { geoTableNow, invalidateGeoCache } = await import("../lookup");
  const olderLoad = geoTableNow(logger);
  invalidateGeoCache();
  const currentLoad = geoTableNow(logger);
  const concurrentLoad = geoTableNow(logger);

  const older = await olderLoad;
  const current = await currentLoad;
  expect(current).not.toBeNull();
  expect(older).toEqual(current);
  expect(older).not.toBe(current);
  expect(await concurrentLoad).toBe(current);
  expect(await geoTableNow(logger)).toBe(current);
});

it("fills a healthy lead within the batch limit when newer rows have duplicate emails", async () => {
  const { backfillLeadCountries } = await import("./repository");
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

  await pg.exec(`
    INSERT INTO leads (ip_address, created_at)
    SELECT '198.51.100.77', now() FROM generate_series(1, 205)
  `);
  expect(await backfillLeadCountries(logger, 201)).toEqual({
    backfilled: 201,
    unresolved: 6,
  });
  expect(await backfillLeadCountries(logger, 201)).toEqual({
    backfilled: 4,
    unresolved: 2,
  });
});

it("backfills the rest of a batch when the email index rejects some rows", async () => {
  // Stand-in for prod's leads_email_unique, which rejects updates of rows
  // whose duplicate email the NOT EXISTS guard could not see.
  await pg.exec(`
    CREATE FUNCTION reject_blocked_email() RETURNS trigger AS $$
    BEGIN
      IF NEW.email = 'blocked@example.test' THEN
        RAISE unique_violation USING CONSTRAINT = 'leads_email_unique';
      END IF;
      RETURN NEW;
    END $$ LANGUAGE plpgsql;
    CREATE TRIGGER reject_blocked_email BEFORE UPDATE ON leads
      FOR EACH ROW EXECUTE FUNCTION reject_blocked_email();
    INSERT INTO leads (email, ip_address, created_at) VALUES
      ('blocked@example.test', '198.51.100.77', now()),
      ('healthy-a@example.test', '198.51.100.77', now()),
      ('healthy-b@example.test', '198.51.100.77', now());
  `);
  const { backfillLeadCountries } = await import("./repository");
  expect(await backfillLeadCountries(logger, 10)).toEqual({
    backfilled: 2,
    unresolved: 3,
  });
  expect(
    (
      await pg.query<{ email: string; geo_country: string | null }>(
        "SELECT email, geo_country FROM leads WHERE email IN ('blocked@example.test', 'healthy-a@example.test', 'healthy-b@example.test') ORDER BY email",
      )
    ).rows,
  ).toEqual([
    { email: "blocked@example.test", geo_country: null },
    { email: "healthy-a@example.test", geo_country: "GB" },
    { email: "healthy-b@example.test", geo_country: "GB" },
  ]);
});
