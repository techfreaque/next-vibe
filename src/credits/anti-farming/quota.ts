/**
 * Free-credit access rules against farming (thresholds in ./config.ts):
 * - accounts created since FREE_POOL_CLAIMS_START get no free credits at all
 *   until their email is verified; account tiers need a verified email
 * - each subnet (IPv4 /24, IPv6 /64) gets ACCOUNT_POOLS_PER_SUBNET_PER_MONTH
 *   new free account pools per month and GUEST_POOLS_PER_SUBNET_PER_DAY new
 *   guest pools per day; pools beyond that get no free credits (accounts keep
 *   trying each month, a purchase lifts the block)
 * - guest free spend from the signup IP in the 24 h before signup counts once
 *   against the new account
 * - hosting/VPN networks (DB-IP ASN, src/leads/geo/asn) additionally get
 *   ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY new account pools per ASN per day,
 *   so rotating /24s inside one provider does not reset the budget
 * - an account sharing an exact IP AND user agent with an account granted in
 *   the IP_LINK_WINDOW_DAYS before it shares that account's pool (gets none)
 * - the newsletter bonus needs a slot in its network's monthly newsletter
 *   budget (NEWSLETTER_BONUSES_PER_NETWORK_PER_MONTH)
 * - an admin-revoked pool (farm cleanup, kind account_revoked) gets no free
 *   tiers until the account buys credits
 */

import "server-only";

import {
  and,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  lte,
  ne,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import { isPrivateAddress } from "next-vibe/core/utils/ssrf-guard";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { ipPoolKey, ipSubnetKey } from "next-vibe/identity/lead/ip-key";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { hostingAsnForIp } from "@/leads/geo/asn/lookup";

import { creditPacks, creditTransactions, creditWallets } from "../db";
import { CreditPackType, CreditTransactionType } from "../enum";
import { poolNewsletterConfirmedAt } from "../free-allowance";
import {
  ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY,
  ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
  FREE_POOL_CLAIMS_START,
  GUEST_POOLS_PER_SUBNET_PER_DAY,
  IP_LINK_WINDOW_DAYS,
  NEWSLETTER_BONUS_CLAIMS_START,
  NEWSLETTER_BONUSES_PER_NETWORK_PER_MONTH,
  SIGNUP_GUEST_SPEND_LOOKBACK_HOURS,
} from "./config";
import {
  type AntiFarmingEventKind,
  type FreePoolClaimKind,
  freePoolClaims,
} from "./db";
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
      { kind: CLAIM_LIMIT_EVENT[kind], subnet },
      logger,
    );
  }
  return granted;
}

/** Event recorded when a claim of this kind is refused */
const CLAIM_LIMIT_EVENT: Record<FreePoolClaimKind, AntiFarmingEventKind> = {
  account: "subnet_account_limit",
  account_asn: "asn_account_limit",
  guest: "subnet_guest_limit",
  newsletter: "newsletter_network_limit",
  account_revoked: "subnet_account_limit",
};

/** Budget key of a hosting/VPN network, or null for any other network */
async function hostingNetworkKey(
  ip: string | null,
  logger: EndpointLogger,
): Promise<string | null> {
  if (!ip || isPrivateAddress(ip)) {
    return null;
  }
  const asn = await hostingAsnForIp(ip, logger);
  return asn ? `asn:${String(asn)}` : null;
}

/** The pool's claim of this kind for this period, if any */
async function existingClaim(
  kind: FreePoolClaimKind,
  period: string,
  poolKey: string,
): Promise<{ granted: boolean } | undefined> {
  const [row] = await db
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
  return row;
}

/** Did the account ever get a granted claim of this kind? */
async function everGrantedClaim(
  kind: FreePoolClaimKind,
  poolKey: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: freePoolClaims.id })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, kind),
        eq(freePoolClaims.poolKey, poolKey),
        eq(freePoolClaims.granted, true),
      ),
    )
    .limit(1);
  return row !== undefined;
}

/** Did the account ever buy credits (one-off pack or subscription)? */
async function hasPurchased(userId: string): Promise<boolean> {
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
  return purchase !== undefined;
}

