/**
 * Per-subnet signup rate limit: at most SIGNUPS_PER_SUBNET_PER_DAY new
 * accounts per IPv4 /24 or IPv6 /64 in a rolling 24 h window.
 * An account counts for the subnet of its signup IP (its signup lead, else its
 * first lead with an IP), the same IP the free-pool budget uses (quota.ts).
 * No IP, or a loopback/private IP (dev, tests, internal calls): no limit.
 */

import "server-only";

import { and, eq, gte, isNotNull, sql } from "drizzle-orm";
import { isPrivateAddress } from "next-vibe/core/utils/ssrf-guard";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { ipSubnetKey } from "next-vibe/identity/lead/ip-key";
import { users } from "next-vibe/identity/user/db";

import {
  SIGNUP_SUBNET_WINDOW_HOURS,
  SIGNUPS_PER_SUBNET_PER_DAY,
} from "./config";

const leadIp = sql<
  string | null
>`COALESCE(${leads.ipAddress}, ${leads.metadata}->>'ipAddress')`;

/** Accounts created since `since` whose signup IP falls in `subnet` */
export async function countRecentSignupsInSubnet(
  subnet: string,
  since: Date,
): Promise<number> {
  const rows = await db
    .select({
      userId: users.id,
      ip: leadIp,
    })
    .from(users)
    .innerJoin(userLeadLinks, eq(userLeadLinks.userId, users.id))
    .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
    .where(and(gte(users.createdAt, since), isNotNull(leadIp)))
    .orderBy(
      users.id,
      sql`CASE WHEN ${userLeadLinks.linkReason} = 'signup' THEN 0 ELSE 1 END`,
      userLeadLinks.createdAt,
    );
  // First row per user = its signup IP (same order as accountSignupIp)
  const signupSubnet = new Map<string, string | null>();
  for (const row of rows) {
    if (!signupSubnet.has(row.userId)) {
      signupSubnet.set(row.userId, ipSubnetKey(row.ip));
    }
  }
  let count = 0;
  for (const key of signupSubnet.values()) {
    if (key === subnet) {
      count++;
    }
  }
  return count;
}

/**
 * The subnet a signup from this IP would exceed, or null when it may sign up.
 * Exempt: no IP, unparseable IP, loopback/private ranges.
 */
export async function signupSubnetLimitHit(
  ip: string | null | undefined,
  now: Date = new Date(),
): Promise<string | null> {
  if (!ip || isPrivateAddress(ip)) {
    return null;
  }
  const subnet = ipSubnetKey(ip);
  if (!subnet) {
    return null;
  }
  const since = new Date(
    now.getTime() - SIGNUP_SUBNET_WINDOW_HOURS * 60 * 60 * 1000,
  );
  const count = await countRecentSignupsInSubnet(subnet, since);
  return count >= SIGNUPS_PER_SUBNET_PER_DAY ? subnet : null;
}
