/**
 * Public free-tier cap: atomic increments, hard gate, single-request clamp,
 * per-lead / per-IP sub-caps. Requires the dev DB (same as other repository tests).
 */

import assert from "node:assert/strict";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import {
  publicCapReservations,
  publicCapSpenders,
  publicFreeTierDailyCap,
} from "./db";
import { PublicCapRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);

let saved: typeof publicFreeTierDailyCap.$inferSelect | undefined;
const testLeads: string[] = [];
const testIpHashes: string[] = [];
const testPools: string[] = [];

function pool(tag: string): string {
  const key = `lead:cap-test-pool-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  testPools.push(key);
  return key;
}

function lead(tag: string): string {
  const id = `cap-test-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  testLeads.push(id);
  return id;
}

async function setRow(
  patch: Partial<typeof publicFreeTierDailyCap.$inferInsert>,
): Promise<void> {
  assert(saved, "cap row missing");
  await db
    .update(publicFreeTierDailyCap)
    .set({ lastResetAt: new Date(), ...patch })
    .where(eq(publicFreeTierDailyCap.id, saved.id));
}

async function spend(): Promise<number> {
  const [row] = await db.select().from(publicFreeTierDailyCap).limit(1);
  return row?.spendToday ?? -1;
}

beforeAll(async () => {
  let [row] = await db.select().from(publicFreeTierDailyCap).limit(1);
  if (!row) {
    [row] = await db
      .insert(publicFreeTierDailyCap)
      .values({ capAmount: 500, spendToday: 0 })
      .returning();
  }
  saved = row;
});

afterAll(async () => {
  if (saved) {
    await db
      .update(publicFreeTierDailyCap)
      .set({
        spendToday: saved.spendToday,
        capAmount: saved.capAmount,
        perLeadCap: saved.perLeadCap,
        perIpCap: saved.perIpCap,
        lastResetAt: saved.lastResetAt,
      })
      .where(eq(publicFreeTierDailyCap.id, saved.id));
  }
  await db
    .delete(publicCapSpenders)
    .where(inArray(publicCapSpenders.key, [...testLeads, ...testIpHashes]));
  if (testPools.length > 0) {
    await db
      .delete(publicCapReservations)
      .where(inArray(publicCapReservations.poolKey, testPools));
  }
});

