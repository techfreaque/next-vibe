/**
 * Referral analytics queries (server only).
 *
 * One scope (referral codes matching the admin filters) and one metric set,
 * shared by the admin overview, the per-code report and the business overview:
 * - clicks: browser arrivals carrying the code (growth_visits.ref_code)
 * - leads: distinct leads credited to the code (lead_referrals)
 * - signups: accounts credited to the code (user_referrals)
 * - payers / revenue: referred accounts with a successful payment, in USD
 * - commission: referral earnings caused by the code's referred accounts
 *   (every level, so upline shares count where the money came from)
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { AnalyticsBucket } from "next-vibe/unified-ui/analytics/enum";
import { bucketSql } from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { CreditPackType } from "@/credits/enum";
import { FINANCE_CONFIG } from "@/finance/config";
import { PaymentStatus } from "@/payment/enum";

import { PayoutStatus, ReferralEarningStatus } from "../enum";

/**
 * Visits carrying a ref code, each attributed to ONE code: the exact-case
 * match, else the oldest case-insensitive one. Codes can differ only by case
 * (KRYSALID / krysalid), and a plain lower() join counted such a click once
 * per code.
 */
const CLICKED_CODE = sql`growth_visits v
  CROSS JOIN LATERAL (
    SELECT rc.id AS code_id FROM referral_codes rc
    WHERE lower(rc.code) = lower(v.ref_code)
    ORDER BY (rc.code = v.ref_code) DESC, rc.created_at, rc.id
    LIMIT 1
  ) vc`;

export interface ReferralScopeFilters {
  /** Matches code, label or owner email (case-insensitive substring). */
  search?: string;
  ownerUserId?: string;
  activeOnly?: boolean;
  codeId?: string;
}

export interface TimeSpan {
  from: Date;
  to: Date;
}

export interface CodeMetricsRow {
  codeId: string;
  code: string;
  label: string | null;
  isActive: boolean;
  ownerUserId: string;
  ownerEmail: string;
  ownerName: string | null;
  createdAt: Date;
  clicks: number;
  leads: number;
  signups: number;
  payers: number;
  revenueCents: number;
  commissionCents: number;
  pendingCents: number;
  confirmedCents: number;
  ownerPaidCents: number;
}

export interface MetricTotals {
  clicks: number;
  leads: number;
  signups: number;
  payers: number;
  revenueCents: number;
  commissionCents: number;
  pendingCents: number;
  confirmedCents: number;
  canceledCents: number;
  payoutsPaidCents: number;
}

export type ReferralSeriesKey =
  | "clicks"
  | "leads"
  | "signups"
  | "payers"
  | "revenue"
  | "commission";

export interface BucketRow {
  bucket: string;
  value: number;
}

const SUCCEEDED = PaymentStatus.SUCCEEDED;

/** USD cents of a payment row `p` (static FX table, same as finance). */
function usdCentsSql(): SQL {
  const cases = Object.entries(FINANCE_CONFIG.fxToUsd).map(
    ([currency, rate]) =>
      sql`WHEN ${currency.toUpperCase()} THEN ${String(rate)}::numeric`,
  );
  return sql`round(p.amount * 100 * (CASE upper(p.currency) ${sql.join(cases, sql` `)} ELSE 0 END))`;
}

function escapeLike(value: string): string {
  return value.replaceAll(/[\\%_]/g, (character) => `\\${character}`);
}

/** Referral codes in scope (CTE body). */
export function scopeSql(filters: ReferralScopeFilters): SQL {
  const conditions: SQL[] = [];
  const search = filters.search?.trim();
  if (search) {
    const pattern = `%${escapeLike(search)}%`;
    conditions.push(
      sql`(c.code ILIKE ${pattern} OR c.label ILIKE ${pattern} OR o.email ILIKE ${pattern})`,
    );
  }
  if (filters.ownerUserId) {
    conditions.push(sql`c.owner_user_id = ${filters.ownerUserId}`);
  }
  if (filters.activeOnly) {
    conditions.push(sql`c.is_active`);
  }
  if (filters.codeId) {
    conditions.push(sql`c.id = ${filters.codeId}`);
  }
  const where =
    conditions.length > 0
      ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
      : sql``;
  return sql`
    SELECT c.id, c.code, lower(c.code) AS code_key, c.label, c.is_active,
      c.owner_user_id, c.created_at, o.email AS owner_email,
      coalesce(o.public_name, o.private_name) AS owner_name
    FROM referral_codes c JOIN users o ON o.id = c.owner_user_id
    ${where}
  `;
}