/**
 * Another account, created in the IP_LINK_WINDOW_DAYS before this one and
 * already granted its free pool, that shares an exact IP (IPv4 /32, IPv6 /64)
 * AND the same user agent with any of this account's leads.
 * Loopback/private IPs and leads without a user agent never link.
 */
export async function findIpLinkedGrantedAccount(
  userId: string,
  createdAt: Date,
): Promise<string | null> {
  const mine = await db
    .selectDistinct({ ip: leadIp, userAgent: leads.userAgent })
    .from(userLeadLinks)
    .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
    .where(
      and(
        eq(userLeadLinks.userId, userId),
        isNotNull(leadIp),
        isNotNull(leads.userAgent),
      ),
    );
  const since = new Date(
    createdAt.getTime() - IP_LINK_WINDOW_DAYS * 24 * 3_600_000,
  );
  for (const { ip, userAgent } of mine) {
    const key = ipPoolKey(ip);
    if (!ip || !key || !userAgent || isPrivateAddress(ip)) {
      continue;
    }
    const [hit] = await db
      .select({ userId: users.id })
      .from(userLeadLinks)
      .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
      .innerJoin(users, eq(users.id, userLeadLinks.userId))
      .where(
        and(
          ne(userLeadLinks.userId, userId),
          gte(users.createdAt, since),
          lte(users.createdAt, createdAt),
          eq(leads.userAgent, userAgent),
          or(sql`${leads.metadata}->>'ipKey' = ${key}`, eq(leadIp, ip)),
          sql`EXISTS (
            SELECT 1 FROM ${freePoolClaims}
            WHERE ${freePoolClaims.kind} = 'account'
              AND ${freePoolClaims.granted}
              AND ${freePoolClaims.poolKey} = 'user:' || ${users.id}::text
          )`,
        ),
      )
      .limit(1);
    if (hit) {
      return hit.userId;
    }
  }
  return null;
}

/**
 * Account free access, in order: verified email; accounts created before
 * FREE_POOL_CLAIMS_START are never budgeted (while unverified they keep only
 * what they were already granted this period, see
 * {@link grandfatheredUnverifiedCap}); an admin-revoked pool stays empty until
 * a purchase; a granted slot is kept for good; buyers are never budgeted.
 * A new pool then needs: no exact IP + user agent link to an account granted
 * in the IP_LINK_WINDOW_DAYS before it, a slot in its hosting ASN's daily
 * budget (hosting/VPN networks only; a refused account retries the next day),
 * and a slot in its subnet's monthly budget (retried each month).
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
  if (!user.emailVerified) {
    return "verifyEmail";
  }
  // Accounts from before the subnet budget existed are never budgeted
  if (user.createdAt < FREE_POOL_CLAIMS_START) {
    return "active";
  }
  const poolKey = `user:${userId}`;
  // Farm cleanup: a revoked pool has no free tiers until the account buys
  if (await everRevoked(poolKey)) {
    return (await hasPurchased(userId)) ? "active" : "subnetLimit";
  }
  if (await everGrantedClaim("account", poolKey)) {
    return "active";
  }
  if (await hasPurchased(userId)) {
    return "active";
  }
  const signupIp = await accountSignupIp(userId);
  const subnet = ipSubnetKey(signupIp);
  if (!subnet) {
    // No IP on record: nothing to budget against
    return "active";
  }
  const now = new Date();
  const month = monthPeriod(now);
  // This month's verdict stands (cheap path for every later balance read)
  const decided = await existingClaim("account", month, poolKey);
  if (decided) {
    return decided.granted ? "active" : "subnetLimit";
  }
  // Same person, second account: exact IP + same browser as a granted account
  const linkedTo = await findIpLinkedGrantedAccount(userId, user.createdAt);
  if (linkedTo) {
    await db
      .insert(freePoolClaims)
      .values({
        kind: "account",
        subnet,
        period: month,
        poolKey,
        granted: false,
      })
      .onConflictDoNothing();
    await recordAntiFarmingEvent({ kind: "ip_link_limit", subnet }, logger);
    logger.info("Free pool shared with an IP-linked account", {
      userId,
      linkedTo,
    });
    return "subnetLimit";
  }
  // Hosting/VPN networks: a daily budget for the whole ASN comes first, so a
  // refusal there never uses up a slot of the subnet budget
  const asnKey = await hostingNetworkKey(signupIp, logger);
  if (asnKey) {
    const asnGranted = await claimSlot(
      {
        kind: "account_asn",
        subnet: asnKey,
        period: dayPeriod(now),
        poolKey,
        limit: ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY,
      },
      logger,
    );
    if (!asnGranted) {
      return "subnetLimit";
    }
  }
  const granted = await claimSlot(
    {
      kind: "account",
      subnet,
      period: month,
      poolKey,
      limit: ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
    },
    logger,
  );
  return granted ? "active" : "subnetLimit";
}

/** Was the account's free pool revoked by an admin (farm cleanup)? */
async function everRevoked(poolKey: string): Promise<boolean> {
  const [row] = await db
    .select({ id: freePoolClaims.id })
    .from(freePoolClaims)
    .where(
      and(
        eq(freePoolClaims.kind, "account_revoked"),
        eq(freePoolClaims.poolKey, poolKey),
      ),
    )
    .limit(1);
  return row !== undefined;
}

