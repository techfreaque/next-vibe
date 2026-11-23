import { and, eq, inArray } from "drizzle-orm";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { createLeadId } from "next-vibe/identity/middleware/lead-id";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { NextRequest } from "next-vibe/ui/lib/request";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { creditTransactions, creditWallets } from "../db";
import { CreditFundingType, CreditTransactionType } from "../enum";
import { scopedTranslation } from "../i18n";
import { PublicCapRepository } from "../public-cap/repository";
import { antiFarmingEvents, freePoolClaims } from "./db";
import * as events from "./events";
import { CreditRepository } from "../repository";
import { crawlerUserAgent } from "./crawler";
import { protectionEnv } from "./env";
import { AntiFarmingReportRepository } from "./report/repository";
import { protectedBalance } from "./spending";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const baseline = { ...protectionEnv };
const leadIds: string[] = [];
const userIds: string[] = [];
const expensive = ChatModelId.GPT_5_MINI;

const eventTag = `q81-${crypto.randomUUID()}.invalid`;
const reads: Array<
  Promise<Awaited<ReturnType<typeof CreditRepository.getBalance>>>
> = [];

beforeEach(() => {
  // Complete the asynchronous balance broadcast before deleting its wallet.
  const getBalance = CreditRepository.getBalance.bind(CreditRepository);
  vi.spyOn(CreditRepository, "getBalance").mockImplementation((...args) => {
    const read = getBalance(...args);
    reads.push(read);
    return read;
  });
  vi.spyOn(PublicCapRepository, "incrementSpend").mockResolvedValue(undefined);
  const record = events.recordAntiFarmingEvent;
  vi.spyOn(events, "recordAntiFarmingEvent").mockImplementation((event, log) =>
    record({ ...event, emailDomain: eventTag }, log),
  );
});

afterEach(async () => {
  await Promise.allSettled(reads.splice(0));
  vi.restoreAllMocks();
  await db
    .delete(antiFarmingEvents)
    .where(eq(antiFarmingEvents.emailDomain, eventTag));
  const keys = [
    ...leadIds.map((id) => `lead:${id}`),
    ...userIds.map((id) => `user:${id}`),
  ];
  if (keys.length) {
    await db
      .delete(freePoolClaims)
      .where(inArray(freePoolClaims.poolKey, keys));
  }
  Object.assign(protectionEnv, baseline);
  if (leadIds.length) {
    await db.delete(leads).where(inArray(leads.id, leadIds.splice(0)));
  }
  if (userIds.length) {
    await db.delete(users).where(inArray(users.id, userIds.splice(0)));
  }
});

async function guest(ip: string, ua: string) {
  const [lead] = await db
    .insert(leads)
    .values({
      source: LeadSource.WEBSITE,
      status: LeadStatus.WEBSITE_USER,
      ipAddress: ip,
      userAgent: ua,
      businessName: "",
      country: "GLOBAL",
      language: "en",
    })
    .returning({ id: leads.id });
  leadIds.push(lead.id);
  return {
    isPublic: true,
    leadId: lead.id,
    roles: [UserPermissionRole.PUBLIC],
  } as const;
}

async function report() {
  const report = await AntiFarmingReportRepository.getReport(
    { days: 1 },
    logger,
    defaultLocale,
  );
  if (!report.success) {
    return expect.unreachable(report.message);
  }
  return report.data.totals.shadowHits ?? { crawler: 0, model: 0, cluster: 0 };
}