/** UTC wall-clock literal (timestamp columns hold UTC; never host-local). */
function utcLiteral(date: Date): SQL {
  return sql`${date.toISOString()}::timestamptz AT TIME ZONE 'UTC'`;
}

function span(column: SQL, range: TimeSpan): SQL {
  return sql`${column} >= (${utcLiteral(range.from)}) AND ${column} < (${utcLiteral(range.to)})`;
}

const referredPayments = sql`
  SELECT ur.referral_code_id AS code_id, p.user_id, p.created_at, ${usdCentsSql()} AS usd_cents
  FROM payment_transactions p
  JOIN user_referrals ur ON ur.referred_user_id = p.user_id
  JOIN scope s ON s.id = ur.referral_code_id
  WHERE p.status = ${SUCCEEDED} AND p.amount > 0
`;

const referredEarnings = sql`
  SELECT ur.referral_code_id AS code_id, e.amount_cents, e.status, e.level, e.created_at
  FROM referral_earnings e
  JOIN user_referrals ur ON ur.referred_user_id = e.source_user_id
  JOIN scope s ON s.id = ur.referral_code_id
`;

/** Per-code metrics for one time span. */
export async function queryCodeMetrics(
  filters: ReferralScopeFilters,
  range: TimeSpan,
): Promise<CodeMetricsRow[]> {
  const { rows } = await db.execute<
    QueryResultRow & {
      code_id: string;
      code: string;
      label: string | null;
      is_active: boolean;
      owner_user_id: string;
      owner_email: string;
      owner_name: string | null;
      created_at: Date;
      clicks: number;
      leads: number;
      signups: number;
      payers: number;
      revenue_cents: number;
      commission_cents: number;
      pending_cents: number;
      confirmed_cents: number;
      owner_paid_cents: number;
    }
  >(sql`
    WITH scope AS (${scopeSql(filters)}),
    clicks AS (
      SELECT s.id AS code_id, count(*)::int AS n
      FROM ${CLICKED_CODE} JOIN scope s ON s.id = vc.code_id
      WHERE ${span(sql`v.visited_at`, range)}
      GROUP BY 1
    ),
    leads AS (
      SELECT lr.referral_code_id AS code_id, count(DISTINCT lr.lead_id)::int AS n
      FROM lead_referrals lr JOIN scope s ON s.id = lr.referral_code_id
      WHERE ${span(sql`lr.created_at`, range)}
      GROUP BY 1
    ),
    signups AS (
      SELECT ur.referral_code_id AS code_id, count(*)::int AS n
      FROM user_referrals ur JOIN scope s ON s.id = ur.referral_code_id
      WHERE ${span(sql`ur.created_at`, range)}
      GROUP BY 1
    ),
    payments AS (
      SELECT code_id, count(DISTINCT user_id)::int AS payers, coalesce(sum(usd_cents), 0)::float8 AS cents
      FROM (${referredPayments}) rp
      WHERE ${span(sql`rp.created_at`, range)}
      GROUP BY 1
    ),
    earnings AS (
      SELECT code_id,
        coalesce(sum(amount_cents) FILTER (WHERE status <> ${ReferralEarningStatus.CANCELED}), 0)::float8 AS total,
        coalesce(sum(amount_cents) FILTER (WHERE status = ${ReferralEarningStatus.PENDING}), 0)::float8 AS pending,
        coalesce(sum(amount_cents) FILTER (WHERE status = ${ReferralEarningStatus.CONFIRMED}), 0)::float8 AS confirmed
      FROM (${referredEarnings}) re
      WHERE ${span(sql`re.created_at`, range)}
      GROUP BY 1
    ),
    paid AS (
      SELECT r.user_id, coalesce(sum(r.amount_cents), 0)::float8 AS cents
      FROM payout_requests r
      WHERE r.status = ${PayoutStatus.COMPLETED} AND ${span(sql`coalesce(r.processed_at, r.created_at)`, range)}
        AND r.user_id IN (SELECT owner_user_id FROM scope)
      GROUP BY 1
    )
    SELECT s.id AS code_id, s.code, s.label, s.is_active, s.owner_user_id, s.owner_email, s.owner_name, s.created_at,
      coalesce(c.n, 0) AS clicks, coalesce(l.n, 0) AS leads, coalesce(u.n, 0) AS signups,
      coalesce(p.payers, 0) AS payers, coalesce(p.cents, 0) AS revenue_cents,
      coalesce(e.total, 0) AS commission_cents, coalesce(e.pending, 0) AS pending_cents,
      coalesce(e.confirmed, 0) AS confirmed_cents, coalesce(pd.cents, 0) AS owner_paid_cents
    FROM scope s
    LEFT JOIN clicks c ON c.code_id = s.id
    LEFT JOIN leads l ON l.code_id = s.id
    LEFT JOIN signups u ON u.code_id = s.id
    LEFT JOIN payments p ON p.code_id = s.id
    LEFT JOIN earnings e ON e.code_id = s.id
    LEFT JOIN paid pd ON pd.user_id = s.owner_user_id
  `);
  return rows.map((row) => ({
    codeId: row.code_id,
    code: row.code,
    label: row.label,
    isActive: row.is_active,
    ownerUserId: row.owner_user_id,
    ownerEmail: row.owner_email,
    ownerName: row.owner_name,
    createdAt: new Date(row.created_at),
    clicks: Number(row.clicks),
    leads: Number(row.leads),
    signups: Number(row.signups),
    payers: Number(row.payers),
    revenueCents: Number(row.revenue_cents),
    commissionCents: Number(row.commission_cents),
    pendingCents: Number(row.pending_cents),
    confirmedCents: Number(row.confirmed_cents),
    ownerPaidCents: Number(row.owner_paid_cents),
  }));
}

