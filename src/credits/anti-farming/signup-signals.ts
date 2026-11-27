/**
 * Log-only signup signals (thresholds in ./config.ts). They record an
 * anti_farming_events row and never deny anything yet; once a week of data
 * shows they only hit farms, they can feed the free-pool decision.
 * - shadow_random_alias: a random plus-tag (RANDOM_ALIAS_MIN_LENGTH+ chars,
 *   random shape, see hasRandomPlusTag) on a big mail provider, e.g. name+8vn5azotz6@gmail.com.
 *   Real tags are words (+shopping, +news); bought-mailbox kits randomise them.
 * - shadow_signup_cluster: SIGNUP_CLUSTER_MIN_SIGNUPS+ accounts with the same
 *   private name (case-insensitive) and the same user agent within
 *   SIGNUP_CLUSTER_WINDOW_HOURS, from 2+ different subnets.
 */

import "server-only";

import { and, eq, gte, isNotNull, sql } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { ipSubnetKey } from "next-vibe/identity/lead/ip-key";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  RANDOM_ALIAS_MIN_LENGTH,
  SIGNUP_CLUSTER_MIN_SIGNUPS,
  SIGNUP_CLUSTER_WINDOW_HOURS,
} from "./config";
import { recordAntiFarmingEvent } from "./events";

/** Free webmail providers where a random plus-tag is a farming signal */
const BIG_MAIL_PROVIDERS: ReadonlySet<string> = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.de",
  "web.de",
  "mail.ru",
  "yandex.ru",
]);

/** Provider families with country domains (outlook.fr, hotmail.co.uk, yahoo.de) */
const BIG_MAIL_PREFIXES = ["outlook.", "hotmail.", "live.", "yahoo."] as const;

function isBigMailProvider(domain: string): boolean {
  return (
    BIG_MAIL_PROVIDERS.has(domain) ||
    BIG_MAIL_PREFIXES.some((prefix) => domain.startsWith(prefix))
  );
}

/**
 * True for a random-looking plus-tag on a big mail provider: 8+ chars of
 * [a-z0-9] with a letter, and either a digit followed by a letter
 * ("8vn5azotz6", "oudzqhb3ca") or, letters only, no pronounceable shape
 * (a run of 5+ consonants: "bxlnkbvmqd"). Word tags (+shopping,
 * +giveupalready) and word+number tags (+news2026, +test20261109) never
 * match. Prod 2026-11-27: all 15 farm tags match, none of the other 15
 * plus-addressed accounts do.
 */
export function hasRandomPlusTag(email: string): boolean {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain || !isBigMailProvider(domain)) {
    return false;
  }
  const plus = local.indexOf("+");
  if (plus < 0) {
    return false;
  }
  const tag = local.slice(plus + 1);
  if (
    tag.length < RANDOM_ALIAS_MIN_LENGTH ||
    !/^[a-z0-9]+$/.test(tag) ||
    !/[a-z]/.test(tag)
  ) {
    return false;
  }
  return /\d[a-z]/.test(tag) || /[^aeiouy\d]{5,}/.test(tag);
}

const leadIp = sql<
  string | null
>`COALESCE(${leads.ipAddress}, ${leads.metadata}->>'ipAddress')`;

/**
 * Accounts with this private name + user agent created since `since`, with
 * the subnets their leads came from.
 */
async function nameUaCluster(
  privateName: string,
  userAgent: string,
  since: Date,
): Promise<{ accounts: number; subnets: number }> {
  const rows = await db
    .selectDistinct({ userId: users.id, ip: leadIp })
    .from(users)
    .innerJoin(userLeadLinks, eq(userLeadLinks.userId, users.id))
    .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
    .where(
      and(
        gte(users.createdAt, since),
        sql`lower(${users.privateName}) = ${privateName.toLowerCase()}`,
        eq(leads.userAgent, userAgent),
        isNotNull(leadIp),
      ),
    );
  const accounts = new Set(rows.map((r) => r.userId));
  const subnets = new Set(
    rows.map((r) => ipSubnetKey(r.ip)).filter((key) => key !== null),
  );
  return { accounts: accounts.size, subnets: subnets.size };
}

/**
 * Record the log-only signals for a just-created account. Never fails the
 * signup: errors are logged and swallowed.
 */
export async function recordSignupSignals(
  { userId, email }: { userId: string; email: string },
  logger: EndpointLogger,
  now: Date = new Date(),
): Promise<void> {
  try {
    const [signup] = await db
      .select({
        privateName: users.privateName,
        ip: leadIp,
        userAgent: leads.userAgent,
      })
      .from(users)
      .innerJoin(userLeadLinks, eq(userLeadLinks.userId, users.id))
      .innerJoin(leads, eq(leads.id, userLeadLinks.leadId))
      .where(eq(users.id, userId))
      .orderBy(
        sql`CASE WHEN ${userLeadLinks.linkReason} = 'signup' THEN 0 ELSE 1 END`,
        userLeadLinks.createdAt,
      )
      .limit(1);
    const subnet = ipSubnetKey(signup?.ip ?? null);
    const emailDomain = email.split("@")[1]?.toLowerCase() ?? null;

    if (hasRandomPlusTag(email)) {
      await recordAntiFarmingEvent(
        { kind: "shadow_random_alias", subnet, emailDomain },
        logger,
      );
      logger.info("Signup signal: random plus-tag alias", {
        userId,
        emailDomain,
      });
    }

    if (signup?.privateName && signup.userAgent) {
      const since = new Date(
        now.getTime() - SIGNUP_CLUSTER_WINDOW_HOURS * 3_600_000,
      );
      const cluster = await nameUaCluster(
        signup.privateName,
        signup.userAgent,
        since,
      );
      if (
        cluster.accounts >= SIGNUP_CLUSTER_MIN_SIGNUPS &&
        cluster.subnets >= 2
      ) {
        await recordAntiFarmingEvent(
          { kind: "shadow_signup_cluster", subnet, emailDomain },
          logger,
        );
        logger.info("Signup signal: name + user agent cluster", {
          userId,
          accounts: cluster.accounts,
          subnets: cluster.subnets,
        });
      }
    }
  } catch (error) {
    logger.error("Signup signals failed", parseError(error), { userId });
  }
}
