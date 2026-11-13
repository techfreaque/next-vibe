/**
 * Anti-Farming Report - Repository
 * Server-only. Aggregates free_pool_claims and anti_farming_events.
 *
 * Account pools are budgeted per calendar month, so their granted/blocked
 * counts always cover the current UTC month. Guest pools, blocked events and
 * email domains cover the requested `days` window.
 * created_at is a zoneless UTC timestamp: last_seen is cast to timestamptz
 * (AT TIME ZONE 'UTC') so the driver does not parse it as server-local time.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { QueryResultRow } from "pg";

import {
  ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
  GUEST_IP_POOL_WINDOW_HOURS,
  GUEST_POOLS_PER_SUBNET_PER_DAY,
  IP_SUBNET_PREFIX,
  SIGNUP_GUEST_SPEND_LOOKBACK_HOURS,
} from "../config";
import type { AntiFarmingReportResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const TOP_LIMIT = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

type NumLike = string | number | null;
type SubnetRow = AntiFarmingReportResponseOutput["subnetsByBlocked"][number];

interface SubnetDbRow extends QueryResultRow {
  subnet: string;
  blocked: NumLike;
  account_granted: NumLike;
  account_blocked: NumLike;
  guest_granted: NumLike;
  guest_blocked: NumLike;
  last_seen: string | Date;
}

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

/** UTC timestamp literal comparable with timestamp-without-time-zone columns. */
function ts(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz at time zone 'UTC')`;
}

function toSubnetRow(r: SubnetDbRow): SubnetRow {
  return {
    subnet: r.subnet,
    blocked: num(r.blocked),
    accountGranted: num(r.account_granted),
    accountBlocked: num(r.account_blocked),
    guestGranted: num(r.guest_granted),
    guestBlocked: num(r.guest_blocked),
    lastSeen: new Date(r.last_seen),
  };
}

export class AntiFarmingReportRepository {
  static async getReport(
    data: { days: number },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AntiFarmingReportResponseOutput>> {
    const now = new Date();
    const from = new Date(now.getTime() - data.days * DAY_MS);
    const month = now.toISOString().slice(0, 7);
    const since = ts(from);

    /**
     * One row per subnet seen in the window: blocked events joined with
     * account claims (current month) and guest claims (window).
     * `where` + `order` pick the rows and ranking for the two subnet tables.
     */
    const subnetQuery = (where: SQL, order: SQL): SQL => sql`
      WITH ev AS (
        SELECT subnet, count(*) AS blocked, max(created_at) AS last_ev
        FROM anti_farming_events
        WHERE subnet IS NOT NULL AND created_at >= ${since}
        GROUP BY subnet
      ),
      cl AS (
        SELECT subnet,
          count(*) FILTER (WHERE kind = 'account' AND granted) AS account_granted,
          count(*) FILTER (WHERE kind = 'account' AND NOT granted) AS account_blocked,
          count(*) FILTER (WHERE kind = 'guest' AND granted) AS guest_granted,
          count(*) FILTER (WHERE kind = 'guest' AND NOT granted) AS guest_blocked,
          max(created_at) AS last_cl
        FROM free_pool_claims
        WHERE (kind = 'account' AND period = ${month})
           OR (kind = 'guest' AND created_at >= ${since})
        GROUP BY subnet
      )
      SELECT
        coalesce(ev.subnet, cl.subnet) AS subnet,
        coalesce(ev.blocked, 0) AS blocked,
        coalesce(cl.account_granted, 0) AS account_granted,
        coalesce(cl.account_blocked, 0) AS account_blocked,
        coalesce(cl.guest_granted, 0) AS guest_granted,
        coalesce(cl.guest_blocked, 0) AS guest_blocked,
        greatest(ev.last_ev, cl.last_cl) AT TIME ZONE 'UTC' AS last_seen
      FROM ev FULL OUTER JOIN cl ON ev.subnet = cl.subnet
      WHERE ${where}
      ORDER BY ${order}
      LIMIT ${TOP_LIMIT}
    `;

    try {
      const [totals, byBlocked, byClaims, domains] = await Promise.all([
        db.execute<
          QueryResultRow & {
            total: NumLike;
            subnet_account_limit: NumLike;
            subnet_guest_limit: NumLike;
            duplicate_email: NumLike;
            disposable_email: NumLike;
          }
        >(sql`
          SELECT
            count(*) AS total,
            count(*) FILTER (WHERE kind = 'subnet_account_limit') AS subnet_account_limit,
            count(*) FILTER (WHERE kind = 'subnet_guest_limit') AS subnet_guest_limit,
            count(*) FILTER (WHERE kind = 'duplicate_email') AS duplicate_email,
            count(*) FILTER (WHERE kind = 'disposable_email') AS disposable_email
          FROM anti_farming_events
          WHERE created_at >= ${since}
        `),
        db.execute<SubnetDbRow>(
          subnetQuery(
            sql`coalesce(ev.blocked, 0) > 0`,
            sql`blocked DESC, (account_blocked + guest_blocked) DESC, last_seen DESC`,
          ),
        ),
        db.execute<SubnetDbRow>(
          subnetQuery(
            sql`cl.subnet IS NOT NULL`,
            sql`(account_granted + account_blocked + guest_granted + guest_blocked) DESC, blocked DESC, last_seen DESC`,
          ),
        ),
        db.execute<
          QueryResultRow & {
            domain: string;
            duplicate: NumLike;
            disposable: NumLike;
            total: NumLike;
            last_seen: string | Date;
          }
        >(sql`
          SELECT
            email_domain AS domain,
            count(*) FILTER (WHERE kind = 'duplicate_email') AS duplicate,
            count(*) FILTER (WHERE kind = 'disposable_email') AS disposable,
            count(*) AS total,
            max(created_at) AT TIME ZONE 'UTC' AS last_seen
          FROM anti_farming_events
          WHERE email_domain IS NOT NULL
            AND kind IN ('duplicate_email', 'disposable_email')
            AND created_at >= ${since}
          GROUP BY email_domain
          ORDER BY total DESC, last_seen DESC
          LIMIT ${TOP_LIMIT}
        `),
      ]);

      const t0 = totals.rows[0];

      return success({
        window: { days: data.days, from, month },
        thresholds: {
          accountPoolsPerSubnetPerMonth: ACCOUNT_POOLS_PER_SUBNET_PER_MONTH,
          guestPoolsPerSubnetPerDay: GUEST_POOLS_PER_SUBNET_PER_DAY,
          guestIpPoolWindowHours: GUEST_IP_POOL_WINDOW_HOURS,
          signupGuestSpendLookbackHours: SIGNUP_GUEST_SPEND_LOOKBACK_HOURS,
          subnetPrefixV4: IP_SUBNET_PREFIX.v4,
          subnetPrefixV6: IP_SUBNET_PREFIX.v6,
        },
        totals: {
          total: num(t0?.total),
          subnetAccountLimit: num(t0?.subnet_account_limit),
          subnetGuestLimit: num(t0?.subnet_guest_limit),
          duplicateEmail: num(t0?.duplicate_email),
          disposableEmail: num(t0?.disposable_email),
        },
        subnetsByBlocked: byBlocked.rows.map(toSubnetRow),
        subnetsByClaims: byClaims.rows.map(toSubnetRow),
        emailDomains: domains.rows.map((r) => ({
          domain: r.domain,
          duplicate: num(r.duplicate),
          disposable: num(r.disposable),
          total: num(r.total),
          lastSeen: new Date(r.last_seen),
        })),
      });
    } catch (error) {
      logger.error("Failed to build anti-farming report", parseError(error), {
        days: data.days,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