/** Scope-wide totals for one time span (owners counted once for payouts). */
export async function queryTotals(
  filters: ReferralScopeFilters,
  range: TimeSpan,
): Promise<MetricTotals> {
  const { rows } = await db.execute<
    QueryResultRow & {
      clicks: number;
      leads: number;
      signups: number;
      payers: number;
      revenue_cents: number;
      commission_cents: number;
      pending_cents: number;
      confirmed_cents: number;
      canceled_cents: number;
      paid_cents: number;
    }
  >(sql`
    WITH scope AS (${scopeSql(filters)})
    SELECT
      (SELECT count(*)::int FROM ${CLICKED_CODE} JOIN scope s ON s.id = vc.code_id
        WHERE ${span(sql`v.visited_at`, range)}) AS clicks,
      (SELECT count(DISTINCT lr.lead_id)::int FROM lead_referrals lr JOIN scope s ON s.id = lr.referral_code_id
        WHERE ${span(sql`lr.created_at`, range)}) AS leads,
      (SELECT count(*)::int FROM user_referrals ur JOIN scope s ON s.id = ur.referral_code_id
        WHERE ${span(sql`ur.created_at`, range)}) AS signups,
      (SELECT count(DISTINCT user_id)::int FROM (${referredPayments}) rp
        WHERE ${span(sql`rp.created_at`, range)}) AS payers,
      (SELECT coalesce(sum(usd_cents), 0)::float8 FROM (${referredPayments}) rp
        WHERE ${span(sql`rp.created_at`, range)}) AS revenue_cents,
      (SELECT coalesce(sum(amount_cents) FILTER (WHERE status <> ${ReferralEarningStatus.CANCELED}), 0)::float8
        FROM (${referredEarnings}) re WHERE ${span(sql`re.created_at`, range)}) AS commission_cents,
      (SELECT coalesce(sum(amount_cents) FILTER (WHERE status = ${ReferralEarningStatus.PENDING}), 0)::float8
        FROM (${referredEarnings}) re WHERE ${span(sql`re.created_at`, range)}) AS pending_cents,
      (SELECT coalesce(sum(amount_cents) FILTER (WHERE status = ${ReferralEarningStatus.CONFIRMED}), 0)::float8
        FROM (${referredEarnings}) re WHERE ${span(sql`re.created_at`, range)}) AS confirmed_cents,
      (SELECT coalesce(sum(amount_cents) FILTER (WHERE status = ${ReferralEarningStatus.CANCELED}), 0)::float8
        FROM (${referredEarnings}) re WHERE ${span(sql`re.created_at`, range)}) AS canceled_cents,
      (SELECT coalesce(sum(r.amount_cents), 0)::float8 FROM payout_requests r
        WHERE r.status = ${PayoutStatus.COMPLETED}
          AND ${span(sql`coalesce(r.processed_at, r.created_at)`, range)}
          AND r.user_id IN (SELECT owner_user_id FROM scope)) AS paid_cents
  `);
  const row = rows[0];
  return {
    clicks: Number(row?.clicks ?? 0),
    leads: Number(row?.leads ?? 0),
    signups: Number(row?.signups ?? 0),
    payers: Number(row?.payers ?? 0),
    revenueCents: Number(row?.revenue_cents ?? 0),
    commissionCents: Number(row?.commission_cents ?? 0),
    pendingCents: Number(row?.pending_cents ?? 0),
    confirmedCents: Number(row?.confirmed_cents ?? 0),
    canceledCents: Number(row?.canceled_cents ?? 0),
    payoutsPaidCents: Number(row?.paid_cents ?? 0),
  };
}

