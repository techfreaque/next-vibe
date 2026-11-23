import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "bun:test";

import {
  findDuplicateLeadIds,
  scrubStoredTelemetryUrls,
} from "./scrub-stored-urls";

it("counts without writes, scrubs all four stores and is idempotent", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE lead_engagements (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), metadata jsonb);
      CREATE TABLE leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), metadata jsonb);
      CREATE TABLE growth_journeys (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), first_landing_path text, last_landing_path text);
      CREATE TABLE error_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), metadata jsonb, message text, stack_trace text);
      INSERT INTO lead_engagements (metadata) VALUES
        ('{"url":"https://example.test/user/signup?confirm=1#private","source":"form"}'),
        ('{"url":"/story?utm_source=mail"}');
      INSERT INTO leads (metadata) VALUES ('{"referer":"/user/verify-email/private","created":true}');
      INSERT INTO growth_journeys (first_landing_path, last_landing_path) VALUES ('/user/reset-password/private', NULL);
      INSERT INTO error_logs (metadata, message, stack_trace) VALUES (
        '[{"request":{"path":"/api/en-US/user/confirm?token=private"},"payload":"{\\"token\\":\\"private"}]',
        'Failed at https://example.test/user/verify-email/private',
        'at https://example.test/user/reset-password/private:2:5'
      );
    `);
    const counts = await scrubStoredTelemetryUrls(db, false);
    expect(counts.map(({ affected, updated }) => [affected, updated])).toEqual([
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 0],
    ]);
    const updates = await scrubStoredTelemetryUrls(db, true, 0);
    expect(updates.map(({ updated }) => updated)).toEqual([1, 1, 1, 1]);
    expect(
      (await db.query("SELECT metadata FROM lead_engagements WHERE metadata ? 'source'")).rows,
    ).toEqual([{ metadata: { url: "/user/signup", source: "form" } }]);
    expect(
      (await db.query("SELECT first_landing_path, last_landing_path FROM growth_journeys")).rows,
    ).toEqual([{ first_landing_path: "/user/reset-password/:token", last_landing_path: null }]);
    expect((await db.query("SELECT metadata, message, stack_trace FROM error_logs")).rows).toEqual([
      {
        metadata: [
          { request: { path: "/api/en-US/user/confirm" }, payload: '{"token":"[redacted]' },
        ],
        message: "Failed at https://example.test/user/verify-email/:token",
        stack_trace: "at https://example.test/user/reset-password/:token:2:5",
      },
    ]);
    expect(
      (await scrubStoredTelemetryUrls(db, false)).every(({ affected }) => affected === 0),
    ).toBe(true);
  } finally {
    await db.close();
  }
});

it("skips affected leads with duplicate normalized emails and scrubs other rows", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE lead_engagements (id uuid PRIMARY KEY, metadata jsonb);
      CREATE TABLE leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text, metadata jsonb);
      CREATE TABLE growth_journeys (id uuid PRIMARY KEY, first_landing_path text, last_landing_path text);
      CREATE TABLE error_logs (id uuid PRIMARY KEY, metadata jsonb, message text, stack_trace text);
      INSERT INTO leads (email, metadata) VALUES
        ('Person@example.test', '{"url":"/story?secret=1"}'),
        (' person@example.test ', '{"url":"/story?secret=2"}'),
        ('other@example.test', '{"url":"/story?secret=3"}'),
        (NULL, '{"url":"/story?secret=4"}'),
        (NULL, '{"url":"/story?secret=5"}');
    `);
    const excludedLeadIds = await findDuplicateLeadIds(db);
    expect(excludedLeadIds.size).toBe(2);
    const count = await scrubStoredTelemetryUrls(db, false, 0, excludedLeadIds);
    expect(count.find(({ table }) => table === "leads")).toEqual({
      table: "leads",
      affected: 3,
      updated: 0,
      skipped: 2,
    });
    const apply = await scrubStoredTelemetryUrls(db, true, 0, excludedLeadIds);
    expect(apply.find(({ table }) => table === "leads")?.updated).toBe(3);
    const remaining = await scrubStoredTelemetryUrls(db, false);
    expect(remaining.find(({ table }) => table === "leads")?.affected).toBe(2);
    expect(
      (await db.query("SELECT email, metadata FROM leads WHERE email IN ('Person@example.test', ' person@example.test ') ORDER BY email")).rows,
    ).toEqual([
      { email: " person@example.test ", metadata: { url: "/story?secret=2" } },
      { email: "Person@example.test", metadata: { url: "/story?secret=1" } },
    ]);
  } finally {
    await db.close();
  }
});
