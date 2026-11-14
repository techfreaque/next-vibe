/**
 * Anti-farming for free credits (thresholds in ./config.ts):
 * - guests behind one IP share one guest pool (rolling 24 h)
 * - accounts never share through IP alone
 * - guest spend from the signup IP counts once against the new account
 * - account tiers need a verified email
 * - per-subnet budgets for new account and guest pools
 * Requires the dev DB, like the other credits repository tests.
 */

import { eq, inArray, like, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { creditTransactions, creditWallets } from "../db";
import { FreeCreditsStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import { publicFreeTierDailyCap } from "../public-cap/db";
import { CreditRepository } from "../repository";
import {
  ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
  FREE_POOL_CLAIMS_START,
  GUEST_POOLS_PER_SUBNET_PER_DAY,
} from "./config";
import { antiFarmingEvents, freePoolClaims } from "./db";
import { ipPoolKey, ipSubnetKey } from "./ip";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { guest } = FREE_CREDIT_ALLOWANCE;
const accountBase = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
// Signups send real emails over SMTP; well past bun's 5s default
const TIMEOUT_MS = 60_000;

const createdLeadIds: string[] = [];
const createdUserIds: string[] = [];
const subnets: string[] = [];

/** A fresh, unused /24 per call so reruns never share budgets */
function freshNet(): string {
  const a = 20 + Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 250);
  const c = Math.floor(Math.random() * 250);
  const net = `10.${String(a)}.${String(b)}`;
  subnets.push(`${net}.${String(c - c)}/24`);
  return net;
}

function postCutoff(): Date {
  return new Date(
    Math.max(Date.now(), FREE_POOL_CLAIMS_START.getTime() + 3_600_000),
  );
}

function guestUser(leadId: string): JwtPayloadType {
  return { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
}

/** A browser session from `ip` (distinct user agents = distinct browsers) */
async function visit(ip: string, browser: string): Promise<string> {
  const leadId = await createAnonymousLead(
    { ipAddress: ip, userAgent: `${browser}-${String(Math.random())}` },
    defaultLocale,
    logger,
  );
  createdLeadIds.push(leadId);
  return leadId;
}

async function balance(
  user: JwtPayloadType,
): Promise<{ free: number; status: string | undefined }> {
  const res = await CreditRepository.getBalance(user, logger, t, defaultLocale);
  expect(res.success, JSON.stringify(res)).toBe(true);
  return res.success
    ? { free: res.data.free, status: res.data.freeStatus }
    : { free: -1, status: undefined };
}

async function spend(user: JwtPayloadType, amount: number): Promise<void> {
  const res = await CreditRepository.deductCreditsForFeature(
    user,
    amount,
    "anti-farming-test",
    logger,
    t,
    defaultLocale,
  );
  expect(res.success, JSON.stringify(res)).toBe(true);
}

function uniqueEmail(tag: string): string {
  return `anti-farming-${tag}-${String(Date.now())}-${String(Math.floor(Math.random() * 1e6))}@example-test.invalid`;
}

/**
 * Sign up an account whose signup lead came from `ip` (verified unless told
 * otherwise). Returns the session payload.
 */
async function account(
  tag: string,
  ip: string | null,
  verified = true,
): Promise<JwtPayloadType | null> {
  const created = await createTestUser(uniqueEmail(tag));
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success || created.data.user.isPublic) {
    return null;
  }
  const user = created.data.user;
  createdUserIds.push(user.id);
  // These cases test the rules for NEW accounts: place them after the cutoff
  // (older accounts are grandfathered, see the cutoff case below)
  await db
    .update(users)
    .set({ createdAt: postCutoff() })
    .where(eq(users.id, user.id));
  if (ip) {
    const linked = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, user.id));
    await db
      .update(leads)
      .set({ ipAddress: ip })
      .where(
        inArray(
          leads.id,
          linked.map((l) => l.leadId),
        ),
      );
  }
  if (verified) {
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, user.id));
  }
  return user;
}