/** Bucketed series for the scope. Money series are in USD (major units). */
export async function querySeries(
  filters: ReferralScopeFilters,
  range: TimeSpan,
  bucket: AnalyticsBucket,
): Promise<Record<ReferralSeriesKey, BucketRow[]>> {
  const { rows } = await db.execute<
    QueryResultRow & {
      metric: ReferralSeriesKey;
      bucket: string;
      value: number;
    }
  >(sql`
    WITH scope AS (${scopeSql(filters)})
    SELECT 'clicks' AS metric, ${bucketSql(sql`v.visited_at`, bucket)} AS bucket, count(*)::float8 AS value
      FROM ${CLICKED_CODE} JOIN scope s ON s.id = vc.code_id
      WHERE ${span(sql`v.visited_at`, range)} GROUP BY 2
    UNION ALL
    SELECT 'leads', ${bucketSql(sql`lr.created_at`, bucket)}, count(DISTINCT lr.lead_id)::float8
      FROM lead_referrals lr JOIN scope s ON s.id = lr.referral_code_id
      WHERE ${span(sql`lr.created_at`, range)} GROUP BY 2
    UNION ALL
    SELECT 'signups', ${bucketSql(sql`ur.created_at`, bucket)}, count(*)::float8
      FROM user_referrals ur JOIN scope s ON s.id = ur.referral_code_id
      WHERE ${span(sql`ur.created_at`, range)} GROUP BY 2
    UNION ALL
    SELECT 'payers', ${bucketSql(sql`rp.created_at`, bucket)}, count(DISTINCT rp.user_id)::float8
      FROM (${referredPayments}) rp WHERE ${span(sql`rp.created_at`, range)} GROUP BY 2
    UNION ALL
    SELECT 'revenue', ${bucketSql(sql`rp.created_at`, bucket)}, (coalesce(sum(rp.usd_cents), 0) / 100.0)::float8
      FROM (${referredPayments}) rp WHERE ${span(sql`rp.created_at`, range)} GROUP BY 2
    UNION ALL
    SELECT 'commission', ${bucketSql(sql`re.created_at`, bucket)},
      (coalesce(sum(re.amount_cents) FILTER (WHERE re.status <> ${ReferralEarningStatus.CANCELED}), 0) / 100.0)::float8
      FROM (${referredEarnings}) re WHERE ${span(sql`re.created_at`, range)} GROUP BY 2
  `);
  const result: Record<ReferralSeriesKey, BucketRow[]> = {
    clicks: [],
    leads: [],
    signups: [],
    payers: [],
    revenue: [],
    commission: [],
  };
  for (const row of rows) {
    result[row.metric].push({ bucket: row.bucket, value: Number(row.value) });
  }
  return result;
}

