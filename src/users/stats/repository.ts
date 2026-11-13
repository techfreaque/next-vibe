/**
 * Users Stats Repository
 *
 * Definitions (keep in sync with the widget hints):
 * - Active user: registered user with credit usage in the window on their own
 *   wallet or a lead wallet linked to them (free-tier spend lives there).
 * - Paying user: at least one SUCCEEDED payment in the window.
 * - Revenue: SUCCEEDED payments in USD via the finance static FX table.
 * - MRR: active/trialing subscriptions priced by the user's latest succeeded
 *   subscription payment, yearly divided by 12.
 * - Signup to paid: users who signed up in the window and paid at least once.
 * - D7 retention: users who signed up in the window (at least 7 days ago) and
 *   spent credits again 7+ days after signup.
 * - Internal (admin) accounts are excluded unless includeInternal is set.
 * All timestamps are stored as UTC timestamp-without-time-zone.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { QueryResultRow } from "pg";

import { CreditTransactionType } from "@/credits/enum";
import { FINANCE_CONFIG } from "@/finance/config";
import { CheckoutMode, PaymentStatus, RefundStatus } from "@/payment/enum";
import { BillingInterval, SubscriptionStatus } from "@/subscription/enum";

import { roundMoney } from "../money-sql";
import type {
  UserStatsRequestOutput,
  UserStatsResponseOutput,
} from "./definition";
import { StatsGranularity, StatsRange } from "./enum";
import { scopedTranslation } from "./i18n";

const DAY_MS = 24 * 60 * 60 * 1000;

type Bucket = "day" | "week" | "month";
type NumLike = string | number | null;

interface StatsWindow {
  from: Date;
  to: Date;
  prevFrom: Date;
  days: number;
  granularity: Bucket;
}

function startOfUtcDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfUtcDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

/** UTC timestamp literal comparable with timestamp-without-time-zone columns. */
function ts(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz at time zone 'UTC')`;
}

/**
 * USD conversion for an amount/currency column pair (raw SQL names).
 * Rates come from a static config table, so inlining them is injection-safe.
 */
function usd(amount: string, currency: string): SQL {
  const cases = Object.entries(FINANCE_CONFIG.fxToUsd)
    .filter(([code, rate]) => /^[a-z]{3}$/.test(code) && Number.isFinite(rate))
    .map(([code, rate]) => `WHEN '${code}' THEN ${rate}`)
    .join(" ");
  return sql.raw(
    `(${amount}::numeric * (CASE lower(${currency}) ${cases} ELSE 0 END))`,
  );
}

/** Excludes ids listed in the `internal` CTE every stats query defines. */
function notInternal(column: string): SQL {
  return sql`${sql.raw(column)} NOT IN (SELECT user_id FROM internal WHERE user_id IS NOT NULL)`;
}

export class UsersStatsRepository {
  private static async resolveWindow(
    data: UserStatsRequestOutput,
  ): Promise<StatsWindow> {
    const now = new Date();
    let from: Date;
    let to: Date = endOfUtcDay(now);

    switch (data.range) {
      case StatsRange.LAST_7_DAYS:
        from = startOfUtcDay(new Date(now.getTime() - 6 * DAY_MS));
        break;
      case StatsRange.LAST_30_DAYS:
        from = startOfUtcDay(new Date(now.getTime() - 29 * DAY_MS));
        break;
      case StatsRange.LAST_90_DAYS:
        from = startOfUtcDay(new Date(now.getTime() - 89 * DAY_MS));
        break;
      case StatsRange.LAST_12_MONTHS:
        from = new Date(
          Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth() + 1, 1),
        );
        break;
      case StatsRange.THIS_MONTH:
        from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        break;
      case StatsRange.LAST_MONTH:
        from = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
        );
        to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) - 1);
        break;
      case StatsRange.ALL_TIME: {
        const result = await db.execute<QueryResultRow & { firstMs: NumLike }>(
          sql`SELECT extract(epoch from min(created_at)) * 1000 AS "firstMs" FROM users`,
        );
        const firstMs = num(result.rows[0]?.firstMs);
        from = startOfUtcDay(firstMs > 0 ? new Date(firstMs) : now);
        break;
      }
      case StatsRange.CUSTOM:
        from = startOfUtcDay(
          data.from ?? new Date(now.getTime() - 29 * DAY_MS),
        );
        to = endOfUtcDay(data.to ?? now);
        break;
    }

    // Explicit dates always win, so the date pickers filter on any preset
    if (data.range !== StatsRange.CUSTOM) {
      if (data.from) {
        from = startOfUtcDay(data.from);
      }
      if (data.to) {
        to = endOfUtcDay(data.to);
      }
    }
    if (from > to) {
      const swap = from;
      from = startOfUtcDay(to);
      to = endOfUtcDay(swap);
    }

    const spanMs = to.getTime() - from.getTime() + 1;
    const days = Math.max(1, Math.round(spanMs / DAY_MS));
    const prevFrom = new Date(from.getTime() - spanMs);

    let granularity: Bucket;
    switch (data.granularity) {
      case StatsGranularity.DAY:
        granularity = "day";
        break;
      case StatsGranularity.WEEK:
        granularity = "week";
        break;
      case StatsGranularity.MONTH:
        granularity = "month";
        break;
      case StatsGranularity.AUTO:
        granularity = days <= 45 ? "day" : days <= 200 ? "week" : "month";
        break;
    }
    // Keep the chart readable: cap the bucket count
    if (granularity === "day" && days > 120) {
      granularity = "week";
    }
    if (granularity === "week" && days > 840) {
      granularity = "month";
    }

    return { from, to, prevFrom, days, granularity };
  }

  static async getUserStats(
    data: UserStatsRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserStatsResponseOutput>> {
    try {
      const w = await UsersStatsRepository.resolveWindow(data);
      logger.debug("Fetching user statistics", {
        from: w.from.toISOString(),
        to: w.to.toISOString(),
        granularity: w.granularity,
        includeInternal: data.includeInternal,
      });

      const from = ts(w.from);
      const to = ts(w.to);
      const prevFrom = ts(w.prevFrom);
      const now = ts(new Date());
      const usage = CreditTransactionType.USAGE;
      const succeeded = PaymentStatus.SUCCEEDED;
      const unit = sql.raw(`'${w.granularity}'`);
      const step = sql.raw(`'1 ${w.granularity}'::interval`);

      // Internal accounts (admins). Their wallets and payments are excluded.
      const internalUsers = data.includeInternal
        ? sql`SELECT NULL::uuid AS user_id WHERE false`
        : sql`SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN}`;

      // wallet -> owning user (own wallet + linked lead wallets)
      const walletOwners = sql`
        SELECT w.id AS wallet_id, w.user_id FROM credit_wallets w WHERE w.user_id IS NOT NULL
        UNION
        SELECT w.id, ul.user_id FROM user_lead_links ul JOIN credit_wallets w ON w.lead_id = ul.lead_id`;
      const internalWallets = sql`SELECT o.wallet_id FROM owners o JOIN internal i ON i.user_id = o.user_id`;

      const [
        userCounts,
        activity,
        anonymous,
        creditTotals,
        payments,
        refunds,
        subsByStatus,
        mrr,
        conversion,
        retention,
        series,
        channels,
        byCurrency,
        topSpenders,
      ] = await Promise.all([
        db.execute<
          QueryResultRow & { total: NumLike; current: NumLike; prev: NumLike }
        >(sql`
          WITH internal AS (${internalUsers})
          SELECT
            count(*) FILTER (WHERE created_at <= ${to}) AS total,
            count(*) FILTER (WHERE created_at >= ${from} AND created_at <= ${to}) AS current,
            count(*) FILTER (WHERE created_at >= ${prevFrom} AND created_at < ${from}) AS prev
          FROM users u WHERE ${notInternal("u.id")}`),

        db.execute<QueryResultRow & { current: NumLike; prev: NumLike }>(sql`
          WITH internal AS (${internalUsers}), owners AS (${walletOwners})
          SELECT
            count(DISTINCT o.user_id) FILTER (WHERE t.created_at >= ${from}) AS current,
            count(DISTINCT o.user_id) FILTER (WHERE t.created_at < ${from}) AS prev
          FROM credit_transactions t
          JOIN owners o ON o.wallet_id = t.wallet_id
          WHERE t.type = ${usage} AND t.created_at >= ${prevFrom} AND t.created_at <= ${to}
            AND ${notInternal("o.user_id")}`),

        db.execute<QueryResultRow & { current: NumLike }>(sql`
          SELECT count(DISTINCT t.wallet_id) AS current
          FROM credit_transactions t
          JOIN credit_wallets w ON w.id = t.wallet_id
          WHERE t.type = ${usage} AND t.created_at >= ${from} AND t.created_at <= ${to}
            AND w.user_id IS NULL
            AND NOT EXISTS (SELECT 1 FROM user_lead_links ul WHERE ul.lead_id = w.lead_id)`),

        db.execute<QueryResultRow & { current: NumLike; prev: NumLike }>(sql`
          WITH internal AS (${internalUsers}), owners AS (${walletOwners})
          SELECT
            coalesce(sum(-t.amount) FILTER (WHERE t.created_at >= ${from}), 0) AS current,
            coalesce(sum(-t.amount) FILTER (WHERE t.created_at < ${from}), 0) AS prev
          FROM credit_transactions t
          WHERE t.type = ${usage} AND t.created_at >= ${prevFrom} AND t.created_at <= ${to}
            AND t.wallet_id NOT IN (${internalWallets})`),

        db.execute<
          QueryResultRow & {
            revenue: NumLike;
            revenuePrev: NumLike;
            paying: NumLike;
            payingPrev: NumLike;
            payingAllTime: NumLike;
            revenueAllTime: NumLike;
          }
        >(sql`
          WITH internal AS (${internalUsers})
          SELECT
            coalesce(sum(${usd("p.amount", "p.currency")}) FILTER (WHERE p.created_at >= ${from} AND p.created_at <= ${to}), 0) AS revenue,
            coalesce(sum(${usd("p.amount", "p.currency")}) FILTER (WHERE p.created_at >= ${prevFrom} AND p.created_at < ${from}), 0) AS "revenuePrev",
            count(DISTINCT p.user_id) FILTER (WHERE p.created_at >= ${from} AND p.created_at <= ${to}) AS paying,
            count(DISTINCT p.user_id) FILTER (WHERE p.created_at >= ${prevFrom} AND p.created_at < ${from}) AS "payingPrev",
            count(DISTINCT p.user_id) FILTER (WHERE p.created_at <= ${to}) AS "payingAllTime",
            coalesce(sum(${usd("p.amount", "p.currency")}) FILTER (WHERE p.created_at <= ${to}), 0) AS "revenueAllTime"
          FROM payment_transactions p
          WHERE p.status = ${succeeded} AND ${notInternal("p.user_id")}`),

        db.execute<QueryResultRow & { refunds: NumLike }>(sql`
          WITH internal AS (${internalUsers})
          SELECT coalesce(sum(${usd("r.amount", "r.currency")}), 0) AS refunds
          FROM payment_refunds r
          WHERE r.status = ${RefundStatus.SUCCEEDED}
            AND r.created_at >= ${from} AND r.created_at <= ${to}
            AND ${notInternal("r.user_id")}`),

        db.execute<QueryResultRow & { status: string; count: NumLike }>(sql`
          WITH internal AS (${internalUsers})
          SELECT s.status, count(*) AS count
          FROM subscriptions s
          WHERE ${notInternal("s.user_id")}
          GROUP BY s.status ORDER BY count(*) DESC`),

        db.execute<QueryResultRow & { mrr: NumLike }>(sql`
          WITH internal AS (${internalUsers}),
          live AS (
            SELECT DISTINCT ON (s.user_id) s.user_id, s.billing_interval
            FROM subscriptions s
            WHERE s.status IN (${SubscriptionStatus.ACTIVE}, ${SubscriptionStatus.TRIALING})
              AND ${notInternal("s.user_id")}
            ORDER BY s.user_id, s.created_at DESC
          )
          SELECT coalesce(sum(
            CASE WHEN l.billing_interval = ${BillingInterval.YEARLY} THEN lp.usd / 12 ELSE lp.usd END
          ), 0) AS mrr
          FROM live l
          JOIN LATERAL (
            SELECT ${usd("p.amount", "p.currency")} AS usd
            FROM payment_transactions p
            WHERE p.user_id = l.user_id AND p.status = ${succeeded}
              AND p.mode = ${CheckoutMode.SUBSCRIPTION}
            ORDER BY p.created_at DESC LIMIT 1
          ) lp ON true`),

        db.execute<
          QueryResultRow & { cohort: NumLike; converted: NumLike }
        >(sql`
          WITH internal AS (${internalUsers})
          SELECT
            count(*) AS cohort,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM payment_transactions p WHERE p.user_id = u.id AND p.status = ${succeeded}
            )) AS converted
          FROM users u
          WHERE u.created_at >= ${from} AND u.created_at <= ${to} AND ${notInternal("u.id")}`),

        db.execute<
          QueryResultRow & { cohort: NumLike; converted: NumLike }
        >(sql`
          WITH internal AS (${internalUsers}), owners AS (${walletOwners})
          SELECT
            count(*) AS cohort,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM credit_transactions t JOIN owners o ON o.wallet_id = t.wallet_id
              WHERE o.user_id = u.id AND t.type = ${usage}
                AND t.created_at >= u.created_at + interval '7 days'
            )) AS converted
          FROM users u
          WHERE u.created_at >= ${from} AND u.created_at <= ${to}
            AND u.created_at <= ${now} - interval '7 days'
            AND ${notInternal("u.id")}`),

        db.execute<
          QueryResultRow & {
            bucketMs: NumLike;
            signups: NumLike;
            active: NumLike;
            paying: NumLike;
            revenue: NumLike;
            credits: NumLike;
          }
        >(sql`
          WITH internal AS (${internalUsers}), owners AS (${walletOwners}),
          buckets AS (
            SELECT generate_series(
              date_trunc(${unit}, ${from}),
              date_trunc(${unit}, ${to}),
              ${step}
            ) AS b
          ),
          s AS (
            SELECT date_trunc(${unit}, u.created_at) AS b, count(*) AS n
            FROM users u
            WHERE u.created_at >= ${from} AND u.created_at <= ${to} AND ${notInternal("u.id")}
            GROUP BY 1
          ),
          a AS (
            SELECT date_trunc(${unit}, t.created_at) AS b,
              count(DISTINCT o.user_id) AS n
            FROM credit_transactions t JOIN owners o ON o.wallet_id = t.wallet_id
            WHERE t.type = ${usage} AND t.created_at >= ${from} AND t.created_at <= ${to}
              AND ${notInternal("o.user_id")}
            GROUP BY 1
          ),
          c AS (
            SELECT date_trunc(${unit}, t.created_at) AS b, sum(-t.amount) AS n
            FROM credit_transactions t
            WHERE t.type = ${usage} AND t.created_at >= ${from} AND t.created_at <= ${to}
              AND t.wallet_id NOT IN (${internalWallets})
            GROUP BY 1
          ),
          p AS (
            SELECT date_trunc(${unit}, p.created_at) AS b,
              count(DISTINCT p.user_id) AS paying,
              sum(${usd("p.amount", "p.currency")}) AS revenue
            FROM payment_transactions p
            WHERE p.status = ${succeeded} AND p.created_at >= ${from} AND p.created_at <= ${to}
              AND ${notInternal("p.user_id")}
            GROUP BY 1
          )
          SELECT extract(epoch from buckets.b) * 1000 AS "bucketMs",
            coalesce(s.n, 0) AS signups,
            coalesce(a.n, 0) AS active,
            coalesce(p.paying, 0) AS paying,
            coalesce(p.revenue, 0) AS revenue,
            coalesce(c.n, 0) AS credits
          FROM buckets
          LEFT JOIN s ON s.b = buckets.b
          LEFT JOIN a ON a.b = buckets.b
          LEFT JOIN c ON c.b = buckets.b
          LEFT JOIN p ON p.b = buckets.b
          ORDER BY buckets.b`),

        db.execute<
          QueryResultRow & {
            channel: string;
            signups: NumLike;
            paying: NumLike;
          }
        >(sql`
          WITH internal AS (${internalUsers})
          SELECT coalesce(nullif(g.first_channel, ''), 'unknown') AS channel,
            count(*) AS signups,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM payment_transactions p WHERE p.user_id = u.id AND p.status = ${succeeded}
            )) AS paying
          FROM users u
          LEFT JOIN growth_journeys g ON g.user_id = u.id
          WHERE u.created_at >= ${from} AND u.created_at <= ${to} AND ${notInternal("u.id")}
          GROUP BY 1 ORDER BY count(*) DESC LIMIT 10`),

        db.execute<
          QueryResultRow & {
            currency: string;
            amount: NumLike;
            amountUsd: NumLike;
            count: NumLike;
          }
        >(sql`
          WITH internal AS (${internalUsers})
          SELECT upper(p.currency) AS currency, sum(p.amount) AS amount,
            sum(${usd("p.amount", "p.currency")}) AS "amountUsd", count(*) AS count
          FROM payment_transactions p
          WHERE p.status = ${succeeded} AND p.created_at >= ${from} AND p.created_at <= ${to}
            AND ${notInternal("p.user_id")}
          GROUP BY 1 ORDER BY 3 DESC`),

        db.execute<
          QueryResultRow & {
            userId: string;
            email: string;
            spent: NumLike;
            paid: NumLike;
          }
        >(sql`
          WITH internal AS (${internalUsers}), owners AS (${walletOwners}),
          spend AS (
            SELECT o.user_id, sum(-t.amount) AS spent
            FROM credit_transactions t JOIN owners o ON o.wallet_id = t.wallet_id
            WHERE t.type = ${usage} AND t.created_at >= ${from} AND t.created_at <= ${to}
              AND ${notInternal("o.user_id")}
            GROUP BY o.user_id ORDER BY 2 DESC LIMIT 10
          )
          SELECT spend.user_id AS "userId", u.email, spend.spent,
            coalesce((SELECT sum(${usd("p.amount", "p.currency")}) FROM payment_transactions p
              WHERE p.user_id = spend.user_id AND p.status = ${succeeded}), 0) AS paid
          FROM spend JOIN users u ON u.id = spend.user_id
          ORDER BY spend.spent DESC`),
      ]);

      const ratio = (
        row: { cohort: NumLike; converted: NumLike } | undefined,
      ): { cohort: number; converted: number; rate: number } => {
        const cohort = num(row?.cohort);
        const converted = num(row?.converted);
        return { cohort, converted, rate: cohort > 0 ? converted / cohort : 0 };
      };

      const userRow = userCounts.rows[0];
      const activityRow = activity.rows[0];
      const creditRow = creditTotals.rows[0];
      const payRow = payments.rows[0];
      const subs = subsByStatus.rows.map((r) => ({
        status: r.status,
        count: num(r.count),
      }));
      const countFor = (status: string): number =>
        subs.find((s) => s.status === status)?.count ?? 0;

      return success({
        period: {
          from: w.from,
          to: w.to,
          previousFrom: w.prevFrom,
          days: w.days,
          granularity: w.granularity,
        },
        kpis: {
          totalUsers: num(userRow?.total),
          newUsers: num(userRow?.current),
          newUsersPrev: num(userRow?.prev),
          activeUsers: num(activityRow?.current),
          activeUsersPrev: num(activityRow?.prev),
          anonymousActive: num(anonymous.rows[0]?.current),
          payingUsers: num(payRow?.paying),
          payingUsersPrev: num(payRow?.payingPrev),
          payingUsersAllTime: num(payRow?.payingAllTime),
          activeSubscribers:
            countFor(SubscriptionStatus.ACTIVE) +
            countFor(SubscriptionStatus.TRIALING),
          pastDueSubscribers: countFor(SubscriptionStatus.PAST_DUE),
          mrrUsd: roundMoney(num(mrr.rows[0]?.mrr)),
          revenueUsd: roundMoney(num(payRow?.revenue)),
          revenuePrevUsd: roundMoney(num(payRow?.revenuePrev)),
          refundsUsd: roundMoney(num(refunds.rows[0]?.refunds)),
          revenueAllTimeUsd: roundMoney(num(payRow?.revenueAllTime)),
          creditsSpent: roundMoney(num(creditRow?.current)),
          creditsSpentPrev: roundMoney(num(creditRow?.prev)),
          signupToPaid: ratio(conversion.rows[0]),
          retentionD7: ratio(retention.rows[0]),
        },
        series: series.rows.map((r) => ({
          bucket: new Date(num(r.bucketMs)),
          signups: num(r.signups),
          activeUsers: num(r.active),
          payingUsers: num(r.paying),
          revenueUsd: roundMoney(num(r.revenue)),
          creditsSpent: roundMoney(num(r.credits)),
        })),
        channels: channels.rows.map((r) => ({
          channel: r.channel,
          signups: num(r.signups),
          paying: num(r.paying),
        })),
        revenueByCurrency: byCurrency.rows.map((r) => ({
          currency: r.currency,
          amount: roundMoney(num(r.amount)),
          amountUsd: roundMoney(num(r.amountUsd)),
          count: num(r.count),
        })),
        subscriptionsByStatus: subs,
        topSpenders: topSpenders.rows.map((r) => ({
          userId: r.userId,
          email: r.email,
          creditsSpent: roundMoney(num(r.spent)),
          totalPaidUsd: roundMoney(num(r.paid)),
        })),
        generatedAt: new Date(),
      });
    } catch (error) {
      logger.error("Error fetching user statistics", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