let savedCapSpend: { id: string; spendToday: number } | undefined;

beforeAll(async () => {
  const [row] = await db
    .select({
      id: publicFreeTierDailyCap.id,
      spendToday: publicFreeTierDailyCap.spendToday,
    })
    .from(publicFreeTierDailyCap)
    .limit(1);
  if (row) {
    savedCapSpend = row;
    await db
      .update(publicFreeTierDailyCap)
      .set({ spendToday: 0 })
      .where(eq(publicFreeTierDailyCap.id, row.id));
  }
});

afterAll(async () => {
  if (savedCapSpend) {
    await db
      .update(publicFreeTierDailyCap)
      .set({ spendToday: savedCapSpend.spendToday })
      .where(eq(publicFreeTierDailyCap.id, savedCapSpend.id));
  }
  for (const userId of createdUserIds) {
    await deleteTestUser(userId);
  }
  if (createdLeadIds.length > 0) {
    await db
      .delete(leadLeadLinks)
      .where(inArray(leadLeadLinks.leadId1, createdLeadIds));
    await db
      .delete(leadLeadLinks)
      .where(inArray(leadLeadLinks.leadId2, createdLeadIds));
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
  for (const subnet of subnets) {
    await db.delete(freePoolClaims).where(eq(freePoolClaims.subnet, subnet));
    await db
      .delete(antiFarmingEvents)
      .where(eq(antiFarmingEvents.subnet, subnet));
  }
  await db
    .delete(freePoolClaims)
    .where(like(freePoolClaims.subnet, "2001:db8:%"));
});

describe("ip keys", () => {
  it("IPv4 /32 and /24, IPv6 /64, mapped IPv4", () => {
    expect(ipPoolKey("203.0.113.7")).toBe("203.0.113.7/32");
    expect(ipSubnetKey("203.0.113.7")).toBe("203.0.113.0/24");
    expect(ipPoolKey("::ffff:203.0.113.7")).toBe("203.0.113.7/32");
    expect(ipPoolKey("2001:db8:1:2:aaaa::1")).toBe("2001:db8:1:2:0:0:0:0/64");
    expect(ipPoolKey("2001:db8:1:2:bbbb::9")).toBe(
      ipPoolKey("2001:db8:1:2:aaaa::1"),
    );
    expect(ipSubnetKey("2001:db8:1:2::1")).toBe("2001:db8:1:2:0:0:0:0/64");
    expect(ipPoolKey("not-an-ip")).toBeNull();
  });
});

describe("guest pools by IP", () => {
  it(
    "fresh incognito session from the same IP: same 20",
    async () => {
      const ip = `${freshNet()}.10`;
      const first = await visit(ip, "firefox");
      expect((await balance(guestUser(first))).free).toBe(guest);
      await spend(guestUser(first), 12);

      const incognito = await visit(ip, "firefox-private");
      expect((await balance(guestUser(incognito))).free).toBe(guest - 12);
    },
    TIMEOUT_MS,
  );

  it(
    "another browser on the same IP: same 20; IPv6 hosts in one /64 too",
    async () => {
      const ip = `${freshNet()}.11`;
      const chrome = await visit(ip, "chrome");
      expect((await balance(guestUser(chrome))).free).toBe(guest);
      await spend(guestUser(chrome), 7);
      const safari = await visit(ip, "safari");
      expect((await balance(guestUser(safari))).free).toBe(guest - 7);

      const hextet = Math.floor(Math.random() * 0xffff).toString(16);
      const v6a = await visit(`2001:db8:${hextet}:7::1`, "v6-a");
      expect((await balance(guestUser(v6a))).free).toBe(guest);
      await spend(guestUser(v6a), 4);
      const v6b = await visit(`2001:db8:${hextet}:7:ffff::2`, "v6-b");
      expect((await balance(guestUser(v6b))).free).toBe(guest - 4);
    },
    TIMEOUT_MS,
  );

  it(
    "a different IP: its own 20",
    async () => {
      const a = await visit(`${freshNet()}.12`, "edge");
      await spend(guestUser(a), 9);
      const b = await visit(`${freshNet()}.12`, "edge");
      expect((await balance(guestUser(b))).free).toBe(guest);
    },
    TIMEOUT_MS,
  );
});

describe("accounts", () => {
  it(
    "signup after guest use: incognito 20 + account = 40 total, not 60",
    async () => {
      const ip = `${freshNet()}.20`;
      const incognito = await visit(ip, "incognito");
      expect((await balance(guestUser(incognito))).free).toBe(guest);
      await spend(guestUser(incognito), guest);

      const user = await account("carryover", ip);
      if (!user) {
        return;
      }
      // The guest's 20 counts against the account once
      expect((await balance(user)).free).toBe(accountBase - guest);
      expect((await balance(user)).free).toBe(accountBase - guest);

      const history = await CreditRepository.getTransactionHistory(
        { paginationInfo: { page: 1, limit: 50 } },
        user,
        logger,
        t,
        defaultLocale,
      );
      expect(
        history.success &&
          history.data.transactions.some(
            (r) =>
              r.type === t("historyLabels.signupCarryover") &&
              r.amount === -guest,
          ),
      ).toBe(true);
    },
    TIMEOUT_MS,
  );

  it(
    "strangers with accounts on the same IP never share",
    async () => {
      const ip = `${freshNet()}.30`;
      const deviceX = await visit(ip, "x");
      const userX = await account("stranger-x", null);
      const userY = await account("stranger-y", null);
      if (!userX || !userY || userX.isPublic || userY.isPublic) {
        return;
      }
      await db
        .insert(userLeadLinks)
        .values({ userId: userX.id, leadId: deviceX, linkReason: "login" });
      // Y signs in from the same IP later: its new lead is not IP-linked to X
      const deviceY = await visit(ip, "y");
      await db
        .insert(userLeadLinks)
        .values({ userId: userY.id, leadId: deviceY, linkReason: "login" });
      // Even an explicit ip_match link never merges the accounts
      await db
        .insert(leadLeadLinks)
        .values({ leadId1: deviceX, leadId2: deviceY, linkReason: "ip_match" })
        .onConflictDoNothing();

      await spend(userX, 15);
      expect((await balance(userX)).free).toBe(accountBase - 15);
      expect((await balance(userY)).free).toBe(accountBase);
      expect((await balance(guestUser(deviceY))).free).toBe(accountBase);
    },
    TIMEOUT_MS,
  );

  it(
    "unverified account keeps the guest share and says why",
    async () => {
      const user = await account("unverified", null, false);
      if (!user) {
        return;
      }
      const now = await balance(user);
      expect(now.free).toBe(guest);
      expect(now.status).toBe(FreeCreditsStatus.VERIFY_EMAIL);
    },
    TIMEOUT_MS,
  );
});

describe("grandfathered accounts", () => {
  /** Move the account to before the cutoff (no subnet budget for it) */
  async function preCutoff(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        createdAt: new Date(FREE_POOL_CLAIMS_START.getTime() - 86_400_000),
      })
      .where(eq(users.id, userId));
  }

  async function poolLeadWalletIds(userId: string): Promise<string[]> {
    const linked = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId));
    const wallets = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(
        inArray(
          creditWallets.leadId,
          linked.map((l) => l.leadId),
        ),
      );
    return wallets.map((w) => w.id);
  }

  it(
    "created before the cutoff, unverified, no account tier this period: guest share + verify prompt",
    async () => {
      const user = await account("pre-cutoff-new", `${freshNet()}.50`, false);
      if (!user || user.isPublic) {
        return;
      }
      await preCutoff(user.id);
      const now = await balance(user);
      expect(now.free).toBe(guest);
      expect(now.status).toBe(FreeCreditsStatus.VERIFY_EMAIL);
    },
    TIMEOUT_MS,
  );

  it(
    "created before the cutoff, already granted the 40 this period: keeps it until the next refill, then needs verification",
    async () => {
      const user = await account("pre-cutoff-grace", `${freshNet()}.51`);
      if (!user || user.isPublic) {
        return;
      }
      await preCutoff(user.id);
      // Granted the account tier this period while the old rule applied
      expect((await balance(user)).free).toBe(accountBase);
      await db
        .update(users)
        .set({ emailVerified: false })
        .where(eq(users.id, user.id));

      const grace = await balance(user);
      expect(grace.free).toBe(accountBase);
      expect(grace.status).toBe(FreeCreditsStatus.VERIFY_EMAIL);

      // Next refill: push this period's wallets and grants back one month
      const walletIds = await poolLeadWalletIds(user.id);
      const lastMonth = new Date();
      lastMonth.setDate(1);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastPeriod = `${String(lastMonth.getFullYear())}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
      await db
        .update(creditWallets)
        .set({ freePeriodStart: lastMonth, freePeriodId: lastPeriod })
        .where(inArray(creditWallets.id, walletIds));
      await db
        .update(creditTransactions)
        // Grant keys name their month: drop them so this month's keys are free
        .set({
          freePeriodId: lastPeriod,
          metadata: sql`${creditTransactions.metadata} - 'grantKey'`,
        })
        .where(inArray(creditTransactions.walletId, walletIds));

      const refilled = await balance(user);
      expect(refilled.free).toBe(guest);
      expect(refilled.status).toBe(FreeCreditsStatus.VERIFY_EMAIL);

      // Verifying lifts it to the account tier again
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, user.id));
      const verified = await balance(user);
      expect(verified.free).toBe(accountBase);
      expect(verified.status).toBe(FreeCreditsStatus.ACTIVE);
    },
    TIMEOUT_MS,
  );
});

describe("subnet budgets", () => {
  it(
    `at most ${String(ACCOUNT_POOLS_PER_SUBNET_PER_MONTH)} new free accounts per /24 per month, then 0 free`,
    async () => {
      const net = freshNet();
      const statuses: string[] = [];
      const frees: number[] = [];
      for (let i = 0; i <= ACCOUNT_POOLS_PER_SUBNET_PER_MONTH; i++) {
        const user = await account(`subnet-${String(i)}`, `${net}.${String(40 + i)}`);
        if (!user) {
          return;
        }
        const now = await balance(user);
        frees.push(now.free);
        statuses.push(now.status ?? "");
      }
      expect(frees.slice(0, ACCOUNT_POOLS_PER_SUBNET_PER_MONTH)).toEqual(
        Array.from({ length: ACCOUNT_POOLS_PER_SUBNET_PER_MONTH }, () => accountBase),
      );
      expect(frees.at(-1)).toBe(0);
      expect(statuses.at(-1)).toBe(FreeCreditsStatus.SUBNET_LIMIT);

      const events = await db
        .select({ kind: antiFarmingEvents.kind })
        .from(antiFarmingEvents)
        .where(eq(antiFarmingEvents.subnet, `${net}.0/24`));
      expect(events.map((e) => e.kind)).toContain("subnet_account_limit");
    },
    TIMEOUT_MS * 2,
  );

  it(
    `at most ${String(GUEST_POOLS_PER_SUBNET_PER_DAY)} new guest pools per /24 per day`,
    async () => {
      const net = freshNet();
      const frees: number[] = [];
      for (let i = 0; i <= GUEST_POOLS_PER_SUBNET_PER_DAY; i++) {
        const lead = await visit(`${net}.${String(100 + i)}`, `guest-${String(i)}`);
        frees.push((await balance(guestUser(lead))).free);
      }
      expect(frees.slice(0, GUEST_POOLS_PER_SUBNET_PER_DAY)).toEqual(
        Array.from({ length: GUEST_POOLS_PER_SUBNET_PER_DAY }, () => guest),
      );
      expect(frees.at(-1)).toBe(0);
    },
    TIMEOUT_MS,
  );
});