/** Earliest referral activity (bounds all-time windows). */
export async function queryDataFloor(
  filters: ReferralScopeFilters,
): Promise<Date | null> {
  const { rows } = await db.execute<
    QueryResultRow & { floor: Date | string | null }
  >(sql`
    WITH scope AS (${scopeSql(filters)})
    SELECT min(created_at) AS floor FROM scope
  `);
  const floor = rows[0]?.floor;
  return floor ? new Date(floor) : null;
}

export interface PayoutStateRow {
  status: string;
  count: number;
  amountCents: number;
}

/** Current payout requests per status (state now, not windowed). */
export async function queryPayoutStates(
  filters: ReferralScopeFilters,
): Promise<PayoutStateRow[]> {
  const scoped =
    filters.search ||
    filters.ownerUserId ||
    filters.activeOnly ||
    filters.codeId;
  const { rows } = await db.execute<
    QueryResultRow & { status: string; count: number; cents: number }
  >(sql`
    WITH scope AS (${scopeSql(filters)})
    SELECT r.status, count(*)::int AS count, coalesce(sum(r.amount_cents), 0)::float8 AS cents
    FROM payout_requests r
    ${scoped ? sql`WHERE r.user_id IN (SELECT owner_user_id FROM scope)` : sql``}
    GROUP BY 1
  `);
  return rows.map((row) => ({
    status: row.status,
    count: Number(row.count),
    amountCents: Number(row.cents),
  }));
}

/** Payout statuses still waiting on an admin (queue). */
export const OPEN_PAYOUT_STATUSES: readonly string[] = [
  PayoutStatus.PENDING,
  PayoutStatus.APPROVED,
  PayoutStatus.PROCESSING,
];

export interface ReferredUserRow {
  userId: string;
  email: string;
  name: string | null;
  signedUpAt: Date;
  payments: number;
  revenueCents: number;
  commissionCents: number;
  lastPaymentAt: Date | null;
}

/** Accounts credited to one code, biggest payers first (all time). */
export async function queryReferredUsers(
  codeId: string,
  limit: number,
): Promise<{ rows: ReferredUserRow[]; total: number }> {
  const { rows } = await db.execute<
    QueryResultRow & {
      user_id: string;
      email: string;
      name: string | null;
      signed_up_at: Date;
      payments: number;
      revenue_cents: number;
      commission_cents: number;
      last_payment_at: Date | null;
      total: number;
    }
  >(sql`
    WITH referred AS (
      SELECT ur.referred_user_id AS user_id, ur.created_at
      FROM user_referrals ur WHERE ur.referral_code_id = ${codeId}
    ),
    pay AS (
      SELECT p.user_id, count(*)::int AS payments, coalesce(sum(${usdCentsSql()}), 0)::float8 AS cents,
        max(p.created_at) AS last_at
      FROM payment_transactions p JOIN referred r ON r.user_id = p.user_id
      WHERE p.status = ${SUCCEEDED} AND p.amount > 0
      GROUP BY 1
    ),
    earn AS (
      SELECT e.source_user_id AS user_id, coalesce(sum(e.amount_cents), 0)::float8 AS cents
      FROM referral_earnings e JOIN referred r ON r.user_id = e.source_user_id
      WHERE e.status <> ${ReferralEarningStatus.CANCELED}
      GROUP BY 1
    )
    SELECT r.user_id, u.email, coalesce(u.public_name, u.private_name) AS name, r.created_at AS signed_up_at,
      coalesce(p.payments, 0) AS payments, coalesce(p.cents, 0) AS revenue_cents,
      coalesce(e.cents, 0) AS commission_cents, p.last_at AS last_payment_at,
      count(*) OVER ()::int AS total
    FROM referred r
    JOIN users u ON u.id = r.user_id
    LEFT JOIN pay p ON p.user_id = r.user_id
    LEFT JOIN earn e ON e.user_id = r.user_id
    ORDER BY coalesce(p.cents, 0) DESC, r.created_at DESC
    LIMIT ${limit}
  `);
  return {
    total: Number(rows[0]?.total ?? 0),
    rows: rows.map((row) => ({
      userId: row.user_id,
      email: row.email,
      name: row.name,
      signedUpAt: new Date(row.signed_up_at),
      payments: Number(row.payments),
      revenueCents: Number(row.revenue_cents),
      commissionCents: Number(row.commission_cents),
      lastPaymentAt: row.last_payment_at ? new Date(row.last_payment_at) : null,
    })),
  };
}