/**
 * Does the account get its newsletter bonus? Needs a confirmed subscription
 * (the double opt-in link clicked). A subscription confirmed since
 * NEWSLETTER_BONUS_CLAIMS_START on an account created under the anti-farming
 * rules also needs a slot in its network's monthly newsletter budget
 * (NEWSLETTER_BONUSES_PER_NETWORK_PER_MONTH; network = hosting ASN, else the
 * signup subnet). A granted bonus stays; a purchase skips the budget.
 * Loopback/private signup IPs are exempt.
 */
export async function resolveNewsletterBonus(
  { userId, leadIds }: { userId: string; leadIds: string[] },
  logger: EndpointLogger,
): Promise<boolean> {
  const confirmedAt = await poolNewsletterConfirmedAt({ userId, leadIds });
  if (!confirmedAt) {
    return false;
  }
  if (confirmedAt < NEWSLETTER_BONUS_CLAIMS_START) {
    return true;
  }
  if (!(await isBudgetedAccount(userId))) {
    return true;
  }
  const poolKey = `user:${userId}`;
  if (await everGrantedClaim("newsletter", poolKey)) {
    return true;
  }
  if (await hasPurchased(userId)) {
    return true;
  }
  const signupIp = await accountSignupIp(userId);
  if (!signupIp || isPrivateAddress(signupIp)) {
    return true;
  }
  const network =
    (await hostingNetworkKey(signupIp, logger)) ?? ipSubnetKey(signupIp);
  if (!network) {
    return true;
  }
  return await claimSlot(
    {
      kind: "newsletter",
      subnet: network,
      period: monthPeriod(new Date()),
      poolKey,
      limit: NEWSLETTER_BONUSES_PER_NETWORK_PER_MONTH,
    },
    logger,
  );
}

/**
 * True when the account was created under the anti-farming rules
 * (FREE_POOL_CLAIMS_START or later). Such accounts get no free credits at all
 * until their email is verified. Unknown users count as budgeted.
 */
export async function isBudgetedAccount(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return !user || user.createdAt >= FREE_POOL_CLAIMS_START;
}

/**
 * Account tier an unverified account created before FREE_POOL_CLAIMS_START
 * already received in the current monthly period: it keeps that cap until the
 * next refill, then needs a verified email like every new account.
 * Counts grants made under the current tiers (tier stamped on the row);
 * pre-2026-11 grants are kept by computeGrandfatheredFreeCap.
 * Returns 0 when the account is newer or got no account tier this period.
 */