describe("PublicCapRepository", () => {
  it("parallel increments are atomic (no lost updates)", async () => {
    await setRow({ spendToday: 0, capAmount: 1000 });
    await Promise.all(
      Array.from({ length: 40 }, () =>
        PublicCapRepository.incrementSpend(1.5, logger),
      ),
    );
    expect(await spend()).toBeCloseTo(60, 5);
  });

  it("rejects all requests once the cap is reached", async () => {
    await setRow({ spendToday: 100, capAmount: 100 });
    const res = await PublicCapRepository.gate(
      {
        leadId: lead("a"),
        ipAddress: undefined,
        expectedCost: 0.1,
        model: "m",
      },
      logger,
      defaultLocale,
    );
    expect(res.success).toBe(false);
  });

  it("rejects a single request larger than the remaining pool", async () => {
    await setRow({ spendToday: 99, capAmount: 100 });
    const res = await PublicCapRepository.gate(
      { leadId: lead("b"), ipAddress: undefined, expectedCost: 5, model: "m" },
      logger,
      defaultLocale,
    );
    expect(res.success).toBe(false);
    const ok = await PublicCapRepository.gate(
      {
        leadId: lead("c"),
        ipAddress: undefined,
        expectedCost: 0.5,
        model: "m",
      },
      logger,
      defaultLocale,
    );
    expect(ok.success).toBe(true);
  });

  it("per-lead sub-cap blocks the outlier while others proceed", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 10 });
    const abuser = lead("abuser");
    const other = lead("other");
    await PublicCapRepository.incrementSpend(10, logger, { leadId: abuser });
    const blocked = await PublicCapRepository.gate(
      { leadId: abuser, ipAddress: undefined, expectedCost: 1, model: "m" },
      logger,
      defaultLocale,
    );
    const fine = await PublicCapRepository.gate(
      { leadId: other, ipAddress: undefined, expectedCost: 1, model: "m" },
      logger,
      defaultLocale,
    );
    expect(blocked.success).toBe(false);
    expect(fine.success).toBe(true);
  });

  it("names a signed-in actor and the pool math on a refusal", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 10 });
    const id = lead("signed-in");
    await PublicCapRepository.incrementSpend(9.5, logger, { leadId: id });
    const warn = vi.spyOn(logger, "warn");
    try {
      const blocked = await PublicCapRepository.gate(
        {
          leadId: id,
          ipAddress: undefined,
          expectedCost: 1,
          model: "fixture",
          actor: { userId: "fixture-user", isSignedIn: true },
        },
        logger,
        defaultLocale,
      );
      expect(blocked.success).toBe(false);
      expect(warn).toHaveBeenCalledWith(
        "[PublicCap] lead-cap: signed-in free user request refused",
        expect.objectContaining({
          kind: "lead-cap",
          actor: "signed-in",
          refusalDetail: expect.objectContaining({
            userId: "fixture-user",
            isSignedIn: true,
            subCap: 10,
            subCapSpend: 9.5,
            limitLeft: 0.5,
            overLimitBy: 0.5,
            leadSettledToday: 9.5,
            leadReservedLive: 0,
          }),
        }),
      );
    } finally {
      warn.mockRestore();
    }
  });

  it("limits a free model turn to the remaining personal allowance", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 70 });
    const id = lead("remaining");
    await PublicCapRepository.incrementSpend(68.1, logger, { leadId: id });
    const gate = await PublicCapRepository.gate(
      { leadId: id, ipAddress: undefined, expectedCost: 1, model: "fixture" },
      logger,
      defaultLocale,
    );
    expect(gate.success).toBe(true);
    if (gate.success) {
      expect(gate.data.remaining).toBeCloseTo(1.9, 6);
    }
  });

  it("per-IP sub-cap blocks across different leads on one IP", async () => {
    await setRow({
      spendToday: 0,
      capAmount: 1000,
      perLeadCap: 100,
      perIpCap: 5,
    });
    const ip = `203.0.113.${Math.floor(Math.random() * 250)}`;
    testIpHashes.push(PublicCapRepository.hashIp(ip));
    await PublicCapRepository.incrementSpend(5, logger, {
      leadId: lead("ip1"),
      ipAddress: ip,
    });
    const res = await PublicCapRepository.gate(
      { leadId: lead("ip2"), ipAddress: ip, expectedCost: 1, model: "m" },
      logger,
      defaultLocale,
    );
    expect(res.success).toBe(false);
  });

  it("fails closed when the cap table is unreadable", async () => {
    await setRow({
      spendToday: 0,
      capAmount: 1000,
      perLeadCap: 20,
      perIpCap: 40,
    });
    // Force a read error: an unparseable spender key query is not possible, so
    // simulate by stubbing the DB read.
    const original = db.select.bind(db);
    db.select = (): never => assert.fail("db down");
    try {
      const res = await PublicCapRepository.gate(
        {
          leadId: lead("x"),
          ipAddress: undefined,
          expectedCost: 1,
          model: "m",
        },
        logger,
        defaultLocale,
      );
      expect(res.success).toBe(false);
    } finally {
      db.select = original;
    }
  });

  it("parallel turns of one pool cannot reserve more than its free credits", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 1000, perIpCap: 1000 });
    const poolKey = pool("wallet");
    const id = lead("wallet");
    const results = await Promise.all(
      Array.from({ length: 12 }, () =>
        PublicCapRepository.gate(
          {
            leadId: id,
            ipAddress: undefined,
            expectedCost: 1,
            model: "m",
            reservation: { poolKey, spendable: 5 },
          },
          logger,
          defaultLocale,
        ),
      ),
    );
    expect(results.filter((r) => r.success)).toHaveLength(5);
    const refused = results.find((r) => !r.success);
    expect(refused?.message).toBe(
      "Your free credits are still covering a reply in progress. Let it finish, then send again.",
    );
    // Each passing turn's budget excludes what the others already hold.
    const budgets = results.flatMap((r) => (r.success ? [r.data.remaining] : []));
    expect(budgets.toSorted()).toEqual([1, 2, 3, 4, 5]);
  });

  it("parallel requests from one IP stop at the IP sub-cap", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 1000, perIpCap: 4 });
    const ip = `198.51.100.${Math.floor(Math.random() * 250)}`;
    testIpHashes.push(PublicCapRepository.hashIp(ip));
    const results = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        PublicCapRepository.gate(
          {
            leadId: lead(`ip-par-${i}`),
            ipAddress: ip,
            expectedCost: 1,
            model: "m",
            reservation: { poolKey: pool(`ip-par-${i}`), spendable: 20 },
          },
          logger,
          defaultLocale,
        ),
      ),
    );
    expect(results.filter((r) => r.success)).toHaveLength(4);
  });

  it("settling a billed turn releases its reservation; expired ones never count", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 1000, perIpCap: 1000 });
    const poolKey = pool("settle");
    const id = lead("settle");
    const request = {
      leadId: id,
      ipAddress: undefined,
      expectedCost: 2,
      model: "m",
      reservation: { poolKey, spendable: 4 },
    };
    expect((await PublicCapRepository.gate(request, logger, defaultLocale)).success).toBe(true);
    expect((await PublicCapRepository.gate(request, logger, defaultLocale)).success).toBe(true);
    expect((await PublicCapRepository.gate(request, logger, defaultLocale)).success).toBe(false);

    // The first turn bills: its spend is recorded and one reservation released.
    const before = await spend();
    await PublicCapRepository.settleSpend(2, logger, { leadId: id, poolKey });
    expect(await spend()).toBeCloseTo(before + 2, 5);
    const held = await db
      .select()
      .from(publicCapReservations)
      .where(eq(publicCapReservations.poolKey, poolKey));
    expect(held).toHaveLength(1);
    // The caller's next balance check sees 2 spendable: the live reservation blocks.
    expect(
      (
        await PublicCapRepository.gate(
          { ...request, reservation: { poolKey, spendable: 2 } },
          logger,
          defaultLocale,
        )
      ).success,
    ).toBe(false);

    // A turn that died before billing: its reservation expires.
    await db
      .update(publicCapReservations)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(publicCapReservations.poolKey, poolKey));
    expect(
      (
        await PublicCapRepository.gate(
          { ...request, reservation: { poolKey, spendable: 2 } },
          logger,
          defaultLocale,
        )
      ).success,
    ).toBe(true);
  });
});