export interface EarningsLevelRow {
  level: number;
  count: number;
  pendingCents: number;
  confirmedCents: number;
  canceledCents: number;
}

/** Earnings caused by one code's referred accounts, per level, in a span. */
export async function queryEarningsByLevel(
  codeId: string,
  range: TimeSpan,
): Promise<EarningsLevelRow[]> {
  const { rows } = await db.execute<
    QueryResultRow & {
      level: number;
      count: number;
      pending: number;
      confirmed: number;
      canceled: number;
    }
  >(sql`
    SELECT e.level, count(*)::int AS count,
      coalesce(sum(e.amount_cents) FILTER (WHERE e.status = ${ReferralEarningStatus.PENDING}), 0)::float8 AS pending,
      coalesce(sum(e.amount_cents) FILTER (WHERE e.status = ${ReferralEarningStatus.CONFIRMED}), 0)::float8 AS confirmed,
      coalesce(sum(e.amount_cents) FILTER (WHERE e.status = ${ReferralEarningStatus.CANCELED}), 0)::float8 AS canceled
    FROM referral_earnings e
    JOIN user_referrals ur ON ur.referred_user_id = e.source_user_id
    WHERE ur.referral_code_id = ${codeId} AND ${span(sql`e.created_at`, range)}
    GROUP BY 1 ORDER BY 1
  `);
  return rows.map((row) => ({
    level: Number(row.level),
    count: Number(row.count),
    pendingCents: Number(row.pending),
    confirmedCents: Number(row.confirmed),
    canceledCents: Number(row.canceled),
  }));
}

export interface PartnerBalance {
  confirmedCents: number;
  pendingCents: number;
  paidOutCents: number;
  openPayoutCents: number;
  /** Remaining EARNED wallet credits before open payout reservations. */
  availableCents: number;
  /** Remaining EARNED wallet credits minus open payout reservations. Negative means over-committed. */
  freeCents: number;
  referredUsers: number;
  codes: number;
}