export async function grandfatheredUnverifiedCap({
  userId,
  leadWalletIds,
  now = new Date(),
}: {
  userId: string;
  leadWalletIds: string[];
  now?: Date;
}): Promise<number> {
  if (leadWalletIds.length === 0) {
    return 0;
  }
  const [user] = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user || user.createdAt >= FREE_POOL_CLAIMS_START) {
    return 0;
  }
  const meta = creditTransactions.metadata;
  const [row] = await db
    .select({
      cap: sql<
        string | null
      >`max(COALESCE((${meta}->>'totalPoolFreeCredits')::numeric, ${creditTransactions.amount}))`,
    })
    .from(creditTransactions)
    .where(
      and(
        inArray(creditTransactions.walletId, leadWalletIds),
        eq(creditTransactions.freePeriodId, monthPeriod(now)),
        eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
        isNotNull(sql`${meta}->>'tierVersion'`),
        inArray(sql`${meta}->>'tier'`, ["account", "accountNewsletter"]),
      ),
    );
  return Math.max(0, Number(row?.cap ?? 0));
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
    .select({ ip: leadIp, isBot: leads.isBot })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);
  if (lead?.isBot) {
    return false;
  }
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
 *
 * Only real guest spend counts, and each guest row only once per IP:
 * - carryover rows are bookkeeping, never spend (counting them doubled the
 *   charge with every signup from one browser, 2026-11-16)
 * - leads linked to an account are that account's spend, not guest spend
 * - rows up to the last carryover's `carriedUntil` at this IP were already
 *   counted against an earlier account
 */
export async function signupGuestCarryover({
  userId,
  poolLeadIds,
}: {
  userId: string;
  poolLeadIds: string[];
}): Promise<{ amount: number; carriedUntil: Date } | null> {
  const [user] = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) {
    return null;
  }
  const ip = await accountSignupIp(userId);
  const key = ipPoolKey(ip);
  if (!ip || !key) {
    return null;
  }
  const sameIp = or(sql`${leads.metadata}->>'ipKey' = ${key}`, eq(leadIp, ip));
  const isCarryover = sql`(${creditTransactions.metadata}->>'signupCarryover') = 'true'`;
  const lookbackFrom = new Date(
    user.createdAt.getTime() - SIGNUP_GUEST_SPEND_LOOKBACK_HOURS * 3_600_000,
  );
  const [watermark] = await db
    .select({
      until: sql<
        string | null
      >`max(COALESCE((${creditTransactions.metadata}->>'carriedUntil')::timestamptz, ${creditTransactions.createdAt}))`,
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .innerJoin(leads, eq(leads.id, creditWallets.leadId))
    .where(
      and(
        sameIp,
        isCarryover,
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        gte(creditTransactions.createdAt, lookbackFrom),
        sql`${creditTransactions.metadata}->>'grantKey' <> ${signupCarryoverGrantKey(userId)}`,
      ),
    );
  const carriedBefore = watermark?.until ? new Date(watermark.until) : null;
  const from =
    carriedBefore && carriedBefore > lookbackFrom
      ? carriedBefore
      : lookbackFrom;
  // One query: the guest leads of that IP are a join, not a materialised id
  // list. A shared IP (CGNAT, VPN exit, localhost in dev) has thousands of
  // guest leads; loading them and binding each as an IN parameter cost
  // ~30 ms of sync drizzle query building per credit check.
  const [row] = await db
    .select({
      spent: sql<string>`COALESCE(sum((${creditTransactions.metadata}->>'freeCreditsUsed')::numeric), 0)`,
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .innerJoin(leads, eq(leads.id, creditWallets.leadId))
    .where(
      and(
        sameIp,
        poolLeadIds.length > 0
          ? notInArray(creditWallets.leadId, poolLeadIds)
          : undefined,
        sql`NOT EXISTS (SELECT 1 FROM ${userLeadLinks} WHERE ${userLeadLinks.leadId} = ${leads.id})`,
        sql`COALESCE((${creditTransactions.metadata}->>'signupCarryover') = 'true', false) = false`,
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        carriedBefore && carriedBefore > lookbackFrom
          ? gt(creditTransactions.createdAt, from)
          : gte(creditTransactions.createdAt, from),
        lte(creditTransactions.createdAt, user.createdAt),
      ),
    );
  return {
    amount: Math.round(Number(row?.spent ?? 0) * 1_000_000) / 1_000_000,
    carriedUntil: user.createdAt,
  };
}

/** Idempotency key of the account's one carryover row */
export function signupCarryoverGrantKey(userId: string): string {
  return `free:user:${userId}:signup-carryover`;
}
