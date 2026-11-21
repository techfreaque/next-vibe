/**
 * Shared shaping of referral analytics rows into response objects (server only).
 */

import "server-only";

import type { Kpi, TimeSeries } from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { fillBuckets } from "next-vibe/unified-ui/analytics/window";

import { PayoutStatusDB } from "../enum";
import { centsToUsd } from "./overview";
import type {
  BucketRow,
  CodeMetricsRow,
  MetricTotals,
  PayoutStateRow,
  ReferralSeriesKey,
} from "./queries";
import { OPEN_PAYOUT_STATUSES } from "./queries";

export interface ReferralKpis {
  clicks: Kpi;
  leads: Kpi;
  signups: Kpi;
  payers: Kpi;
  revenueUsd: Kpi;
  commissionUsd: Kpi;
  commissionPendingUsd: Kpi;
  commissionConfirmedUsd: Kpi;
  payoutsPaidUsd: Kpi;
}

export function buildKpis(
  current: MetricTotals,
  previous: MetricTotals | null,
): ReferralKpis {
  const make = (pick: (totals: MetricTotals) => number): Kpi => ({
    value: pick(current),
    previous: previous ? pick(previous) : null,
  });
  return {
    clicks: make((t) => t.clicks),
    leads: make((t) => t.leads),
    signups: make((t) => t.signups),
    payers: make((t) => t.payers),
    revenueUsd: make((t) => centsToUsd(t.revenueCents)),
    commissionUsd: make((t) => centsToUsd(t.commissionCents)),
    commissionPendingUsd: make((t) => centsToUsd(t.pendingCents)),
    commissionConfirmedUsd: make((t) => centsToUsd(t.confirmedCents)),
    payoutsPaidUsd: make((t) => centsToUsd(t.payoutsPaidCents)),
  };
}

const SERIES_ORDER: readonly ReferralSeriesKey[] = [
  "clicks",
  "leads",
  "signups",
  "payers",
  "revenue",
  "commission",
];

export function buildTrend(
  win: AnalyticsWindow,
  series: Record<ReferralSeriesKey, BucketRow[]>,
): TimeSeries {
  return {
    buckets: win.buckets,
    series: SERIES_ORDER.map((key) => ({
      key,
      values: fillBuckets(win.buckets, series[key]).map(
        (value) => Math.round(value * 100) / 100,
      ),
    })),
  };
}

export function buildCodeRow(
  row: CodeMetricsRow,
  extra: {
    signupsPrevious: number | null;
    ownerQueueCents: number;
    ownerFreeCents: number;
  } = { signupsPrevious: null, ownerQueueCents: 0, ownerFreeCents: 0 },
): {
  codeId: string;
  code: string;
  label: string | null;
  isActive: boolean;
  ownerUserId: string;
  ownerEmail: string;
  ownerName: string | null;
  createdAt: string;
  clicks: number;
  leads: number;
  signups: number;
  payers: number;
  conversion: number | null;
  revenueUsd: number;
  commissionUsd: number;
  pendingUsd: number;
  ownerPaidUsd: number;
  signupsPrevious: number | null;
  ownerQueueUsd: number;
  ownerFreeUsd: number;
} {
  return {
    codeId: row.codeId,
    code: row.code,
    label: row.label,
    isActive: row.isActive,
    ownerUserId: row.ownerUserId,
    ownerEmail: row.ownerEmail,
    ownerName: row.ownerName,
    createdAt: row.createdAt.toISOString(),
    clicks: row.clicks,
    leads: row.leads,
    signups: row.signups,
    payers: row.payers,
    conversion: row.clicks > 0 ? row.signups / row.clicks : null,
    revenueUsd: centsToUsd(row.revenueCents),
    commissionUsd: centsToUsd(row.commissionCents),
    pendingUsd: centsToUsd(row.pendingCents),
    ownerPaidUsd: centsToUsd(row.ownerPaidCents),
    signupsPrevious: extra.signupsPrevious,
    ownerQueueUsd: centsToUsd(extra.ownerQueueCents),
    ownerFreeUsd: centsToUsd(extra.ownerFreeCents),
  };
}

type PayoutStatusDBValue = (typeof PayoutStatusDB)[number];

function isPayoutStatus(value: string): value is PayoutStatusDBValue {
  return PayoutStatusDB.some((status) => status === value);
}

export function buildPayoutQueue(rows: readonly PayoutStateRow[]): {
  openCount: number;
  openUsd: number;
  byStatus: Array<{
    status: PayoutStatusDBValue;
    count: number;
    amountUsd: number;
  }>;
} {
  const byStatus = PayoutStatusDB.flatMap((status) => {
    const row = rows.find((candidate) => candidate.status === status);
    return row && isPayoutStatus(row.status)
      ? [{ status, count: row.count, amountUsd: centsToUsd(row.amountCents) }]
      : [];
  });
  const open = rows.filter((row) => OPEN_PAYOUT_STATUSES.includes(row.status));
  return {
    openCount: open.reduce((sum, row) => sum + row.count, 0),
    openUsd: centsToUsd(open.reduce((sum, row) => sum + row.amountCents, 0)),
    byStatus,
  };
}