/** All-time balance of partners (keyed by user id). */
export async function queryPartnerBalances(
  userIds: readonly string[],
): Promise<Map<string, PartnerBalance>> {
  const result = new Map<string, PartnerBalance>();
  if (userIds.length === 0) {
    return result;
  }
  const ids = sql.join(
    userIds.map((id) => sql`${id}::uuid`),
    sql`, `,
  );
  const { rows } = await db.execute<
    QueryResultRow & {
      user_id: string;
      confirmed: number;
      pending: number;
      paid: number;
      earned_wallet: number;
      open: number;
      referred: number;
      codes: number;
    }
  >(sql`
    SELECT u.id AS user_id,
      (SELECT coalesce(sum(amount_cents), 0)::float8 FROM referral_earnings e
        WHERE e.earner_user_id = u.id AND e.status = ${ReferralEarningStatus.CONFIRMED}) AS confirmed,
      (SELECT coalesce(sum(amount_cents), 0)::float8 FROM referral_earnings e
        WHERE e.earner_user_id = u.id AND e.status = ${ReferralEarningStatus.PENDING}) AS pending,
      (SELECT coalesce(sum(amount_cents), 0)::float8 FROM payout_requests r
        WHERE r.user_id = u.id AND r.status = ${PayoutStatus.COMPLETED}) AS paid,
      (SELECT coalesce(sum(p.remaining), 0)::float8
        FROM credit_wallets w JOIN credit_packs p ON p.wallet_id = w.id
        WHERE w.user_id = u.id AND p.type = ${CreditPackType.EARNED}) AS earned_wallet,
      (SELECT coalesce(sum(amount_cents), 0)::float8 FROM payout_requests r
        WHERE r.user_id = u.id AND r.status IN (${PayoutStatus.PENDING}, ${PayoutStatus.APPROVED}, ${PayoutStatus.PROCESSING})) AS open,
      (SELECT count(*)::int FROM user_referrals ur WHERE ur.referrer_user_id = u.id) AS referred,
      (SELECT count(*)::int FROM referral_codes c WHERE c.owner_user_id = u.id) AS codes
    FROM users u WHERE u.id IN (${ids})
  `);
  for (const row of rows) {
    const confirmed = Number(row.confirmed);
    const paid = Number(row.paid);
    const open = Number(row.open);
    const earnedWallet = Number(row.earned_wallet);
    result.set(row.user_id, {
      confirmedCents: confirmed,
      pendingCents: Number(row.pending),
      paidOutCents: paid,
      openPayoutCents: open,
      availableCents: Math.max(0, earnedWallet),
      freeCents: earnedWallet - open,
      referredUsers: Number(row.referred),
      codes: Number(row.codes),
    });
  }
  return result;
}

export interface CodeHeaderRow {
  codeId: string;
  code: string;
  label: string | null;
  isActive: boolean;
  bonusCredits: number;
  currentUses: number;
  createdAt: Date;
  ownerUserId: string;
  ownerEmail: string;
  ownerName: string | null;
}

/** Look a code up by its text (case-insensitive). */
export async function queryCodeHeader(
  code: string,
): Promise<CodeHeaderRow | null> {
  const { rows } = await db.execute<
    QueryResultRow & {
      id: string;
      code: string;
      label: string | null;
      is_active: boolean;
      bonus: number;
      uses: number;
      created_at: Date;
      owner_user_id: string;
      owner_email: string;
      owner_name: string | null;
    }
  >(sql`
    SELECT c.id, c.code, c.label, c.is_active, c.subscription_bonus_credits AS bonus,
      c.current_uses AS uses, c.created_at, c.owner_user_id, o.email AS owner_email,
      coalesce(o.public_name, o.private_name) AS owner_name
    FROM referral_codes c JOIN users o ON o.id = c.owner_user_id
    WHERE lower(c.code) = lower(${code.trim()})
    ORDER BY (c.code = ${code.trim()}) DESC
    LIMIT 1
  `);
  const row = rows[0];
  if (!row) {
    return null;
  }
  return {
    codeId: row.id,
    code: row.code,
    label: row.label,
    isActive: row.is_active,
    bonusCredits: Number(row.bonus),
    currentUses: Number(row.uses),
    createdAt: new Date(row.created_at),
    ownerUserId: row.owner_user_id,
    ownerEmail: row.owner_email,
    ownerName: row.owner_name,
  };
}

export interface OwnerPayoutRow {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: Date;
  processedAt: Date | null;
}

export async function queryOwnerPayouts(
  userId: string,
  limit: number,
): Promise<OwnerPayoutRow[]> {
  const { rows } = await db.execute<
    QueryResultRow & {
      id: string;
      amount_cents: number;
      currency: string;
      status: string;
      created_at: Date;
      processed_at: Date | null;
    }
  >(sql`
    SELECT id, amount_cents, currency, status, created_at, processed_at
    FROM payout_requests WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT ${limit}
  `);
  return rows.map((row) => ({
    id: row.id,
    amountCents: Number(row.amount_cents),
    currency: row.currency,
    status: row.status,
    createdAt: new Date(row.created_at),
    processedAt: row.processed_at ? new Date(row.processed_at) : null,
  }));
}

