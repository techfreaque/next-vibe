/**
 * Public free-tier cap: atomic increments, hard gate, single-request clamp,
 * per-lead / per-IP sub-caps. Requires the dev DB (same as other repository tests).
 */

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { publicCapSpenders, publicFreeTierDailyCap } from "./db";
import { PublicCapRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);

let saved: typeof publicFreeTierDailyCap.$inferSelect | undefined;
const testLeads: string[] = [];
const testIpHashes: string[] = [];

function lead(tag: string): string {
  const id = `cap-test-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  testLeads.push(id);
  return id;
}

async function setRow(
  patch: Partial<typeof publicFreeTierDailyCap.$inferInsert>,
): Promise<void> {
  if (!saved) {
    throw new Error("cap row missing");
  }
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
      { leadId: lead("a"), ipAddress: undefined, expectedCost: 0.1, model: "m" },
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
      { leadId: lead("c"), ipAddress: undefined, expectedCost: 0.5, model: "m" },
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

  it("per-IP sub-cap blocks across different leads on one IP", async () => {
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 100, perIpCap: 5 });
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
    await setRow({ spendToday: 0, capAmount: 1000, perLeadCap: 20, perIpCap: 40 });
    // Force a read error: an unparseable spender key query is not possible, so
    // simulate by stubbing the DB read.
    const original = db.select.bind(db);
    db.select = ((): never => {
      throw new Error("db down");
    }) as typeof db.select;
    try {
      const res = await PublicCapRepository.gate(
        { leadId: lead("x"), ipAddress: undefined, expectedCost: 1, model: "m" },
        logger,
        defaultLocale,
      );
      expect(res.success).toBe(false);
    } finally {
      db.select = original;
    }
  });
});
