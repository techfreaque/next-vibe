/**
 * Signups report repository.
 *
 * Cohort = users matching the shared users-list filters (filter-sql.ts),
 * humans only by default. Definitions (keep in sync with the widget hints):
 * - Signups: cohort accounts created in the window.
 * - Verified rate / paid conversion: share of those signups that verified
 *   their email / made at least one succeeded payment (ever).
 * - Active: cohort accounts with credit usage in the window (own wallet or a
 *   linked lead wallet, signup carryover excluded).
 * - Paying / revenue: succeeded payments in the window, USD via the finance
 *   static FX table.
 * - Free burn: credits spent in the window by cohort accounts that never paid.
 * - Banned: signups in the window that are banned now.
 * - Milestones (funnel field): signups in the period that verified, spent
 *   credits (any time) and paid, each as its own count (match the tiles).
 * All timestamps are UTC timestamp-without-time-zone.
 */

import "server-only";

import { and, type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  type AnalyticsWindow,
  fillBuckets,
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
} from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { CreditTransactionType } from "@/credits/enum";
import { notSignupCarryoverRaw } from "@/credits/usage-filter";
import { PaymentStatus } from "@/payment/enum";

import {
  ACTIVE_SUB_STATUSES,
  buildEnrichedUsers,
  buildUserFilterConditions,
  usageInWindowSql,
} from "../list/filter-sql";
import { roundMoney, usdAmountSqlRaw } from "../money-sql";
import type {
  UserStatsRequestOutput,
  UserStatsResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type NumLike = string | number | null;

const BREAKDOWN_LIMIT = 15;
const FREE_BURNER_LIMIT = 10;

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function ratio(part: number, whole: number): number {
  return whole > 0 ? part / whole : 0;
}

/** Previous-window value, or null when the window has no previous (all-time). */
function prev(win: AnalyticsWindow, value: number): number | null {
  return win.previousFrom ? value : null;
}

/** The filtered cohort as a SQL subquery (one row per account). */
function cohortQuery(data: UserStatsRequestOutput): SQL {
  const enriched = buildEnrichedUsers();
  const conditions = buildUserFilterConditions(data, enriched);
  const query = db
    .with(enriched)
    .select({
      id: sql<string>`${enriched.id}`.as("uid"),
      email: sql<string>`${enriched.email}`.as("email"),
      createdAt: sql<string>`${enriched.createdAt}`.as("created_at"),
      emailVerified: sql<boolean>`${enriched.emailVerified}`.as("verified"),
      isBanned: sql<boolean>`${enriched.isBanned}`.as("banned"),
      paymentsCount: sql<number>`${enriched.paymentsCount}`.as("payments"),
      totalPaidUsd: sql<number>`${enriched.totalPaidUsd}`.as("paid_usd"),
      channel: sql<string | null>`${enriched.channel}`.as("channel"),
      refCode: sql<
        string | null
      >`coalesce(${enriched.referralCode}, ${enriched.firstRefCode})`.as(
        "ref_code",
      ),
      locale: sql<string>`${enriched.locale}`.as("locale"),
      spentTotal: sql<number>`${enriched.creditsSpent}`.as("spent_total"),
      balance: sql<number>`${enriched.creditBalance}`.as("balance"),
    })
    .from(enriched)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return sql`${query}`;
}

export class UsersStatsRepository {
  static async getUserStats(
    data: UserStatsRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserStatsResponseOutput>> {
    try {
      const [floorRow] = await db
        .select({ first: sql<string | null>`min(${users.createdAt})` })
        .from(users);
      const win = resolveAnalyticsWindow(
        data,
        new Date(),
        floorRow?.first ? new Date(`${floorRow.first}Z`) : null,
      );
      logger.debug("Signups report", {
        window: serializeWindow(win),
        audience: data.audience,
      });

      const cohort = sql`WITH cohort AS (${cohortQuery(data)})`;
      const cur = (col: string): SQL => inWindowSql(sql.raw(col), win);
      const prv = (col: string): SQL => inPreviousWindowSql(sql.raw(col), win);
      const usage = CreditTransactionType.USAGE;
      const realUsage = sql.raw(notSignupCarryoverRaw("t"));
      const succeeded = PaymentStatus.SUCCEEDED;
      const usd = usdAmountSqlRaw("p.amount", "p.currency");
      const bucketOf = (col: string): SQL =>
        bucketSql(sql.raw(col), win.bucket);
      // wallet -> cohort account (own wallet + linked lead wallets)
      const owners = sql`owners AS (
        SELECT w.id AS wallet_id, c.uid FROM credit_wallets w JOIN cohort c ON c.uid = w.user_id
        UNION
        SELECT w.id, c.uid FROM user_lead_links ul
          JOIN cohort c ON c.uid = ul.user_id
          JOIN credit_wallets w ON w.lead_id = ul.lead_id
      )`;
      const usageRows = sql`usage AS (
        SELECT o.uid, t.created_at, -t.amount AS spent
        FROM credit_transactions t JOIN owners o ON o.wallet_id = t.wallet_id
        WHERE t.type = ${usage} AND ${realUsage}
      )`;
      const activeSubs = sql.join(
        ACTIVE_SUB_STATUSES.map((s) => sql`${s}`),
        sql`, `,
      );

      const [
        signupKpis,
        activityKpis,
        paymentKpis,
        signupSeries,
        activitySeries,
        paymentSeries,
        funnel,
        byChannel,
        byRefCode,
        byPlan,
        byLocale,
        burners,
      ] = await Promise.all([
        db.execute<
          QueryResultRow & {
            cohort: NumLike;
            signups: NumLike;
            verified: NumLike;
            converted: NumLike;
            banned: NumLike;
            signupsPrev: NumLike;
            verifiedPrev: NumLike;
            convertedPrev: NumLike;
            bannedPrev: NumLike;
            activated: NumLike;
            activatedPrev: NumLike;
          }
        >(sql`${cohort}
          SELECT count(*) AS cohort,
            count(*) FILTER (WHERE ${cur("c.created_at")}) AS signups,
            count(*) FILTER (WHERE ${cur("c.created_at")} AND c.verified) AS verified,
            count(*) FILTER (WHERE ${cur("c.created_at")} AND c.payments > 0) AS converted,
            count(*) FILTER (WHERE ${cur("c.created_at")} AND c.banned) AS banned,
            count(*) FILTER (WHERE ${prv("c.created_at")}) AS "signupsPrev",
            count(*) FILTER (WHERE ${prv("c.created_at")} AND c.verified) AS "verifiedPrev",
            count(*) FILTER (WHERE ${prv("c.created_at")} AND c.payments > 0) AS "convertedPrev",
            count(*) FILTER (WHERE ${prv("c.created_at")} AND c.banned) AS "bannedPrev",
            count(*) FILTER (WHERE ${cur("c.created_at")} AND ${usageInWindowSql(sql.raw("c.uid"), undefined, undefined)}) AS activated,
            count(*) FILTER (WHERE ${prv("c.created_at")} AND ${usageInWindowSql(sql.raw("c.uid"), undefined, undefined)}) AS "activatedPrev"
          FROM cohort c`),

        db.execute<
          QueryResultRow & {
            active: NumLike;
            activePrev: NumLike;
            burn: NumLike;
            burnPrev: NumLike;
            burners: NumLike;
          }
        >(sql`${cohort}, ${owners}, ${usageRows}
          SELECT
            count(DISTINCT u.uid) FILTER (WHERE ${cur("u.created_at")}) AS active,
            count(DISTINCT u.uid) FILTER (WHERE ${prv("u.created_at")}) AS "activePrev",
            coalesce(sum(u.spent) FILTER (WHERE ${cur("u.created_at")} AND c.payments = 0), 0) AS burn,
            coalesce(sum(u.spent) FILTER (WHERE ${prv("u.created_at")} AND c.payments = 0), 0) AS "burnPrev",
            count(DISTINCT u.uid) FILTER (WHERE ${cur("u.created_at")} AND c.payments = 0) AS burners
          FROM usage u JOIN cohort c ON c.uid = u.uid`),

        db.execute<
          QueryResultRow & {
            paying: NumLike;
            payingPrev: NumLike;
            revenue: NumLike;
            revenuePrev: NumLike;
          }
        >(sql`${cohort}
          SELECT
            count(DISTINCT p.user_id) FILTER (WHERE ${cur("p.created_at")}) AS paying,
            count(DISTINCT p.user_id) FILTER (WHERE ${prv("p.created_at")}) AS "payingPrev",
            coalesce(sum(${usd}) FILTER (WHERE ${cur("p.created_at")}), 0) AS revenue,
            coalesce(sum(${usd}) FILTER (WHERE ${prv("p.created_at")}), 0) AS "revenuePrev"
          FROM payment_transactions p JOIN cohort c ON c.uid = p.user_id
          WHERE p.status = ${succeeded}`),

        db.execute<
          QueryResultRow & {
            bucket: string;
            paid: NumLike;
            verified: NumLike;
            unverified: NumLike;
          }
        >(sql`${cohort}
          SELECT ${bucketOf("c.created_at")} AS bucket,
            count(*) FILTER (WHERE c.payments > 0) AS paid,
            count(*) FILTER (WHERE c.payments = 0 AND c.verified) AS verified,
            count(*) FILTER (WHERE c.payments = 0 AND NOT c.verified) AS unverified
          FROM cohort c WHERE ${cur("c.created_at")}
          GROUP BY 1`),

        db.execute<
          QueryResultRow & { bucket: string; active: NumLike }
        >(sql`${cohort}, ${owners}, ${usageRows}
          SELECT ${bucketOf("u.created_at")} AS bucket, count(DISTINCT u.uid) AS active
          FROM usage u WHERE ${cur("u.created_at")}
          GROUP BY 1`),

        db.execute<
          QueryResultRow & { bucket: string; paying: NumLike }
        >(sql`${cohort}
          SELECT ${bucketOf("p.created_at")} AS bucket, count(DISTINCT p.user_id) AS paying
          FROM payment_transactions p JOIN cohort c ON c.uid = p.user_id
          WHERE p.status = ${succeeded} AND ${cur("p.created_at")}
          GROUP BY 1`),

        db.execute<
          QueryResultRow & {
            signups: NumLike;
            verified: NumLike;
            active: NumLike;
            paid: NumLike;
          }
        >(sql`${cohort}
          SELECT count(*) AS signups,
            count(*) FILTER (WHERE f.verified) AS verified,
            count(*) FILTER (WHERE f.active) AS active,
            count(*) FILTER (WHERE f.paid) AS paid
          FROM (
            SELECT c.verified, c.payments > 0 AS paid,
              ${usageInWindowSql(sql.raw("c.uid"), undefined, undefined)} AS active
            FROM cohort c WHERE ${cur("c.created_at")}
          ) f`),

        db.execute<
          QueryResultRow & {
            key: string | null;
            signups: NumLike;
            verified: NumLike;
            active: NumLike;
            paid: NumLike;
            revenue: NumLike;
          }
        >(sql`${cohort}
          SELECT lower(c.channel) AS key, count(*) AS signups,
            count(*) FILTER (WHERE c.verified) AS verified,
            count(*) FILTER (WHERE ${usageInWindowSql(sql.raw("c.uid"), undefined, undefined)}) AS active,
            count(*) FILTER (WHERE c.payments > 0) AS paid,
            coalesce(sum((SELECT sum(${usd}) FROM payment_transactions p WHERE p.user_id = c.uid AND p.status = ${succeeded} AND ${cur("p.created_at")})), 0) AS revenue
          FROM cohort c WHERE ${cur("c.created_at")}
          GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT ${BREAKDOWN_LIMIT}`),

        db.execute<
          QueryResultRow & {
            key: string;
            signups: NumLike;
            verified: NumLike;
            active: NumLike;
            paid: NumLike;
            revenue: NumLike;
          }
        >(sql`${cohort}
          SELECT c.ref_code AS key, count(*) AS signups,
            count(*) FILTER (WHERE c.verified) AS verified,
            count(*) FILTER (WHERE ${usageInWindowSql(sql.raw("c.uid"), undefined, undefined)}) AS active,
            count(*) FILTER (WHERE c.payments > 0) AS paid,
            coalesce(sum((SELECT sum(${usd}) FROM payment_transactions p WHERE p.user_id = c.uid AND p.status = ${succeeded} AND ${cur("p.created_at")})), 0) AS revenue
          FROM cohort c WHERE ${cur("c.created_at")} AND c.ref_code IS NOT NULL
          GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT ${BREAKDOWN_LIMIT}`),

        db.execute<
          QueryResultRow & {
            key: string | null;
            subscribers: NumLike;
            revenue: NumLike;
          }
        >(sql`${cohort},
          payers AS (
            SELECT p.user_id, sum(${usd}) AS revenue
            FROM payment_transactions p JOIN cohort c ON c.uid = p.user_id
            WHERE p.status = ${succeeded} AND ${cur("p.created_at")}
            GROUP BY p.user_id
          ),
          live AS (
            SELECT DISTINCT ON (s.user_id) s.user_id, s.plan_id
            FROM subscriptions s JOIN payers py ON py.user_id = s.user_id
            WHERE s.status IN (${activeSubs})
            ORDER BY s.user_id, s.created_at DESC
          )
          SELECT coalesce(l.plan_id, CASE WHEN EXISTS (
              SELECT 1 FROM subscriptions s2 WHERE s2.user_id = py.user_id
            ) THEN '__lapsed' ELSE '__packs' END) AS key,
            count(*) AS subscribers, coalesce(sum(py.revenue), 0) AS revenue
          FROM payers py LEFT JOIN live l ON l.user_id = py.user_id
          GROUP BY 1 ORDER BY 3 DESC`),

        db.execute<
          QueryResultRow & { key: string; signups: NumLike; paid: NumLike }
        >(sql`${cohort}
          SELECT c.locale AS key, count(*) AS signups,
            count(*) FILTER (WHERE c.payments > 0) AS paid
          FROM cohort c WHERE ${cur("c.created_at")}
          GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT ${BREAKDOWN_LIMIT}`),

        db.execute<
          QueryResultRow & {
            userId: string;
            email: string;
            spent: NumLike;
            spentTotal: NumLike;
            balance: NumLike;
            granted: NumLike;
            createdAt: string;
            banned: boolean;
            verified: boolean;
          }
        >(sql`${cohort}, ${owners}, ${usageRows}
          SELECT c.uid AS "userId", c.email, sum(u.spent) AS spent,
            c.spent_total AS "spentTotal", c.balance,
            (SELECT coalesce(sum(t2.amount), 0) FROM credit_transactions t2
              JOIN owners o2 ON o2.wallet_id = t2.wallet_id
              WHERE o2.uid = c.uid AND t2.type = ${CreditTransactionType.FREE_GRANT}) AS granted,
            c.created_at AS "createdAt", c.banned, c.verified
          FROM usage u JOIN cohort c ON c.uid = u.uid
          WHERE c.payments = 0 AND ${cur("u.created_at")}
          GROUP BY c.uid, c.email, c.spent_total, c.balance, c.created_at, c.banned, c.verified
          HAVING sum(u.spent) > 0
          ORDER BY 3 DESC LIMIT ${FREE_BURNER_LIMIT}`),
      ]);

      const s = signupKpis.rows[0];
      const a = activityKpis.rows[0];
      const p = paymentKpis.rows[0];
      const f = funnel.rows[0];
      const signups = num(s?.signups);
      const signupsPrev = num(s?.signupsPrev);
      const verified = num(s?.verified);
      const converted = num(s?.converted);
      const buckets = win.buckets;
      const series = <TRow extends { bucket: string }>(
        rows: TRow[],
        pick: (row: TRow) => NumLike,
      ): number[] =>
        fillBuckets(
          buckets,
          rows.map((row) => ({ bucket: row.bucket, value: num(pick(row)) })),
        );

      return success({
        window: serializeWindow(win),
        kpis: {
          signups: { value: signups, previous: prev(win, signupsPrev) },
          verifiedRate: {
            value: ratio(verified, signups),
            previous: prev(win, ratio(num(s?.verifiedPrev), signupsPrev)),
          },
          activatedRate: {
            value: ratio(num(s?.activated), signups),
            previous: prev(win, ratio(num(s?.activatedPrev), signupsPrev)),
          },
          paidConversion: {
            value: ratio(converted, signups),
            previous: prev(win, ratio(num(s?.convertedPrev), signupsPrev)),
          },
          activeUsers: {
            value: num(a?.active),
            previous: prev(win, num(a?.activePrev)),
          },
          payingUsers: {
            value: num(p?.paying),
            previous: prev(win, num(p?.payingPrev)),
          },
          revenueUsd: {
            value: roundMoney(num(p?.revenue)),
            previous: prev(win, roundMoney(num(p?.revenuePrev))),
          },
          freeBurnCredits: {
            value: roundMoney(num(a?.burn)),
            previous: prev(win, roundMoney(num(a?.burnPrev))),
          },
          banned: {
            value: num(s?.banned),
            previous: prev(win, num(s?.bannedPrev)),
          },
        },
        totals: {
          cohortUsers: num(s?.cohort),
          verified,
          converted,
          activated: num(s?.activated),
          freeBurners: num(a?.burners),
        },
        signupTrend: {
          buckets,
          series: [
            { key: "paid", values: series(signupSeries.rows, (r) => r.paid) },
            {
              key: "verified",
              values: series(signupSeries.rows, (r) => r.verified),
            },
            {
              key: "unverified",
              values: series(signupSeries.rows, (r) => r.unverified),
            },
          ],
        },
        activityTrend: {
          buckets,
          series: [
            {
              key: "active",
              values: series(activitySeries.rows, (r) => r.active),
            },
            {
              key: "paying",
              values: series(paymentSeries.rows, (r) => r.paying),
            },
          ],
        },
        funnel: [
          { key: "signups", value: num(f?.signups) },
          { key: "verified", value: num(f?.verified) },
          { key: "active", value: num(f?.active) },
          { key: "paid", value: num(f?.paid) },
        ],
        byChannel: byChannel.rows.map((r) => ({
          key: r.key,
          metrics: {
            signups: num(r.signups),
            verified: num(r.verified),
            active: num(r.active),
            paid: num(r.paid),
            conversion: ratio(num(r.paid), num(r.signups)),
            revenueUsd: roundMoney(num(r.revenue)),
          },
        })),
        byRefCode: byRefCode.rows.map((r) => ({
          key: r.key,
          metrics: {
            signups: num(r.signups),
            verified: num(r.verified),
            active: num(r.active),
            paid: num(r.paid),
            conversion: ratio(num(r.paid), num(r.signups)),
            revenueUsd: roundMoney(num(r.revenue)),
          },
        })),
        byPlan: byPlan.rows.map((r) => ({
          key: r.key,
          metrics: {
            subscribers: num(r.subscribers),
            revenueUsd: roundMoney(num(r.revenue)),
          },
        })),
        byLocale: byLocale.rows.map((r) => ({
          key: r.key,
          metrics: {
            signups: num(r.signups),
            paid: num(r.paid),
            conversion: ratio(num(r.paid), num(r.signups)),
          },
        })),
        freeBurners: burners.rows.map((r) => ({
          userId: r.userId,
          email: r.email,
          creditsSpent: roundMoney(num(r.spent)),
          creditsSpentTotal: roundMoney(num(r.spentTotal)),
          creditBalance: roundMoney(num(r.balance)),
          creditsGranted: roundMoney(num(r.granted)),
          signedUpAt: new Date(`${r.createdAt}Z`),
          isBanned: r.banned,
          emailVerified: r.verified,
        })),
      });
    } catch (error) {
      logger.error("Error building the signups report", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
