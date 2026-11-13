/**
 * Free-credit access rules against farming (thresholds in ./config.ts):
 * - account tiers need a verified email
 * - each subnet (IPv4 /24, IPv6 /64) gets ACCOUNT_POOLS_PER_SUBNET_PER_MONTH
 *   new free account pools per month and GUEST_POOLS_PER_SUBNET_PER_DAY new
 *   guest pools per day; pools beyond that get no free credits (accounts keep
 *   trying each month, a purchase lifts the block)
 * - guest free spend from the signup IP in the 24 h before signup counts once
 *   against the new account
 */

import "server-only";

import { and, eq, gte, inArray, isNotNull, lte, or, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { ipPoolKey, ipSubnetKey } from "next-vibe/identity/lead/ip-key";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditTransactions, creditWallets } from "../db";
import { CreditPackType, CreditTransactionType } from "../enum";
import {
  ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
  FREE_POOL_CLAIMS_START,
  GUEST_POOLS_PER_SUBNET_PER_DAY,
  SIGNUP_GUEST_SPEND_LOOKBACK_HOURS,
} from "./config";
import { type FreePoolClaimKind, freePoolClaims } from "./db";
import { recordAntiFarmingEvent } from "./events";

/** Why an account pool gets (or does not get) its free tiers */
export type AccountFreeAccess = "active" | "verifyEmail" | "subnetLimit";

const leadIp = sql<
  string | null
>`COALESCE(${leads.ipAddress}, ${leads.metadata}->>'ipAddress')`;

function monthPeriod(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function dayPeriod(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/** The IP the account signed up from (its signup lead, else its first lead) */
async function accountSignupIp(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ ip: leadIp })
    .from(userLeadLinks)
    .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
    .where(and(eq(userLeadLinks.userId, userId), isNotNull(leadIp)))
    .orderBy(
      sql`CASE WHEN ${userLeadLinks.linkReason} = 'signup' THEN 0 ELSE 1 END`,
      userLeadLinks.createdAt,
    )
    .limit(1);
  return row?.ip ?? null;
}

/**
 * Claim a slot in the subnet's budget for this pool and period.
 * Idempotent per pool + period; returns whether the pool may have free credits.
 */
async function claimSlot(
  {
    kind,
    subnet,
    period,
    poolKey,
    limit,
  }: {
    kind: FreePoolClaimKind;
    subnet: string;
    period: string;
    poolKey: string;
    limit: number;
  },
  logger: EndpointLogger,
): Promise<boolean> {
  const [existing] = await db
    .select({ granted: freePoolClaims.granted })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, kind),
        eq(freePoolClaims.period, period),
        eq(freePoolClaims.poolKey, poolKey),
      ),
    )
    .limit(1);
  if (existing) {
    return existing.granted;
  }
  const [{ used }] = await db
    .select({ used: sql<number>`count(*)::int` })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, kind),
        eq(freePoolClaims.subnet, subnet),
        eq(freePoolClaims.period, period),
        eq(freePoolClaims.granted, true),
      ),
    );
  const granted = Number(used) < limit;
  const [inserted] = await db
    .insert(freePoolClaims)
    .values({ kind, subnet, period, poolKey, granted })
    .onConflictDoNothing()
    .returning({ granted: freePoolClaims.granted });
  if (!inserted) {
    // A concurrent request claimed first: its decision wins
    const [winner] = await db
      .select({ granted: freePoolClaims.granted })
      .from(freePoolClaims)
      .where(
        and(
          eq(freePoolClaims.kind, kind),
          eq(freePoolClaims.period, period),
          eq(freePoolClaims.poolKey, poolKey),
        ),
      )
      .limit(1);
    return winner?.granted ?? granted;
  }
  if (!granted) {
    await recordAntiFarmingEvent(
      {
        kind:
          kind === "account" ? "subnet_account_limit" : "subnet_guest_limit",
        subnet,
      },
      logger,
    );
  }
  return granted;
}

/**
 * Account free access: verified email, then the subnet's monthly budget.
 * Accounts created before FREE_POOL_CLAIMS_START are grandfathered (neither
 * rule applies). Accounts that ever bought credits are never budgeted.
 * A budgeted account keeps its slot for good.
 */