export interface PayoutListFilters {
  search?: string;
  userId?: string;
  requestId?: string;
  currency?: string;
}

/** Payout requests per status for the list filters (status filter ignored). */
export async function queryPayoutSummary(
  filters: PayoutListFilters,
): Promise<PayoutStateRow[]> {
  const conditions: SQL[] = [];
  const search = filters.search?.trim();
  if (search) {
    conditions.push(sql`u.email ILIKE ${`%${escapeLike(search)}%`}`);
  }
  if (filters.userId) {
    conditions.push(sql`r.user_id = ${filters.userId}`);
  }
  if (filters.requestId) {
    conditions.push(sql`r.id = ${filters.requestId}`);
  }
  if (filters.currency) {
    conditions.push(sql`r.currency = ${filters.currency}`);
  }
  const where =
    conditions.length > 0
      ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
      : sql``;
  const { rows } = await db.execute<
    QueryResultRow & { status: string; count: number; cents: number }
  >(sql`
    SELECT r.status, count(*)::int AS count, coalesce(sum(r.amount_cents), 0)::float8 AS cents
    FROM payout_requests r JOIN users u ON u.id = r.user_id
    ${where}
    GROUP BY 1
  `);
  return rows.map((row) => ({
    status: row.status,
    count: Number(row.count),
    amountCents: Number(row.cents),
  }));
}

/** Codes and display names of partners (keyed by user id). */
export async function queryPartnerIdentity(
  userIds: readonly string[],
): Promise<Map<string, { name: string | null; codes: string[] }>> {
  const result = new Map<string, { name: string | null; codes: string[] }>();
  if (userIds.length === 0) {
    return result;
  }
  const ids = sql.join(
    userIds.map((id) => sql`${id}::uuid`),
    sql`, `,
  );
  const { rows } = await db.execute<
    QueryResultRow & {
      user_id: string;
      name: string | null;
      codes: string[] | null;
    }
  >(sql`
    SELECT u.id AS user_id, coalesce(u.public_name, u.private_name) AS name,
      array_remove(array_agg(c.code ORDER BY c.created_at), NULL) AS codes
    FROM users u LEFT JOIN referral_codes c ON c.owner_user_id = u.id
    WHERE u.id IN (${ids})
    GROUP BY 1, 2
  `);
  for (const row of rows) {
    result.set(row.user_id, { name: row.name, codes: row.codes ?? [] });
  }
  return result;
}

export interface OpenRequestGroup {
  userId: string;
  amountCents: number;
  currency: string;
  walletAddress: string | null;
  count: number;
}

/** Open payout requests grouped by partner, amount, currency and wallet. */
export async function queryOpenRequestGroups(
  userIds: readonly string[],
): Promise<OpenRequestGroup[]> {
  if (userIds.length === 0) {
    return [];
  }
  const ids = sql.join(
    userIds.map((id) => sql`${id}::uuid`),
    sql`, `,
  );
  const { rows } = await db.execute<
    QueryResultRow & {
      user_id: string;
      amount_cents: number;
      currency: string;
      wallet_address: string | null;
      count: number;
    }
  >(sql`
    SELECT user_id, amount_cents, currency, wallet_address, count(*)::int AS count
    FROM payout_requests
    WHERE user_id IN (${ids})
      AND status IN (${PayoutStatus.PENDING}, ${PayoutStatus.APPROVED}, ${PayoutStatus.PROCESSING})
    GROUP BY 1, 2, 3, 4
  `);
  return rows.map((row) => ({
    userId: row.user_id,
    amountCents: Number(row.amount_cents),
    currency: row.currency,
    walletAddress: row.wallet_address,
    count: Number(row.count),
  }));
}
