import { PGlite } from "@electric-sql/pglite";
import { afterAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import * as databaseModule from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";

const pg = new PGlite();
const database = { ...databaseModule };
mock.module("next-vibe/database", () => ({ ...database, db: drizzle(pg), isPglite: true }));
afterAll(() => pg.close());

it("records the credit recipient lookup kind without its value on an account miss or database failure", async () => {
  const { AdminAddCreditsRepository } = await import("./repository");
  const logger = createEndpointLogger(false, defaultLocale);
  const warn = mock(logger.warn).mockImplementation(() => undefined);
  const error = mock(logger.error).mockImplementation(() => undefined);
  const sampleLogger = { ...logger, warn, error };
  await pg.exec(
    "CREATE TABLE users (id uuid, email text, private_name text, created_at timestamp)",
  );
  for (const [target, lookupBy] of [
    ["absent@example.invalid", "email"],
    ["11000000-0000-4000-8000-000000000001", "id"],
  ] as const) {
    const result = await AdminAddCreditsRepository.getRecipient(target, sampleLogger, defaultLocale);
    expect(result.success).toBe(false);
    expect(warn).toHaveBeenLastCalledWith("Credit grant recipient account not found", { lookupBy });
    expect(error).not.toHaveBeenCalled();
  }
  await pg.exec("ALTER TABLE users RENAME TO offline_users");
  const target = "private-selector@example.invalid";
  const result = await AdminAddCreditsRepository.getRecipient(target, sampleLogger, defaultLocale);
  expect(result.success).toBe(false);
  expect(error).toHaveBeenCalledWith("Failed to verify credit grant recipient", expect.objectContaining({
    lookupBy: "email",
    stage: "recipient-account",
    databaseCode: "42P01",
  }));
  expect(JSON.stringify(error.mock.calls)).not.toContain(target);
});
