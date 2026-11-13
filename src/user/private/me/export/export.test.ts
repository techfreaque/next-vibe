/**
 * Data export — integration tests (real DB).
 * Seeds two users and asserts the export only carries the caller's data.
 */

import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { userAddresses } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { scopedTranslation } from "./i18n";
import { ExportMyDataRepository } from "./repository";

const exportSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.record(z.string(), z.json()))]),
);

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const stamp = Date.now();

let alice: TestUser;
let bob: TestUser;

describe("ExportMyDataRepository.exportMyData", () => {
  beforeAll(async () => {
    const a = await createTestUser(`export-a-${stamp}@example.com`);
    const b = await createTestUser(`export-b-${stamp}@example.com`);
    if (!a.success || !b.success) {
      throw new Error("seed failed");
    }
    alice = a.data;
    bob = b.data;
    await db.insert(userAddresses).values([
      {
        userId: alice.user.id,
        label: "alice-home",
        addressLine1: "Alice Street 1",
        city: "Berlin",
        country: "DE",
      },
      {
        userId: bob.user.id,
        label: "bob-home",
        addressLine1: "Bob Street 2",
        city: "Warsaw",
        country: "PL",
      },
    ]);
  });

  afterAll(async () => {
    await deleteTestUser(alice.user.id);
    await deleteTestUser(bob.user.id);
  });

  it("exports the caller's data only", async () => {
    const result = await ExportMyDataRepository.exportMyData(
      alice.user,
      logger,
      t,
    );
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.json).toContain("alice-home");
    expect(result.data.json).toContain(alice.user.id);
    expect(result.data.json).not.toContain("bob-home");
    expect(result.data.json).not.toContain(bob.user.id);
    expect(result.data.json).not.toContain(`export-b-${stamp}`);
  });

  it("includes the expected sections and no secrets", async () => {
    const result = await ExportMyDataRepository.exportMyData(
      bob.user,
      logger,
      t,
    );
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    const parsed = exportSchema.parse(JSON.parse(result.data.json));
    for (const key of [
      "account",
      "addresses",
      "chatThreads",
      "chatMessages",
      "memories",
      "skills",
      "favorites",
      "creditTransactions",
      "referrals",
      "newsletter",
      "leads",
      "attribution",
    ]) {
      expect(Array.isArray(parsed[key])).toBe(true);
    }
    expect(parsed.addresses).toHaveLength(1);
    expect(parsed.account[0]).not.toHaveProperty("password");
    expect(parsed.account[0]).not.toHaveProperty("twoFactorSecret");
    expect(result.data.markdown).toContain(`export-b-${stamp}@example.com`);
    expect(result.data.jsonFilename).toMatch(/\.json$/);
  });

  it("rejects public callers", async () => {
    const result = await ExportMyDataRepository.exportMyData(
      { ...alice.user, id: undefined },
      logger,
      t,
    );
    expect(result.success).toBe(false);
  });
});