async function rows(leadId: string) {
  return db
    .select({
      amount: creditTransactions.amount,
      funding: creditTransactions.fundingType,
      meta: creditTransactions.metadata,
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .where(
      and(
        eq(creditWallets.leadId, leadId),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    );
}

it("matches the incident browser strings and known crawler families without matching other Mac Chrome versions", () => {
  for (const version of [142, 158, 157]) {
    const ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
    expect(crawlerUserAgent(ua)).toBe(version !== 157);
  }
  for (const ua of [
    "Googlebot",
    "bingbot",
    "facebookexternalhit",
    "meta-externalagent",
    "Claude-User",
    "GPTBot",
    "HeadlessChrome",
  ]) {
    expect(crawlerUserAgent(ua)).toBe(true);
  }
  expect(crawlerUserAgent(null)).toBe(false);
  expect(crawlerUserAgent("curl/8.11")).toBe(false);
});

it("creates an anonymous crawler identity off and in shadow, and skips the insert and cookie in enforcement", async () => {
  const before = await report();
  for (const mode of ["off", "shadow", "enforce"] as const) {
    protectionEnv.FREE_CRAWLER_MODE = mode;
    const ua = `facebookexternalhit/1.1 ${crypto.randomUUID()}`;
    const result = await createLeadId(
      new NextRequest("https://example.test/en-US/", {
        headers: { "user-agent": ua },
      }),
      defaultLocale,
    );
    const cookie = result.cookies.get(LEAD_ID_COOKIE_NAME)?.value;
    if (cookie) {
      leadIds.push(cookie);
    }
    const matching = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.userAgent, ua));
    expect(matching.map((row) => row.id)).toEqual(
      mode === "enforce" ? [] : [cookie],
    );
    expect(Boolean(cookie)).toBe(mode !== "enforce");
  }
  expect((await report()).crawler - before.crawler).toBe(1);
});

it("shares a single allowance by IPv6 /48 or fingerprint across wallets and charges only covered free credits", async () => {
  const before = await report();
  const prefix = `2001:db8:${Math.floor(Math.random() * 65535).toString(16)}`;
  const ua = crypto.randomUUID();
  const a = await guest(prefix + ":a::1", ua);
  const b = await guest(prefix + ":b::2", crypto.randomUUID());
  const c = await guest("192.0.2.150", ua);
  async function spend(session: typeof a, cost: number) {
    return CreditRepository.deductCreditsForModelUsage(
      { ...session, roles: [...session.roles] },
      cost,
      expensive,
      logger,
      t,
      defaultLocale,
    );
  }
  protectionEnv.FREE_CLUSTER_CREDITS = 3;
  protectionEnv.FREE_CLUSTER_MODE = "off";
  expect((await spend(a, 1)).success).toBe(true);
  protectionEnv.FREE_CLUSTER_MODE = "shadow";
  expect((await spend(a, 2)).success).toBe(true);
  expect((await spend(b, 2)).success).toBe(true);
  expect((await rows(b.leadId))[0]).toMatchObject({
    amount: -2,
    funding: CreditFundingType.FREE_ALLOWANCE,
    meta: { clusterCredits: 1 },
  });
  expect((await report()).cluster - before.cluster).toBe(1);
  protectionEnv.FREE_CLUSTER_MODE = "enforce";
  expect((await spend(b, 1)).success).toBe(false);
  expect(await rows(b.leadId)).toHaveLength(1);
  const charge = await spend(c, 2);
  expect(charge).toMatchObject({
    success: true,
    data: { partialDeduction: true },
  });
  expect((await rows(c.leadId))[0]).toMatchObject({
    amount: -1,
    funding: CreditFundingType.FREE_ALLOWANCE,
  });
});

it("clamps expensive models to purchased packs in preflight and in the ledger, and exempts purchasers from cluster limits", async () => {
  const before = await report();
  const g = await guest("198.51.100.64", crypto.randomUUID());
  const [owner] = await db
    .insert(users)
    .values({
      email: `q81-${crypto.randomUUID()}@example.invalid`,
      privateName: "Q81",
      publicName: "Q81",
      password: "fixture",
      locale: defaultLocale,
      emailVerified: true,
    })
    .returning({ id: users.id });
  userIds.push(owner.id);
  await db
    .insert(userLeadLinks)
    .values({ userId: owner.id, leadId: g.leadId, linkReason: "signup" });
  const user = {
    id: owner.id,
    leadId: g.leadId,
    isPublic: false,
    roles: [UserPermissionRole.CUSTOMER],
  } as const;
  const debit = (cost: number) =>
    CreditRepository.deductCreditsForModelUsage(
      { ...user, roles: [...user.roles] },
      cost,
      expensive,
      logger,
      t,
      defaultLocale,
    );
  protectionEnv.FREE_MODEL_MODE = "off";
  expect((await debit(1)).success).toBe(true);
  protectionEnv.FREE_MODEL_MODE = "shadow";
  expect((await debit(1)).success).toBe(true);
  expect((await report()).model - before.model).toBe(1);
  for (const type of ["permanent", "bonus"] as const) {
    const added = await CreditRepository.addUserCredits(
      user.id,
      3,
      type,
      logger,
      t,
      undefined,
      crypto.randomUUID(),
    );
    expect(added.success).toBe(true);
  }
  protectionEnv.FREE_MODEL_MODE = "enforce";
  const pl = scopedTranslation.scopedT("pl-PL").t;
  const gate = await protectedBalance(
    user.id,
    user.leadId,
    expensive,
    40,
    4,
    pl,
    "pl-PL",
  );
  expect(gate).toMatchObject({
    success: false,
    message: pl("errors.purchasedModel", { path: "/pl-PL/subscription/buy" }),
  });
  expect(
    await protectedBalance(
      user.id,
      user.leadId,
      expensive,
      40,
      3,
      t,
      defaultLocale,
    ),
  ).toMatchObject({ success: true, data: 3 });
  expect((await debit(3)).success).toBe(true);
  expect((await debit(1)).success).toBe(false);
  expect((await rows(g.leadId)).map((r) => r.amount)).toEqual([-1, -1]);
  const paid = await db
    .select({
      funding: creditTransactions.fundingType,
      amount: creditTransactions.amount,
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .where(
      and(
        eq(creditWallets.userId, user.id),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    );
  expect(paid).toEqual([{ funding: CreditFundingType.PURCHASED, amount: -3 }]);
  protectionEnv.FREE_CLUSTER_MODE = "enforce";
  protectionEnv.FREE_CLUSTER_CREDITS = 0;
  const cheap = ChatModelId.GLM_5_3_FLASH_UNCENSORED;
  const paidPack = await CreditRepository.addUserCredits(
    user.id,
    2,
    "subscription",
    logger,
    t,
    new Date(Date.now() + 86_400_000),
    crypto.randomUUID(),
  );
  expect(paidPack.success).toBe(true);
  const mixed = await CreditRepository.deductCreditsForModelUsage(
    { ...user, roles: [...user.roles] },
    2,
    cheap,
    logger,
    t,
    defaultLocale,
  );
  if (!mixed.success || !mixed.data.messageId) {
    return expect.unreachable("Expected an eligible subscription debit");
  }
  expect(
    await db
      .select({
        funding: creditTransactions.fundingType,
        amount: creditTransactions.amount,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.messageId, mixed.data.messageId)),
  ).toEqual([{ funding: CreditFundingType.SUBSCRIPTION, amount: -2 }]);
  expect(await rows(g.leadId)).toHaveLength(2);
  await db.insert(paymentTransactions).values({
    userId: user.id,
    status: PaymentStatus.SUCCEEDED,
    amount: "1.00",
    currency: "USD",
  });
  expect(
    (
      await CreditRepository.deductCreditsForModelUsage(
        { ...user, roles: [...user.roles] },
        1,
        cheap,
        logger,
        t,
        defaultLocale,
      )
    ).success,
  ).toBe(true);
  expect(await rows(g.leadId)).toHaveLength(3);
});

it("serializes concurrent free debits across distinct guest wallets on one IPv4 /24 and starts a new budget in the next window", async () => {
  protectionEnv.FREE_CLUSTER_MODE = "enforce";
  protectionEnv.FREE_CLUSTER_RULES = "prefix";
  protectionEnv.FREE_CLUSTER_CREDITS = 1;
  const prefix = `10.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`;
  const guests = await Promise.all([
    guest(prefix + ".1", crypto.randomUUID()),
    guest(prefix + ".2", crypto.randomUUID()),
  ]);
  const charge = (session: (typeof guests)[number]) =>
    CreditRepository.deductCreditsForModelUsage(
      { ...session, roles: [...session.roles] },
      1,
      expensive,
      logger,
      t,
      defaultLocale,
    );
  const results = await Promise.all(guests.map(charge));
  expect(results.filter((r) => r.success)).toHaveLength(1);
  const debits = await Promise.all(guests.map((g) => rows(g.leadId)));
  expect(debits.flat()).toHaveLength(1);
  const wallets = await db
    .select({ id: creditWallets.id })
    .from(creditWallets)
    .where(
      inArray(
        creditWallets.leadId,
        guests.map((g) => g.leadId),
      ),
    );
  await db
    .update(creditTransactions)
    .set({ createdAt: new Date(Date.now() - 48 * 3_600_000) })
    .where(
      and(
        inArray(
          creditTransactions.walletId,
          wallets.map((w) => w.id),
        ),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    );
  expect((await charge(guests[0])).success).toBe(true);
});