export async function resolveAccountFreeAccess(
  userId: string,
  logger: EndpointLogger,
): Promise<AccountFreeAccess> {
  const [user] = await db
    .select({ emailVerified: users.emailVerified, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) {
    return "verifyEmail";
  }
  // Accounts from before the rules existed keep their tiers as they were
  if (user.createdAt < FREE_POOL_CLAIMS_START) {
    return "active";
  }
  if (!user.emailVerified) {
    return "verifyEmail";
  }
  const poolKey = `user:${userId}`;
  const [everGranted] = await db
    .select({ id: freePoolClaims.id })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, "account"),
        eq(freePoolClaims.poolKey, poolKey),
        eq(freePoolClaims.granted, true),
      ),
    )
    .limit(1);
  if (everGranted) {
    return "active";
  }
  const [purchase] = await db
    .select({ id: creditPacks.id })
    .from(creditPacks)
    .innerJoin(creditWallets, eq(creditWallets.id, creditPacks.walletId))
    .where(
      and(
        eq(creditWallets.userId, userId),
        inArray(creditPacks.type, [
          CreditPackType.PERMANENT,
          CreditPackType.SUBSCRIPTION,
        ]),
      ),
    )
    .limit(1);
  if (purchase) {
    return "active";
  }
  const subnet = ipSubnetKey(await accountSignupIp(userId));
  if (!subnet) {
    // No IP on record: nothing to budget against
    return "active";
  }
  const granted = await claimSlot(
    {
      kind: "account",
      subnet,
      period: monthPeriod(new Date()),
      poolKey,
      limit: ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
    },
    logger,
  );
  return granted ? "active" : "subnetLimit";
}

/**
 * Claim today's guest budget for a NEW guest pool (its first lead).
 * Returns false when the subnet already started its daily quota of guest pools.
 */
export async function claimGuestPool(
  leadId: string,
  logger: EndpointLogger,
): Promise<boolean> {
  const [lead] = await db
    .select({ ip: leadIp })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);
  const subnet = ipSubnetKey(lead?.ip ?? null);
  if (!subnet) {
    return true;
  }
  return await claimSlot(
    {
      kind: "guest",
      subnet,
      period: dayPeriod(new Date()),
      poolKey: `lead:${leadId}`,
      limit: GUEST_POOLS_PER_SUBNET_PER_DAY,
    },
    logger,
  );
}

/**
 * A guest pool is blocked when its leads only hold refused claims (the pool
 * was started beyond the subnet's daily guest quota). Pools without claims
 * (older pools, unknown IPs) are never blocked.
 */
export async function isGuestPoolBlocked(leadIds: string[]): Promise<boolean> {
  if (leadIds.length === 0) {
    return false;
  }
  const claims = await db
    .select({ granted: freePoolClaims.granted })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, "guest"),
        inArray(
          freePoolClaims.poolKey,
          leadIds.map((id) => `lead:${id}`),
        ),
      ),
    );
  return claims.length > 0 && claims.every((c) => !c.granted);
}

/**
 * Free credits guests spent from the account's signup IP in the 24 h before
 * the account was created, on leads outside the account's pool. Counted once
 * against the new account (a signed-in user cannot start fresh after burning
 * an incognito guest pool).
 */
export async function signupGuestCarryover({
  userId,
  poolLeadIds,
}: {
  userId: string;
  poolLeadIds: string[];
}): Promise<number> {
  const [user] = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) {
    return 0;
  }
  const ip = await accountSignupIp(userId);
  const key = ipPoolKey(ip);
  if (!ip || !key) {
    return 0;
  }
  const from = new Date(
    user.createdAt.getTime() - SIGNUP_GUEST_SPEND_LOOKBACK_HOURS * 3_600_000,
  );
  const guestLeads = await db
    .select({ id: leads.id })
    .from(leads)
    .where(or(sql`${leads.metadata}->>'ipKey' = ${key}`, eq(leadIp, ip)));
  const guestLeadIds = guestLeads
    .map((l) => l.id)
    .filter((id) => !poolLeadIds.includes(id));
  if (guestLeadIds.length === 0) {
    return 0;
  }
  const [row] = await db
    .select({
      spent: sql<string>`COALESCE(sum((${creditTransactions.metadata}->>'freeCreditsUsed')::numeric), 0)`,
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .where(
      and(
        inArray(creditWallets.leadId, guestLeadIds),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        gte(creditTransactions.createdAt, from),
        lte(creditTransactions.createdAt, user.createdAt),
      ),
    );
  return Math.round(Number(row?.spent ?? 0) * 1_000_000) / 1_000_000;
}
